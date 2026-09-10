import React, { useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, MessageSquare, AlertCircle, RefreshCw } from 'lucide-react';
import ActionCard from './ActionCard';
import { apiService } from '../services/api';
import { useAuth } from '../hooks/useAuth';

export default function ChaosAnalyzer({ onConverted }) {
  const { user } = useAuth();
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [parsedActions, setParsedActions] = useState([]);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  // Sample templates for quick demo testing
  const sampleTexts = [
    {
      label: '💬 WhatsApp Request',
      text: 'Client called and needs the revised proposal urgently by 4 PM. Finance also wants us to check the pending invoice #4092 ASAP.'
    },
    {
      label: '📧 Email Thread',
      text: 'Please schedule a call with Acme Corp team tomorrow to review Q4 strategy. Also email the updated pricing catalog to Sarah.'
    },
    {
      label: '🗣️ Verbal Meeting Notes',
      text: 'Urgent: Prepare weekly operations report before Friday. Follow up with Rahim regarding contract renewal terms.'
    }
  ];

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    try {
      const actions = await apiService.analyzeChaos(inputText);
      setParsedActions(actions || []);
      setHasAnalyzed(true);
    } catch (err) {
      console.error('Failed to parse chaos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSelect = (id) => {
    setParsedActions(prev => prev.map(a => a.id === id ? { ...a, selected: !a.selected } : a));
  };

  const handleUpdateAction = (id, updates) => {
    setParsedActions(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  const handleRemoveAction = (id) => {
    setParsedActions(prev => prev.filter(a => a.id !== id));
  };

  const handleAddToFlow = async () => {
    const selected = parsedActions.filter(a => a.selected);
    if (selected.length === 0) return;

    setLoading(true);
    try {
      await apiService.convertChaosToTasks(selected, user?.id);
      setInputText('');
      setParsedActions([]);
      setHasAnalyzed(false);
      if (onConverted) onConverted(selected.length);
    } catch (e) {
      console.error('Failed to convert chaos to flow:', e);
    } finally {
      setLoading(false);
    }
  };

  const selectedCount = parsedActions.filter(a => a.selected).length;

  return (
    <div className="space-y-6">
      {/* Input Box */}
      <div className="rounded-2xl bg-surface-900 border border-surface-border p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-brand-cyan" /> Unstructured Input Text
          </label>

          {/* Quick Demo Templates */}
          <div className="flex items-center gap-2 overflow-x-auto text-[11px]">
            <span className="text-slate-500 font-medium hidden sm:inline">Try Demo:</span>
            {sampleTexts.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => setInputText(sample.text)}
                className="px-2.5 py-1 rounded-lg bg-surface-800 hover:bg-surface-700 text-slate-300 hover:text-white border border-surface-border transition shrink-0"
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>

        <textarea
          rows="4"
          placeholder="Paste a WhatsApp message, email, meeting note, client request, or any unstructured work request..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="w-full bg-navy-800 text-sm text-slate-100 border border-surface-border rounded-xl p-4 placeholder-slate-500 focus:outline-none focus:border-brand-500 transition resize-none"
        />

        <div className="flex items-center justify-between mt-4">
          <p className="text-xs text-slate-400">
            LALA AI will automatically parse tasks, priorities, and deadlines.
          </p>

          <button
            onClick={handleAnalyze}
            disabled={loading || !inputText.trim()}
            className="flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-brand-violet via-brand-600 to-brand-cyan hover:opacity-90 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-brand-600/30 transition transform active:scale-95 cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Parsing Chaos...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-cyan-300" />
                <span>✨ ANALYZE CHAOS</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Parsed Action Cards Section */}
      {hasAnalyzed && (
        <div className="rounded-2xl bg-surface-900 border border-surface-border p-5 shadow-xl space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-surface-border/60 pb-3">
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <span>Extracted Action Items</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-extrabold bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30">
                  {parsedActions.length} Found
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Review and edit action items before adding them to your team's Flow Board.
              </p>
            </div>

            {parsedActions.length > 0 && (
              <button
                onClick={handleAddToFlow}
                disabled={loading || selectedCount === 0}
                className="flex items-center space-x-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30 transition transform active:scale-95 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>ADD {selectedCount} SELECTED TO FLOW</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {parsedActions.length === 0 ? (
            <div className="py-8 text-center border-2 border-dashed border-surface-border/50 rounded-xl p-6">
              <AlertCircle className="w-8 h-8 text-amber-400 mx-auto mb-2" />
              <h4 className="font-bold text-sm text-slate-200">No Actionable Tasks Identified</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                We couldn't identify any clear actions from your input. Try adding more detail like "Send proposal" or "Check invoice".
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {parsedActions.map(action => (
                <ActionCard
                  key={action.id}
                  action={action}
                  onToggleSelect={handleToggleSelect}
                  onUpdate={handleUpdateAction}
                  onRemove={handleRemoveAction}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
