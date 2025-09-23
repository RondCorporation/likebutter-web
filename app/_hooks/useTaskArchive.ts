'use client';

import { useEffect, useReducer, useCallback } from 'react';
import { Task } from '@/types/task';
import {
  getTaskHistory,
  getTaskStatus,
  getBatchTaskStatus,
  BatchTaskResponse,
  TaskFilters,
  TaskCategory,
} from '@/lib/apis/task.api';

interface ArchiveState {
  tasks: Task[];
  inProgressTasks: Task[];
  completedTasks: Task[];
  isLoading: boolean;
  isPolling: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  filters: TaskFilters;
}

type ArchiveAction =
  | { type: 'FETCH_START'; forLoadMore: boolean }
  | { type: 'FETCH_SUCCESS'; payload: { tasks: Task[]; totalPages: number } }
  | {
      type: 'FETCH_MORE_SUCCESS';
      payload: { tasks: Task[]; totalPages: number };
    }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'UPDATE_TASK_STATUS'; payload: Task }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'SET_FILTERS'; payload: Partial<TaskFilters> }
  | { type: 'POLLING_START' | 'POLLING_END' };

const initialState: ArchiveState = {
  tasks: [],
  inProgressTasks: [],
  completedTasks: [],
  isLoading: true,
  isPolling: false,
  error: null,
  page: 0,
  totalPages: 1,
  filters: { status: '', actionType: '', category: 'IMAGE' },
};

