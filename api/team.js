// Vercel Serverless Function: /api/team
// Handles team statistics, workload distribution, and re-assignment recommendations.

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { data: profiles, error: profErr } = await supabase.from('profiles').select('*');
      if (profErr) throw profErr;

      const { data: tasks, error: taskErr } = await supabase.from('tasks').select('*');
      if (taskErr) throw taskErr;

      const teamMetrics = calculateTeamMetrics(profiles, tasks);
      return res.status(200).json({ success: true, data: teamMetrics });
    }

    // Fallback response for offline / mock mode
    return res.status(200).json({
      success: true,
      message: 'Running in demo mode',
      data: {
        total_members: 3,
        overloaded_members: 1,
        recommendation: 'Rahim Khan has 8 active tasks. LALA recommends re-assigning upcoming items to Shadman Chowdhury (2 active tasks).'
      }
    });

  } catch (err) {
    console.error('Serverless team error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Server error' });
  }
}

function calculateTeamMetrics(profiles = [], tasks = []) {
  const members = profiles.map(p => {
    const userTasks = tasks.filter(t => t.assignee_id === p.id);
    const activeTasks = userTasks.filter(t => t.status !== 'completed');
    const completedTasks = userTasks.filter(t => t.status === 'completed');

    let workloadStatus = 'AVAILABLE';
    if (activeTasks.length >= 6) workloadStatus = 'HIGH WORKLOAD';
    else if (activeTasks.length >= 3) workloadStatus = 'MODERATE';

    return {
      ...p,
      active_tasks_count: activeTasks.length,
      completed_tasks_count: completedTasks.length,
      workload_status: workloadStatus,
      tasks: activeTasks
    };
  });

  const overloaded = members.filter(m => m.workload_status === 'HIGH WORKLOAD');
  const available = members.filter(m => m.workload_status === 'AVAILABLE');

  let recommendation = 'Workload distribution is healthy across team members.';
  if (overloaded.length > 0 && available.length > 0) {
    recommendation = `⚠️ WORKLOAD ALERT: ${overloaded[0].name} has ${overloaded[0].active_tasks_count} active tasks (${overloaded[0].workload_status}). LALA recommends assigning new tasks to ${available[0].name} (${available[0].active_tasks_count} active tasks).`;
  }

  return {
    members,
    overloaded_count: overloaded.length,
    recommendation
  };
}
