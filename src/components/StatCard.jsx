import React from 'react';

export default function StatCard({ title, value, icon: Icon, description, color = 'brand', onClick }) {
  const colorStyles = {
    brand: 'from-brand-500/10 to-brand-600/5 text-brand-400 border-brand-500/20',
    cyan: 'from-cyan-500/10 to-cyan-600/5 text-cyan-400 border-cyan-500/20',
    emerald: 'from-emerald-500/10 to-emerald-600/5 text-emerald-400 border-emerald-500/20',
    red: 'from-red-500/10 to-red-600/5 text-red-400 border-red-500/20',
    amber: 'from-amber-500/10 to-amber-600/5 text-amber-400 border-amber-500/20',
  };

  const styleClass = colorStyles[color] || colorStyles.brand;

  return (
    <div 
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${styleClass} border bg-surface-900 p-5 shadow-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-xl cursor-pointer`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
          <h3 className="text-2xl md:text-3xl font-extrabold text-white mt-1 tracking-tight">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl bg-surface-800/80 border border-surface-border`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      {description && (
        <p className="text-xs text-slate-400 mt-3 flex items-center gap-1 font-medium">
          {description}
        </p>
      )}
    </div>
  );
}
