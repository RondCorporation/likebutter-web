'use client';

import { useState } from 'react';
import { X, Send, Loader2 } from 'lucide-react';
import { Task, ActionType } from '@/types/task';
import { editTask } from '@/lib/apis/task.api';

interface Props {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newTaskId: number) => void;
}

export default function EditTaskModal({ task, isOpen, onClose, onSuccess }: Props) {
  const [editPrompt, setEditPrompt] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!editPrompt.trim()) {
      setError('수정할 내용을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await editTask(task.taskId, task.actionType, editPrompt.trim());
      if (response.success && response.data) {
        onSuccess(response.data.taskId);
        handleClose();
      } else {
        setError(response.msg || '수정 요청 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('Edit task error:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('수정 요청 중 오류가 발생했습니다.');
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
      DIGITAL_GOODS: '디지털 굿즈',
      FANMEETING_STUDIO: '팬미팅 스튜디오',
      STYLIST: 'AI 스타일리스트',
      VIRTUAL_CASTING: '가상 캐스팅',
    };
    return labels[actionType] || actionType;
  };

  const getResultImageUrl = (task: Task): string | null => {
    if (!task.details?.result) return null;

    switch (task.actionType) {
      case 'DIGITAL_GOODS':
        return task.details.result.imageUrl || null;
      case 'FANMEETING_STUDIO':
        return task.details.result.imageUrl || null;
      case 'STYLIST':
        return task.details.result.imageUrl || null;
      case 'VIRTUAL_CASTING':
        return task.details.result.imageUrl || null;
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  const imageUrl = getResultImageUrl(task);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#25282c] border border-[#4a4a4b] rounded-xl p-6 mx-4 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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
            <span className="text-gray-400 text-sm">
              Task #{task.taskId}
            </span>
          </div>

          {/* Original Image Preview */}
          {imageUrl && (
            <div className="mb-4">
              <h3 className="text-white text-sm font-medium mb-2">원본 이미지</h3>
              <div className="w-full h-[200px] bg-[#4a4a4b] rounded-lg overflow-hidden">
                <img
                  src={imageUrl}
                  alt="원본 이미지"
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
            placeholder="예: 배경을 더 밝게 하고 꽃을 추가해주세요"
            className="w-full h-32 px-4 py-3 bg-[#1a1d21] border border-[#4a4a4b] rounded-lg text-white placeholder-gray-400 resize-none focus:outline-none focus:border-[#e8fa07] transition-colors"
            disabled={isSubmitting}
            maxLength={500}
          />
          <div className="text-right text-xs text-gray-400 mt-1">
            {editPrompt.length}/500
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