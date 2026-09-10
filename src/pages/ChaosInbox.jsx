import React from 'react';
import { Inbox, Sparkles } from 'lucide-react';
import ChaosAnalyzer from '../components/ChaosAnalyzer';
import { useTasks } from '../hooks/useTasks';

export default function ChaosInbox({ onNavigateTab }) {
  const { refreshTasks, addToast } = useTasks();

  const handleConverted = (count) => {
    refreshTasks();
    if (addToast) {
      addToast(`Successfully converted ${count} action items to Flow Board!`, 'success');
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Page Title Header */}
      <div className="flex items-center justify-between border-b border-surface-border/60 pb-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Inbox className="w-6 h-6 text-brand-cyan" />
            <span>Chaos Inbox</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Turn scattered WhatsApp messages, emails, and verbal requests into structured actions.
          </p>
        </div>
      </div>

      {/* Main Chaos Analyzer Input & Action Extractor */}
      <ChaosAnalyzer onConverted={handleConverted} />
    </div>
  );
}
