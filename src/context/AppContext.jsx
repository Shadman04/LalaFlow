import React, { createContext, useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';

export const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    assignee: 'all',
    quickFilter: 'all' // 'all', 'my_tasks', 'high_priority', 'due_today', 'overdue'
  });

  // Toast System State
  const [toasts, setToasts] = useState([]);

  // LALA Co-Pilot Panel State
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [showDailyBriefing, setShowDailyBriefing] = useState(false);

  // Toast Trigger
  const addToast = useCallback((message, type = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Fetch initial state
  const refreshTasks = useCallback(async () => {
    try {
      setLoading(true);
      const [fetchedTasks, fetchedTeam, fetchedActivity] = await Promise.all([
        apiService.fetchTasks(),
        apiService.fetchTeam(),
        apiService.fetchActivity()
      ]);
      setTasks(fetchedTasks || []);
      setTeamMembers(fetchedTeam || []);
      setActivities(fetchedActivity || []);
      setError(null);
    } catch (err) {
      console.error('Failed to load application data:', err);
      setError('Unable to sync right now. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshTasks();
    // Show daily briefing on first load
    const hasSeenBriefing = sessionStorage.getItem('lalaflow_seen_briefing');
    if (!hasSeenBriefing) {
      setShowDailyBriefing(true);
      sessionStorage.setItem('lalaflow_seen_briefing', 'true');
    }
  }, [refreshTasks]);

  // CRUD Actions
  const createTask = async (taskData) => {
    try {
      const created = await apiService.createTask(taskData);
      setTasks(prev => [created, ...prev]);
      addToast(`Task "${created.title}" created successfully!`, 'success');
      refreshTasks();
      return created;
    } catch (e) {
      addToast('Failed to create task', 'error');
      throw e;
    }
  };

  const updateTask = async (id, updates) => {
    try {
      const updated = await apiService.updateTask(id, updates);
      setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updated } : t));
      addToast(`Task updated`, 'info');
      refreshTasks();
      return updated;
    } catch (e) {
      addToast('Failed to update task', 'error');
      throw e;
    }
  };

  const deleteTask = async (id) => {
    try {
      await apiService.deleteTask(id);
      setTasks(prev => prev.filter(t => t.id !== id));
      addToast('Task deleted', 'warning');
      refreshTasks();
    } catch (e) {
      addToast('Failed to delete task', 'error');
    }
  };

  const snoozeTask = async (id, durationHours = 24) => {
    const snoozedUntil = new Date(Date.now() + durationHours * 60 * 60 * 1000).toISOString();
    await updateTask(id, { snoozed_until: snoozedUntil });
    addToast(`Task snoozed for ${durationHours} hours`, 'info');
  };

  return (
    <AppContext.Provider value={{
      tasks,
      teamMembers,
      activities,
      loading,
      error,
      searchQuery,
      setSearchQuery,
      filters,
      setFilters,
      toasts,
      addToast,
      removeToast,
      isAssistantOpen,
      setIsAssistantOpen,
      showDailyBriefing,
      setShowDailyBriefing,
      refreshTasks,
      createTask,
      updateTask,
      deleteTask,
      snoozeTask
    }}>
      {children}
    </AppContext.Provider>
  );
}
