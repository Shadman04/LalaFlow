// Vercel Serverless Function: /api/chaos
// Handles POST requests to analyze unstructured chaos text and extract structured tasks.

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
    const { action, text, selectedActions, created_by } = body;

    if (action === 'analyze') {
      if (!text || text.trim().length === 0) {
        return res.status(400).json({ success: false, error: 'Text input is required' });
      }

      // Rule-based NLP extraction logic for chaos messages
      const parsedActions = parseChaosText(text);

      return res.status(200).json({
        success: true,
        data: {
          original_text: text,
          detected_actions: parsedActions,
          action_count: parsedActions.length
        }
      });
    }

    if (action === 'convert') {
      if (!selectedActions || !Array.isArray(selectedActions) || selectedActions.length === 0) {
        return res.status(400).json({ success: false, error: 'No action items selected to convert' });
      }

      const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

      if (supabaseUrl && supabaseKey) {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(supabaseUrl, supabaseKey);

        const createdTasks = [];
        for (const act of selectedActions) {
          const { data, error } = await supabase.from('tasks').insert([{
            title: act.title,
            description: act.description || `Extracted from Chaos Inbox: "${text || ''}"`,
            priority: act.priority || 'medium',
            status: 'captured',
            created_by: created_by || null,
            due_date: act.due_date || null
          }]).select().single();

          if (!error && data) {
            createdTasks.push(data);
            await supabase.from('activity_logs').insert([{
              user_id: created_by || null,
              action: 'created_task_from_chaos',
              entity_type: 'task',
              entity_id: data.id,
              details: { title: act.title, source: 'Chaos Inbox' }
            }]);
          }
        }

        return res.status(200).json({
          success: true,
          message: `Successfully created ${createdTasks.length} tasks in Flow Board`,
          tasks: createdTasks
        });
      }

      // Fallback response for client-side persistence mode
      return res.status(200).json({
        success: true,
        message: `Parsed ${selectedActions.length} tasks ready for store integration`,
        tasks: selectedActions.map((act, index) => ({
          id: `chaos-converted-${Date.now()}-${index}`,
          title: act.title,
          description: act.description || 'Extracted from Chaos Inbox',
          priority: act.priority || 'medium',
          status: 'captured',
          due_date: act.due_date || null,
          created_at: new Date().toISOString()
        }))
      });
    }

    return res.status(400).json({ success: false, error: 'Invalid chaos action. Use "analyze" or "convert".' });

  } catch (err) {
    console.error('Serverless chaos error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Internal server error' });
  }
}

// NLP keyword parser implementation
function parseChaosText(text) {
  const lines = text.split(/[\n;.]+/).map(l => l.trim()).filter(Boolean);
  const actions = [];

  const urgentKeywords = ['urgent', 'urgently', 'asap', 'critical', 'immediately', 'highest priority'];
  const highKeywords = ['important', 'today', 'deadline', 'proposal', 'invoice', 'client', 'payment', 'p0'];
  const keywordsMap = [
    { keys: ['proposal', 'quotation', 'quote'], titlePrefix: 'Prepare Proposal for', category: 'sales' },
    { keys: ['invoice', 'payment', 'bill', 'finance'], titlePrefix: 'Check & Process Invoice:', category: 'finance' },
    { keys: ['call', 'ring', 'phone'], titlePrefix: 'Call Client:', category: 'communication' },
    { keys: ['email', 'mail', 'send'], titlePrefix: 'Send Email regarding', category: 'communication' },
    { keys: ['review', 'check', 'verify'], titlePrefix: 'Review & Verify', category: 'review' },
    { keys: ['meeting', 'discussion', 'sync'], titlePrefix: 'Schedule Meeting for', category: 'operations' },
    { keys: ['report', 'stats', 'analytics'], titlePrefix: 'Compile Report:', category: 'analytics' },
    { keys: ['follow up', 'followup'], titlePrefix: 'Follow Up:', category: 'communication' },
  ];

  lines.forEach((line, idx) => {
    const lower = line.toLowerCase();

    // Determine priority
    let priority = 'medium';
    if (urgentKeywords.some(k => lower.includes(k))) priority = 'urgent';
    else if (highKeywords.some(k => lower.includes(k))) priority = 'high';

    // Determine target category & prefix
    let titlePrefix = 'Action Item:';
    let category = 'general';
    for (const item of keywordsMap) {
      if (item.keys.some(k => lower.includes(k))) {
        titlePrefix = item.titlePrefix;
        category = item.category;
        break;
      }
    }

    // Determine Due Date
    let dueDate = null;
    const now = new Date();
    if (lower.includes('today') || lower.includes('urgently') || lower.includes('asap')) {
      dueDate = new Date(now.getTime() + 4 * 60 * 60 * 1000).toISOString(); // +4 hours
    } else if (lower.includes('tomorrow')) {
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      dueDate = tomorrow.toISOString();
    } else if (lower.includes('next week') || lower.includes('monday')) {
      const nextWeek = new Date(now);
      nextWeek.setDate(nextWeek.getDate() + 4);
      dueDate = nextWeek.toISOString();
    }

    // Clean title string
    let cleanTitle = line
      .replace(/^(please|can you|we need to|client wants|make sure to|remember to)\s+/i, '')
      .replace(/\s+(urgently|asap|today|tomorrow)$/i, '');

    cleanTitle = cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1);

    if (cleanTitle.length > 5) {
      actions.push({
        id: `action-${Date.now()}-${idx}`,
        title: `${titlePrefix} ${cleanTitle}`.substring(0, 80),
        description: `Source line: "${line}"`,
        priority,
        category,
        due_date: dueDate,
        selected: true
      });
    }
  });

  // Fallback if no specific sentences parsed
  if (actions.length === 0 && text.trim().length > 0) {
    actions.push({
      id: `action-${Date.now()}-0`,
      title: `Process Request: ${text.trim().substring(0, 60)}...`,
      description: text,
      priority: 'high',
      category: 'general',
      due_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      selected: true
    });
  }

  return actions;
}
