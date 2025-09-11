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
  startPolling: (taskId: number) => Promise<void>;
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
    console.log('🛑 Stopping polling...');
    setIntervalId(prev => {
      if (prev) {
        clearInterval(prev);
        console.log('✅ Polling interval cleared');
      }
      return null;
    });
    setIsPolling(false);
    setAttempts(0);
  }, []);

  const pollTask = useCallback(async (taskId: number) => {
    try {
      const response = await getTaskStatus(taskId);
      
      if (response.status === 200 && response.data) {
        setTaskData(response.data);
        setError(null);

        // 완료된 경우
        if (response.data.status === 'COMPLETED') {
          console.log('🔄 Task completed, stopping polling for taskId:', taskId);
          stopPolling();
          onCompleted?.(response.data);
          return true; // 폴링 중단 신호
        }

        // 실패한 경우
        if (response.data.status === 'FAILED') {
          console.log('❌ Task failed, stopping polling for taskId:', taskId);
          stopPolling();
          const errorMsg = response.data.details?.error || 'Task failed';
          setError(errorMsg);
          onFailed?.(errorMsg);
          return true; // 폴링 중단 신호
        }

        // 진행 중인 경우는 계속 폴링
        return false;
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
        return true; // 폴링 중단 신호
      }
      return false;
    }
  }, [attempts, onCompleted, onFailed, stopPolling]);

  const startPolling = useCallback(async (taskId: number) => {
    console.log('🚀 Starting polling for taskId:', taskId);
    // 기존 폴링이 있으면 중지
    stopPolling();
    
    setTaskData(null);
    setError(null);
    setAttempts(0);
    setIsPolling(true);

    // 즉시 첫 번째 호출
    const shouldStop = await pollTask(taskId);
    if (shouldStop) {
      console.log('⏹️ Task completed on first check, not starting interval');
      return; // 첫 번째 호출에서 완료/실패 시 폴링 시작하지 않음
    }

    // 인터벌 설정
    console.log('⏰ Setting up polling interval, checking every', interval, 'ms');
    const id = setInterval(() => {
      setAttempts(prev => {
        const newAttempts = prev + 1;
        console.log('🔄 Polling attempt:', newAttempts, 'for taskId:', taskId);
        
        if (newAttempts >= maxAttempts) {
          console.log('⏰ Polling timeout reached');
          stopPolling();
          setError('Polling timeout');
          onFailed?.('Polling timeout');
          return prev;
        }
        
        // 비동기 pollTask 실행
        (async () => {
          try {
            const shouldStop = await pollTask(taskId);
            if (shouldStop) {
              console.log('🔄 Polling should stop, calling stopPolling()');
              stopPolling();
            }
          } catch (error) {
            console.error('🔄 Polling error:', error);
            // 에러는 pollTask 내부에서 처리됨
          }
        })();
        
        return newAttempts;
      });
    }, interval);

    setIntervalId(id);
  }, [interval, maxAttempts, pollTask, onFailed, stopPolling]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      setIntervalId(prev => {
        if (prev) {
          console.log('🧹 Cleaning up interval on unmount');
          clearInterval(prev);
        }
        return null;
      });
    };
  }, []);

  return {
    taskData,
    isPolling,
    error,
    startPolling,
    stopPolling,
  };
}