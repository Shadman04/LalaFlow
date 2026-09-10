import React from 'react';
import { 
  Zap, 
  Inbox, 
  Repeat, 
  Target, 
  Users, 
  Activity, 
  Settings, 
  X,
  LogOut,
  Shield,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Sidebar({ activeTab, setActiveTab, mobileOpen, setMobileOpen }) {
  const { user, role, logout, switchUser, demoProfiles } = useAuth();

  const navItems = [
    { id: 'command', label: 'Command', icon: Zap },
    { id: 'chaos-inbox', label: 'Chaos Inbox', icon: Inbox, badge: 'AI' },
    { id: 'flow', label: 'Flow Board', icon: Repeat },
    { id: 'focus', label: 'My Focus', icon: Target },
    { id: 'team', label: 'Team', icon: Users, roles: ['manager', 'admin'] },
    { id: 'activity', label: 'Activity', icon: Activity },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNav = (id) => {
    setActiveTab(id);
    if (setMobileOpen) setMobileOpen(false);
  };

  const navContent = (
    <div className="flex flex-col h-full bg-surface-900 border-r border-surface-border text-slate-200">
      {/* Brand Header */}
      <div className="p-5 flex items-center justify-between border-b border-surface-border/60">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleNav('command')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-cyan to-brand-violet flex items-center justify-center shadow-lg shadow-brand-500/20">
            <Zap className="w-6 h-6 text-white stroke-[2.5]" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1">
              Lala<span className="text-brand-cyan">Flow</span>
            </span>
            <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">AI Operations Co-Pilot</p>
          </div>
        </div>
        {setMobileOpen && (
          <button 
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-surface-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Demo Switcher Quick Menu */}
      <div className="px-4 py-3 bg-surface-850/60 border-b border-surface-border/40">
        <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1.5 block flex items-center justify-between">
          <span>Demo Profile Switcher</span>
          <span className="text-brand-cyan capitalize">{user?.role}</span>
        </label>
        <div className="relative">
          <select 
            value={user?.id || ''} 
            onChange={(e) => switchUser(e.target.value)}
            className="w-full text-xs bg-navy-800 text-slate-200 border border-surface-border rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-brand-500 appearance-none cursor-pointer"
          >
            {demoProfiles.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.role.toUpperCase()})
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          // Check role restrictions
          if (item.roles && !item.roles.includes(role)) {
            return null;
          }
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-brand-600 to-brand-700 text-white shadow-md shadow-brand-600/30'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-surface-800/80'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-1.5 py-0.5 text-[10px] font-extrabold bg-brand-violet/30 text-brand-violet rounded-full border border-brand-violet/40">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer User Profile */}
      <div className="p-4 border-t border-surface-border bg-surface-850">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 overflow-hidden">
            <img 
              src={user?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'} 
              alt={user?.name} 
              className="w-9 h-9 rounded-full object-cover ring-2 ring-brand-500/50"
            />
            <div className="truncate">
              <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-slate-400 truncate capitalize flex items-center gap-1">
                <Shield className="w-2.5 h-2.5 text-brand-cyan" /> {role}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            title="Log out"
            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-surface-800 rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 shrink-0 h-screen sticky top-0 z-20">
        {navContent}
      </aside>

      {/* Mobile Drawer Backdrop & Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-72 max-w-full h-full z-10 animate-in slide-in-from-left duration-200">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
}
