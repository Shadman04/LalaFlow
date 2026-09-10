import React from 'react';
import { User, CheckCircle2, AlertCircle, Shield, ArrowRightLeft } from 'lucide-react';

export default function EmployeeCard({ member, tasks = [], onAssignTask }) {
  const activeTasks = tasks.filter(t => t.assignee_id === member.id && t.status !== 'completed');
  const completedTasks = tasks.filter(t => t.assignee_id === member.id && t.status === 'completed');

  // Calculate Workload
  const activeCount = activeTasks.length;
  let workloadStatus = '🟢 AVAILABLE';
  let barColor = 'bg-emerald-500';
  let textColor = 'text-emerald-400';
  let maxScale = 8;
  let percent = Math.min(100, Math.round((activeCount / maxScale) * 100));

  if (activeCount >= 6) {
    workloadStatus = '🔴 HIGH WORKLOAD';
    barColor = 'bg-red-500';
    textColor = 'text-red-400';
  } else if (activeCount >= 3) {
    workloadStatus = '🟡 MODERATE';
    barColor = 'bg-amber-500';
    textColor = 'text-amber-400';
  }

  return (
    <div className="rounded-2xl bg-surface-900 border border-surface-border p-5 shadow-lg space-y-4">
      {/* Employee Profile Header */}
      <div className="flex items-center space-x-3.5">
        <img
          src={member.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
          alt={member.name}
          className="w-12 h-12 rounded-2xl object-cover ring-2 ring-brand-500/30 shrink-0"
        />
        <div className="truncate flex-1">
          <h3 className="font-bold text-base text-white truncate">{member.name}</h3>
          <p className="text-xs text-slate-400 capitalize flex items-center gap-1">
            <Shield className="w-3 h-3 text-brand-cyan" /> {member.role} • {member.email}
          </p>
        </div>
      </div>

      {/* Task Count Stats */}
      <div className="grid grid-cols-2 gap-2 text-center p-3 rounded-xl bg-surface-850 border border-surface-border/50">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400">Active Tasks</span>
          <p className="text-xl font-black text-white">{activeCount}</p>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400">Completed</span>
          <p className="text-xl font-black text-emerald-400">{completedTasks.length}</p>
        </div>
      </div>

      {/* Workload Progress Bar */}
      <div>
        <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
          <span className="text-slate-300">WORKLOAD BALANCE</span>
          <span className={textColor}>{workloadStatus}</span>
        </div>
        <div className="w-full h-2.5 bg-surface-800 rounded-full overflow-hidden p-0.5 border border-surface-border">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${barColor}`}
            style={{ width: `${Math.max(10, percent)}%` }}
          />
        </div>
      </div>

      {/* Action button */}
      {onAssignTask && (
        <button
          onClick={() => onAssignTask(member)}
          className="w-full py-2 bg-surface-800 hover:bg-surface-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold border border-surface-border transition flex items-center justify-center space-x-1.5"
        >
          <ArrowRightLeft className="w-3.5 h-3.5 text-brand-cyan" />
          <span>Manage / Assign Task</span>
        </button>
      )}
    </div>
  );
}
