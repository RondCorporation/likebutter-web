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
  error: string | null;
  startPolling: (taskId: number) => void;
  stopPolling: () => void;
}

export function useTaskPolling(options: UseTaskPollingOptions = {}): UseTaskPollingReturn {
  const {
    interval = 2000, // 2초 간격
    maxAttempts = 150, // 최대 5분 (2초 * 150)
    onCompleted,
    onFailed,
  } = options;

  const [taskData, setTaskData] = useState<TaskStatusResponse | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const stopPolling = useCallback(() => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    setIsPolling(false);
    setAttempts(0);
  }, [intervalId]);

  const pollTask = useCallback(async (taskId: number) => {
    try {
      const response = await getTaskStatus(taskId);
      
      if (response.status === 200 && response.data) {
        setTaskData(response.data);
        setError(null);

        // 완료된 경우
        if (response.data.status === 'COMPLETED') {
          stopPolling();
          onCompleted?.(response.data);
          return;
        }

        // 실패한 경우
        if (response.data.status === 'FAILED') {
          stopPolling();
          const errorMsg = response.data.details?.error || 'Task failed';
          setError(errorMsg);
          onFailed?.(errorMsg);
          return;
        }

        // 진행 중인 경우는 계속 폴링
      } else {
        throw new Error('Failed to fetch task status');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      
      // 에러가 발생해도 몇 번 더 시도
      if (attempts >= 3) {
        stopPolling();
        onFailed?.(errorMsg);
      }
    }
  }, [attempts, onCompleted, onFailed, stopPolling]);

  const startPolling = useCallback((taskId: number) => {
    // 기존 폴링이 있으면 중지
    stopPolling();
    
    setTaskData(null);
    setError(null);
    setAttempts(0);
    setIsPolling(true);

    // 즉시 첫 번째 호출
    pollTask(taskId);

    // 인터벌 설정
    const id = setInterval(() => {
      setAttempts(prev => {
        const newAttempts = prev + 1;
        
        if (newAttempts >= maxAttempts) {
          stopPolling();
          setError('Polling timeout');
          onFailed?.('Polling timeout');
          return prev;
        }
        
        pollTask(taskId);
        return newAttempts;
      });
    }, interval);

    setIntervalId(id);
  }, [interval, maxAttempts, pollTask, onFailed, stopPolling]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  return {
    taskData,
    isPolling,
    error,
    startPolling,
    stopPolling,
  };
}