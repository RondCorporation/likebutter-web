'use client';

import { useState, useEffect } from 'react';
import { Edit3, Loader2 } from 'lucide-react';
import { Task } from '@/types/task';
import { canEditTask, isEditableActionType } from '@/lib/apis/task.api';
import EditTaskModal from './EditTaskModal';

interface Props {
  task: Task;
  onEditSuccess?: (newTaskId: number) => void;
}

export default function EditButton({ task, onEditSuccess }: Props) {
  const [canEdit, setCanEdit] = useState<boolean | null>(null);
  const [isCheckingEdit, setIsCheckingEdit] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkEditability();
  }, [task.taskId, task.actionType, task.status]);

  const checkEditability = async () => {
    // 먼저 클라이언트 사이드에서 체크
    if (!isEditableActionType(task.actionType) || task.status !== 'COMPLETED') {
      setCanEdit(false);
      return;
    }

    setIsCheckingEdit(true);
    setError(null);

    try {
      const response = await canEditTask(task.taskId, task.actionType);
      if (response.success) {
        setCanEdit(response.data);
      } else {
        setCanEdit(false);
        setError(response.msg || 'Failed to check edit availability');
      }
    } catch (error) {
      console.error('Error checking edit availability:', error);
      setCanEdit(false);
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsCheckingEdit(false);
    }
  };

  const handleEditClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleEditSuccess = (newTaskId: number) => {
    setIsModalOpen(false);
    onEditSuccess?.(newTaskId);
  };

  // 로딩 중이거나 수정 불가능한 경우 렌더하지 않음
  if (isCheckingEdit) {
    return (
      <button
        disabled
        className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-gray-400 rounded-lg cursor-not-allowed"
      >
        <Loader2 size={16} className="animate-spin" />
        확인 중...
      </button>
    );
  }

  if (canEdit !== true) {
    return null;
  }

  return (
    <>
      <button
        onClick={handleEditClick}
        className="flex items-center gap-2 px-4 py-2 bg-[#e8fa07] text-[#292c31] font-medium rounded-lg hover:bg-[#d4e006] transition-colors"
      >
        <Edit3 size={16} />
        수정하기
      </button>

      <EditTaskModal
        task={task}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleEditSuccess}
      />
    </>
  );
}