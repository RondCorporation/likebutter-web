'use client';

import { useState } from 'react';
import BasePopup from './BasePopup';
import PrimaryButton from '../../[lang]/(studio)/studio/_components/ui/PrimaryButton';

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
      title="굿즈 수정 요청"
      className="!w-full !max-w-[500px] !h-auto"
    >
      <div className="flex flex-col gap-6 flex-1">
        <div className="flex flex-col gap-3">
          <label className="font-semibold text-studio-text-primary text-sm">
            수정 요청 사항
          </label>
          <textarea
            value={editRequest}
            onChange={(e) => setEditRequest(e.target.value)}
            placeholder="어떤 부분을 수정하고 싶으신지 구체적으로 설명해주세요. (최소 10자)"
            className="w-full h-32 p-4 bg-studio-content border border-studio-border rounded-lg text-studio-text-primary placeholder-studio-text-muted resize-none focus:outline-none focus:border-studio-button-primary transition-colors"
            disabled={isLoading}
          />
          <div className="text-xs text-studio-text-muted">
            {editRequest.length}/1000자 (최소 10자 이상)
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1 h-12 bg-studio-content border border-studio-border text-studio-text-primary rounded-md hover:bg-studio-border transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            취소
          </button>
          <PrimaryButton
            text={isLoading ? '처리중...' : '수정하기'}
            onClick={handleSubmit}
            disabled={editRequest.trim().length < 10 || isLoading}
            className="!flex-1"
          />
        </div>
      </div>
    </BasePopup>
  );
}