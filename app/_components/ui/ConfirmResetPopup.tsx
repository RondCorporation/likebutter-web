'use client';

import { X } from 'lucide-react';
import StudioButton from '@/app/[lang]/(studio)/studio/_components/ui/StudioButton';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation('studio');

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-[90vw] max-w-[400px] bg-studio-sidebar border border-solid border-studio-border rounded-xl p-6 flex flex-col gap-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex-1 text-center font-bold text-studio-text-primary text-lg">
            {t('confirmReset.title')}
          </div>
          <button
            onClick={onClose}
            className="text-studio-text-primary hover:text-studio-text-secondary"
          >
            <X size={20} />
          </button>
        </div>

        <div className="text-center text-studio-text-primary">
          {t('confirmReset.messageLine1')}
          <br />
          {t('confirmReset.messageLine2')}
          <br />
          {t('confirmReset.messageLine3')}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 h-12 border border-studio-border rounded-xl text-studio-text-primary hover:bg-studio-border/50 transition-colors duration-200 disabled:opacity-50"
          >
            {t('confirmReset.cancel')}
          </button>
          <StudioButton
            text={t('confirmReset.confirm')}
            onClick={onConfirm}
            disabled={isLoading}
            loading={isLoading}
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
}
