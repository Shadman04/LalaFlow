import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-supabase-project')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// =========================================================
// MOCK / DEMO DATA STORE FOR LOCAL INTEGRATION & TESTING
// =========================================================

export const DEMO_PROFILES = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'Rahim Khan',
    email: 'rahim@lalaflow.com',
    role: 'employee',
    language: 'en-IN',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    name: 'Sarah Ahmed',
    email: 'sarah@lalaflow.com',
    role: 'employee',
    language: 'en-IN',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    name: 'Shadman Chowdhury',
    email: 'shadman@lalaflow.com',
    role: 'manager',
    language: 'en-IN',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
  }
];

export const DEMO_TASKS = [
  {
    id: 'task-demo-1',
    title: 'Send Revised Proposal',
    description: 'Client requested urgent update on pricing structure and contract terms.',
    priority: 'high',
    status: 'in_progress',
    assignee_id: '11111111-1111-1111-1111-111111111111',
    created_by: '33333333-3333-3333-3333-333333333333',
    due_date: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hrs from now
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    snoozed_until: null
  },
  {
    id: 'task-demo-2',
    title: 'Check Pending Invoice #4092',
    description: 'Verify payment confirmation from finance department for Q3 shipment.',
    priority: 'urgent',
    status: 'captured',
    assignee_id: '11111111-1111-1111-1111-111111111111',
    created_by: '11111111-1111-1111-1111-111111111111',
    due_date: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // Overdue 3 hrs
    created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    snoozed_until: null
  },
  {
    id: 'task-demo-3',
    title: 'Follow Up With Client (Acme Corp)',
    description: 'Schedule call regarding Q4 strategy rollout and feature requests.',
    priority: 'medium',
    status: 'captured',
    assignee_id: '22222222-2222-2222-2222-222222222222',
    created_by: '33333333-3333-3333-3333-333333333333',
    due_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    snoozed_until: null
  },
  {
    id: 'task-demo-4',
    title: 'Prepare Weekly Operations Report',
    description: 'Compile team throughput and open bottleneck metrics for executive review.',
    priority: 'medium',
    status: 'review',
    assignee_id: '33333333-3333-3333-3333-333333333333',
    created_by: '33333333-3333-3333-3333-333333333333',
    due_date: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    snoozed_until: null
  },
  {
    id: 'task-demo-5',
    title: 'Review Q3 Sales Data',
    description: 'Analyze regional growth figures across key verticals.',
    priority: 'low',
    status: 'completed',
    assignee_id: '22222222-2222-2222-2222-222222222222',
    created_by: '33333333-3333-3333-3333-333333333333',
    due_date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
    snoozed_until: null
  }
];

export const DEMO_ACTIVITY = [
  {
    id: 'act-demo-1',
    user_id: '11111111-1111-1111-1111-111111111111',
    user_name: 'Rahim Khan',
    action: 'created_task',
    entity_type: 'task',
    details: { title: 'Send Revised Proposal' },
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'act-demo-2',
    user_id: '33333333-3333-3333-3333-333333333333',
    user_name: 'Shadman Chowdhury',
    action: 'updated_status',
    entity_type: 'task',
    details: { title: 'Prepare Weekly Operations Report', new_status: 'review' },
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'act-demo-3',
    user_id: '22222222-2222-2222-2222-222222222222',
    user_name: 'Sarah Ahmed',
    action: 'completed_task',
    entity_type: 'task',
    details: { title: 'Review Q3 Sales Data' },
    created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
  }
];

// LocalStorage Persistence Helper
const LOCAL_STORAGE_KEY = 'lalaflow_demo_db_v1';

export function getLocalStore() {
  const existing = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (existing) {
    try {
      return JSON.parse(existing);
    } catch (e) {
      console.warn('Failed to parse local store, re-initializing', e);
    }
  }
  const initialStore = {
    tasks: DEMO_TASKS,
    profiles: DEMO_PROFILES,
    activity: DEMO_ACTIVITY
  };
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialStore));
  return initialStore;
}

export function saveLocalStore(store) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(store));
}

export function resetLocalStore() {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
  return getLocalStore();
}
