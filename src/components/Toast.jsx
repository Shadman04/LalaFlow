import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export default function Toast({ toasts = [], onRemove }) {
  if (toasts.length === 0) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-brand-cyan shrink-0" />
  };

  const borders = {
    success: 'border-emerald-500/40 bg-surface-900/95 text-slate-100',
    error: 'border-red-500/40 bg-surface-900/95 text-slate-100',
    warning: 'border-amber-500/40 bg-surface-900/95 text-slate-100',
    info: 'border-brand-500/40 bg-surface-900/95 text-slate-100'
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center justify-between p-4 rounded-2xl border ${borders[toast.type] || borders.info} shadow-2xl backdrop-blur-md animate-in slide-in-from-top-3 duration-200`}
        >
          <div className="flex items-center space-x-3">
            {icons[toast.type] || icons.info}
            <p className="text-xs font-semibold">{toast.message}</p>
          </div>
          <button
            onClick={() => onRemove(toast.id)}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
