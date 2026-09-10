// Vercel Serverless Function: /api/assistant
// Handles AI Assistant queries: command processing, daily briefings, and next best actions.

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { action, query, tasks = [], user = {}, language = 'en-IN' } = body;

    // 1. DAILY BRIEFING ACTION
    if (action === 'daily_briefing') {
      const activeTasks = tasks.filter(t => t.status !== 'completed');
      const urgentHigh = activeTasks.filter(t => t.priority === 'urgent' || t.priority === 'high');
      const now = new Date();
      const overdue = activeTasks.filter(t => t.due_date && new Date(t.due_date) < now);

      let textBriefing = '';
      if (language === 'hi-IN') {
        textBriefing = `Namaste ${user.name || ''}! Aapke paas ${activeTasks.length} active tasks hain, jinme se ${urgentHigh.length} high-priority hain aur ${overdue.length} overdue hain. Kya hum aapke priorities review karein?`;
      } else if (language === 'bn-IN') {
        textBriefing = `Shubho din ${user.name || ''}! Aapnar ${activeTasks.length}ti active kaj ache. Er moddhe ${urgentHigh.length}ti uchho agradhikar ebong ${overdue.length}ti overdue. Apni ki priority review korte chan?`;
      } else {
        textBriefing = `Good day, ${user.name || 'Operations Lead'}! You have ${activeTasks.length} active tasks. ${urgentHigh.length} are high priority, and ${overdue.length} require immediate attention. Shall we review your priorities?`;
      }

      return res.status(200).json({
        success: true,
        data: {
          briefing: textBriefing,
          stats: {
            active_count: activeTasks.length,
            high_priority_count: urgentHigh.length,
            overdue_count: overdue.length
          },
          recommended_action: activeTasks.length > 0 ? activeTasks[0] : null
        }
      });
    }

    // 2. NEXT ACTION SELECTION
    if (action === 'next_action') {
      const bestTask = findNextBestAction(tasks);
      return res.status(200).json({
        success: true,
        data: {
          next_action: bestTask ? {
            ...bestTask.task,
            rationale: bestTask.rationale
          } : null
        }
      });
    }

    // 3. VOICE / TEXT COMMAND PROCESSING
    if (action === 'command') {
      const cleanQuery = (query || '').toLowerCase().trim();
      let responseMessage = '';
      let intent = 'unknown';
      let dataPayload = null;

      if (cleanQuery.includes('update') || cleanQuery.includes('summary') || cleanQuery.includes('status') || cleanQuery.includes('mera update')) {
        intent = 'summary';
        const active = tasks.filter(t => t.status !== 'completed');
        const overdue = tasks.filter(t => t.status !== 'completed' && t.due_date && new Date(t.due_date) < new Date());
        
        if (language === 'hi-IN') {
          responseMessage = `Aapke paas ${active.length} active tasks hain. ${overdue.length} tasks overdue hain. Sabse zaroori task hai "${active[0]?.title || 'koi nahi'}".`;
        } else if (language === 'bn-IN') {
          responseMessage = `Aapnar mot ${active.length}ti sakriya kaj ache. ${overdue.length}ti kaj overdue. Shobcheye gurutwopurno: "${active[0]?.title || 'nei'}".`;
        } else {
          responseMessage = `You currently have ${active.length} active tasks across your flow. ${overdue.length} are overdue. Your top focus should be "${active[0]?.title || 'None'}".`;
        }
      } 
      else if (cleanQuery.includes('what should i do') || cleanQuery.includes('next task') || cleanQuery.includes('kya karun') || cleanQuery.includes('ki korbo')) {
        intent = 'next_best_action';
        const best = findNextBestAction(tasks);
        if (best) {
          responseMessage = `I recommend working on "${best.task.title}". Reason: ${best.rationale}`;
          dataPayload = best.task;
        } else {
          responseMessage = `Great job! Your workflow is clear. All tasks are completed!`;
        }
      }
      else if (cleanQuery.includes('overdue') || cleanQuery.includes('delayed') || cleanQuery.includes('late')) {
        intent = 'show_overdue';
        const overdueTasks = tasks.filter(t => t.status !== 'completed' && t.due_date && new Date(t.due_date) < new Date());
        responseMessage = overdueTasks.length > 0
          ? `You have ${overdueTasks.length} overdue task(s): ${overdueTasks.map(t => t.title).join(', ')}.`
          : `Awesome! You have zero overdue tasks right now.`;
        dataPayload = overdueTasks;
      }
      else if (cleanQuery.includes('create') || cleanQuery.includes('add task') || cleanQuery.includes('nayi task')) {
        intent = 'initiate_create_task';
        responseMessage = `Sure thing! What is the title of the task you'd like to create?`;
      }
      else {
        intent = 'general';
        responseMessage = `I heard: "${query}". I can help you find your next task, create a task, check overdue items, or summarize your workflow!`;
      }

      return res.status(200).json({
        success: true,
        data: {
          intent,
          message: responseMessage,
          payload: dataPayload
        }
      });
    }

    return res.status(400).json({ success: false, error: 'Invalid assistant action' });

  } catch (err) {
    console.error('Serverless assistant error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Server error' });
  }
}

// Decision matrix for Next Best Action algorithm
function findNextBestAction(tasks) {
  const active = tasks.filter(t => t.status !== 'completed');
  if (active.length === 0) return null;

  const now = new Date();

  // 1. Overdue tasks
  const overdue = active.filter(t => t.due_date && new Date(t.due_date) < now);
  if (overdue.length > 0) {
    // Sort by priority (urgent > high > medium > low)
    const sorted = sortTasksByPriority(overdue);
    return {
      task: sorted[0],
      rationale: `This task is overdue (${new Date(sorted[0].due_date).toLocaleDateString()}) and requires immediate resolution.`
    };
  }

  // 2. Due Today & Urgent/High Priority
  const dueToday = active.filter(t => {
    if (!t.due_date) return false;
    const d = new Date(t.due_date);
    return d.toDateString() === now.toDateString();
  });
  if (dueToday.length > 0) {
    const sorted = sortTasksByPriority(dueToday);
    return {
      task: sorted[0],
      rationale: `High priority task scheduled due today.`
    };
  }

  // 3. High/Urgent priority unstarted
  const highPriority = active.filter(t => t.priority === 'urgent' || t.priority === 'high');
  if (highPriority.length > 0) {
    return {
      task: highPriority[0],
      rationale: `Marked as ${highPriority[0].priority.toUpperCase()} priority in your workflow.`
    };
  }

  // 4. Default active task
  return {
    task: active[0],
    rationale: `Highest remaining item in your active flow queue.`
  };
}

function sortTasksByPriority(taskList) {
  const weight = { urgent: 4, high: 3, medium: 2, low: 1 };
  return [...taskList].sort((a, b) => (weight[b.priority] || 0) - (weight[a.priority] || 0));
}
