// Utility functions for task metrics, priority calculation, subtasks, and status helpers

export function calculateWorkflowHealth(tasks = []) {
  if (!tasks || tasks.length === 0) {
    return {
      percentage: 100,
      status: 'HEALTHY',
      color: 'emerald',
      label: '100% — No active risks'
    };
  }

  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'completed').length;
  const active = tasks.filter(t => t.status !== 'completed');
  
  const now = new Date();
  const overdue = active.filter(t => t.due_date && new Date(t.due_date) < now).length;
  const urgentUnfinished = active.filter(t => t.priority === 'urgent' || t.priority === 'high').length;

  const completionRatio = completed / total;
  const overduePenalty = (overdue / total) * 0.4;
  const urgentPenalty = (urgentUnfinished / total) * 0.2;

  let healthScore = Math.round((completionRatio * 100) + ((1 - overduePenalty - urgentPenalty) * 40));
  if (healthScore > 100) healthScore = 100;
  if (healthScore < 10) healthScore = 10;

  let status = 'HEALTHY';
  let color = 'emerald';

  if (healthScore < 50 || overdue >= 3) {
    status = 'CRITICAL';
    color = 'red';
  } else if (healthScore < 80 || overdue > 0) {
    status = 'NEEDS ATTENTION';
    color = 'amber';
  }

  return {
    percentage: healthScore,
    status,
    color,
    completed_count: completed,
    active_count: active.length,
    overdue_count: overdue
  };
}

export function sortTasksByPriority(tasks = []) {
  const weight = { urgent: 4, high: 3, medium: 2, low: 1 };
  return [...tasks].sort((a, b) => {
    const now = new Date();
    const aOverdue = a.due_date && new Date(a.due_date) < now && a.status !== 'completed';
    const bOverdue = b.due_date && new Date(b.due_date) < now && b.status !== 'completed';

    if (aOverdue && !bOverdue) return -1;
    if (!aOverdue && bOverdue) return 1;

    const diff = (weight[b.priority] || 0) - (weight[a.priority] || 0);
    if (diff !== 0) return diff;

    if (a.due_date && b.due_date) return new Date(a.due_date) - new Date(b.due_date);
    return 0;
  });
}

export function calculateSubtaskProgress(subtasks = []) {
  if (!subtasks || !Array.isArray(subtasks) || subtasks.length === 0) {
    return { count: 0, completed: 0, percent: 0 };
  }
  const completed = subtasks.filter(s => s.completed).length;
  const percent = Math.round((completed / subtasks.length) * 100);
  return {
    count: subtasks.length,
    completed,
    percent
  };
}

export function getPriorityBadge(priority) {
  switch (priority) {
    case 'urgent':
      return { label: 'URGENT', bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' };
    case 'high':
      return { label: 'HIGH', bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30' };
    case 'medium':
      return { label: 'MEDIUM', bg: 'bg-cyan-500/20', text: 'text-cyan-400', border: 'border-cyan-500/30' };
    case 'low':
    default:
      return { label: 'LOW', bg: 'bg-slate-500/20', text: 'text-slate-400', border: 'border-slate-500/30' };
  }
}

export function getStatusBadge(status) {
  switch (status) {
    case 'captured':
      return { label: 'Captured', bg: 'bg-slate-800', text: 'text-slate-300' };
    case 'in_progress':
      return { label: 'In Progress', bg: 'bg-brand-500/20', text: 'text-brand-400' };
    case 'review':
      return { label: 'In Review', bg: 'bg-violet-500/20', text: 'text-violet-400' };
    case 'completed':
      return { label: 'Completed', bg: 'bg-emerald-500/20', text: 'text-emerald-400' };
    default:
      return { label: status, bg: 'bg-slate-800', text: 'text-slate-300' };
  }
}
