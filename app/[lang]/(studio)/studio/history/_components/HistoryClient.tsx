'use client';

import { useState } from 'react';
import { useTaskHistory } from '@/hooks/useTaskHistory';
import { Task } from '@/types/task';
import HistoryFilters from '@/components/studio/history/HistoryFilters';
import InProgressTasks from '@/components/studio/history/InProgressTasks';
import CompletedTasks from '@/components/studio/history/CompletedTasks';
import TaskDetailsModal from '@/components/studio/history/TaskDetailsModal';
import { LoaderCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function HistoryClient() {
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
  const { t } = useTranslation();

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const hasMore = page < totalPages - 1;

  const openModal = (task: Task) => {
    setSelectedTask(task);
  };

  const closeModal = () => {
    setSelectedTask(null);
  };

  return (
    <>
      <HistoryFilters onFilterChange={setFilters} />

      {isLoading &&
        inProgressTasks.length === 0 &&
        completedTasks.length === 0 && (
          <div className="flex justify-center items-center py-20">
            <LoaderCircle size={40} className="animate-spin text-accent" />
          </div>
        )}

      {error && (
        <p className="text-center text-red-400">
          {t('historyError', { error })}
        </p>
      )}

      {!isLoading &&
        inProgressTasks.length === 0 &&
        completedTasks.length === 0 &&
        !error && (
          <div className="text-center py-16 text-slate-500">
            <p>{t('historyNoTasks')}</p>
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
            {isLoading ? t('historyLoading') : t('historyLoadMore')}
          </button>
        </div>
      )}

      {selectedTask && (
        <TaskDetailsModal task={selectedTask} onClose={closeModal} />
      )}
    </>
  );
}
