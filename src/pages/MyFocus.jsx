import React from 'react';
import { Target, Clock, Sparkles, AlertTriangle, Play, ChevronRight, CheckCircle2 } from 'lucide-react';
import FocusCard from '../components/FocusCard';
import RiskCard from '../components/RiskCard';
import TaskCard from '../components/TaskCard';
import { useTasks } from '../hooks/useTasks';

export default function MyFocus({ onNavigateTab, onOpenTaskModal, onOpenAssistant }) {
  const { tasks, nextBestAction, riskyItems, updateTask, snoozeTask } = useTasks();

  const handleStartTask = async (task) => {
    await updateTask(task.id, { status: 'in_progress' });
    onNavigateTab('flow');
  };

  // Focus Queue: Next 3 active tasks excluding the top nextBestAction
  const activeQueue = tasks
    .filter(t => t.status !== 'completed' && t.id !== nextBestAction?.task?.id)
    .slice(0, 3);

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Title Header */}
      <div className="flex items-center justify-between border-b border-surface-border/60 pb-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Target className="w-6 h-6 text-brand-cyan" />
            <span>What Should I Do Now?</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            LalaFlow's core engine evaluates priority, deadlines, and urgency to direct your focus.
          </p>
        </div>
      </div>

      {/* Hero Next Best Action Card */}
      <FocusCard
        nextAction={nextBestAction}
        onStartTask={handleStartTask}
        onSnooze={snoozeTask}
        onAskLala={onOpenAssistant}
        onViewDetails={(task) => onOpenTaskModal(task)}
      />

      {/* Grid: Focus Queue & Silent Risk Detector */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        {/* FOCUS QUEUE (Next 3 Recommended Tasks) */}
        <div className="rounded-3xl bg-surface-900 border border-surface-border p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-surface-border pb-3">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-brand-cyan" />
              <span>Upcoming Focus Queue</span>
            </h3>
            <span className="text-xs font-bold text-slate-400">Next Up</span>
          </div>

          {activeQueue.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">No secondary tasks queued up.</p>
          ) : (
            <div className="space-y-3">
              {activeQueue.map(task => (
                <div key={task.id} className="p-3.5 rounded-xl bg-surface-850 border border-surface-border hover:border-brand-500/30 transition flex items-center justify-between">
                  <div className="truncate pr-2">
                    <h4 className="font-bold text-xs text-white truncate">{task.title}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">Priority: {task.priority.toUpperCase()}</p>
                  </div>
                  <button
                    onClick={() => handleStartTask(task)}
                    className="p-1.5 rounded-lg bg-brand-600/20 text-brand-cyan hover:bg-brand-600 hover:text-white transition shrink-0"
                    title="Start task"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SILENT RISK DETECTOR CARD LIST */}
        <div className="rounded-3xl bg-surface-900 border border-surface-border p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-surface-border pb-3">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span>Silent Risk Detector</span>
            </h3>
            <span className="text-xs font-bold text-amber-400">{riskyItems.length} Risks</span>
          </div>

          {riskyItems.length === 0 ? (
            <div className="text-center py-6">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p className="text-xs text-slate-400">All workflow items are safe with zero deadline risks.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {riskyItems.slice(0, 3).map((item, i) => (
                <RiskCard
                  key={i}
                  item={item}
                  onClickTask={(task) => onOpenTaskModal(task)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
