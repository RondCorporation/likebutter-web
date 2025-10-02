'use client';

import { useEffect, useState } from 'react';
import { Task } from '@/types/task';
import { X, LoaderCircle } from 'lucide-react';
import TaskDetailsView from './TaskDetailsView';
import { getTaskStatus } from '@/lib/apis/task.api';
import { useTranslation } from 'react-i18next';
import { useTaskPolling } from '@/hooks/useTaskPolling';
import EditButton from './EditButton';
import { toast } from 'react-hot-toast';

interface Props {
  task: Task;
  onClose: () => void;
  onRefetch?: () => void;
}

export default function TaskDetailsModal({
  task: initialTask,
  onClose,
  onRefetch,
}: Props) {
  const { t } = useTranslation('studio');
  const [displayTask, setDisplayTask] = useState<Task | null>(initialTask);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { isPolling, startPolling, taskData } = useTaskPolling({
    onCompleted: (result) => {
      toast.success(t('archive.messages.editComplete'));
      setDisplayTask(result as unknown as Task);
      onRefetch?.();
    },
    onFailed: (error) => {
      toast.error(t('archive.messages.editFailed'));
    },
  });

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

  useEffect(() => {
    if (taskData) {
      setDisplayTask(taskData as unknown as Task);
    }
  }, [taskData]);

  const handleEditSuccess = (newTaskId: number) => {
    toast.success(t('archive.messages.editRequestSent'));
    startPolling(newTaskId);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
        <div className="bg-studio-sidebar border border-studio-border rounded-xl p-8">
          <div className="flex flex-col items-center gap-4">
            <LoaderCircle
              size={32}
              className="animate-spin text-studio-button-primary"
            />
            <p className="text-studio-text-primary text-sm">
              {t('archive.messages.loadingDetails')}
            </p>
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
            <h3 className="text-lg font-semibold text-studio-text-primary">
              {t('archive.messages.errorOccurred')}
            </h3>
            <button
              onClick={onClose}
              className="text-studio-text-secondary hover:text-studio-text-primary"
            >
              <X size={20} />
            </button>
          </div>
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (isPolling) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
        <div className="bg-studio-sidebar border border-studio-border rounded-xl p-8">
          <div className="flex flex-col items-center gap-4">
            <LoaderCircle
              size={32}
              className="animate-spin text-studio-button-primary"
            />
            <p className="text-studio-text-primary text-sm">
              {t('archive.messages.processingEdit')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return displayTask ? (
    <>
      <TaskDetailsView task={displayTask} onClose={onClose} />
      {displayTask && displayTask.status === 'COMPLETED' && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-[60]">
          <EditButton task={displayTask} onEditSuccess={handleEditSuccess} />
        </div>
      )}
    </>
  ) : null;
}
