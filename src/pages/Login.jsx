import React, { useState } from 'react';
import { Zap, Lock, Mail, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Login({ onLoginSuccess }) {
  const { login, switchUser, demoProfiles } = useAuth();
  const [email, setEmail] = useState('shadman@lalaflow.com');
  const [password, setPassword] = useState('password123');
  const [remember, setRemember] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      login(email, password);
      if (onLoginSuccess) onLoginSuccess();
    }
  };

  const handleQuickDemo = (profile) => {
    switchUser(profile.id);
    if (onLoginSuccess) onLoginSuccess();
  };

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-brand-500 selection:text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Brand Icon */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-cyan to-brand-violet flex items-center justify-center mx-auto shadow-xl shadow-brand-500/20 mb-3">
          <Zap className="w-8 h-8 text-white stroke-[2.5]" />
        </div>

        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          ⚡ Lala<span className="text-brand-cyan">Flow</span>
        </h1>
        <p className="mt-1 text-sm font-semibold text-brand-violet">
          Turn Chaos Into Clear Action.
        </p>
        <p className="text-xs text-slate-400 mt-1">
          Your Multilingual AI Operations Co-Pilot.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-surface-900 border border-surface-border py-8 px-6 shadow-2xl rounded-3xl sm:px-10">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-navy-800 text-sm text-slate-100 border border-surface-border rounded-xl pl-10 pr-3.5 py-2.5 focus:outline-none focus:border-brand-500 transition"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-navy-800 text-sm text-slate-100 border border-surface-border rounded-xl pl-10 pr-3.5 py-2.5 focus:outline-none focus:border-brand-500 transition"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 text-brand-600 border-surface-border rounded focus:ring-brand-500 cursor-pointer"
                />
                <span className="ml-2">Remember me</span>
              </label>
              <a href="#" onClick={(e) => e.preventDefault()} className="text-brand-cyan hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white text-xs font-extrabold uppercase tracking-wider rounded-xl shadow-lg shadow-brand-600/30 transition transform active:scale-95 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Sign In to Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo User Buttons */}
          <div className="mt-8 pt-6 border-t border-surface-border/60">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block text-center mb-3">
              ⚡ Instant Demo Profiles (Click to Enter)
            </span>
            <div className="space-y-2">
              {demoProfiles.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleQuickDemo(p)}
                  className="w-full flex items-center justify-between p-2.5 bg-surface-850 hover:bg-surface-800 border border-surface-border rounded-xl transition text-left cursor-pointer"
                >
                  <div className="flex items-center space-x-2.5">
                    <img src={p.avatar_url} alt={p.name} className="w-7 h-7 rounded-full object-cover" />
                    <div>
                      <p className="text-xs font-bold text-white">{p.name}</p>
                      <p className="text-[10px] text-slate-400">{p.email}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase rounded bg-brand-500/20 text-brand-cyan border border-brand-500/30">
                    {p.role}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
