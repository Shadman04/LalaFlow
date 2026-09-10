import React from 'react';
import { BarChart2, CheckCircle2, Clock, AlertTriangle, Inbox } from 'lucide-react';

export default function AnalyticsChart({ tasks = [] }) {
  const captured = tasks.filter(t => t.status === 'captured').length;
  const inProgress = tasks.filter(t => t.status === 'in_progress').length;
  const review = tasks.filter(t => t.status === 'review').length;
  const completed = tasks.filter(t => t.status === 'completed').length;

  const total = tasks.length || 1;
  const max = Math.max(captured, inProgress, review, completed, 1);

  const bars = [
    { label: 'Captured', count: captured, color: 'bg-slate-500', text: 'text-slate-400', icon: Inbox },
    { label: 'In Progress', count: inProgress, color: 'bg-brand-500', text: 'text-brand-400', icon: Clock },
    { label: 'Review', count: review, color: 'bg-violet-500', text: 'text-violet-400', icon: BarChart2 },
    { label: 'Completed', count: completed, color: 'bg-emerald-500', text: 'text-emerald-400', icon: CheckCircle2 },
  ];

  return (
    <div className="rounded-3xl bg-surface-900 border border-surface-border p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-surface-border pb-3">
        <h3 className="font-bold text-base text-white flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-brand-cyan" />
          <span>Workflow Throughput Velocity</span>
        </h3>
        <span className="text-xs text-slate-400 font-medium">Status Distribution</span>
      </div>

      <div className="grid grid-cols-4 gap-3 pt-2">
        {bars.map((bar, i) => {
          const heightPercent = Math.max(12, Math.round((bar.count / max) * 100));
          const Icon = bar.icon;
          return (
            <div key={i} className="flex flex-col items-center justify-end space-y-2">
              <span className={`text-xs font-black ${bar.text}`}>{bar.count}</span>
              <div className="w-full bg-surface-800 rounded-xl overflow-hidden p-1 border border-surface-border h-28 flex items-end">
                <div 
                  className={`w-full rounded-lg transition-all duration-500 ${bar.color}`}
                  style={{ height: `${heightPercent}%` }}
                />
              </div>
              <div className="flex items-center space-x-1 text-[11px] font-semibold text-slate-400 truncate">
                <Icon className="w-3 h-3 hidden sm:inline" />
                <span className="truncate">{bar.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
