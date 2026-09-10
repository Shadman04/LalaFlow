import React from 'react';
import { Activity as ActivityIcon } from 'lucide-react';
import ActivityTimeline from '../components/ActivityTimeline';
import { useTasks } from '../hooks/useTasks';

export default function Activity() {
  const { activities } = useTasks();

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      <div className="flex items-center justify-between border-b border-surface-border/60 pb-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <ActivityIcon className="w-6 h-6 text-brand-cyan" />
            <span>Operational Audit Activity</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time audit trail of task creations, status updates, and completion milestones.
          </p>
        </div>
      </div>

      <ActivityTimeline activities={activities} />
    </div>
  );
}
