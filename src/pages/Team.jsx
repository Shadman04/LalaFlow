import React from 'react';
import { Users, AlertTriangle, Sparkles, ArrowRightLeft } from 'lucide-react';
import EmployeeCard from '../components/EmployeeCard';
import { useTasks } from '../hooks/useTasks';

export default function Team({ onOpenTaskModal }) {
  const { teamMembers, tasks } = useTasks();

  // Calculate Overload Alert & Recommendation
  const overloadedMembers = teamMembers.filter(m => {
    const active = tasks.filter(t => t.assignee_id === m.id && t.status !== 'completed');
    return active.length >= 6;
  });

  const availableMembers = teamMembers.filter(m => {
    const active = tasks.filter(t => t.assignee_id === m.id && t.status !== 'completed');
    return active.length < 4;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Title Header */}
      <div className="flex items-center justify-between border-b border-surface-border/60 pb-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-brand-cyan" />
            <span>Team Workload & Capacity</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Monitor employee task distribution, balance workloads, and execute AI re-assignments.
          </p>
        </div>
      </div>

      {/* LALA WORKLOAD BALANCING RECOMMENDATION CARD */}
      <div className="rounded-3xl bg-gradient-to-r from-surface-900 via-surface-850 to-navy-900 border border-brand-500/30 p-6 shadow-xl">
        <div className="flex items-start space-x-3">
          <div className="p-2.5 rounded-2xl bg-brand-violet/20 border border-brand-violet/30 shrink-0">
            <Sparkles className="w-6 h-6 text-brand-cyan" />
          </div>
          <div className="flex-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-brand-cyan block">
              LALA AI WORKLOAD BALANCER
            </span>
            <h3 className="font-bold text-base text-white mt-0.5">
              {overloadedMembers.length > 0
                ? `⚠️ WORKLOAD ALERT: ${overloadedMembers[0].name} has high task density.`
                : '🟢 Team Workload Balanced'}
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              {overloadedMembers.length > 0 && availableMembers.length > 0
                ? `${overloadedMembers[0].name} is currently managing ${tasks.filter(t => t.assignee_id === overloadedMembers[0].id && t.status !== 'completed').length} active tasks. LALA recommends assigning the next incoming tasks to ${availableMembers[0].name} (${tasks.filter(t => t.assignee_id === availableMembers[0].id && t.status !== 'completed').length} active tasks).`
                : 'Current active tasks are well distributed across team members.'}
            </p>
          </div>
        </div>
      </div>

      {/* Team Member Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        {teamMembers.map(member => (
          <EmployeeCard
            key={member.id}
            member={member}
            tasks={tasks}
            onAssignTask={() => onOpenTaskModal()}
          />
        ))}
      </div>
    </div>
  );
}
