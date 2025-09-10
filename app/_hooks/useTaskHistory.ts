'use client';

import { useEffect, useReducer, useCallback } from 'react';
import { Task } from '@/types/task';
import {
  getTaskHistory,
  getTaskStatus,
  getBatchTaskStatus,
} from '@/lib/apis/task.api';

interface HistoryState {
  tasks: Task[];
  inProgressTasks: Task[];
  completedTasks: Task[];
  isLoading: boolean;
  isPolling: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  filters: {
    status: string;
    actionType: string;
  };
}

type HistoryAction =
  | { type: 'FETCH_START'; forLoadMore: boolean }
  | { type: 'FETCH_SUCCESS'; payload: { tasks: Task[]; totalPages: number } }
  | {
      type: 'FETCH_MORE_SUCCESS';
      payload: { tasks: Task[]; totalPages: number };
    }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'UPDATE_TASK_STATUS'; payload: Task }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'SET_FILTERS'; payload: { status?: string; actionType?: string } }
  | { type: 'POLLING_START' | 'POLLING_END' };

const initialState: HistoryState = {
  tasks: [],
  inProgressTasks: [],
  completedTasks: [],
  isLoading: true,
  isPolling: false,
  error: null,
  page: 0,
  totalPages: 1,
  filters: { status: '', actionType: '' },
};

function historyReducer(
  state: HistoryState,
  action: HistoryAction
): HistoryState {
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
export function useTaskHistory() {
  const [state, dispatch] = useReducer(historyReducer, initialState);

  const fetchHistory = useCallback(
    async (pageToFetch: number, filters: HistoryState['filters']) => {
      const isLoadMore = pageToFetch > 0;
      dispatch({ type: 'FETCH_START', forLoadMore: isLoadMore });

      try {
        // First load gets full details (summary=false), subsequent loads can be summary only
        const response = await getTaskHistory(pageToFetch, {
          ...filters,
          summary: false, // Always get full details for better UX
        });
        if (response.data) {
          dispatch({
            type: isLoadMore ? 'FETCH_MORE_SUCCESS' : 'FETCH_SUCCESS',
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
            'Failed to fetch history. Please try refreshing the page.',
        });
      }
    },
    []
  );

  useEffect(() => {
    fetchHistory(state.page, state.filters);
  }, [state.page, JSON.stringify(state.filters), fetchHistory]);

  useEffect(() => {
    const tasksToCheck = state.tasks.filter(
      (t) => t.status === 'PENDING' || t.status === 'PROCESSING'
    );

    if (tasksToCheck.length === 0) return;

    // Smart polling with exponential backoff
    let pollInterval = 5000; // Start with 5 seconds
    const maxInterval = 30000; // Max 30 seconds

    let timeoutId: NodeJS.Timeout;

    const poll = async () => {
      if (state.isPolling) return;
      dispatch({ type: 'POLLING_START' });

      try {
        const taskIds = tasksToCheck.map((t) => t.taskId);

        // Use batch API instead of individual calls
        const response = await getBatchTaskStatus(taskIds);

        if (response.data && Array.isArray(response.data)) {
          // Update only changed tasks
          response.data.forEach((updatedTask) => {
            const existingTask = state.tasks.find(
              (t) => t.taskId === updatedTask.taskId
            );
            if (existingTask && existingTask.status !== updatedTask.status) {
              dispatch({
                type: 'UPDATE_TASK_STATUS',
                payload: {
                  taskId: updatedTask.taskId,
                  status: updatedTask.status,
                  createdAt: updatedTask.createdAt,
                  actionType: existingTask.actionType, // Keep original actionType
                  details: updatedTask.details,
                } as Task,
              });
            }
          });

          // If tasks completed, reset poll interval for next batch
          const stillInProgress = response.data.filter(
            (t) => t.status === 'PENDING' || t.status === 'PROCESSING'
          );

          if (stillInProgress.length === 0) {
            pollInterval = 5000; // Reset to fast polling
          } else if (stillInProgress.length === tasksToCheck.length) {
            // No status changes, increase interval (exponential backoff)
            pollInterval = Math.min(pollInterval * 1.5, maxInterval);
          } else {
            // Some changes, reset to medium interval
            pollInterval = 10000;
          }
        }
      } catch (error) {
        console.warn('Polling error:', error);
        // On error, increase polling interval to reduce server load
        pollInterval = Math.min(pollInterval * 2, maxInterval);
      } finally {
        dispatch({ type: 'POLLING_END' });
      }

      // Schedule next poll with dynamic interval
      timeoutId = setTimeout(poll, pollInterval);
    };

    // Start first poll immediately
    poll();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [state.tasks, state.isPolling]);

  const loadMore = () => {
    if (state.page < state.totalPages - 1 && !state.isLoading) {
      dispatch({ type: 'SET_PAGE', payload: state.page + 1 });
    }
  };

  const setFilters = (newFilters: { status?: string; actionType?: string }) => {
    dispatch({ type: 'SET_FILTERS', payload: newFilters });
  };

  return { ...state, loadMore, setFilters };
}
