import React, { useState, useEffect } from 'react';
import { Search, Zap, Inbox, Repeat, Target, Users, Activity, Settings, Plus, Bot, Command, ArrowRight } from 'lucide-react';

export default function CommandPalette({ isOpen, onClose, onNavigate, onCreateTask, onOpenAssistant }) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else window.dispatchEvent(new CustomEvent('open-command-palette'));
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    { id: 'create_task', label: 'Create New Task', icon: Plus, category: 'Actions', run: () => onCreateTask() },
    { id: 'ask_lala', label: 'Ask LALA AI Co-Pilot', icon: Bot, category: 'Actions', run: () => onOpenAssistant() },
    { id: 'nav_command', label: 'Go to Command Center', icon: Zap, category: 'Navigation', run: () => onNavigate('command') },
    { id: 'nav_chaos', label: 'Go to Chaos Inbox', icon: Inbox, category: 'Navigation', run: () => onNavigate('chaos-inbox') },
    { id: 'nav_flow', label: 'Go to Flow Board', icon: Repeat, category: 'Navigation', run: () => onNavigate('flow') },
    { id: 'nav_focus', label: 'Go to My Focus', icon: Target, category: 'Navigation', run: () => onNavigate('focus') },
    { id: 'nav_team', label: 'Go to Team Workload', icon: Users, category: 'Navigation', run: () => onNavigate('team') },
    { id: 'nav_activity', label: 'Go to Activity Log', icon: Activity, category: 'Navigation', run: () => onNavigate('activity') },
    { id: 'nav_settings', label: 'Go to Settings', icon: Settings, category: 'Navigation', run: () => onNavigate('settings') },
  ];

  const filtered = actions.filter(a => a.label.toLowerCase().includes(query.toLowerCase()));

  const handleRun = (action) => {
    action.run();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Palette Box */}
      <div className="relative w-full max-w-xl rounded-2xl bg-surface-900 border border-surface-border p-3 shadow-2xl z-10 animate-in zoom-in-95 duration-150">
        <div className="flex items-center px-3 py-2 border-b border-surface-border">
          <Search className="w-5 h-5 text-brand-cyan mr-3" />
          <input
            type="text"
            autoFocus
            placeholder="Type a command or search workspace (Press Esc to exit)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          <span className="text-[10px] font-bold text-slate-400 bg-surface-800 border border-surface-border px-2 py-0.5 rounded">
            ESC
          </span>
        </div>

        {/* Results Stream */}
        <div className="max-h-72 overflow-y-auto py-2 space-y-1">
          {filtered.length === 0 ? (
            <p className="text-xs text-slate-500 p-4 text-center">No matching actions found.</p>
          ) : (
            filtered.map((act) => {
              const Icon = act.icon;
              return (
                <button
                  key={act.id}
                  onClick={() => handleRun(act)}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-surface-800 text-slate-300 hover:text-white transition group text-left cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4 h-4 text-brand-cyan group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-semibold">{act.label}</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 group-hover:text-slate-300">
                    {act.category}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
