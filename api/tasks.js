// Vercel Serverless Function: /api/tasks
// Handles GET (list), POST (create), PUT (update), DELETE (delete) for tasks.

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

  // Fallback demo response if backend Supabase environment is not set up
  if (!supabaseUrl || !supabaseKey) {
    return res.status(200).json({
      success: true,
      message: 'Running in serverless fallback mode. Realtime local persistence available on frontend.',
      data: []
    });
  }

  try {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { id } = req.query;

    if (req.method === 'GET') {
      if (id) {
        const { data, error } = await supabase.from('tasks').select('*').eq('id', id).single();
        if (error) throw error;
        return res.status(200).json({ success: true, data });
      } else {
        const { data, error } = await supabase.from('tasks').select('*, assignee:profiles(id, name, avatar_url, role)').order('created_at', { ascending: false });
        if (error) throw error;
        return res.status(200).json({ success: true, data });
      }
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { title, description, priority, status, assignee_id, created_by, due_date } = body;

      if (!title) {
        return res.status(400).json({ success: false, error: 'Task title is required.' });
      }

      const { data, error } = await supabase.from('tasks').insert([{
        title,
        description: description || '',
        priority: priority || 'medium',
        status: status || 'captured',
        assignee_id: assignee_id || null,
        created_by: created_by || null,
        due_date: due_date || null
      }]).select().single();

      if (error) throw error;

      // Create activity log
      await supabase.from('activity_logs').insert([{
        user_id: created_by || null,
        action: 'created_task',
        entity_type: 'task',
        entity_id: data.id,
        details: { title }
      }]);

      return res.status(201).json({ success: true, data });
    }

    if (req.method === 'PUT') {
      if (!id) return res.status(400).json({ success: false, error: 'Task ID is required for update.' });
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

      const { data, error } = await supabase.from('tasks').update({
        ...body,
        updated_at: new Date().toISOString()
      }).eq('id', id).select().single();

      if (error) throw error;

      // Log activity if status changed
      if (body.status) {
        await supabase.from('activity_logs').insert([{
          user_id: body.updated_by || null,
          action: 'updated_status',
          entity_type: 'task',
          entity_id: id,
          details: { title: data.title, new_status: body.status }
        }]);
      }

      return res.status(200).json({ success: true, data });
    }

    if (req.method === 'DELETE') {
      if (!id) return res.status(400).json({ success: false, error: 'Task ID is required for deletion.' });
      const { error } = await supabase.from('tasks').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ success: true, message: 'Task deleted successfully.' });
    }

    return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });

  } catch (err) {
    console.error('Serverless tasks error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Server error' });
  }
}
