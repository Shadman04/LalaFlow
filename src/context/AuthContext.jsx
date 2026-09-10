import React, { createContext, useState, useEffect } from 'react';
import { DEMO_PROFILES } from '../services/supabase';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Default to Shadman Chowdhury (Operations Manager) for rich out-of-the-box demo experience
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('lalaflow_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return DEMO_PROFILES[2]; // Shadman Chowdhury (Manager)
  });

  const [language, setLanguage] = useState(() => {
    return currentUser?.language || 'en-IN';
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('lalaflow_user', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  const switchUser = (profileId) => {
    const profile = DEMO_PROFILES.find(p => p.id === profileId);
    if (profile) {
      setCurrentUser(profile);
      setLanguage(profile.language || 'en-IN');
    }
  };

  const login = (email, password) => {
    const matched = DEMO_PROFILES.find(p => p.email.toLowerCase() === email.toLowerCase());
    if (matched) {
      setCurrentUser(matched);
      return { success: true, user: matched };
    }
    // Fallback new demo user
    const newUser = {
      id: `user-${Date.now()}`,
      name: email.split('@')[0],
      email,
      role: 'employee',
      language: 'en-IN',
      avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
    };
    setCurrentUser(newUser);
    return { success: true, user: newUser };
  };

  const logout = () => {
    localStorage.removeItem('lalaflow_user');
    setCurrentUser(null);
  };

  const updateRole = (newRole) => {
    if (currentUser) {
      const updated = { ...currentUser, role: newRole };
      setCurrentUser(updated);
    }
  };

  return (
    <AuthContext.Provider value={{
      user: currentUser,
      role: currentUser?.role || 'employee',
      language,
      setLanguage,
      login,
      logout,
      switchUser,
      updateRole,
      demoProfiles: DEMO_PROFILES
    }}>
      {children}
    </AuthContext.Provider>
  );
}
