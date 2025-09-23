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
    console.log('🛑 Stopping polling...');
    setIntervalId((prev) => {
      if (prev) {
        clearInterval(prev);
        console.log('✅ Polling interval cleared');
      }
      return null;
    });
    setIsPolling(false);
    setAttempts(0);
  }, []);

  const stopBackgroundProcessing = useCallback(() => {
    console.log('🛑 Stopping background processing...');
    setBackgroundIntervalId((prev) => {
      if (prev) {
        clearInterval(prev);
        console.log('✅ Background polling interval cleared');
      }
      return null;
    });
    setIsBackgroundProcessing(false);
    setCurrentTaskId(null);
  }, []);

  const pollTask = useCallback(
    async (taskId: number) => {
      try {
        const response = await getTaskStatus(taskId);

        if (response.status === 200 && response.data) {
          setTaskData(response.data);
          setError(null);

          if (response.data.status === 'COMPLETED') {
            console.log(
              '🔄 Task completed, stopping polling for taskId:',
              taskId
            );
            stopPolling();

            if (!isCallbackExecuted) {
              setIsCallbackExecuted(true);
              onCompleted?.(response.data);
            }
            return true;
          }

          if (response.data.status === 'FAILED') {
            console.log('❌ Task failed, stopping polling for taskId:', taskId);
            stopPolling();
            const errorMsg = response.data.details?.error || 'Task failed';
            setError(errorMsg);

            if (!isCallbackExecuted) {
              setIsCallbackExecuted(true);
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

          if (!isCallbackExecuted) {
            setIsCallbackExecuted(true);
            onFailed?.(errorMsg);
          }
          return true;
        }
        return false;
      }
    },
    [attempts, onCompleted, onFailed, stopPolling, isCallbackExecuted]
  );

  const startBackgroundProcessing = useCallback(
    (taskId: number) => {
      console.log('🔄 Starting background processing for taskId:', taskId);
      setIsBackgroundProcessing(true);
      setCurrentTaskId(taskId);
      setError(null);

      const backgroundInterval = setInterval(() => {
        console.log('🔄 Background polling check for taskId:', taskId);
        pollTask(taskId)
          .then((shouldStop) => {
            if (shouldStop) {
              stopBackgroundProcessing();
            }
          })
          .catch((error) => {
            console.error('🔄 Background polling error:', error);
          });
      }, 30000);

      setBackgroundIntervalId(backgroundInterval);
    },
    [pollTask, stopBackgroundProcessing]
  );

  const startPolling = useCallback(
    async (taskId: number) => {
      console.log('🚀 Starting polling for taskId:', taskId);

      stopPolling();

      setTaskData(null);
      setError(null);
      setAttempts(0);
      setIsPolling(true);
      setIsCallbackExecuted(false);

      const shouldStop = await pollTask(taskId);
      if (shouldStop) {
        console.log('⏹️ Task completed on first check, not starting interval');
        return;
      }

      console.log(
        '⏰ Setting up polling interval, checking every',
        interval,
        'ms'
      );
      const id = setInterval(() => {
        setAttempts((prev) => {
          const newAttempts = prev + 1;
          console.log(
            '🔄 Polling attempt:',
            newAttempts,
            'for taskId:',
            taskId
          );

          if (newAttempts >= maxAttempts) {
            console.log(
              '⏰ Polling timeout reached, switching to background processing'
            );
            stopPolling();
            startBackgroundProcessing(taskId);
            return prev;
          }

          (async () => {
            try {
              const shouldStop = await pollTask(taskId);
              if (shouldStop) {
                console.log('🔄 Polling should stop, calling stopPolling()');
                stopPolling();
              }
            } catch (error) {
              console.error('🔄 Polling error:', error);
            }
          })();

          return newAttempts;
        });
      }, interval);

      setIntervalId(id);
    },
    [
      interval,
      maxAttempts,
      pollTask,
      onFailed,
      stopPolling,
      isCallbackExecuted,
      startBackgroundProcessing,
    ]
  );

  const checkTaskStatus = useCallback(
    async (taskId: number) => {
      console.log('🔍 Manual task status check for taskId:', taskId);
      try {
        const shouldStop = await pollTask(taskId);
        if (shouldStop && isBackgroundProcessing) {
          stopBackgroundProcessing();
        }
      } catch (error) {
        console.error('🔍 Manual task status check error:', error);
      }
    },
    [pollTask, isBackgroundProcessing, stopBackgroundProcessing]
  );

  useEffect(() => {
    return () => {
      setIntervalId((prev) => {
        if (prev) {
          console.log('🧹 Cleaning up interval on unmount');
          clearInterval(prev);
        }
        return null;
      });
      setBackgroundIntervalId((prev) => {
        if (prev) {
          console.log('🧹 Cleaning up background interval on unmount');
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
