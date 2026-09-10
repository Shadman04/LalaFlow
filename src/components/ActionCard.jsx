import React, { useState } from 'react';
import { Trash2, Edit3, Check, AlertCircle, FileText, DollarSign, Calendar, MessageSquare, ShieldAlert } from 'lucide-react';

export default function ActionCard({ action, onToggleSelect, onUpdate, onRemove }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(action.title);
  const [priority, setPriority] = useState(action.priority || 'medium');

  const handleSave = () => {
    onUpdate(action.id, { title, priority });
    setIsEditing(false);
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'sales': return <FileText className="w-4 h-4 text-brand-cyan" />;
      case 'finance': return <DollarSign className="w-4 h-4 text-emerald-400" />;
      case 'communication': return <MessageSquare className="w-4 h-4 text-violet-400" />;
      case 'operations': default: return <Calendar className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className={`group rounded-xl bg-surface-850 border transition-all duration-150 p-4 ${
      action.selected ? 'border-brand-500/60 ring-1 ring-brand-500/30' : 'border-surface-border opacity-70'
    }`}>
      <div className="flex items-start space-x-3">
        {/* Selection Checkbox */}
        <input
          type="checkbox"
          checked={action.selected}
          onChange={() => onToggleSelect(action.id)}
          className="mt-1 w-4 h-4 rounded border-surface-border text-brand-600 focus:ring-brand-500 cursor-pointer"
        />

        <div className="flex-1">
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-navy-800 border border-surface-border rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-brand-500"
              />
              <div className="flex items-center space-x-2">
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="bg-navy-800 border border-surface-border rounded-md px-2 py-0.5 text-[11px] text-slate-200"
                >
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                <button
                  onClick={handleSave}
                  className="px-2 py-0.5 bg-brand-600 text-white rounded text-[11px] font-bold"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <div className="p-1 rounded bg-surface-800">
                  {getCategoryIcon(action.category)}
                </div>
                <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded border ${
                  action.priority === 'urgent' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                  action.priority === 'high' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                  'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
                }`}>
                  {action.priority}
                </span>
                <span className="text-[10px] text-slate-500">Source: Chaos Inbox</span>
              </div>

              <h4 className="font-semibold text-sm text-slate-100">{action.title}</h4>
              {action.description && (
                <p className="text-xs text-slate-400 mt-1 italic">{action.description}</p>
              )}
            </div>
          )}
        </div>

        {/* Edit & Remove Actions */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-surface-800"
            title="Edit action"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onRemove(action.id)}
            className="p-1 text-slate-400 hover:text-red-400 rounded hover:bg-surface-800"
            title="Remove action"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
