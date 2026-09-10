import React from 'react';
import { AlertTriangle, Clock, ArrowUpRight } from 'lucide-react';

export default function RiskCard({ item, onClickTask }) {
  const { task, riskLevel, riskReason } = item;

  const levelStyles = {
    CRITICAL: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', badge: 'bg-red-500 text-white' },
    HIGH: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', badge: 'bg-amber-500 text-slate-950 font-extrabold' },
    MEDIUM: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400', badge: 'bg-yellow-500/20 text-yellow-300' },
  };

  const style = levelStyles[riskLevel] || levelStyles.HIGH;

  return (
    <div 
      onClick={() => onClickTask && onClickTask(task)}
      className={`rounded-2xl ${style.bg} border ${style.border} p-4 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <AlertTriangle className={`w-4 h-4 ${style.text}`} />
          <span className={`px-2 py-0.5 text-[10px] font-black uppercase rounded ${style.badge}`}>
            ⚠️ AT RISK: {riskLevel}
          </span>
        </div>
        <ArrowUpRight className="w-4 h-4 text-slate-400" />
      </div>

      <h4 className="font-bold text-sm text-white">{task.title}</h4>

      <p className="text-xs text-slate-300 mt-1 font-medium flex items-center gap-1">
        <span>Risk Cause:</span>
        <span className={style.text}>{riskReason}</span>
      </p>

      {task.due_date && (
        <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>Due: {new Date(task.due_date).toLocaleString()}</span>
        </p>
      )}
    </div>
  );
}
