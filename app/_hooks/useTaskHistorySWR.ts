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

  const taskHistoryKey = useMemo(
    () =>
      `/tasks/me?page=${page}&status=${filters.status}&actionType=${filters.actionType}`,
    [page, filters.status, filters.actionType]
  );

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
        summary: false,
      }).then((res) => res.data),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 2000,
      errorRetryCount: 2,
    }
  );

  const tasks = useMemo(
    () => taskHistoryData?.content || [],
    [taskHistoryData]
  );
  const totalPages = useMemo(
    () => taskHistoryData?.totalPages || 1,
    [taskHistoryData]
  );

  const { inProgressTasks, completedTasks } = useMemo(() => {
    const inProgress = tasks.filter(
      (t: Task) => t.status === 'PENDING' || t.status === 'PROCESSING'
    );
    const completed = tasks.filter(
      (t: Task) => t.status === 'COMPLETED' || t.status === 'FAILED'
    );

    return { inProgressTasks: inProgress, completedTasks: completed };
  }, [tasks]);

  const [isPolling, setIsPolling] = useState(false);

  const inProgressTaskIds = useMemo(
    () => inProgressTasks.map((task) => task.taskId),
    [inProgressTasks]
  );

  const shouldPoll = enablePolling && inProgressTaskIds.length > 0;

  const { data: batchStatusData, mutate: mutateBatchStatus } = useSWR(
    shouldPoll
      ? `/tasks/batch?taskIds=${inProgressTaskIds.join(',')}&summary=false`
      : null,
    () => getBatchTaskStatus(inProgressTaskIds).then((res) => res.data),
    {
      refreshInterval: shouldPoll ? 10000 : 0,
      revalidateOnFocus: false,
      onSuccess: (data) => {
        if (data && Array.isArray(data)) {
          const hasStatusChange = data.some((apiTask: BatchTaskResponse) => {
            const existingTask = tasks.find((t) => t.taskId === apiTask.id);
            return existingTask && existingTask.status !== apiTask.status;
          });

          if (hasStatusChange) {
            mutateTaskHistory();
          }
        }
      },
    }
  );

  useEffect(() => {
    setIsPolling(shouldPoll);
  }, [shouldPoll]);

  const [allTasks, setAllTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (tasks.length > 0) {
      if (page === 0) {
        setAllTasks(tasks);
      } else {
        setAllTasks((prev) => {
          const existingIds = new Set(prev.map((t) => t.taskId));
          const newTasks = tasks.filter((t) => !existingIds.has(t.taskId));
          return [...prev, ...newTasks];
        });
      }
    }
  }, [tasks, page]);

  const loadMore = useCallback(() => {
    return page + 1;
  }, [page]);

  const setFilters = useCallback(
    (newFilters: Partial<TaskHistoryFilters>) => {
      setAllTasks([]);

      return { ...filters, ...newFilters };
    },
    [filters]
  );

  const refreshTasks = useCallback(() => {
    mutateTaskHistory();
    if (shouldPoll) {
      mutateBatchStatus();
    }
  }, [mutateTaskHistory, mutateBatchStatus, shouldPoll]);

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
    tasks,
    inProgressTasks,
    completedTasks,

    allTasks,
    allInProgressTasks,
    allCompletedTasks,
    totalPages,

    isLoading: isTaskHistoryLoading,
    isPolling,

    error: taskHistoryError?.message || null,

    page,
    filters,

    loadMore,
    setFilters,
    refreshTasks,
    mutate: mutateTaskHistory,
  };
}
