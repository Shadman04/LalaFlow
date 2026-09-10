import React from 'react';
import { Repeat, Plus, Inbox, Play, Search, CheckCircle2 } from 'lucide-react';
import KanbanColumn from '../components/KanbanColumn';
import TaskFilters from '../components/TaskFilters';
import EmptyState from '../components/EmptyState';
import { useTasks } from '../hooks/useTasks';

export default function FlowBoard({ onOpenTaskModal }) {
  const { 
    filteredTasks, 
    teamMembers, 
    filters, 
    setFilters, 
    searchQuery, 
    setSearchQuery,
    updateTask,
    deleteTask
  } = useTasks();

  // Column Status Definitions
  const columns = [
    { id: 'captured', title: 'Captured', icon: Inbox },
    { id: 'in_progress', title: 'In Progress', icon: Play },
    { id: 'review', title: 'Review', icon: Search },
    { id: 'completed', title: 'Completed', icon: CheckCircle2 },
  ];

  const handleStatusChange = async (taskId, newStatus) => {
    await updateTask(taskId, { status: newStatus });
  };

  const handleStartTask = async (task) => {
    await updateTask(task.id, { status: 'in_progress' });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Board Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-border/60 pb-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Repeat className="w-6 h-6 text-brand-cyan" />
            <span>Flow Board</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Track operations, manage task statuses, and assign team responsibilities.
          </p>
        </div>

        <button
          onClick={() => onOpenTaskModal()}
          className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-bold text-xs rounded-xl shadow-lg shadow-brand-600/30 transition transform active:scale-95 cursor-pointer w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>CREATE TASK</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <TaskFilters
        filters={filters}
        setFilters={setFilters}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        teamMembers={teamMembers}
      />

      {/* Kanban Board Container */}
      {filteredTasks.length === 0 ? (
        <EmptyState
          title="NO TASKS MATCH FILTERS"
          message="Try clearing your search query or status filters to view active workflow items."
          actionLabel="CREATE TASK"
          onAction={() => onOpenTaskModal()}
        />
      ) : (
        <div className="flex space-x-4 overflow-x-auto pb-6 pt-2 items-start min-h-[600px] scrollbar-thin">
          {columns.map(col => {
            const colTasks = filteredTasks.filter(t => t.status === col.id);
            return (
              <KanbanColumn
                key={col.id}
                id={col.id}
                title={col.title}
                icon={col.icon}
                tasks={colTasks}
                onAddTask={(statusId) => onOpenTaskModal(null, statusId)}
                onEditTask={(task) => onOpenTaskModal(task)}
                onDeleteTask={(taskId) => deleteTask(taskId)}
                onStatusChange={handleStatusChange}
                onStartTask={handleStartTask}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
