import React from 'react';
import { Activity, Plus, CheckCircle, RefreshCw, FileText, User } from 'lucide-react';

export default function ActivityTimeline({ activities = [] }) {
  const getActionIcon = (action) => {
    switch (action) {
      case 'created_task':
      case 'created_task_from_chaos':
        return <Plus className="w-4 h-4 text-emerald-400" />;
      case 'completed_task':
        return <CheckCircle className="w-4 h-4 text-brand-cyan" />;
      case 'updated_status':
        return <RefreshCw className="w-4 h-4 text-violet-400" />;
      default:
        return <FileText className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="rounded-2xl bg-surface-900 border border-surface-border p-5 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-surface-border pb-3">
        <h3 className="font-bold text-base text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-brand-cyan" />
          <span>Recent Activity</span>
        </h3>
        <span className="text-xs text-slate-400 font-medium">Live Audit Log</span>
      </div>

      <div className="space-y-4 relative before:absolute before:inset-0 before:left-4 before:w-0.5 before:bg-surface-border">
        {activities.length === 0 ? (
          <p className="text-xs text-slate-500 py-4 text-center">No recent activities recorded.</p>
        ) : (
          activities.slice(0, 10).map((act, index) => (
            <div key={act.id || index} className="relative flex items-start space-x-3 pl-8">
              {/* Timeline Icon Marker */}
              <div className="absolute left-1.5 top-1 -translate-x-1/2 p-1.5 rounded-full bg-surface-850 border border-surface-border z-10">
                {getActionIcon(act.action)}
              </div>

              <div className="flex-1 bg-surface-850 border border-surface-border/60 rounded-xl p-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-slate-200">
                    {act.user?.name || act.user_name || 'Team Member'}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {act.created_at ? new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently'}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 font-medium">
                  {act.action === 'created_task' && `Created task: "${act.details?.title}"`}
                  {act.action === 'created_task_from_chaos' && `Added task from Chaos Inbox: "${act.details?.title}"`}
                  {act.action === 'completed_task' && `Completed task: "${act.details?.title}"`}
                  {act.action === 'updated_status' && `Moved "${act.details?.title}" → ${act.details?.new_status}`}
                  {!['created_task', 'created_task_from_chaos', 'completed_task', 'updated_status'].includes(act.action) && 
                    `Performed operational action on ${act.entity_type}`}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
