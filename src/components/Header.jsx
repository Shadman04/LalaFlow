import React from 'react';
import { Menu, Search, Bot, Mic, Sparkles } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import LanguageSelector from './LanguageSelector';

export default function Header({ onOpenMobileMenu, searchQuery, setSearchQuery, onOpenAssistant }) {
  const { user } = useAuth();

  // Dynamic Greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <header className="sticky top-0 z-10 bg-navy-950/80 backdrop-blur-md border-b border-surface-border px-4 py-3 md:px-6 flex items-center justify-between gap-4">
      {/* Mobile Toggle & Greeting */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 text-slate-300 hover:bg-surface-800 rounded-lg transition"
          aria-label="Open Mobile Menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div>
          <h1 className="text-lg md:text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>{getGreeting()}, <span className="text-brand-cyan">{user?.name?.split(' ')[0] || 'User'}</span></span>
          </h1>
          <p className="hidden sm:block text-xs text-slate-400">
            Turn today's chaos into clear action.
          </p>
        </div>
      </div>

      {/* Right Controls: Search, Language, Co-Pilot Trigger */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Real-time Search Input & Command Palette Trigger */}
        <div 
          onClick={() => window.dispatchEvent(new CustomEvent('open-command-palette'))}
          className="relative hidden sm:flex items-center w-48 lg:w-64 bg-surface-900 border border-surface-border rounded-xl px-3 py-1.5 cursor-pointer hover:border-brand-500 transition"
        >
          <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
          <input
            type="text"
            readOnly
            placeholder="Search / Cmd + K..."
            value={searchQuery}
            className="w-full bg-transparent text-xs text-slate-200 placeholder-slate-500 focus:outline-none cursor-pointer"
          />
          <span className="text-[9px] font-bold bg-surface-800 text-slate-400 px-1.5 py-0.5 rounded border border-surface-border">
            Ctrl+K
          </span>
        </div>

        {/* Language Selector */}
        <LanguageSelector />

        {/* LALA AI Assistant Trigger */}
        <button
          onClick={onOpenAssistant}
          className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-brand-violet to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white text-xs font-semibold shadow-md shadow-brand-violet/20 transition transform active:scale-95"
        >
          <Bot className="w-4 h-4 text-brand-cyan" />
          <span className="hidden sm:inline">Ask LALA</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        </button>
      </div>
    </header>
  );
}
