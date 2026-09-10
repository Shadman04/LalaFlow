import React from 'react';
import { Target, Play, Clock, Sparkles, AlertTriangle, ArrowRight, HelpCircle } from 'lucide-react';
import { getPriorityBadge } from '../utils/taskUtils';

export default function FocusCard({ nextAction, onStartTask, onSnooze, onAskLala, onViewDetails }) {
  if (!nextAction || !nextAction.task) {
    return (
      <div className="rounded-2xl bg-gradient-to-br from-surface-900 via-surface-850 to-navy-900 border border-surface-border p-6 shadow-xl text-center py-10">
        <Target className="w-12 h-12 text-brand-cyan mx-auto mb-3 animate-pulse" />
        <h3 className="text-xl font-bold text-white">Your Workflow is Clear!</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
          You have no urgent or pending tasks left in your active queue. Take a breather or create new work items.
        </p>
      </div>
    );
  }

  const { task, rationale } = nextAction;
  const priorityInfo = getPriorityBadge(task.priority);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-surface-900 via-surface-850 to-navy-900 border border-brand-500/40 p-6 md:p-8 shadow-2xl">
      {/* Background Decorative Glow */}
      <div className="absolute -right-12 -top-12 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-brand-cyan/10 rounded-full blur-3xl pointer-events-none" />

      {/* Card Header Tag */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center space-x-2 bg-brand-500/20 border border-brand-500/30 px-3 py-1 rounded-full w-fit">
          <Target className="w-4 h-4 text-brand-cyan animate-pulse" />
          <span className="text-xs font-black uppercase tracking-wider text-brand-cyan">
            YOUR NEXT BEST ACTION
          </span>
        </div>

        <span className={`px-3 py-1 text-xs font-bold rounded-full border ${priorityInfo.bg} ${priorityInfo.text} ${priorityInfo.border}`}>
          {priorityInfo.label} PRIORITY
        </span>
      </div>

      {/* Task Title */}
      <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight mb-2">
        {task.title}
      </h2>

      {task.description && (
        <p className="text-sm text-slate-300 mb-4 line-clamp-2 max-w-2xl">
          {task.description}
        </p>
      )}

      {/* WHY THIS TASK RATIONALE (The Core Differentiator!) */}
      <div className="my-5 p-4 rounded-2xl bg-surface-800/80 border border-brand-500/20 flex items-start space-x-3">
        <div className="p-2 rounded-xl bg-brand-600/20 shrink-0">
          <Sparkles className="w-5 h-5 text-brand-cyan" />
        </div>
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-brand-cyan block mb-0.5">
            WHY THIS TASK?
          </span>
          <p className="text-xs font-semibold text-slate-200">
            {rationale}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          onClick={() => onStartTask(task)}
          className="flex-1 min-w-[140px] flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-brand-600 via-brand-500 to-brand-cyan hover:opacity-90 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-brand-600/30 transition transform active:scale-95 cursor-pointer"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>START TASK</span>
        </button>

        <button
          onClick={() => onSnooze(task.id)}
          className="flex items-center space-x-1.5 px-4 py-3 bg-surface-800 hover:bg-surface-700 text-slate-300 hover:text-white font-semibold text-xs rounded-xl border border-surface-border transition"
        >
          <Clock className="w-4 h-4 text-amber-400" />
          <span>SNOOZE</span>
        </button>

        <button
          onClick={() => onAskLala(task)}
          className="flex items-center space-x-1.5 px-4 py-3 bg-brand-violet/20 hover:bg-brand-violet/30 text-brand-violet font-semibold text-xs rounded-xl border border-brand-violet/30 transition"
        >
          <Sparkles className="w-4 h-4" />
          <span>ASK LALA</span>
        </button>
      </div>
    </div>
  );
}
