// Unified API Service
import { isSupabaseConfigured, supabase, getLocalStore, saveLocalStore } from './supabase';

export const apiService = {
  // --- TASKS ---
  async fetchTasks() {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('tasks')
        .select('*, assignee:profiles(id, name, avatar_url, role)')
        .order('created_at', { ascending: false });
      if (!error && data) return data;
    }
    const store = getLocalStore();
    return store.tasks.map(t => ({
      ...t,
      assignee: store.profiles.find(p => p.id === t.assignee_id) || null
    }));
  },

  async createTask(taskData) {
    const newTask = {
      id: `task-${Date.now()}`,
      title: taskData.title,
      description: taskData.description || '',
      priority: taskData.priority || 'medium',
      status: taskData.status || 'captured',
      assignee_id: taskData.assignee_id || null,
      created_by: taskData.created_by || null,
      due_date: taskData.due_date || null,
      created_at: new Date().toISOString(),
      snoozed_until: null
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('tasks').insert([newTask]).select().single();
      if (!error && data) return data;
    }

    const store = getLocalStore();
    store.tasks.unshift(newTask);

    // Log Activity
    store.activity.unshift({
      id: `act-${Date.now()}`,
      user_id: taskData.created_by || store.profiles[0].id,
      user_name: store.profiles.find(p => p.id === taskData.created_by)?.name || 'User',
      action: 'created_task',
      entity_type: 'task',
      details: { title: newTask.title },
      created_at: new Date().toISOString()
    });

    saveLocalStore(store);
    return newTask;
  },

  async updateTask(id, updates) {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('tasks').update({
        ...updates,
        updated_at: new Date().toISOString()
      }).eq('id', id).select().single();
      if (!error && data) return data;
    }

    const store = getLocalStore();
    const index = store.tasks.findIndex(t => t.id === id);
    if (index !== -1) {
      store.tasks[index] = {
        ...store.tasks[index],
        ...updates,
        updated_at: new Date().toISOString()
      };

      if (updates.status) {
        store.activity.unshift({
          id: `act-${Date.now()}`,
          user_id: store.profiles[0].id,
          user_name: 'User',
          action: 'updated_status',
          entity_type: 'task',
          details: { title: store.tasks[index].title, new_status: updates.status },
          created_at: new Date().toISOString()
        });
      }

      saveLocalStore(store);
      return store.tasks[index];
    }
    throw new Error('Task not found');
  },

  async deleteTask(id) {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('tasks').delete().eq('id', id);
    }
    const store = getLocalStore();
    store.tasks = store.tasks.filter(t => t.id !== id);
    saveLocalStore(store);
    return true;
  },

  // --- CHAOS ANALYZER ---
  async analyzeChaos(text) {
    try {
      const response = await fetch('/api/chaos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'analyze', text })
      });
      if (response.ok) {
        const json = await response.json();
        if (json.success) return json.data.detected_actions;
      }
    } catch (e) {
      console.warn('Vercel API /api/chaos fallback to client parser:', e);
    }
    // Client-side parser fallback
    const { parseChaosText } = await import('../utils/chaosParser');
    return parseChaosText(text);
  },

  async convertChaosToTasks(selectedActions, createdBy) {
    const created = [];
    for (const act of selectedActions) {
      const t = await this.createTask({
        title: act.title,
        description: act.description || 'Extracted from Chaos Inbox',
        priority: act.priority || 'medium',
        status: 'captured',
        due_date: act.due_date,
        created_by: createdBy
      });
      created.push(t);
    }
    return created;
  },

  // --- TEAM ---
  async fetchTeam() {
    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase.from('profiles').select('*');
      if (data) return data;
    }
    const store = getLocalStore();
    return store.profiles;
  },

  // --- ACTIVITY ---
  async fetchActivity() {
    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase.from('activity_logs').select('*, user:profiles(name, avatar_url)').order('created_at', { ascending: false });
      if (data) return data;
    }
    const store = getLocalStore();
    return store.activity;
  }
};
