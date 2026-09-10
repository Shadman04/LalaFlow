import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import TaskCard from './TaskCard';

export default function KanbanColumn({ id, title, icon: Icon, tasks = [], onAddTask, onEditTask, onDeleteTask, onStatusChange, onStartTask }) {
  const [isDragOver, setIsDragOver] = useState(false);

  const columnStyles = {
    captured: { borderTop: 'border-slate-500', badgeBg: 'bg-slate-800 text-slate-300' },
    in_progress: { borderTop: 'border-brand-500', badgeBg: 'bg-brand-500/20 text-brand-400' },
    review: { borderTop: 'border-violet-500', badgeBg: 'bg-violet-500/20 text-violet-400' },
    completed: { borderTop: 'border-emerald-500', badgeBg: 'bg-emerald-500/20 text-emerald-400' },
  };

  const currentStyle = columnStyles[id] || columnStyles.captured;

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId && onStatusChange) {
      onStatusChange(taskId, id);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col min-w-[280px] sm:min-w-[300px] w-full max-w-sm rounded-2xl bg-surface-900/90 border border-t-4 ${currentStyle.borderTop} p-4 shadow-lg shrink-0 h-full transition-all duration-150 ${
        isDragOver ? 'border-brand-500 ring-2 ring-brand-500/40 bg-surface-850' : 'border-surface-border'
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-surface-border/60">
        <div className="flex items-center space-x-2">
          {Icon && <Icon className="w-5 h-5 text-slate-400" />}
          <h3 className="font-bold text-sm text-slate-100 uppercase tracking-wide">{title}</h3>
          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${currentStyle.badgeBg}`}>
            {tasks.length}
          </span>
        </div>

        <button
          onClick={() => onAddTask(id)}
          title={`Add task to ${title}`}
          className="p-1 text-slate-400 hover:text-white hover:bg-surface-800 rounded-lg transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Task List Items Container */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 min-h-[150px]">
        {tasks.length === 0 ? (
          <div className="h-full min-h-[120px] flex items-center justify-center border-2 border-dashed border-surface-border/40 rounded-xl p-4 text-center">
            <p className="text-xs text-slate-500 font-medium">Drop tasks here</p>
          </div>
        ) : (
          tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onStatusChange={onStatusChange}
              onStartTask={onStartTask}
            />
          ))
        )}
      </div>
    </div>
  );
}