function archiveReducer(
  state: ArchiveState,
  action: ArchiveAction
): ArchiveState {
  switch (action.type) {
    case 'FETCH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
        ...(action.forLoadMore
          ? {}
          : { tasks: [], inProgressTasks: [], completedTasks: [] }),
      };
    case 'FETCH_SUCCESS':
      const newTasksSuccess = action.payload.tasks;
      return {
        ...state,
        isLoading: false,
        tasks: newTasksSuccess,
        totalPages: action.payload.totalPages,
        inProgressTasks: newTasksSuccess.filter(
          (t) => t.status === 'PENDING' || t.status === 'PROCESSING'
        ),
        completedTasks: newTasksSuccess.filter(
          (t) => t.status === 'COMPLETED' || t.status === 'FAILED'
        ),
      };
    case 'FETCH_MORE_SUCCESS':
      const existingTaskIds = new Set(state.tasks.map((t) => t.taskId));
      const newTasks = action.payload.tasks.filter(
        (t) => !existingTaskIds.has(t.taskId)
      );
      const combinedTasks = [...state.tasks, ...newTasks];
      return {
        ...state,
        isLoading: false,
        tasks: combinedTasks,
        totalPages: action.payload.totalPages,
        inProgressTasks: combinedTasks.filter(
          (t) => t.status === 'PENDING' || t.status === 'PROCESSING'
        ),
        completedTasks: combinedTasks.filter(
          (t) => t.status === 'COMPLETED' || t.status === 'FAILED'
        ),
      };
    case 'FETCH_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    case 'UPDATE_TASK_STATUS':
      const updatedTasks = state.tasks.map((t) => {
        if (t.taskId === action.payload.taskId) {
          return {
            ...t,
            status: action.payload.status,
            details: action.payload.details as any,
          };
        }
        return t;
      });
      return {
        ...state,
        tasks: updatedTasks,
        inProgressTasks: updatedTasks.filter(
          (t) => t.status === 'PENDING' || t.status === 'PROCESSING'
        ),
        completedTasks: updatedTasks.filter(
          (t) => t.status === 'COMPLETED' || t.status === 'FAILED'
        ),
      };
    case 'SET_PAGE':
      return { ...state, page: action.payload };
    case 'SET_FILTERS':
      return {
        ...state,
        page: 0,
        tasks: [],
        filters: { ...state.filters, ...action.payload },
      };
    case 'POLLING_START':
      return { ...state, isPolling: true };
    case 'POLLING_END':
      return { ...state, isPolling: false };
    default:
      return state;
  }
}
export function useTaskArchive() {
  const [state, dispatch] = useReducer(archiveReducer, initialState);

  const fetchArchive = useCallback(
    async (pageToFetch: number, filters: TaskFilters) => {
      dispatch({ type: 'FETCH_START', forLoadMore: false });

      try {
        const response = await getTaskHistory(pageToFetch, {
          ...filters,
          summary: false,
        });
        if (response.data) {
          dispatch({
            type: 'FETCH_SUCCESS',
            payload: {
              tasks: response.data.content,
              totalPages: response.data.totalPages,
            },
          });
        }
      } catch (err: any) {
        dispatch({
          type: 'FETCH_ERROR',
          payload:
            err.message ||
            'Failed to fetch archive. Please try refreshing the page.',
        });
      }
    },
    []
  );

  useEffect(() => {
    fetchArchive(state.page, state.filters);
  }, [state.page, JSON.stringify(state.filters), fetchArchive]);

  useEffect(() => {
    const tasksToCheck = state.tasks.filter(
      (t) => t.status === 'PENDING' || t.status === 'PROCESSING'
    );

    if (tasksToCheck.length === 0) return;

    let pollInterval = 10000;
    const maxInterval = 60000;
    let consecutiveNoChanges = 0;

    let timeoutId: NodeJS.Timeout;

    const poll = async () => {
      if (state.isPolling) return;
      dispatch({ type: 'POLLING_START' });

      try {
        const currentInProgressTasks = state.tasks.filter(
          (t) => t.status === 'PENDING' || t.status === 'PROCESSING'
        );

        if (currentInProgressTasks.length === 0) {
          dispatch({ type: 'POLLING_END' });
          return;
        }

        const taskIds = currentInProgressTasks.map((t) => t.taskId);

        const response = await getBatchTaskStatus(taskIds);

        if (response.data && Array.isArray(response.data)) {
          let hasChanges = false;

          response.data.forEach((apiTask: BatchTaskResponse) => {
            const existingTask = state.tasks.find(
              (t) => t.taskId === apiTask.id
            );
            if (existingTask && existingTask.status !== apiTask.status) {
              hasChanges = true;
              dispatch({
                type: 'UPDATE_TASK_STATUS',
                payload: {
                  taskId: apiTask.id,
                  status: apiTask.status as any,
                  createdAt: apiTask.createdAt,
                  actionType: apiTask.actionType as any,
                  details: apiTask.details,
                } as Task,
              });
            }
          });

          if (hasChanges) {
            consecutiveNoChanges = 0;
            pollInterval = 10000;
          } else {
            consecutiveNoChanges++;

            if (consecutiveNoChanges >= 3) {
              pollInterval = Math.min(pollInterval * 1.3, maxInterval);
            }
          }

          const stillInProgress = response.data.filter(
            (t) => t.status === 'PENDING' || t.status === 'PROCESSING'
          );

          if (stillInProgress.length === 0) {
            dispatch({ type: 'POLLING_END' });
            return;
          }
        }
      } catch (error) {
        console.warn('Polling error:', error);

        pollInterval = Math.min(pollInterval * 1.5, maxInterval);
      } finally {
        dispatch({ type: 'POLLING_END' });
      }

      timeoutId = setTimeout(poll, pollInterval);
    };

    timeoutId = setTimeout(poll, 2000);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [
    state.tasks.length,
    state.tasks
      .filter((t) => t.status === 'PENDING' || t.status === 'PROCESSING')
      .map((t) => t.taskId)
      .join(','),
  ]);

  const loadMore = () => {
    if (state.page < state.totalPages - 1 && !state.isLoading) {
      dispatch({ type: 'SET_PAGE', payload: state.page + 1 });
    }
  };

  const loadMoreItems = useCallback(async () => {
    if (state.page < state.totalPages - 1 && !state.isLoading) {
      const nextPage = state.page + 1;
      dispatch({ type: 'FETCH_START', forLoadMore: true });

      try {
        const response = await getTaskHistory(nextPage, {
          ...state.filters,
          summary: false,
        });
        if (response.data) {
          dispatch({
            type: 'FETCH_MORE_SUCCESS',
            payload: {
              tasks: response.data.content,
              totalPages: response.data.totalPages,
            },
          });
          dispatch({ type: 'SET_PAGE', payload: nextPage });
        }
      } catch (err: any) {
        dispatch({
          type: 'FETCH_ERROR',
          payload: err.message || 'Failed to load more items.',
        });
      }
    }
  }, [state.page, state.totalPages, state.isLoading, state.filters]);

  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 0 && pageNumber < state.totalPages && !state.isLoading) {
      dispatch({ type: 'SET_PAGE', payload: pageNumber });
    }
  };

  const goToPreviousPage = () => {
    if (state.page > 0 && !state.isLoading) {
      dispatch({ type: 'SET_PAGE', payload: state.page - 1 });
    }
  };

  const goToNextPage = () => {
    if (state.page < state.totalPages - 1 && !state.isLoading) {
      dispatch({ type: 'SET_PAGE', payload: state.page + 1 });
    }
  };

  const setFilters = (newFilters: Partial<TaskFilters>) => {
    dispatch({ type: 'SET_FILTERS', payload: newFilters });
  };

  const refetch = useCallback(() => {
    fetchArchive(state.page, state.filters);
  }, [fetchArchive, state.page, state.filters]);

  return {
    ...state,
    loadMore,
    loadMoreItems,
    goToPage,
    goToPreviousPage,
    goToNextPage,
    setFilters,
    refetch,
  };
}
