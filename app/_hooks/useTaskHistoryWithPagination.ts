'use client';

import { useState, useCallback, useMemo } from 'react';
import { useTaskHistorySWR } from './useTaskHistorySWR';

interface TaskHistoryFilters {
  status: string;
  actionType: string;
}

/**
 * Wrapper hook that provides the same API as the old useTaskHistory
 * but uses SWR internally for data fetching
 */
export function useTaskHistoryWithPagination() {
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState<TaskHistoryFilters>({
    status: '',
    actionType: '',
  });

  const swrResult = useTaskHistorySWR({
    page,
    filters,
    enablePolling: true,
  });

  const loadMore = useCallback(() => {
    if (page < swrResult.totalPages - 1) {
      setPage((prev) => prev + 1);
    }
  }, [page, swrResult.totalPages]);

  const handleSetFilters = useCallback(
    (newFilters: Partial<TaskHistoryFilters>) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
      setPage(0);
    },
    []
  );

  return {
    inProgressTasks: swrResult.allInProgressTasks,
    completedTasks: swrResult.allCompletedTasks,
    tasks: swrResult.allTasks,

    isLoading: swrResult.isLoading,
    isPolling: swrResult.isPolling,
    error: swrResult.error,

    page,
    totalPages: swrResult.totalPages,

    filters,

    loadMore,
    setFilters: handleSetFilters,
    refreshTasks: swrResult.refreshTasks,
    mutate: swrResult.mutate,
  };
}
