import { useContext, useMemo } from 'react';
import { AppContext } from '../context/AppContext';
import { useAuth } from './useAuth';
import { calculateWorkflowHealth, sortTasksByPriority } from '../utils/taskUtils';
import { detectRiskyTasks } from '../utils/riskUtils';

export function useTasks() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useTasks must be used within an AppProvider');
  }

  const { tasks, searchQuery, filters, ...rest } = context;
  const { user } = useAuth();

  // Multi-attribute Filter Engine
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // 1. Search Query (Title, Description, Assignee Name)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const titleMatch = task.title?.toLowerCase().includes(q);
        const descMatch = task.description?.toLowerCase().includes(q);
        const assigneeMatch = task.assignee?.name?.toLowerCase().includes(q);
        if (!titleMatch && !descMatch && !assigneeMatch) return false;
      }

      // 2. Status Filter
      if (filters.status !== 'all' && task.status !== filters.status) {
        return false;
      }

      // 3. Priority Filter
      if (filters.priority !== 'all' && task.priority !== filters.priority) {
        return false;
      }

      // 4. Assignee Filter
      if (filters.assignee !== 'all') {
        if (filters.assignee === 'unassigned' && task.assignee_id) return false;
        if (filters.assignee !== 'unassigned' && task.assignee_id !== filters.assignee) return false;
      }

      // 5. Quick Filters ('my_tasks', 'high_priority', 'due_today', 'overdue')
      if (filters.quickFilter === 'my_tasks' && task.assignee_id !== user?.id) {
        return false;
      }
      if (filters.quickFilter === 'high_priority' && task.priority !== 'high' && task.priority !== 'urgent') {
        return false;
      }

      const now = new Date();
      if (filters.quickFilter === 'due_today') {
        if (!task.due_date) return false;
        const d = new Date(task.due_date);
        if (d.toDateString() !== now.toDateString()) return false;
      }
      if (filters.quickFilter === 'overdue') {
        if (!task.due_date || task.status === 'completed') return false;
        if (new Date(task.due_date) >= now) return false;
      }

      return true;
    });
  }, [tasks, searchQuery, filters, user]);

  // Derived Task Metrics
  const stats = useMemo(() => {
    const total = tasks.length;
    const active = tasks.filter(t => t.status !== 'completed').length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const now = new Date();
    const overdue = tasks.filter(t => t.status !== 'completed' && t.due_date && new Date(t.due_date) < now).length;
    const atRisk = detectRiskyTasks(tasks).length;

    return { total, active, completed, overdue, atRisk };
  }, [tasks]);

  // Health Score Calculation
  const workflowHealth = useMemo(() => {
    return calculateWorkflowHealth(tasks);
  }, [tasks]);

  // Silent Risk Detector
  const riskyItems = useMemo(() => {
    return detectRiskyTasks(tasks);
  }, [tasks]);

  // Next Best Action Algorithm
  const nextBestAction = useMemo(() => {
    const active = tasks.filter(t => {
      if (t.status === 'completed') return false;
      // Skip snoozed
      if (t.snoozed_until && new Date(t.snoozed_until) > new Date()) return false;
      return true;
    });

    if (active.length === 0) return null;

    const sorted = sortTasksByPriority(active);
    const top = sorted[0];

    const now = new Date();
    let rationale = `Highest priority item in your flow queue.`;
    if (top.due_date && new Date(top.due_date) < now) {
      rationale = `OVERDUE: Scheduled deadline (${new Date(top.due_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}) passed.`;
    } else if (top.priority === 'urgent' || top.priority === 'high') {
      rationale = `High priority task scheduled for today.`;
    }

    return { task: top, rationale };
  }, [tasks]);

  return {
    tasks,
    filteredTasks,
    stats,
    workflowHealth,
    riskyItems,
    nextBestAction,
    searchQuery,
    filters,
    ...rest
  };
}
