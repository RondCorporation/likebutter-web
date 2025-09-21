'use client';

import { X, AlertTriangle } from 'lucide-react';
import { Task } from '@/types/task';

interface Props {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export default function DeleteConfirmModal({
  task,
  isOpen,
  onClose,
  onConfirm,
  isDeleting = false,
}: Props) {
  if (!isOpen) return null;

  const getActionTypeLabel = (actionType: string) => {
    const labels: { [key: string]: string } = {
      DIGITAL_GOODS: '디지털 굿즈',
      BUTTER_COVER: '버터 커버',
      FANMEETING_STUDIO: '팬미팅 스튜디오',
      PHOTO_EDITOR: '포토 에디터',
      STYLIST: 'AI 스타일리스트',
      DREAM_CONTI: '드림 컨티',
      VIRTUAL_CASTING: '가상 캐스팅',
    };
    return labels[actionType] || actionType;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md mx-4 bg-[#25282c] border border-white/10 rounded-2xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">작업 삭제</h2>
          </div>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="p-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mb-6">
          <p className="text-gray-300 mb-4">
            다음 작업을 정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
          </p>

          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-white">
                {getActionTypeLabel(task.actionType)}
              </span>
              <span className="text-xs text-gray-400">
                Task #{task.taskId}
              </span>
            </div>
            <div className="text-sm text-gray-400">
              {formatDate(task.createdAt)} 생성
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            {isDeleting ? '삭제 중...' : '삭제'}
          </button>
        </div>
      </div>
    </div>
  );
}