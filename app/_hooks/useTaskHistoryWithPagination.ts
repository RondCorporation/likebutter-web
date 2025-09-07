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
    actionType: '' 
  });

  // Use SWR-based hook
  const swrResult = useTaskHistorySWR({
    page,
    filters,
    enablePolling: true
  });

  // Load more function that updates page state
  const loadMore = useCallback(() => {
    if (page < swrResult.totalPages - 1) {
      setPage(prev => prev + 1);
    }
  }, [page, swrResult.totalPages]);

  // Set filters function that resets pagination
  const handleSetFilters = useCallback((newFilters: Partial<TaskHistoryFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPage(0); // Reset to first page when filters change
  }, []);

  // Return data in the same format as the old hook
  return {
    // Use accumulated tasks for pagination view
    inProgressTasks: swrResult.allInProgressTasks,
    completedTasks: swrResult.allCompletedTasks,
    tasks: swrResult.allTasks,
    
    // States
    isLoading: swrResult.isLoading,
    isPolling: swrResult.isPolling,
    error: swrResult.error,
    
    // Pagination
    page,
    totalPages: swrResult.totalPages,
    
    // Current filters
    filters,
    
    // Actions
    loadMore,
    setFilters: handleSetFilters,
    refreshTasks: swrResult.refreshTasks,
    mutate: swrResult.mutate,
  };
}