import React from 'react';
import { Globe } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { LOCALES } from '../utils/languageUtils';

export default function LanguageSelector() {
  const { language, setLanguage } = useAuth();

  return (
    <div className="relative flex items-center">
      <Globe className="w-4 h-4 text-slate-400 absolute left-2.5 pointer-events-none" />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="bg-surface-900 text-xs text-slate-200 border border-surface-border rounded-xl pl-8 pr-2.5 py-1.5 focus:outline-none focus:border-brand-500 cursor-pointer appearance-none"
        title="Change Assistant Language"
      >
        {LOCALES.map(loc => (
          <option key={loc.code} value={loc.code}>
            {loc.flag} {loc.name}
          </option>
        ))}
      </select>
    </div>
  );
}
