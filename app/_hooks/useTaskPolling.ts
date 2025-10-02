'use client';

import { useState, useEffect, useCallback } from 'react';
import { getTaskStatus } from '@/lib/apis/task.api';
import { TaskStatusResponse } from '@/types/task';

interface UseTaskPollingOptions {
  interval?: number;
  maxAttempts?: number;
  onCompleted?: (result: TaskStatusResponse) => void;
  onFailed?: (error: string) => void;
}

interface UseTaskPollingReturn {
  taskData: TaskStatusResponse | null;
  isPolling: boolean;
  isBackgroundProcessing: boolean;
  error: string | null;
  startPolling: (taskId: number) => Promise<void>;
  stopPolling: () => void;
  checkTaskStatus: (taskId: number) => Promise<void>;
  currentTaskId: number | null;
}

export function useTaskPolling(
  options: UseTaskPollingOptions = {}
): UseTaskPollingReturn {
  const { interval = 2000, maxAttempts = 900, onCompleted, onFailed } = options;

  const [taskData, setTaskData] = useState<TaskStatusResponse | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [isBackgroundProcessing, setIsBackgroundProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [backgroundIntervalId, setBackgroundIntervalId] =
    useState<NodeJS.Timeout | null>(null);
  const [isCallbackExecuted, setIsCallbackExecuted] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState<number | null>(null);

  const stopPolling = useCallback(() => {
    setIntervalId((prev) => {
      if (prev) {
        clearInterval(prev);
      }
      return null;
    });
    setIsPolling(false);
    setAttempts(0);
  }, []);

  const stopBackgroundProcessing = useCallback(() => {
    setBackgroundIntervalId((prev) => {
      if (prev) {
        clearInterval(prev);
      }
      return null;
    });
    setIsBackgroundProcessing(false);
    setCurrentTaskId(null);
  }, []);

  const pollTask = useCallback(
    async (taskId: number, callbackExecutedRef: { current: boolean }) => {
      try {
        const response = await getTaskStatus(taskId);

        if (response.status === 200 && response.data) {
          setTaskData(response.data);
          setError(null);

          if (response.data.status === 'COMPLETED') {
            stopPolling();

            if (!callbackExecutedRef.current) {
              callbackExecutedRef.current = true;
              onCompleted?.(response.data);
            }
            return true;
          }

          if (response.data.status === 'FAILED') {
            stopPolling();
            const errorMsg = response.data.details?.error || 'Task failed';
            setError(errorMsg);

            if (!callbackExecutedRef.current) {
              callbackExecutedRef.current = true;
              onFailed?.(errorMsg);
            }
            return true;
          }

          return false;
        } else {
          throw new Error('Failed to fetch task status');
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMsg);

        if (attempts >= 3) {
          stopPolling();

          if (!callbackExecutedRef.current) {
            callbackExecutedRef.current = true;
            onFailed?.(errorMsg);
          }
          return true;
        }
        return false;
      }
    },
    [attempts, onCompleted, onFailed, stopPolling]
  );

  const startBackgroundProcessing = useCallback(
    (taskId: number, callbackExecutedRef: { current: boolean }) => {
      setIsBackgroundProcessing(true);
      setCurrentTaskId(taskId);
      setError(null);

      const backgroundInterval = setInterval(() => {
        pollTask(taskId, callbackExecutedRef)
          .then((shouldStop) => {
            if (shouldStop) {
              stopBackgroundProcessing();
            }
          })
          .catch((error) => {
            console.error('Background polling error:', error);
          });
      }, 30000);

      setBackgroundIntervalId(backgroundInterval);
    },
    [pollTask, stopBackgroundProcessing]
  );

  const startPolling = useCallback(
    async (taskId: number) => {
      // Stop any existing polling first
      setIntervalId((prev) => {
        if (prev) {
          clearInterval(prev);
        }
        return null;
      });
      setIsPolling(false);

      // Create a new ref for this polling session
      const callbackExecutedRef = { current: false };

      setTaskData(null);
      setError(null);
      setAttempts(0);
      setIsPolling(true);
      setIsCallbackExecuted(false);

      const shouldStop = await pollTask(taskId, callbackExecutedRef);
      if (shouldStop) {
        return;
      }

      let attemptCount = 0;
      const id = setInterval(() => {
        attemptCount++;

        if (attemptCount >= maxAttempts) {
          clearInterval(id);
          setIntervalId(null);
          setIsPolling(false);
          startBackgroundProcessing(taskId, callbackExecutedRef);
          return;
        }

        (async () => {
          try {
            const shouldStop = await pollTask(taskId, callbackExecutedRef);
            if (shouldStop) {
              clearInterval(id);
              setIntervalId(null);
              setIsPolling(false);
            }
          } catch (error) {
            console.error('Polling error:', error);
          }
        })();
      }, interval);

      setIntervalId(id);
    },
    [interval, maxAttempts, pollTask, startBackgroundProcessing]
  );

  const checkTaskStatus = useCallback(
    async (taskId: number) => {
      try {
        // For manual check, create a new ref that allows callback execution
        const manualCheckRef = { current: false };
        const shouldStop = await pollTask(taskId, manualCheckRef);
        if (shouldStop && isBackgroundProcessing) {
          stopBackgroundProcessing();
        }
      } catch (error) {
        console.error('Manual task status check error:', error);
      }
    },
    [pollTask, isBackgroundProcessing, stopBackgroundProcessing]
  );

  useEffect(() => {
    return () => {
      setIntervalId((prev) => {
        if (prev) {
          clearInterval(prev);
        }
        return null;
      });
      setBackgroundIntervalId((prev) => {
        if (prev) {
          clearInterval(prev);
        }
        return null;
      });
    };
  }, []);

  return {
    taskData,
    isPolling,
    isBackgroundProcessing,
    error,
    startPolling,
    stopPolling,
    checkTaskStatus,
    currentTaskId,
  };
}
