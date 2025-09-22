'use client';

import BasePopup from './BasePopup';
import StudioButton from '@/app/[lang]/(studio)/studio/_components/ui/StudioButton';

interface ConfirmResetPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export default function ConfirmResetPopup({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: ConfirmResetPopupProps) {
  return (
    <BasePopup
      isOpen={isOpen}
      onClose={onClose}
      title="다시 만들기"
    >
      <div className="flex flex-col gap-6">
        <div className="text-center text-studio-text-primary">
          다시 만들기를 하면 현재 작업 내용이 초기화됩니다.
          <br />
          계속하시겠습니까?
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 h-12 border border-studio-border rounded-xl text-studio-text-primary hover:bg-studio-border/50 transition-colors duration-200 disabled:opacity-50"
          >
            취소
          </button>
          <StudioButton
            text="확인"
            onClick={onConfirm}
            disabled={isLoading}
            loading={isLoading}
            className="flex-1"
          />
        </div>
      </div>
    </BasePopup>
  );
}