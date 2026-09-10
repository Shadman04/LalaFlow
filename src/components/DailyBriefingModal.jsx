import React from 'react';
import { X, Sparkles, Volume2, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useVoiceAssistant } from '../hooks/useVoiceAssistant';

export default function DailyBriefingModal({ isOpen, onClose, stats = {}, nextAction = null, onReviewPriorities }) {
  const { user } = useAuth();
  const { speakText, isSpeaking, stopSpeaking } = useVoiceAssistant();

  if (!isOpen) return null;

  const handlePlayBriefing = () => {
    if (isSpeaking) {
      stopSpeaking();
      return;
    }
    const text = `Good day ${user?.name || ''}. You have ${stats.active || 0} active tasks, ${stats.overdue || 0} overdue tasks, and ${stats.atRisk || 0} tasks requiring attention. Your top recommended task is ${nextAction?.task?.title || 'to review your queue'}.`;
    speakText(text);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Briefing Card */}
      <div className="relative w-full max-w-md rounded-3xl bg-gradient-to-b from-surface-850 via-surface-900 to-navy-950 border border-brand-500/40 p-6 md:p-8 shadow-2xl z-10 animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-surface-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 bg-brand-violet/20 border border-brand-violet/30 px-3 py-1 rounded-full w-fit mb-4">
          <Sparkles className="w-4 h-4 text-brand-cyan" />
          <span className="text-xs font-black tracking-wider uppercase text-brand-cyan">
            DAILY OPERATIONAL BRIEFING
          </span>
        </div>

        <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">
          Good day, {user?.name?.split(' ')[0]}!
        </h3>
        <p className="text-xs text-slate-300 mt-2 leading-relaxed">
          You have <strong className="text-white">{stats.active || 0} active tasks</strong>, <strong className="text-amber-400">{stats.atRisk || 0} requiring attention</strong>, and <strong className="text-red-400">{stats.overdue || 0} overdue tasks</strong> today.
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 my-5 p-3 rounded-2xl bg-surface-850 border border-surface-border text-center">
          <div>
            <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Active</span>
            <span className="text-lg font-black text-white">{stats.active || 0}</span>
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase text-slate-400 block">At Risk</span>
            <span className="text-lg font-black text-amber-400">{stats.atRisk || 0}</span>
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Overdue</span>
            <span className="text-lg font-black text-red-400">{stats.overdue || 0}</span>
          </div>
        </div>

        {/* Recommended Focus Item */}
        {nextAction?.task && (
          <div className="p-4 rounded-2xl bg-brand-600/10 border border-brand-500/30 mb-6">
            <span className="text-[10px] font-black uppercase text-brand-cyan block mb-1">
              🎯 TOP PRIORITY ITEM
            </span>
            <h4 className="font-bold text-sm text-white">{nextAction.task.title}</h4>
            <p className="text-xs text-slate-400 mt-1">{nextAction.rationale}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={() => { onClose(); if (onReviewPriorities) onReviewPriorities(); }}
            className="w-full py-3 bg-gradient-to-r from-brand-600 to-brand-cyan hover:opacity-90 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-brand-600/30 transition flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>REVIEW PRIORITIES</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={handlePlayBriefing}
            className="w-full py-2.5 bg-surface-800 hover:bg-surface-700 text-slate-200 hover:text-white font-bold text-xs rounded-xl border border-surface-border transition flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Volume2 className={`w-4 h-4 ${isSpeaking ? 'text-brand-cyan animate-pulse' : 'text-slate-400'}`} />
            <span>{isSpeaking ? 'STOP BRIEFING' : '🔊 PLAY BRIEFING'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
