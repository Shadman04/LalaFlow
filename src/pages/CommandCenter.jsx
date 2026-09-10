import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Layers, 
  Sparkles, 
  ArrowRight, 
  Play, 
  Activity,
  HeartPulse,
  Bot
} from 'lucide-react';
import StatCard from '../components/StatCard';
import FocusCard from '../components/FocusCard';
import RiskCard from '../components/RiskCard';
import ActivityTimeline from '../components/ActivityTimeline';
import AnalyticsChart from '../components/AnalyticsChart';
import LoadingState from '../components/LoadingState';
import { useTasks } from '../hooks/useTasks';
import { useAuth } from '../hooks/useAuth';

export default function CommandCenter({ onNavigateTab, onOpenTaskModal, onOpenAssistant }) {
  const { user } = useAuth();
  const { 
    tasks, 
    stats, 
    workflowHealth, 
    nextBestAction, 
    riskyItems, 
    activities, 
    loading, 
    updateTask,
    snoozeTask
  } = useTasks();

  const handleStartTask = async (task) => {
    await updateTask(task.id, { status: 'in_progress' });
    onNavigateTab('flow');
  };

  if (loading && tasks.length === 0) {
    return <LoadingState count={4} />;
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Top Real Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="TOTAL TASKS"
          value={stats.total}
          icon={Layers}
          color="brand"
          description="In operations workspace"
          onClick={() => onNavigateTab('flow')}
        />
        <StatCard
          title="ACTIVE"
          value={stats.active}
          icon={Clock}
          color="cyan"
          description="Work items in progress"
          onClick={() => onNavigateTab('flow')}
        />
        <StatCard
          title="COMPLETED"
          value={stats.completed}
          icon={CheckCircle2}
          color="emerald"
          description="Finished successfully"
          onClick={() => onNavigateTab('flow')}
        />
        <StatCard
          title="AT RISK"
          value={stats.atRisk}
          icon={AlertTriangle}
          color="red"
          description="Overdue or high priority risk"
          onClick={() => onNavigateTab('focus')}
        />
      </div>

      {/* Grid: Workflow Health & Next Best Action */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* WORKFLOW HEALTH SCORE CARD */}
        <div className="rounded-3xl bg-surface-900 border border-surface-border p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <HeartPulse className="w-4 h-4 text-brand-cyan" /> WORKFLOW HEALTH
              </span>
              <span className={`px-2.5 py-0.5 text-xs font-black rounded-full uppercase border ${
                workflowHealth.color === 'emerald' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                workflowHealth.color === 'amber' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                'bg-red-500/20 text-red-400 border-red-500/30'
              }`}>
                ● {workflowHealth.status}
              </span>
            </div>

            <div className="my-4">
              <div className="flex items-baseline space-x-2">
                <span className="text-4xl md:text-5xl font-black text-white">{workflowHealth.percentage}%</span>
                <span className="text-xs text-slate-400">efficiency index</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-3 bg-surface-800 rounded-full overflow-hidden mt-3 p-0.5 border border-surface-border">
                <div 
                  className={`h-full rounded-full transition-all duration-700 ${
                    workflowHealth.color === 'emerald' ? 'bg-gradient-to-r from-emerald-500 to-brand-cyan' :
                    workflowHealth.color === 'amber' ? 'bg-gradient-to-r from-amber-500 to-yellow-400' :
                    'bg-gradient-to-r from-red-600 to-amber-500'
                  }`}
                  style={{ width: `${workflowHealth.percentage}%` }}
                />
              </div>
            </div>

            <div className="text-xs text-slate-300 space-y-1.5 mt-4 pt-3 border-t border-surface-border/50">
              <div className="flex justify-between">
                <span>Completed Tasks:</span>
                <span className="font-bold text-white">{workflowHealth.completed_count}</span>
              </div>
              <div className="flex justify-between">
                <span>Active Bottlenecks:</span>
                <span className="font-bold text-white">{workflowHealth.active_count}</span>
              </div>
              <div className="flex justify-between">
                <span>Overdue Risk Items:</span>
                <span className="font-bold text-red-400">{workflowHealth.overdue_count}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onOpenAssistant}
            className="w-full mt-6 py-2.5 bg-surface-850 hover:bg-surface-800 text-brand-cyan font-bold text-xs rounded-xl border border-surface-border transition flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Bot className="w-4 h-4" />
            <span>Ask LALA for Health Optimization</span>
          </button>
        </div>

        {/* LALA NEXT BEST ACTION CARD (2 Columns Wide) */}
        <div className="lg:col-span-2">
          <FocusCard
            nextAction={nextBestAction}
            onStartTask={handleStartTask}
            onSnooze={snoozeTask}
            onAskLala={onOpenAssistant}
            onViewDetails={(task) => onOpenTaskModal(task)}
          />
        </div>
      </div>

      {/* Grid: Needs Attention & Activity Log & Throughput Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* NEEDS ATTENTION SECTION */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span>Needs Attention ({riskyItems.length})</span>
            </h3>
            <button
              onClick={() => onNavigateTab('focus')}
              className="text-xs font-semibold text-brand-cyan hover:underline flex items-center gap-1"
            >
              <span>View All Focus Items</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {riskyItems.length === 0 ? (
            <div className="rounded-2xl bg-surface-900 border border-surface-border p-6 text-center py-8">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <h4 className="font-bold text-sm text-white">No Critical Risks Detected</h4>
              <p className="text-xs text-slate-400 mt-1">All tasks are currently within deadline thresholds.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {riskyItems.slice(0, 4).map((item, i) => (
                <RiskCard
                  key={i}
                  item={item}
                  onClickTask={(task) => onOpenTaskModal(task)}
                />
              ))}
            </div>
          )}

          {/* Workflow Velocity Analytics Chart */}
          <AnalyticsChart tasks={tasks} />
        </div>

        {/* RECENT ACTIVITY TIMELINE */}
        <div>
          <ActivityTimeline activities={activities} />
        </div>
      </div>
    </div>
  );
}
