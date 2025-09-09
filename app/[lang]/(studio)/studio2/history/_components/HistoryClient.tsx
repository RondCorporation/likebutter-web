'use client';

import { useState } from 'react';
import { useTaskHistoryWithPagination } from '@/hooks/useTaskHistoryWithPagination';
import { Task } from '@/types/task';
import HistoryFilters from '@/components/studio/history/HistoryFilters';
import InProgressTasks from '@/components/studio/history/InProgressTasks';
import CompletedTasks from '@/components/studio/history/CompletedTasks';
import TaskDetailsModal from '@/components/studio/history/TaskDetailsModal';
import { LoaderCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import StudioButton from '@/components/shared/StudioButton';
import StudioToolCard from '@/components/shared/StudioToolCard';

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
  } = useTaskHistoryWithPagination();
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
    <div className="space-y-8">
      <StudioToolCard>
        <HistoryFilters onFilterChange={setFilters} />
      </StudioToolCard>

      {isLoading &&
        inProgressTasks.length === 0 &&
        completedTasks.length === 0 && (
          <StudioToolCard>
            <div className="flex justify-center items-center py-20">
              <LoaderCircle
                size={40}
                className="animate-spin text-butter-yellow"
              />
            </div>
          </StudioToolCard>
        )}

      {error && (
        <StudioToolCard className="border-red-400/30 bg-red-400/5">
          <p className="text-center text-red-400">
            {t('historyError', { error })}
          </p>
        </StudioToolCard>
      )}

      {!isLoading &&
        inProgressTasks.length === 0 &&
        completedTasks.length === 0 &&
        !error && (
          <StudioToolCard>
            <div className="text-center py-16 text-slate-400">
              <p className="text-lg">{t('historyNoTasks')}</p>
            </div>
          </StudioToolCard>
        )}

      <InProgressTasks tasks={inProgressTasks} onTaskClick={openModal} />
      <CompletedTasks tasks={completedTasks} onTaskClick={openModal} />

      {hasMore && (
        <div className="flex justify-center">
          <StudioButton
            onClick={loadMore}
            disabled={isLoading}
            loading={isLoading}
            variant="secondary"
            size="md"
          >
            {isLoading ? t('historyLoading') : t('historyLoadMore')}
          </StudioButton>
        </div>
      )}

      {selectedTask && (
        <TaskDetailsModal task={selectedTask} onClose={closeModal} />
      )}
    </div>
  );
}
