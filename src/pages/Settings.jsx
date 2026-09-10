import React from 'react';
import { Settings as SettingsIcon, User, Shield, Globe, Database, CheckCircle2, AlertCircle, RotateCcw, Sparkles } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../hooks/useTasks';
import { LOCALES } from '../utils/languageUtils';
import { isSupabaseConfigured, resetLocalStore } from '../services/supabase';
import { apiService } from '../services/api';

export default function Settings() {
  const { user, role, language, setLanguage, demoProfiles, switchUser } = useAuth();
  const { refreshTasks, addToast } = useTasks();

  const handleResetData = () => {
    resetLocalStore();
    refreshTasks();
    if (addToast) addToast('Demo database reset to initial seed state!', 'success');
  };

  const handleInjectSampleChaos = async () => {
    const sampleChaosText = "Client urgent request: Prepare revised quotation for Acme Corp by 3 PM. Finance wants us to check pending invoice #4092. Schedule team meeting for Friday.";
    const actions = await apiService.analyzeChaos(sampleChaosText);
    await apiService.convertChaosToTasks(actions, user?.id);
    refreshTasks();
    if (addToast) addToast(`Injected ${actions.length} new tasks from Chaos Inbox!`, 'info');
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Title Header */}
      <div className="flex items-center justify-between border-b border-surface-border/60 pb-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <SettingsIcon className="w-6 h-6 text-brand-cyan" />
            <span>Workspace Settings</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage user roles, multilingual co-pilot preferences, and backend database connections.
          </p>
        </div>
      </div>

      {/* User Profile & Demo Switcher */}
      <div className="rounded-3xl bg-surface-900 border border-surface-border p-6 shadow-xl space-y-4">
        <h3 className="font-bold text-base text-white flex items-center gap-2 border-b border-surface-border pb-3">
          <User className="w-5 h-5 text-brand-cyan" />
          <span>Active Demo Profile</span>
        </h3>

        <div className="flex items-center space-x-4 p-4 rounded-2xl bg-surface-850 border border-surface-border">
          <img
            src={user?.avatar_url}
            alt={user?.name}
            className="w-14 h-14 rounded-2xl object-cover ring-2 ring-brand-500/50"
          />
          <div className="flex-1">
            <h4 className="font-bold text-base text-white">{user?.name}</h4>
            <p className="text-xs text-slate-400">{user?.email}</p>
            <span className="inline-block mt-1.5 px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-full bg-brand-500/20 text-brand-cyan border border-brand-500/30">
              Role: {role?.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Quick Role Switcher */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Switch Demo Account / Role
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {demoProfiles.map(p => (
              <button
                key={p.id}
                onClick={() => switchUser(p.id)}
                className={`p-3 rounded-xl border text-left transition ${
                  user?.id === p.id
                    ? 'bg-brand-600/20 border-brand-500 text-white'
                    : 'bg-surface-850 border-surface-border text-slate-300 hover:bg-surface-800'
                }`}
              >
                <p className="font-bold text-xs">{p.name}</p>
                <p className="text-[10px] text-slate-400 capitalize">{p.role}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Multilingual Voice Co-Pilot Preference */}
      <div className="rounded-3xl bg-surface-900 border border-surface-border p-6 shadow-xl space-y-4">
        <h3 className="font-bold text-base text-white flex items-center gap-2 border-b border-surface-border pb-3">
          <Globe className="w-5 h-5 text-brand-cyan" />
          <span>LALA Assistant Language Locale</span>
        </h3>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Selected Co-Pilot Voice & Text Locale
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full max-w-xs bg-navy-800 border border-surface-border rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500 cursor-pointer"
          >
            {LOCALES.map(loc => (
              <option key={loc.code} value={loc.code}>
                {loc.flag} {loc.name} ({loc.code})
              </option>
            ))}
          </select>
          <p className="text-xs text-slate-400 mt-2">
            Changing this updates LALA's voice synthesis preference, greetings, and conversational state machine responses.
          </p>
        </div>
      </div>

      {/* Demo Controls & Re-seeding */}
      <div className="rounded-3xl bg-surface-900 border border-surface-border p-6 shadow-xl space-y-4">
        <h3 className="font-bold text-base text-white flex items-center gap-2 border-b border-surface-border pb-3">
          <RotateCcw className="w-5 h-5 text-brand-cyan" />
          <span>Demo Data Management & Seed Controls</span>
        </h3>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleResetData}
            className="px-4 py-2.5 bg-surface-800 hover:bg-surface-700 text-slate-200 hover:text-white font-bold text-xs rounded-xl border border-surface-border transition flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-amber-400" />
            <span>Reset Demo Store to Fresh Seed</span>
          </button>

          <button
            onClick={handleInjectSampleChaos}
            className="px-4 py-2.5 bg-brand-violet/20 hover:bg-brand-violet/30 text-brand-violet font-bold text-xs rounded-xl border border-brand-violet/30 transition flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-brand-cyan" />
            <span>Inject Sample Chaos Batch</span>
          </button>
        </div>
      </div>

      {/* Supabase Connection Diagnostics */}
      <div className="rounded-3xl bg-surface-900 border border-surface-border p-6 shadow-xl space-y-4">
        <h3 className="font-bold text-base text-white flex items-center gap-2 border-b border-surface-border pb-3">
          <Database className="w-5 h-5 text-brand-cyan" />
          <span>Database & Backend Status</span>
        </h3>

        <div className="flex items-center space-x-3 p-4 rounded-2xl bg-surface-850 border border-surface-border">
          {isSupabaseConfigured ? (
            <>
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <h4 className="font-bold text-xs text-emerald-400">Connected to Live Supabase PostgreSQL</h4>
                <p className="text-[11px] text-slate-400">Realtime database synchronization active.</p>
              </div>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-6 h-6 text-brand-cyan shrink-0" />
              <div>
                <h4 className="font-bold text-xs text-brand-cyan">Running in Local Demo Storage Mode</h4>
                <p className="text-[11px] text-slate-400">
                  Data persists in browser localStorage with full Vercel serverless API compatibility. Add `VITE_SUPABASE_URL` to connect to cloud database.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
