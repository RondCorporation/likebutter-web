'use client';

import { useState } from 'react';
import { useTaskHistory } from '@/hooks/useTaskHistory';
import { Task } from '@/types/task';
import HistoryFilters from '@/components/studio/history/HistoryFilters';
import InProgressTasks from '@/components/studio/history/InProgressTasks';
import CompletedTasks from '@/components/studio/history/CompletedTasks';
import TaskDetailsModal from '@/components/studio/history/TaskDetailsModal';
import { LoaderCircle } from 'lucide-react';

export default function HistoryPage() {
  const {
    inProgressTasks,
    completedTasks,
    isLoading,
    error,
    page,
    totalPages,
    loadMore,
    setFilters,
  } = useTaskHistory();

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const hasMore = page < totalPages - 1;

  const openModal = (task: Task) => {
    setSelectedTask(task);
  };

  const closeModal = () => {
    setSelectedTask(null);
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <h2 className="mb-2 text-2xl font-bold">Studio History</h2>
        <p className="text-slate-400">
          Track your ongoing creations and browse your completed AI art.
        </p>
      </div>

      <HistoryFilters onFilterChange={setFilters} />

      {isLoading &&
        inProgressTasks.length === 0 &&
        completedTasks.length === 0 && (
          <div className="flex justify-center items-center py-20">
            <LoaderCircle size={40} className="animate-spin text-accent" />
          </div>
        )}

      {error && <p className="text-center text-red-400">Error: {error}</p>}

      {!isLoading &&
        inProgressTasks.length === 0 &&
        completedTasks.length === 0 &&
        !error && (
          <div className="text-center py-16 text-slate-500">
            <p>No tasks found that match your criteria.</p>
          </div>
        )}

      <InProgressTasks tasks={inProgressTasks} onTaskClick={openModal} />
      <CompletedTasks tasks={completedTasks} onTaskClick={openModal} />

      {hasMore && (
        <div className="mt-8 text-center">
          <button
            onClick={loadMore}
            disabled={isLoading}
            className="rounded-md bg-slate-700 px-6 py-2 text-sm font-semibold text-white transition hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}

      {selectedTask && (
        <TaskDetailsModal task={selectedTask} onClose={closeModal} />
      )}
    </div>
  );
}
