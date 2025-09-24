'use client';

import { useState } from 'react';
import BasePopup from './BasePopup';
import StudioButton from '../../[lang]/(studio)/studio/_components/ui/StudioButton';
import { useTranslation } from 'react-i18next';

interface EditRequestPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onEditRequest: (request: string) => void;
  isLoading?: boolean;
}

export default function EditRequestPopup({
  isOpen,
  onClose,
  onEditRequest,
  isLoading = false,
}: EditRequestPopupProps) {
  const { t } = useTranslation('studio');
  const [editRequest, setEditRequest] = useState('');

  const handleSubmit = () => {
    if (editRequest.trim().length < 10) {
      return;
    }
    onEditRequest(editRequest.trim());
    setEditRequest('');
    onClose();
  };

  const handleClose = () => {
    setEditRequest('');
    onClose();
  };

  return (
    <BasePopup
      isOpen={isOpen}
      onClose={handleClose}
      title={t('editRequest.title')}
      className="!w-full !max-w-[500px] !h-auto"
    >
      <div className="flex flex-col gap-6 flex-1">
        <div className="flex flex-col gap-3">
          <label className="font-semibold text-studio-text-primary text-sm">
            {t('editRequest.label')}
          </label>
          <textarea
            value={editRequest}
            onChange={(e) => setEditRequest(e.target.value)}
            placeholder={t('editRequest.placeholder')}
            className="w-full h-32 p-4 bg-studio-content border border-studio-border rounded-lg text-studio-text-primary placeholder-studio-text-muted resize-none focus:outline-none focus:border-studio-button-primary transition-colors"
            disabled={isLoading}
          />
          <div className="text-xs text-studio-text-muted">
            {t('editRequest.charCount', { count: editRequest.length })}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1 h-12 bg-studio-content border border-studio-border text-studio-text-primary rounded-md hover:bg-studio-border transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('editRequest.cancel')}
          </button>
          <StudioButton
            text={
              isLoading ? t('editRequest.processing') : t('editRequest.submit')
            }
            onClick={handleSubmit}
            disabled={editRequest.trim().length < 10 || isLoading}
            loading={isLoading}
            className="!flex-1"
          />
        </div>
      </div>
    </BasePopup>
  );
}
