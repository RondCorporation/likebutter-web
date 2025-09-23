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
      dispatch({ type: 'FETCH_START', forLoadMore: false }); // Always replace content for pagination

      try {
        // Always get full details for better UX
        const response = await getTaskHistory(pageToFetch, {
          ...filters,
          summary: false,
        });
        if (response.data) {
          dispatch({
            type: 'FETCH_SUCCESS', // Always use FETCH_SUCCESS to replace content
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

    // Smart polling with exponential backoff
    let pollInterval = 10000; // Start with 10 seconds (less aggressive)
    const maxInterval = 60000; // Max 1 minute
    let consecutiveNoChanges = 0;

    let timeoutId: NodeJS.Timeout;

    const poll = async () => {
      if (state.isPolling) return;
      dispatch({ type: 'POLLING_START' });

      try {
        // Get current in-progress tasks (they might have changed since effect started)
        const currentInProgressTasks = state.tasks.filter(
          (t) => t.status === 'PENDING' || t.status === 'PROCESSING'
        );

        if (currentInProgressTasks.length === 0) {
          dispatch({ type: 'POLLING_END' });
          return; // Stop polling if no more in-progress tasks
        }

        const taskIds = currentInProgressTasks.map((t) => t.taskId);

        // Use batch API instead of individual calls
        const response = await getBatchTaskStatus(taskIds);

        if (response.data && Array.isArray(response.data)) {
          let hasChanges = false;

          // Update only changed tasks - Map API response to frontend Task format
          response.data.forEach((apiTask: BatchTaskResponse) => {
            const existingTask = state.tasks.find(
              (t) => t.taskId === apiTask.id
            );
            if (existingTask && existingTask.status !== apiTask.status) {
              hasChanges = true;
              dispatch({
                type: 'UPDATE_TASK_STATUS',
                payload: {
                  taskId: apiTask.id, // API uses 'id', frontend uses 'taskId'
                  status: apiTask.status as any, // Cast to match GenerationStatus
                  createdAt: apiTask.createdAt,
                  actionType: apiTask.actionType as any, // Cast to match ActionType
                  details: apiTask.details,
                } as Task,
              });
            }
          });

          // Adjust polling interval based on activity
          if (hasChanges) {
            consecutiveNoChanges = 0;
            pollInterval = 10000; // Reset to medium interval when there are changes
          } else {
            consecutiveNoChanges++;
            // Gradually increase interval if no changes
            if (consecutiveNoChanges >= 3) {
              pollInterval = Math.min(pollInterval * 1.3, maxInterval);
            }
          }

          // Check if any tasks are still in progress
          const stillInProgress = response.data.filter(
            (t) => t.status === 'PENDING' || t.status === 'PROCESSING'
          );

          if (stillInProgress.length === 0) {
            dispatch({ type: 'POLLING_END' });
            return; // Stop polling when all tasks are complete
          }
        }
      } catch (error) {
        console.warn('Polling error:', error);
        // On error, increase polling interval to reduce server load
        pollInterval = Math.min(pollInterval * 1.5, maxInterval);
      } finally {
        dispatch({ type: 'POLLING_END' });
      }

      // Schedule next poll with dynamic interval
      timeoutId = setTimeout(poll, pollInterval);
    };

    // Start first poll after a short delay to avoid immediate polling
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
  ]); // Only restart polling when in-progress task IDs change

  const loadMore = () => {
    if (state.page < state.totalPages - 1 && !state.isLoading) {
      dispatch({ type: 'SET_PAGE', payload: state.page + 1 });
    }
  };

  // Separate function for actually loading more items (appending to existing list)
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
