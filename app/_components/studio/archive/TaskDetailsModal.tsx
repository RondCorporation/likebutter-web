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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-lg bg-neutral-900 border border-white/10 text-white overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-white/10">
          <h2 className="text-lg font-semibold">
            Task Details (ID: {initialTask.taskId})
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <LoaderCircle size={32} className="animate-spin text-accent" />
            </div>
          ) : error ? (
            <div className="text-center text-red-400 py-10">
              <p>{error}</p>
            </div>
          ) : (
            displayTask && <TaskDetailsView task={displayTask} />
          )}
        </div>
      </div>
    </div>
  );
}
