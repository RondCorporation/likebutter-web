'use client';

import { useEffect, useState } from 'react';
import { Task } from '@/types/task';
import { X, LoaderCircle } from 'lucide-react';
import TaskDetailsView from './TaskDetailsView';
import { getTaskStatus } from '@/lib/apis/task.api';

interface Props {
  task: Task;
  onClose: () => void;
}

export default function TaskDetailsModal({
  task: initialTask,
  onClose,
}: Props) {
  const [displayTask, setDisplayTask] = useState<Task | null>(initialTask);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!initialTask.details && !isLoading) {
      const fetchDetails = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const response = await getTaskStatus(initialTask.taskId);
          if (response.data) {
            const completeTask = { ...initialTask, ...response.data };
            setDisplayTask(completeTask);
          } else {
            setError(response.msg || 'Failed to load task details.');
          }
        } catch (e) {
          if (e instanceof Error) {
            setError(e.message);
          } else {
            setError('An unexpected error occurred while fetching details.');
          }
        } finally {
          setIsLoading(false);
        }
      };

      fetchDetails();
    } else {
      setDisplayTask(initialTask);
    }
  }, [initialTask]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
        <div className="bg-studio-sidebar border border-studio-border rounded-xl p-8">
          <div className="flex flex-col items-center gap-4">
            <LoaderCircle size={32} className="animate-spin text-studio-button-primary" />
            <p className="text-studio-text-primary text-sm">상세 정보를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      >
        <div className="bg-studio-sidebar border border-studio-border rounded-xl p-8 mx-4 max-w-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-studio-text-primary">오류 발생</h3>
            <button onClick={onClose} className="text-studio-text-secondary hover:text-studio-text-primary">
              <X size={20} />
            </button>
          </div>
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return displayTask ? (
    <TaskDetailsView task={displayTask} onClose={onClose} />
  ) : null;
}
