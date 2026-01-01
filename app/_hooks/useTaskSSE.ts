'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { getTaskStatus } from '@/lib/apis/task.api';
import { getAccessToken } from '@/lib/apiClient';
import { Task } from '@/types/task';

interface TaskSummaryResponse {
  taskId: number;
  actionType: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  createdAt: string;
  parentTaskId?: number;
  editSequence?: number;
  isOriginal?: boolean;
  isEditTask?: boolean;
}

interface UseTaskSSEOptions {
  onStatusUpdate?: (summary: TaskSummaryResponse) => void;
  onCompleted?: (result: Task) => void;
  onFailed?: (error: string) => void;
  enablePollingFallback?: boolean;
  fallbackInterval?: number;
}

interface UseTaskSSEReturn {
  taskData: Task | null;
  isPolling: boolean;
  isBackgroundProcessing: boolean;
  error: string | null;
  startPolling: (taskId: number) => Promise<void>;
  stopPolling: () => void;
  stopBackgroundProcessing: () => void;
  checkTaskStatus: (taskId: number) => Promise<void>;
  currentTaskId: number | null;
  isConnected: boolean;
  connectionType: 'sse' | 'polling' | null;
}

export function useTaskSSE(options: UseTaskSSEOptions = {}): UseTaskSSEReturn {
  const {
    onStatusUpdate,
    onCompleted,
    onFailed,
    enablePollingFallback = true,
    fallbackInterval = 2000,
  } = options;

  const [taskData, setTaskData] = useState<Task | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [isBackgroundProcessing, setIsBackgroundProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTaskId, setCurrentTaskId] = useState<number | null>(null);
  const [connectionType, setConnectionType] = useState<
    'sse' | 'polling' | null
  >(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const callbackExecutedRef = useRef(false);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 3;
  const lastDataReceivedRef = useRef<number>(Date.now());
  const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const idleTimeoutMs = 60_000; // 60 seconds idle timeout

  const stopPolling = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    if (idleTimeoutRef.current) {
      clearTimeout(idleTimeoutRef.current);
      idleTimeoutRef.current = null;
    }
    setIsConnected(false);
    setIsPolling(false);
    setIsBackgroundProcessing(false);
    setConnectionType(null);
  }, []);

  const fetchFullTaskData = useCallback(
    async (taskId: number, status: string, retryCount = 0) => {
      const maxRetries = 3;
      const retryDelay = 1000;

      try {
        console.log(`[SSE] Fetching full task data - taskId=${taskId}, status=${status}, retry=${retryCount}`);
        const response = await getTaskStatus(taskId);

        if (response.status === 200 && response.data) {
          console.log('[SSE] Full task data fetched successfully:', response.data.status);
          setTaskData(response.data);

          if (!callbackExecutedRef.current) {
            callbackExecutedRef.current = true;

            if (status === 'COMPLETED') {
              onCompleted?.(response.data);
            } else if (status === 'FAILED') {
              const errorMsg = response.data.error || 'Task failed';
              setError(errorMsg);
              onFailed?.(errorMsg);
            }
          }

          stopPolling();
        } else {
          console.warn('[SSE] Unexpected API response:', response.status);
          if (retryCount < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, retryDelay));
            return fetchFullTaskData(taskId, status, retryCount + 1);
          }
          stopPolling();
          if (!callbackExecutedRef.current) {
            callbackExecutedRef.current = true;
            onFailed?.('Failed to fetch task data');
          }
        }
      } catch (err) {
        console.error(`[SSE] Failed to fetch full task data (retry ${retryCount}):`, err);
        if (retryCount < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          return fetchFullTaskData(taskId, status, retryCount + 1);
        }
        stopPolling();
        if (!callbackExecutedRef.current) {
          callbackExecutedRef.current = true;
          onFailed?.('Failed to fetch task data after retries');
        }
      }
    },
    [onCompleted, onFailed, stopPolling]
  );

  const startPollingFallback = useCallback(
    async (taskId: number) => {
      console.log('[SSE] Starting polling fallback');
      setIsPolling(true);
      setConnectionType('polling');

      const poll = async () => {
        try {
          const response = await getTaskStatus(taskId);
          if (response.status === 200 && response.data) {
            setTaskData(response.data);

            if (
              response.data.status === 'COMPLETED' ||
              response.data.status === 'FAILED'
            ) {
              if (!callbackExecutedRef.current) {
                callbackExecutedRef.current = true;

                if (response.data.status === 'COMPLETED') {
                  onCompleted?.(response.data);
                } else {
                  const errorMsg = response.data.error || 'Task failed';
                  setError(errorMsg);
                  onFailed?.(errorMsg);
                }
              }
              stopPolling();
            }
          }
        } catch (err) {
          console.error('Polling error:', err);
        }
      };

      await poll();
      pollingIntervalRef.current = setInterval(poll, fallbackInterval);
    },
    [fallbackInterval, onCompleted, onFailed]
  );

  const startSSEConnection = useCallback(
    async (taskId: number) => {
      const token = getAccessToken();
      if (!token) {
        console.error('[SSE] No access token available');
        setError('No access token available');
        if (enablePollingFallback) {
          startPollingFallback(taskId);
        }
        return;
      }

      const API_URL =
        process.env.NODE_ENV === 'development'
          ? ''
          : process.env.NEXT_PUBLIC_API_URL;

      const url = `${API_URL}/api/v1/tasks/${taskId}/stream`;

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        console.log('[SSE] Connecting to:', url);

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Accept: 'text/event-stream',
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include',
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            `SSE connection failed: ${response.status} ${response.statusText}`
          );
        }

        if (!response.body) {
          throw new Error('Response body is null');
        }

        setIsConnected(true);
        setConnectionType('sse');
        reconnectAttemptsRef.current = 0;
        lastDataReceivedRef.current = Date.now();
        console.log('[SSE] Connected successfully');

        // Idle timeout checker - falls back to polling if no data for 60 seconds
        const startIdleTimeoutChecker = () => {
          if (idleTimeoutRef.current) {
            clearTimeout(idleTimeoutRef.current);
          }
          idleTimeoutRef.current = setTimeout(() => {
            const idleTime = Date.now() - lastDataReceivedRef.current;
            if (idleTime >= idleTimeoutMs && !callbackExecutedRef.current) {
              console.warn(`[SSE] No data received for ${idleTime}ms, falling back to polling`);
              controller.abort();
              startPollingFallback(taskId);
            }
          }, idleTimeoutMs);
        };

        startIdleTimeoutChecker();

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        const processLines = (lines: string[]) => {
          for (const line of lines) {
            if (line.startsWith('data:')) {
              try {
                const data = line.substring(5).trim();
                if (!data) {
                  console.log('[SSE] Empty data line, skipping');
                  continue;
                }
                const summary: TaskSummaryResponse = JSON.parse(data);

                console.log('[SSE] Received status:', summary.status, 'taskId:', summary.taskId);
                onStatusUpdate?.(summary);

                if (
                  summary.status === 'COMPLETED' ||
                  summary.status === 'FAILED'
                ) {
                  console.log('[SSE] Terminal status received, will fetch full data');
                  return summary;
                }
              } catch (err) {
                console.error('[SSE] Failed to parse data:', err, 'line:', line);
              }
            } else if (line.startsWith('event:')) {
              console.log('[SSE] Event type:', line.substring(6).trim());
            }
          }
          return null;
        };

        try {
          while (true) {
            const { done, value } = await reader.read();

            if (value) {
              // Reset idle timer on any data received
              lastDataReceivedRef.current = Date.now();
              startIdleTimeoutChecker();

              const decoded = decoder.decode(value, { stream: true });
              buffer += decoded;

              const lines = buffer.split('\n');
              buffer = lines.pop() || '';

              const finalStatus = processLines(lines);
              if (finalStatus) {
                await fetchFullTaskData(taskId, finalStatus.status);
                reader.cancel();
                setIsConnected(false);
                return;
              }
            }

            if (done) {
              if (buffer.trim()) {
                const lines = buffer.split('\n');
                const finalStatus = processLines(lines);
                if (finalStatus) {
                  await fetchFullTaskData(taskId, finalStatus.status);
                }
              }
              console.log('[SSE] Stream closed by server');

              // SSE가 끊어졌는데 콜백이 실행되지 않았으면 한 번 더 상태 확인
              if (!callbackExecutedRef.current) {
                console.log('[SSE] Callback not executed, checking task status...');
                try {
                  const response = await getTaskStatus(taskId);
                  if (response.status === 200 && response.data) {
                    const status = response.data.status;
                    if (status === 'COMPLETED' || status === 'FAILED') {
                      await fetchFullTaskData(taskId, status);
                    } else {
                      // 아직 완료되지 않았으면 폴링 시작
                      console.log('[SSE] Task not completed, starting polling fallback');
                      startPollingFallback(taskId);
                    }
                  }
                } catch (err) {
                  console.error('[SSE] Failed to check task status after stream close:', err);
                  startPollingFallback(taskId);
                }
              }
              break;
            }
          }
        } finally {
          setIsConnected(false);
        }
      } catch (err: any) {
        console.error('[SSE] Connection error:', err);
        setIsConnected(false);

        if (err.name === 'AbortError') {
          console.log('[SSE] Connection aborted by user');
          return;
        }

        if (enablePollingFallback && !callbackExecutedRef.current) {
          reconnectAttemptsRef.current++;

          if (reconnectAttemptsRef.current <= maxReconnectAttempts) {
            console.log(
              `[SSE] Retrying... (${reconnectAttemptsRef.current}/${maxReconnectAttempts})`
            );
            setTimeout(() => {
              if (!callbackExecutedRef.current) {
                startSSEConnection(taskId);
              }
            }, 3000);
          } else {
            console.log(
              '[SSE] Max reconnection attempts reached. Falling back to polling.'
            );
            startPollingFallback(taskId);
          }
        }
      }
    },
    [
      onStatusUpdate,
      fetchFullTaskData,
      enablePollingFallback,
      startPollingFallback,
    ]
  );

  const startPolling = useCallback(
    async (taskId: number) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }

      callbackExecutedRef.current = false;
      reconnectAttemptsRef.current = 0;
      setCurrentTaskId(taskId);
      setTaskData(null);
      setError(null);
      setIsConnected(false);
      setIsPolling(false);
      setIsBackgroundProcessing(false);
      setConnectionType(null);

      startSSEConnection(taskId);
    },
    [startSSEConnection]
  );

  const stopBackgroundProcessing = useCallback(() => {
    stopPolling();
  }, [stopPolling]);

  const checkTaskStatus = useCallback(async (taskId: number) => {
    try {
      const response = await getTaskStatus(taskId);
      if (response.status === 200 && response.data) {
        setTaskData(response.data);
      }
    } catch (err) {
      console.error('Failed to check task status:', err);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }
    };
  }, []);

  return {
    taskData,
    isPolling: isPolling || isConnected,
    isBackgroundProcessing,
    error,
    startPolling,
    stopPolling,
    stopBackgroundProcessing,
    checkTaskStatus,
    currentTaskId,
    isConnected,
    connectionType,
  };
}
