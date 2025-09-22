'use client';

import { X } from 'lucide-react';

interface Props {
  taskCount?: number;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export default function DeleteConfirmModal({
  taskCount,
  isOpen,
  onClose,
  onConfirm,
  isDeleting = false,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-lg mx-4 bg-[#25282c] border border-white/10 rounded-2xl p-8">
        {/* Close button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="p-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
            <X className="h-8 w-8 text-black" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-xl font-medium text-white">
            이미지를 삭제하시겠습니까?
          </h2>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 font-medium"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 px-6 py-3 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50 font-medium"
          >
            {isDeleting ? '삭제 중...' : '삭제'}
          </button>
        </div>
      </div>
    </div>
  );
}
