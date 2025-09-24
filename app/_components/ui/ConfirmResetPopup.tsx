'use client';

import BasePopup from './BasePopup';
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

  return (
    <BasePopup
      isOpen={isOpen}
      onClose={onClose}
      title={t('confirmReset.title')}
    >
      <div className="flex flex-col gap-6">
        <div className="text-center text-studio-text-primary">
          {t('confirmReset.messageLine1')}
          <br />
          {t('confirmReset.messageLine2')}
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
    </BasePopup>
  );
}
