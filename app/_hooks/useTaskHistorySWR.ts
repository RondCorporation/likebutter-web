'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';
import { Task } from '@/types/task';
import {
  getTaskHistory,
  getBatchTaskStatus,
  BatchTaskResponse,
} from '@/lib/apis/task.api';

interface TaskHistoryFilters {
  status: string;
  actionType: string;
}

interface UseTaskHistoryOptions {
  page?: number;
  filters?: TaskHistoryFilters;
  enablePolling?: boolean;
}

export function useTaskHistorySWR(options: UseTaskHistoryOptions = {}) {
  const {
    page = 0,
    filters = { status: '', actionType: '' },
    enablePolling = true,
  } = options;

  // SWR key for task history data
  const taskHistoryKey = useMemo(
    () =>
      `/tasks/me?page=${page}&status=${filters.status}&actionType=${filters.actionType}`,
    [page, filters.status, filters.actionType]
  );

  // Main task history data fetching with SWR
  const {
    data: taskHistoryData,
    error: taskHistoryError,
    isLoading: isTaskHistoryLoading,
    mutate: mutateTaskHistory,
  } = useSWR(
    taskHistoryKey,
    () =>
      getTaskHistory(page, {
        ...filters,
        summary: false, // Always get full details
      }).then((res) => res.data),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 2000, // 2 seconds deduplication
      errorRetryCount: 2,
    }
  );

  // Extract tasks from paginated data
  const tasks = useMemo(
    () => taskHistoryData?.content || [],
    [taskHistoryData]
  );
  const totalPages = useMemo(
    () => taskHistoryData?.totalPages || 1,
    [taskHistoryData]
  );

  // Categorize tasks
  const { inProgressTasks, completedTasks } = useMemo(() => {
    const inProgress = tasks.filter(
      (t: Task) => t.status === 'PENDING' || t.status === 'PROCESSING'
    );
    const completed = tasks.filter(
      (t: Task) => t.status === 'COMPLETED' || t.status === 'FAILED'
    );

    return { inProgressTasks: inProgress, completedTasks: completed };
  }, [tasks]);

  // Polling state
  const [isPolling, setIsPolling] = useState(false);

  // Smart polling with SWR for in-progress tasks
  const inProgressTaskIds = useMemo(
    () => inProgressTasks.map((task) => task.taskId),
    [inProgressTasks]
  );

  const shouldPoll = enablePolling && inProgressTaskIds.length > 0;

  // Batch status checking with SWR
  const { data: batchStatusData, mutate: mutateBatchStatus } = useSWR(
    shouldPoll
      ? `/tasks/batch?taskIds=${inProgressTaskIds.join(',')}&summary=false`
      : null,
    () => getBatchTaskStatus(inProgressTaskIds).then((res) => res.data),
    {
      refreshInterval: shouldPoll ? 10000 : 0, // Poll every 10 seconds
      revalidateOnFocus: false,
      onSuccess: (data) => {
        if (data && Array.isArray(data)) {
          // Check if any task status changed - Map API response to frontend format
          const hasStatusChange = data.some((apiTask: BatchTaskResponse) => {
            const existingTask = tasks.find(
              (t) => t.taskId === apiTask.id // API uses 'id', frontend uses 'taskId'
            );
            return existingTask && existingTask.status !== apiTask.status;
          });

          // If status changed, refresh the main task history
          if (hasStatusChange) {
            mutateTaskHistory();
          }
        }
      },
    }
  );

  // Update polling state based on SWR status
  useEffect(() => {
    setIsPolling(shouldPoll);
  }, [shouldPoll]);

  // Paginated tasks state for load more functionality
  const [allTasks, setAllTasks] = useState<Task[]>([]);

  // Update allTasks when new data comes in
  useEffect(() => {
    if (tasks.length > 0) {
      if (page === 0) {
        // First page - replace all tasks
        setAllTasks(tasks);
      } else {
        // Subsequent pages - append new tasks
        setAllTasks((prev) => {
          const existingIds = new Set(prev.map((t) => t.taskId));
          const newTasks = tasks.filter((t) => !existingIds.has(t.taskId));
          return [...prev, ...newTasks];
        });
      }
    }
  }, [tasks, page]);

  // Load more function for pagination
  const loadMore = useCallback(() => {
    // This should trigger a page increment in the parent component
    // Parent will update the page prop, causing a new SWR fetch
    return page + 1;
  }, [page]);

  // Set filters function
  const setFilters = useCallback(
    (newFilters: Partial<TaskHistoryFilters>) => {
      // Reset accumulated tasks when filters change
      setAllTasks([]);
      // Return new filters for parent to handle
      return { ...filters, ...newFilters };
    },
    [filters]
  );

  // Force refresh function
  const refreshTasks = useCallback(() => {
    mutateTaskHistory();
    if (shouldPoll) {
      mutateBatchStatus();
    }
  }, [mutateTaskHistory, mutateBatchStatus, shouldPoll]);

  // Categorize accumulated tasks for pagination views
  const { allInProgressTasks, allCompletedTasks } = useMemo(() => {
    const inProgress = allTasks.filter(
      (t: Task) => t.status === 'PENDING' || t.status === 'PROCESSING'
    );
    const completed = allTasks.filter(
      (t: Task) => t.status === 'COMPLETED' || t.status === 'FAILED'
    );

    return { allInProgressTasks: inProgress, allCompletedTasks: completed };
  }, [allTasks]);

  return {
    // Data - current page
    tasks,
    inProgressTasks,
    completedTasks,

    // Data - accumulated for pagination
    allTasks,
    allInProgressTasks,
    allCompletedTasks,
    totalPages,

    // Loading states
    isLoading: isTaskHistoryLoading,
    isPolling,

    // Error state
    error: taskHistoryError?.message || null,

    // Current state
    page,
    filters,

    // Actions
    loadMore,
    setFilters,
    refreshTasks,
    mutate: mutateTaskHistory,
  };
}
