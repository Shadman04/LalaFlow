import React from 'react';
import { Calendar, User, AlertTriangle, CheckCircle2, Clock, Play, CheckSquare } from 'lucide-react';
import { getPriorityBadge, getStatusBadge, calculateSubtaskProgress } from '../utils/taskUtils';

export default function TaskCard({ task, onEdit, onDelete, onStatusChange, onStartTask }) {
  const priorityInfo = getPriorityBadge(task.priority);
  const statusInfo = getStatusBadge(task.status);
  const subtaskProgress = calculateSubtaskProgress(task.subtasks);

  const now = new Date();
  const isOverdue = task.due_date && new Date(task.due_date) < now && task.status !== 'completed';
  const isDueToday = task.due_date && new Date(task.due_date).toDateString() === now.toDateString();
  const isAtRisk = isOverdue || (task.priority === 'urgent' && task.status === 'captured');

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className={`group relative rounded-xl bg-surface-850 border border-surface-border/80 p-4 shadow-sm hover:shadow-md hover:border-brand-500/40 transition-all duration-200 cursor-grab active:cursor-grabbing ${
        task.status === 'completed' ? 'opacity-75' : ''
      }`}
    >
      {/* Risk Ribbon Header */}
      {isAtRisk && (
        <div className="flex items-center space-x-1 mb-2.5 text-[10px] font-extrabold uppercase tracking-wider text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-md w-fit">
          <AlertTriangle className="w-3 h-3" />
          <span>{isOverdue ? 'OVERDUE' : 'AT RISK'}</span>
        </div>
      )}

      {/* Priority & Status Controls */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${priorityInfo.bg} ${priorityInfo.text} ${priorityInfo.border}`}>
          {priorityInfo.label}
        </span>

        {/* Status Dropdown Fallback */}
        <select
          value={task.status}
          onChange={(e) => onStatusChange && onStatusChange(task.id, e.target.value)}
          className="text-[11px] font-medium bg-surface-800 text-slate-300 border border-surface-border rounded-md px-2 py-0.5 focus:outline-none focus:border-brand-500 cursor-pointer"
        >
          <option value="captured">Captured</option>
          <option value="in_progress">In Progress</option>
          <option value="review">Review</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Task Title & Description */}
      <h4 
        onClick={() => onEdit && onEdit(task)}
        className="font-semibold text-sm text-slate-100 hover:text-brand-cyan transition cursor-pointer line-clamp-2"
      >
        {task.title}
      </h4>
      {task.description && (
        <p className="text-xs text-slate-400 mt-1 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Subtask Progress Bar */}
      {subtaskProgress.count > 0 && (
        <div className="mt-2.5 pt-2 border-t border-surface-border/40">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-1">
            <span className="flex items-center gap-1">
              <CheckSquare className="w-3 h-3 text-brand-cyan" /> Subtasks
            </span>
            <span className="text-slate-200">{subtaskProgress.completed}/{subtaskProgress.count} ({subtaskProgress.percent}%)</span>
          </div>
          <div className="w-full h-1.5 bg-surface-800 rounded-full overflow-hidden border border-surface-border/50">
            <div 
              className="h-full bg-brand-cyan rounded-full transition-all duration-300"
              style={{ width: `${subtaskProgress.percent}%` }}
            />
          </div>
        </div>
      )}

      {/* Footer Info: Assignee & Due Date */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-surface-border/50 text-xs text-slate-400">
        <div className="flex items-center space-x-2">
          {task.assignee ? (
            <div className="flex items-center space-x-1.5" title={task.assignee.name}>
              <img 
                src={task.assignee.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'} 
                alt={task.assignee.name}
                className="w-5 h-5 rounded-full object-cover border border-surface-border"
              />
              <span className="text-[11px] truncate max-w-[80px]">{task.assignee.name.split(' ')[0]}</span>
            </div>
          ) : (
            <span className="text-[11px] text-slate-500 flex items-center gap-1">
              <User className="w-3 h-3" /> Unassigned
            </span>
          )}
        </div>

        {task.due_date && (
          <div className={`flex items-center space-x-1 text-[11px] font-medium ${
            isOverdue ? 'text-red-400 font-bold' : (isDueToday ? 'text-amber-400' : 'text-slate-400')
          }`}>
            <Calendar className="w-3 h-3" />
            <span>
              {isDueToday ? 'Today' : new Date(task.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </span>
          </div>
        )}
      </div>

      {/* Quick Action Button */}
      {task.status === 'captured' && onStartTask && (
        <button
          onClick={() => onStartTask(task)}
          className="w-full mt-3 py-1.5 bg-brand-600/20 hover:bg-brand-600 text-brand-300 hover:text-white rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition duration-150"
        >
          <Play className="w-3 h-3 fill-current" />
          <span>Start Task</span>
        </button>
      )}
    </div>
  );
}
