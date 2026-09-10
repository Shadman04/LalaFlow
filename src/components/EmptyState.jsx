import React from 'react';
import { Inbox, Plus } from 'lucide-react';

export default function EmptyState({ title = "NO TASKS YET", message = "Your workflow is clear.", actionLabel = "CREATE FIRST TASK", onAction }) {
  return (
    <div className="py-16 px-4 text-center rounded-3xl bg-surface-900 border border-surface-border my-6">
      <div className="w-16 h-16 rounded-2xl bg-surface-800 border border-surface-border flex items-center justify-center mx-auto mb-4 text-slate-400">
        <Inbox className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-white uppercase tracking-wider">{title}</h3>
      <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-6">
        {message}
      </p>
      {onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white text-xs font-bold rounded-xl shadow-lg shadow-brand-600/30 transition transform active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
}
