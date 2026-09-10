import React from 'react';
import { Filter, Search, RotateCcw, AlertTriangle, Clock, User, CheckCircle2 } from 'lucide-react';

export default function TaskFilters({ filters, setFilters, searchQuery, setSearchQuery, teamMembers = [] }) {
  const handleQuickFilter = (quickKey) => {
    setFilters(prev => ({
      ...prev,
      quickFilter: prev.quickFilter === quickKey ? 'all' : quickKey
    }));
  };

  const resetFilters = () => {
    setSearchQuery('');
    setFilters({
      status: 'all',
      priority: 'all',
      assignee: 'all',
      quickFilter: 'all'
    });
  };

  const isFiltered = searchQuery || filters.status !== 'all' || filters.priority !== 'all' || filters.assignee !== 'all' || filters.quickFilter !== 'all';

  return (
    <div className="bg-surface-900 border border-surface-border rounded-2xl p-4 space-y-3 mb-6">
      {/* Quick Filter Preset Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider shrink-0 flex items-center gap-1">
          <Filter className="w-3 h-3 text-brand-cyan" /> Filter By:
        </span>

        <button
          onClick={() => handleQuickFilter('all')}
          className={`px-3 py-1 rounded-full font-medium transition shrink-0 ${
            filters.quickFilter === 'all'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'bg-surface-800 text-slate-300 hover:bg-surface-700'
          }`}
        >
          All Tasks
        </button>

        <button
          onClick={() => handleQuickFilter('my_tasks')}
          className={`px-3 py-1 rounded-full font-medium transition shrink-0 flex items-center gap-1.5 ${
            filters.quickFilter === 'my_tasks'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'bg-surface-800 text-slate-300 hover:bg-surface-700'
          }`}
        >
          <User className="w-3.5 h-3.5" /> My Tasks
        </button>

        <button
          onClick={() => handleQuickFilter('high_priority')}
          className={`px-3 py-1 rounded-full font-medium transition shrink-0 flex items-center gap-1.5 ${
            filters.quickFilter === 'high_priority'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
              : 'bg-surface-800 text-amber-400 hover:bg-surface-700'
          }`}
        >
          ⚡ High Priority
        </button>

        <button
          onClick={() => handleQuickFilter('due_today')}
          className={`px-3 py-1 rounded-full font-medium transition shrink-0 flex items-center gap-1.5 ${
            filters.quickFilter === 'due_today'
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
              : 'bg-surface-800 text-cyan-400 hover:bg-surface-700'
          }`}
        >
          <Clock className="w-3.5 h-3.5" /> Due Today
        </button>

        <button
          onClick={() => handleQuickFilter('overdue')}
          className={`px-3 py-1 rounded-full font-medium transition shrink-0 flex items-center gap-1.5 ${
            filters.quickFilter === 'overdue'
              ? 'bg-red-500 text-white font-bold shadow-sm'
              : 'bg-surface-800 text-red-400 hover:bg-surface-700'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" /> Overdue
        </button>

        {isFiltered && (
          <button
            onClick={resetFilters}
            className="ml-auto text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 shrink-0"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        )}
      </div>

      {/* Select Dropdowns Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-surface-border/50">
        <div>
          <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Status</label>
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="w-full bg-navy-800 border border-surface-border rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
          >
            <option value="all">All Statuses</option>
            <option value="captured">📥 Captured</option>
            <option value="in_progress">⚡ In Progress</option>
            <option value="review">🔍 Review</option>
            <option value="completed">✅ Completed</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Priority</label>
          <select
            value={filters.priority}
            onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
            className="w-full bg-navy-800 border border-surface-border rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">🔴 Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Assignee</label>
          <select
            value={filters.assignee}
            onChange={(e) => setFilters(prev => ({ ...prev, assignee: e.target.value }))}
            className="w-full bg-navy-800 border border-surface-border rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
          >
            <option value="all">Everyone</option>
            <option value="unassigned">Unassigned</option>
            {teamMembers.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
