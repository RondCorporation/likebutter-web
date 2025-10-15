'use client';

import { useEffect, useState } from 'react';
import { Task } from '@/types/task';
import { X, LoaderCircle } from 'lucide-react';
import TaskDetailsView from './TaskDetailsView';
import { getTaskStatus } from '@/lib/apis/task.api';
import { useTranslation } from 'react-i18next';
import EditTaskModal from './EditTaskModal';

interface Props {
  task: Task;
  onClose: () => void;
  onRefetch?: () => void;
  onScrollToTop?: () => void;
}

export default function TaskDetailsModal({
  task: initialTask,
  onClose,
  onRefetch,
  onScrollToTop,
}: Props) {
  const { t } = useTranslation('studio');
  const [displayTask, setDisplayTask] = useState<Task | null>(initialTask);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    // Check if task has result data based on actionType
    const hasResultData = () => {
      switch (initialTask.actionType) {
        case 'DIGITAL_GOODS':
        case 'DIGITAL_GOODS_EDIT':
          return (
            'digitalGoods' in initialTask &&
            initialTask.digitalGoods !== undefined
          );
        case 'FANMEETING_STUDIO':
        case 'FANMEETING_STUDIO_EDIT':
          return (
            'fanmeetingStudio' in initialTask &&
            initialTask.fanmeetingStudio !== undefined
          );
        case 'STYLIST':
        case 'STYLIST_EDIT':
          return 'stylist' in initialTask && initialTask.stylist !== undefined;
        case 'VIRTUAL_CASTING':
        case 'VIRTUAL_CASTING_EDIT':
          return (
            'virtualCasting' in initialTask &&
            initialTask.virtualCasting !== undefined
          );
        case 'BUTTER_COVER':
          return (
            'butterCover' in initialTask &&
            initialTask.butterCover !== undefined
          );
        default:
          return false;
      }
    };

    if (!hasResultData() && !isLoading) {
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
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
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
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm"
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

  const handleEditSuccess = (newTaskId: number) => {
    // Close the details modal
    onClose();

    // Scroll to top of archive page
    if (onScrollToTop) {
      onScrollToTop();
    }

    // Refresh the archive list
    if (onRefetch) {
      onRefetch();
    }
  };

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  // Check if task can be edited (only completed image generation tasks)
  const canEdit =
    displayTask?.status === 'COMPLETED' &&
    (displayTask.actionType === 'DIGITAL_GOODS' ||
      displayTask.actionType === 'DIGITAL_GOODS_EDIT' ||
      displayTask.actionType === 'FANMEETING_STUDIO' ||
      displayTask.actionType === 'FANMEETING_STUDIO_EDIT' ||
      displayTask.actionType === 'STYLIST' ||
      displayTask.actionType === 'STYLIST_EDIT' ||
      displayTask.actionType === 'VIRTUAL_CASTING' ||
      displayTask.actionType === 'VIRTUAL_CASTING_EDIT');

  return (
    <>
      {displayTask && (
        <TaskDetailsView
          task={displayTask}
          onClose={onClose}
          onEdit={canEdit ? handleEditClick : undefined}
        />
      )}

      {displayTask && canEdit && (
        <EditTaskModal
          task={displayTask}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={handleEditSuccess}
        />
      )}
    </>
  );
}
