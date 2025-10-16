'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter, usePathname } from 'next/navigation';
import { X, Send, Loader2 } from 'lucide-react';
import { Task, ActionType } from '@/types/task';
import { editTask } from '@/lib/apis/task.api';
import { useTranslation } from 'react-i18next';
import { useScrollLock } from '@/hooks/useScrollLock';
import Image from 'next/image';

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
  const router = useRouter();
  const pathname = usePathname();
  const lang = pathname.split('/')[1];
  const [editPrompt, setEditPrompt] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useScrollLock(isOpen);

  useEffect(() => {
    setMounted(true);
  }, []);

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

      if ((response as any).isInsufficientCredit) {
        handleClose();
        router.push(`/${lang}/billing`);
        // TODO: 플랜에 따라 이미 구독된 사람이면 크레딧 결제 쪽으로 이동하는 부분 고려하기
        return;
      }

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

  if (!isOpen || !mounted) return null;

  const imageUrl = getResultImageUrl(task);

  const modalContent = (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative bg-[#25282c] border border-[#4a4a4b] rounded-xl w-full max-w-xl max-h-[65vh] md:max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#4a4a4b]">
          <h2 className="text-lg font-bold text-white">
            {t('editTaskModal.title')}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
            disabled={isSubmitting}
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Edit History Chain */}
          {task.parentTaskId &&
            task.editSequence !== undefined &&
            task.editSequence !== null && (
              <div className="mb-4 p-3 bg-[#1a1d21] border border-[#4a4a4b] rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-400">
                    {t('editTaskModal.editChain')}
                  </span>
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
                    <span className="text-gray-500">
                      → {t('editTaskModal.newEdit')}
                    </span>
                  </div>
                </div>
              </div>
            )}

          {/* Original Image Preview */}
          {imageUrl && (
            <div className="mb-4">
              <h3 className="text-white text-sm font-medium mb-2">
                {t('editTaskModal.currentResultImage')}
              </h3>
              <div className="flex justify-center">
                <div className="w-[280px] h-[280px] bg-[#4a4a4b] rounded-lg overflow-hidden flex items-center justify-center">
                  <img
                    src={imageUrl}
                    alt={t('editTaskModal.currentResultImage')}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.innerHTML = `
                        <div class="w-full h-full flex items-center justify-center text-gray-400">
                          <div class="text-center">
                            <div class="text-sm">${t('editTaskModal.imageLoadError')}</div>
                          </div>
                        </div>
                      `;
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Edit Prompt Input */}
          <div className="mb-6">
            <label className="block text-white text-sm font-medium mb-2">
              {t('editTaskModal.editLabel')}
            </label>
            <textarea
              value={editPrompt}
              onChange={(e) => setEditPrompt(e.target.value)}
              placeholder={t('editTaskModal.editPlaceholder')}
              className="w-full h-32 px-4 py-3 bg-[#1a1d21] border border-[#4a4a4b] rounded-lg text-white placeholder-gray-400 resize-none focus:outline-none focus:border-[#e8fa07] transition-colors"
              disabled={isSubmitting}
              maxLength={500}
            />
            <div className="text-right text-xs text-gray-400 mt-1">
              {editPrompt.length}/500
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Floating Button at Bottom */}
        <div className="px-6 py-4 border-t border-[#4a4a4b] bg-[#25282c]">
          <button
            onClick={handleSubmit}
            disabled={!editPrompt.trim() || isSubmitting}
            className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-[#ffd83b] hover:bg-[#f7c80d] text-black font-semibold rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                {t('editTaskModal.editing')}
              </>
            ) : (
              <>
                <Send size={16} />
                {t('editTaskModal.edit')}
                <div className="flex items-center gap-1 px-2 py-1 rounded-[20px] bg-[rgba(232,250,7,0.62)] flex-shrink-0 ml-1">
                  <Image
                    src="/credit_black.svg"
                    alt="Credit"
                    width={12}
                    height={12}
                    className="flex-shrink-0"
                    style={{ width: 'auto', height: 'auto' }}
                  />
                  <span className="text-xs font-medium text-black">-3</span>
                </div>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
