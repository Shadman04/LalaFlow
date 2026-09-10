import React, { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, Sparkles, Mic, Volume2, VolumeX, RefreshCw, Check, ArrowRight, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../hooks/useTasks';
import { useVoiceAssistant } from '../hooks/useVoiceAssistant';
import VoiceControl from './VoiceControl';
import { apiService } from '../services/api';

// Conversational Task Creation State Machine States
const TASK_FLOW_STATES = {
  IDLE: 'IDLE',
  ASK_TITLE: 'ASK_TITLE',
  ASK_PRIORITY: 'ASK_PRIORITY',
  ASK_DATE: 'ASK_DATE',
  CONFIRM: 'CONFIRM',
  COMPLETE: 'COMPLETE'
};

export default function LalaAssistant({ isOpen, onClose }) {
  const { user, language } = useAuth();
  const { tasks, createTask, nextBestAction, stats, refreshTasks } = useTasks();
  const { speakText, isSpeaking, stopSpeaking, speechSupported } = useVoiceAssistant();

  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'lala',
      text: `Hello ${user?.name || ''}! I'm LALA, your AI Operations Co-Pilot. How can I assist your workflow today?`,
      timestamp: new Date()
    }
  ]);

  // Task Creation State Machine State
  const [creationState, setCreationState] = useState(TASK_FLOW_STATES.IDLE);
  const [draftTask, setDraftTask] = useState({ title: '', priority: 'medium', due_date: null });

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const addMessage = (text, sender = 'lala', extra = null) => {
    const newMsg = {
      id: `msg-${Date.now()}-${Math.random()}`,
      sender,
      text,
      extra,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMsg]);

    // Speak LALA messages aloud if voice enabled
    if (sender === 'lala') {
      speakText(text);
    }
  };

  // Conversational Task Machine Input Processor
  const handleTaskStateMachine = async (userText) => {
    const text = userText.trim();
    const lower = text.toLowerCase();

    if (creationState === TASK_FLOW_STATES.ASK_TITLE) {
      setDraftTask(prev => ({ ...prev, title: text }));
      setCreationState(TASK_FLOW_STATES.ASK_PRIORITY);
      addMessage(`What priority should I set for "${text}"? Options: High, Medium, or Low.`, 'lala');
      return true;
    }

    if (creationState === TASK_FLOW_STATES.ASK_PRIORITY) {
      let prio = 'medium';
      if (lower.includes('urgent')) prio = 'urgent';
      else if (lower.includes('high')) prio = 'high';
      else if (lower.includes('low')) prio = 'low';

      setDraftTask(prev => ({ ...prev, priority: prio }));
      setCreationState(TASK_FLOW_STATES.ASK_DATE);
      addMessage(`Got it (${prio.toUpperCase()} priority). When is the deadline? (e.g., Today, Tomorrow, or Friday)`, 'lala');
      return true;
    }

    if (creationState === TASK_FLOW_STATES.ASK_DATE) {
      const now = new Date();
      let due = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
      if (lower.includes('today')) due = new Date(now.getTime() + 4 * 60 * 60 * 1000).toISOString();
      else if (lower.includes('tomorrow')) {
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        due = tomorrow.toISOString();
      }

      setDraftTask(prev => ({ ...prev, due_date: due }));
      setCreationState(TASK_FLOW_STATES.CONFIRM);
      addMessage(`I will create "${draftTask.title}" with ${draftTask.priority.toUpperCase()} priority and deadline ${new Date(due).toLocaleDateString()}. Should I save it to Flow Board? (Yes / No)`, 'lala');
      return true;
    }

    if (creationState === TASK_FLOW_STATES.CONFIRM) {
      if (lower.includes('yes') || lower.includes('sure') || lower.includes('save') || lower.includes('yeah') || lower.includes('ha') || lower.includes('haan')) {
        try {
          await createTask({
            title: draftTask.title,
            description: 'Created via LALA AI Conversational Assistant',
            priority: draftTask.priority,
            status: 'captured',
            due_date: draftTask.due_date,
            assignee_id: user?.id
          });
          addMessage(`Done! Your task "${draftTask.title}" has been saved and added to your Flow Board.`, 'lala');
        } catch (e) {
          addMessage(`Failed to create task. Please try again.`, 'lala');
        }
      } else {
        addMessage(`Cancelled task creation. Let me know if you need anything else!`, 'lala');
      }
      setCreationState(TASK_FLOW_STATES.IDLE);
      setDraftTask({ title: '', priority: 'medium', due_date: null });
      return true;
    }

    return false;
  };

  const handleSend = async (overrideText = null) => {
    const textToSend = overrideText || inputMessage;
    if (!textToSend.trim()) return;

    setInputMessage('');
    addMessage(textToSend, 'user');

    // 1. Check if we are inside Conversational Task State Machine
    const handledByMachine = await handleTaskStateMachine(textToSend);
    if (handledByMachine) return;

    // 2. Check if user wants to initiate task creation flow
    const lower = textToSend.toLowerCase();
    if (lower.includes('create') || lower.includes('add task') || lower.includes('nayi task') || lower.includes('noyer kaj')) {
      setCreationState(TASK_FLOW_STATES.ASK_TITLE);
      addMessage(`Sure thing! What should I call the task?`, 'lala');
      return;
    }

    // 3. Process Intent via API
    setLoading(true);
    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'command',
          query: textToSend,
          tasks,
          user,
          language
        })
      });

      if (response.ok) {
        const json = await response.json();
        if (json.success) {
          addMessage(json.data.message, 'lala', json.data.payload);
          setLoading(false);
          return;
        }
      }
    } catch (e) {
      console.warn('API assistant fallback:', e);
    }

    // Client Intent Processing Fallback
    setLoading(false);
    if (lower.includes('update') || lower.includes('summary') || lower.includes('status')) {
      const active = tasks.filter(t => t.status !== 'completed');
      const overdue = tasks.filter(t => t.status !== 'completed' && t.due_date && new Date(t.due_date) < new Date());
      addMessage(`You currently have ${active.length} active tasks across your flow. ${overdue.length} are overdue. Your top focus item is "${active[0]?.title || 'None'}".`, 'lala');
    } else if (lower.includes('what should i do') || lower.includes('next task') || lower.includes('kya karun')) {
      if (nextBestAction) {
        addMessage(`I recommend working on "${nextBestAction.task.title}". Rationale: ${nextBestAction.rationale}`, 'lala', nextBestAction.task);
      } else {
        addMessage(`All tasks in your queue are completed! Fantastic work.`, 'lala');
      }
    } else if (lower.includes('overdue')) {
      const overdue = tasks.filter(t => t.status !== 'completed' && t.due_date && new Date(t.due_date) < new Date());
      addMessage(overdue.length > 0 ? `You have ${overdue.length} overdue task(s): ${overdue.map(t => t.title).join(', ')}.` : `No overdue tasks right now!`, 'lala');
    } else {
      addMessage(`I heard: "${textToSend}". I can help you find your next task, create a task conversationally, check overdue items, or summarize your workflow!`, 'lala');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-md h-[580px] max-h-[85vh] rounded-3xl bg-surface-900 border border-surface-border shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-surface-850 via-navy-900 to-surface-850 border-b border-surface-border flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-violet to-brand-cyan flex items-center justify-center shadow-md">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
              <span>LALA AI Co-Pilot</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </h3>
            <p className="text-[10px] text-slate-400">Operations Assistant • ● ONLINE</p>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          {isSpeaking && (
            <button 
              onClick={stopSpeaking}
              className="p-1.5 text-brand-cyan hover:text-white rounded-lg hover:bg-surface-800"
              title="Stop speaking"
            >
              <VolumeX className="w-4 h-4 animate-pulse" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-surface-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-navy-950/60">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] rounded-2xl p-3.5 text-xs shadow-md ${
              msg.sender === 'user'
                ? 'bg-gradient-to-r from-brand-600 to-brand-700 text-white rounded-tr-none'
                : 'bg-surface-850 border border-surface-border text-slate-200 rounded-tl-none space-y-2'
            }`}>
              <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              {msg.extra && msg.extra.title && (
                <div className="p-2.5 rounded-xl bg-navy-900 border border-brand-500/30 text-xs">
                  <span className="font-bold text-brand-cyan block">🎯 Task Item:</span>
                  <span className="font-semibold text-white">{msg.extra.title}</span>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-surface-850 border border-surface-border rounded-2xl p-3 text-xs text-slate-400 flex items-center space-x-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-brand-cyan" />
              <span>LALA is processing...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestion Chips */}
      <div className="p-2 bg-surface-850 border-t border-surface-border/50 flex gap-1.5 overflow-x-auto text-[11px]">
        <button
          onClick={() => handleSend("What's my update?")}
          className="px-2.5 py-1 rounded-lg bg-surface-800 hover:bg-surface-700 text-slate-300 hover:text-white border border-surface-border transition shrink-0"
        >
          What's my update?
        </button>
        <button
          onClick={() => handleSend("What should I do now?")}
          className="px-2.5 py-1 rounded-lg bg-surface-800 hover:bg-surface-700 text-slate-300 hover:text-white border border-surface-border transition shrink-0"
        >
          What should I do now?
        </button>
        <button
          onClick={() => handleSend("Create a task")}
          className="px-2.5 py-1 rounded-lg bg-brand-violet/20 hover:bg-brand-violet/30 text-brand-violet font-semibold border border-brand-violet/30 transition shrink-0"
        >
          ➕ Create a task
        </button>
      </div>

      {/* Input Footer */}
      <div className="p-3 bg-surface-900 border-t border-surface-border flex items-center space-x-2">
        <VoiceControl onSpeechInput={(text) => handleSend(text)} disabled={loading} />

        <input
          type="text"
          placeholder={creationState !== TASK_FLOW_STATES.IDLE ? "Type your answer..." : "Ask LALA anything..."}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 bg-navy-800 border border-surface-border rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 transition"
        />

        <button
          onClick={() => handleSend()}
          disabled={loading || !inputMessage.trim()}
          className="p-2 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-40 text-white shadow-md transition transform active:scale-95"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
