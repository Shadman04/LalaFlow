-- =========================================================
-- ⚡ LALAFLOW DATABASE SCHEMA & RLS POLICIES
-- =========================================================

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('employee', 'manager', 'admin')) DEFAULT 'employee',
  language TEXT NOT NULL CHECK (language IN ('en-IN', 'hi-IN', 'bn-IN')) DEFAULT 'en-IN',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. TASKS TABLE
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  status TEXT NOT NULL CHECK (status IN ('captured', 'in_progress', 'review', 'completed')) DEFAULT 'captured',
  assignee_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  due_date TIMESTAMPTZ,
  snoozed_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. CHAOS INPUTS TABLE
CREATE TABLE IF NOT EXISTS public.chaos_inputs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  processed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. ACTIVITY LOGS TABLE
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chaos_inputs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Profiles: Everyone authenticated can view team profiles; Users edit own profile
CREATE POLICY "Public profiles are viewable by authenticated users" 
  ON public.profiles FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Tasks:
-- Employees can view all tasks, insert tasks, update assigned or created tasks.
-- Managers and Admins can view, insert, update, and delete all tasks.
CREATE POLICY "Authenticated users can view tasks" 
  ON public.tasks FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert tasks" 
  ON public.tasks FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update assigned or created tasks OR managers can update any task" 
  ON public.tasks FOR UPDATE USING (
    auth.uid() = assignee_id 
    OR auth.uid() = created_by 
    OR EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('manager', 'admin')
    )
  );

CREATE POLICY "Managers and admins can delete tasks" 
  ON public.tasks FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('manager', 'admin')
    )
  );

-- Chaos Inputs: Viewable and insertable by all team members
CREATE POLICY "Authenticated users can view chaos inputs" 
  ON public.chaos_inputs FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert chaos inputs" 
  ON public.chaos_inputs FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update chaos inputs" 
  ON public.chaos_inputs FOR UPDATE USING (auth.role() = 'authenticated');

-- Activity Logs: Viewable and insertable by all team members
CREATE POLICY "Authenticated users can view activity logs" 
  ON public.activity_logs FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can create activity logs" 
  ON public.activity_logs FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- =========================================================
-- SEED DEMO DATA
-- =========================================================

-- Note: Demo UUIDs for pre-populated accounts
-- Rahim: 11111111-1111-1111-1111-111111111111
-- Sarah: 22222222-2222-2222-2222-222222222222
-- Shadman: 33333333-3333-3333-3333-333333333333

INSERT INTO public.profiles (id, name, email, role, language, avatar_url) VALUES
('11111111-1111-1111-1111-111111111111', 'Rahim Khan', 'rahim@lalaflow.com', 'employee', 'en-IN', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'),
('22222222-2222-2222-2222-222222222222', 'Sarah Ahmed', 'sarah@lalaflow.com', 'employee', 'en-IN', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'),
('33333333-3333-3333-3333-333333333333', 'Shadman Chowdhury', 'shadman@lalaflow.com', 'manager', 'en-IN', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.tasks (id, title, description, priority, status, assignee_id, due_date, created_at) VALUES
('a1111111-1111-1111-1111-111111111111', 'Send Revised Proposal', 'Client requested urgent update on pricing structure and terms.', 'high', 'in_progress', '11111111-1111-1111-1111-111111111111', NOW() + INTERVAL '2 hours', NOW() - INTERVAL '1 day'),
('a2222222-2222-2222-2222-222222222222', 'Check Pending Invoice #4092', 'Verify payment confirmation from the finance department.', 'high', 'captured', '11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '3 hours', NOW() - INTERVAL '2 days'),
('a3333333-3333-3333-3333-333333333333', 'Follow Up With Client (Acme Corp)', 'Schedule call regarding Q4 strategy rollout.', 'medium', 'captured', '22222222-2222-2222-2222-222222222222', NOW() + INTERVAL '1 day', NOW() - INTERVAL '4 hours'),
('a4444444-4444-4444-4444-444444444444', 'Prepare Weekly Operations Report', 'Compile team throughput and open bottleneck metrics.', 'medium', 'review', '33333333-3333-3333-3333-333333333333', NOW() + INTERVAL '2 days', NOW() - INTERVAL '12 hours'),
('a5555555-5555-5555-5555-555555555555', 'Review Q3 Sales Data', 'Analyze regional growth figures across key verticals.', 'low', 'completed', '22222222-2222-2222-2222-222222222222', NOW() - INTERVAL '1 day', NOW() - INTERVAL '3 days')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.activity_logs (user_id, action, entity_type, details, created_at) VALUES
('11111111-1111-1111-1111-111111111111', 'created_task', 'task', '{"title": "Send Revised Proposal"}', NOW() - INTERVAL '4 hours'),
('33333333-3333-3333-3333-333333333333', 'updated_status', 'task', '{"title": "Prepare Weekly Operations Report", "from": "captured", "to": "review"}', NOW() - INTERVAL '2 hours'),
('22222222-2222-2222-2222-222222222222', 'completed_task', 'task', '{"title": "Review Q3 Sales Data"}', NOW() - INTERVAL '1 hour');
