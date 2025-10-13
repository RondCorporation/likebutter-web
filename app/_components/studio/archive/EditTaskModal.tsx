'use client';

import { useState } from 'react';
import { X, Send, Loader2 } from 'lucide-react';
import { Task, ActionType } from '@/types/task';
import { editTask } from '@/lib/apis/task.api';
import { useTranslation } from 'react-i18next';
import { useScrollLock } from '@/hooks/useScrollLock';

interface Props {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newTaskId: number) => void;
}

export default function EditTaskModal({
  task,
  isOpen,
  onClose,
  onSuccess,
}: Props) {
  const { t } = useTranslation('studio');
  const [editPrompt, setEditPrompt] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useScrollLock(isOpen);

  const handleSubmit = async () => {
    if (!editPrompt.trim()) {
      setError(t('editRequest.errors.emptyPrompt'));
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await editTask(
        task.taskId,
        task.actionType,
        editPrompt.trim()
      );
      if (response.data) {
        onSuccess(response.data.taskId);
        handleClose();
      } else {
        setError(t('editRequest.errors.requestFailed'));
      }
    } catch (error) {
      console.error('Edit task error:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(t('editRequest.errors.requestFailed'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setEditPrompt('');
    setError(null);
    setIsSubmitting(false);
    onClose();
  };

  const getActionTypeLabel = (actionType: ActionType) => {
    const labels: { [key: string]: string } = {
      DIGITAL_GOODS: t('tools.digitalGoods.title'),
      FANMEETING_STUDIO: t('tools.fanmeetingStudio.title'),
      STYLIST: t('tools.stylist.title'),
      VIRTUAL_CASTING: t('tools.virtualCasting.title'),
    };
    return labels[actionType] || actionType;
  };

  const getResultImageUrl = (task: Task): string | null => {
    switch (task.actionType) {
      case 'DIGITAL_GOODS':
      case 'DIGITAL_GOODS_EDIT':
        return task.digitalGoods?.imageUrl || null;
      case 'FANMEETING_STUDIO':
      case 'FANMEETING_STUDIO_EDIT':
        return task.fanmeetingStudio?.imageUrl || null;
      case 'STYLIST':
      case 'STYLIST_EDIT':
        return task.stylist?.imageUrl || null;
      case 'VIRTUAL_CASTING':
      case 'VIRTUAL_CASTING_EDIT':
        return task.virtualCasting?.imageUrl || null;
      case 'BUTTER_COVER':
        // ButterCover has audio, not image
        return null;
      default:
        const exhaustiveCheck: never = task;
        return null;
    }
  };

  if (!isOpen) return null;

  const imageUrl = getResultImageUrl(task);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#25282c] border border-[#4a4a4b] rounded-xl p-6 mx-4 max-w-2xl w-full max-h-[90vh] overflow-y-auto pb-32 md:pb-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">이미지 수정하기</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
            disabled={isSubmitting}
          >
            <X size={24} />
          </button>
        </div>

        {/* Task Info */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="px-3 py-1 bg-[#e8fa07] text-[#292c31] text-sm font-medium rounded">
              {getActionTypeLabel(task.actionType)}
            </div>
            <span className="text-gray-400 text-sm">Task #{task.taskId}</span>
          </div>

          {/* Edit History Chain */}
          {task.parentTaskId &&
            task.editSequence !== undefined &&
            task.editSequence !== null && (
              <div className="mb-4 p-3 bg-[#1a1d21] border border-[#4a4a4b] rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-400">편집 체인:</span>
                  <div className="flex items-center gap-1 text-white">
                    <span className="text-gray-500">#{task.parentTaskId}</span>
                    {Array.from({ length: task.editSequence }, (_, i) => (
                      <span key={i} className="text-gray-500">
                        →{' '}
                      </span>
                    ))}
                    <span className="text-[#e8fa07] font-medium">
                      #{task.taskId}
                    </span>
                    <span className="text-gray-500">→ 새 편집</span>
                  </div>
                </div>
              </div>
            )}

          {/* Original Image Preview */}
          {imageUrl && (
            <div className="mb-4">
              <h3 className="text-white text-sm font-medium mb-2">
                현재 결과 이미지
              </h3>
              <div className="w-full h-[200px] bg-[#4a4a4b] rounded-lg overflow-hidden">
                <img
                  src={imageUrl}
                  alt="현재 결과 이미지"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.innerHTML = `
                      <div class="w-full h-full flex items-center justify-center text-gray-400">
                        <div class="text-center">
                          <div class="text-sm">이미지를 불러올 수 없습니다</div>
                        </div>
                      </div>
                    `;
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Edit Prompt Input */}
        <div className="mb-6">
          <label className="block text-white text-sm font-medium mb-2">
            수정할 내용을 설명해주세요
          </label>
          <textarea
            value={editPrompt}
            onChange={(e) => setEditPrompt(e.target.value)}
            placeholder="예: 배경을 해변으로 변경, 의상을 정장으로 변경"
            className="w-full h-32 px-4 py-3 bg-[#1a1d21] border border-[#4a4a4b] rounded-lg text-white placeholder-gray-400 resize-none focus:outline-none focus:border-[#e8fa07] transition-colors"
            disabled={isSubmitting}
            maxLength={500}
          />
          <div className="text-right text-xs text-gray-400 mt-1">
            {editPrompt.length}/500
          </div>

          {/* Guidance Notice */}
          <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-start gap-2 text-blue-300 text-xs">
              <span className="text-lg">ℹ️</span>
              <div className="space-y-1">
                <p>• 얼굴과 인물은 유지되며 스타일만 변경됩니다</p>
                <p>• 자연어로 변경할 내용을 설명해주세요</p>
              </div>
            </div>
          </div>
        </div>

        {/* Credit Notice */}
        <div className="mb-6 p-4 bg-[#1a1d21] border border-[#4a4a4b] rounded-lg">
          <div className="flex items-center gap-2 text-yellow-400 text-sm">
            <span>💡</span>
            <span>수정하기에도 크레딧이 소모됩니다.</span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-3 justify-end">
          <button
            onClick={handleClose}
            className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
            disabled={isSubmitting}
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={!editPrompt.trim() || isSubmitting}
            className="flex items-center gap-2 px-6 py-2 bg-[#e8fa07] text-[#292c31] font-medium rounded-lg hover:bg-[#d4e006] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                수정 중...
              </>
            ) : (
              <>
                <Send size={16} />
                수정하기
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
