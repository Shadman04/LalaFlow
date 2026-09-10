import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Toast from './components/Toast';
import TaskModal from './components/TaskModal';
import DailyBriefingModal from './components/DailyBriefingModal';
import LalaAssistant from './components/LalaAssistant';
import CommandPalette from './components/CommandPalette';
import Login from './pages/Login';
import CommandCenter from './pages/CommandCenter';
import ChaosInbox from './pages/ChaosInbox';
import FlowBoard from './pages/FlowBoard';
import MyFocus from './pages/MyFocus';
import Team from './pages/Team';
import Activity from './pages/Activity';
import Settings from './pages/Settings';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import { AppProvider, AppContext } from './context/AppContext';
import { useTasks } from './hooks/useTasks';
import { Bot, Sparkles } from 'lucide-react';

function AppContent() {
  const { user } = useAuth();
  const { 
    toasts, 
    removeToast, 
    searchQuery, 
    setSearchQuery, 
    isAssistantOpen, 
    setIsAssistantOpen,
    showDailyBriefing,
    setShowDailyBriefing,
    createTask,
    updateTask,
    deleteTask,
    teamMembers,
    stats,
    nextBestAction
  } = useTasks();

  const [activeTab, setActiveTab] = useState('command');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Task Modal State
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    const handleOpenPalette = () => setIsCommandPaletteOpen(true);
    window.addEventListener('open-command-palette', handleOpenPalette);
    return () => window.removeEventListener('open-command-palette', handleOpenPalette);
  }, []);

  // Unauthenticated -> Show Login Page
  if (!user) {
    return <Login onLoginSuccess={() => setActiveTab('command')} />;
  }

  const handleOpenTaskModal = (task = null, defaultStatus = 'captured') => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = async (taskData) => {
    if (taskData.id) {
      await updateTask(taskData.id, taskData);
    } else {
      await createTask(taskData);
    }
  };

  const handleDeleteTask = async (taskId) => {
    await deleteTask(taskId);
  };

  return (
    <div className="flex min-h-screen bg-navy-950 text-slate-100">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onOpenMobileMenu={() => setMobileOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenAssistant={() => setIsAssistantOpen(true)}
        />

        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'command' && (
            <CommandCenter
              onNavigateTab={setActiveTab}
              onOpenTaskModal={handleOpenTaskModal}
              onOpenAssistant={() => setIsAssistantOpen(true)}
            />
          )}

          {activeTab === 'chaos-inbox' && (
            <ChaosInbox onNavigateTab={setActiveTab} />
          )}

          {activeTab === 'flow' && (
            <FlowBoard onOpenTaskModal={handleOpenTaskModal} />
          )}

          {activeTab === 'focus' && (
            <MyFocus
              onNavigateTab={setActiveTab}
              onOpenTaskModal={handleOpenTaskModal}
              onOpenAssistant={() => setIsAssistantOpen(true)}
            />
          )}

          {activeTab === 'team' && (
            <Team onOpenTaskModal={handleOpenTaskModal} />
          )}

          {activeTab === 'activity' && (
            <Activity />
          )}

          {activeTab === 'settings' && (
            <Settings />
          )}
        </main>
      </div>

      {/* Floating LALA AI Assistant Trigger Button (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsAssistantOpen(!isAssistantOpen)}
          className="group relative flex items-center space-x-2.5 px-4 py-3 bg-gradient-to-r from-brand-violet via-brand-600 to-brand-cyan hover:opacity-95 text-white font-black text-xs rounded-full shadow-2xl shadow-brand-violet/40 transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-navy-950 animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-navy-950" />
          </div>
          <span className="tracking-wider uppercase">🤖 LALA AI</span>
          <span className="px-1.5 py-0.5 text-[9px] font-extrabold bg-white/20 rounded-full">● ONLINE</span>
        </button>
      </div>

      {/* LALA Floating Assistant Drawer */}
      <LalaAssistant
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
      />

      {/* Global Command Palette (Ctrl+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={setActiveTab}
        onCreateTask={handleOpenTaskModal}
        onOpenAssistant={() => setIsAssistantOpen(true)}
      />

      {/* Startup Daily Briefing Modal */}
      <DailyBriefingModal
        isOpen={showDailyBriefing}
        onClose={() => setShowDailyBriefing(false)}
        stats={stats}
        nextAction={nextBestAction}
        onReviewPriorities={() => setActiveTab('focus')}
      />

      {/* Task Create/Edit Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
        task={editingTask}
        teamMembers={teamMembers}
      />

      {/* Toast Notification Container */}
      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}
