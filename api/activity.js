// Vercel Serverless Function: /api/activity
// Retrieves activity audit logs.

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

      const { data, error } = await supabase
        .from('activity_logs')
        .select('*, user:profiles(id, name, avatar_url)')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return res.status(200).json({ success: true, data });
    }

    return res.status(200).json({
      success: true,
      message: 'Running in demo fallback mode',
      data: []
    });

  } catch (err) {
    console.error('Serverless activity error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Server error' });
  }
}
