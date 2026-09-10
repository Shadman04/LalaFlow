import React from 'react';

export default function LoadingState({ count = 3 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-36 rounded-2xl bg-surface-900 border border-surface-border p-5 space-y-3">
          <div className="h-4 bg-surface-800 rounded w-1/3" />
          <div className="h-6 bg-surface-800 rounded w-2/3" />
          <div className="h-4 bg-surface-800 rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}
