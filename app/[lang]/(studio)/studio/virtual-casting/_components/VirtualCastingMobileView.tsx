'use client';

import { useTranslation } from 'react-i18next';
import { Upload } from 'lucide-react';
import BeforeAfterToggle from '@/app/_components/ui/BeforeAfterToggle';
import MobileLoadingOverlay from '@/app/_components/ui/MobileLoadingOverlay';
import EditRequestPopup from '@/components/ui/EditRequestPopup';
import ConfirmResetPopup from '@/app/_components/ui/ConfirmResetPopup';
import { UseVirtualCastingReturn } from '../_hooks/useVirtualCasting';

interface VirtualCastingMobileViewProps {
  hook: UseVirtualCastingReturn;
  showResult: boolean;
}

export default function VirtualCastingMobileView({
  hook,
  showResult,
}: VirtualCastingMobileViewProps) {
  const { t } = useTranslation(['studio']);

  const {
    previewUrl,
    resultImage,
    isDragOver,
    isProcessing,
    isPolling,
    isEditLoading,
    isEditPopupOpen,
    isResetPopupOpen,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDownload,
    handleEditRequest,
    handleReset,
    setIsEditPopupOpen,
    setIsResetPopupOpen,
  } = hook;

  // 결과 화면 표시
  if (showResult && resultImage) {
    return (
      <>
        <BeforeAfterToggle
          beforeImage={previewUrl || '/placeholder-image.png'}
          afterImage={resultImage}
          onDownload={handleDownload}
          onEdit={() => setIsEditPopupOpen(true)}
          onReset={() => setIsResetPopupOpen(true)}
          showEditButton={true}
          editButtonText={t('virtualCasting.edit')}
          isEditLoading={isEditLoading}
        />
        <MobileLoadingOverlay
          isVisible={isProcessing || isPolling || isEditLoading}
          title={
            isEditLoading
              ? t('virtualCasting.editing')
              : t('virtualCasting.generatingTitle')
          }
          description={
            isEditLoading
              ? t('virtualCasting.pleaseWait')
              : t('virtualCasting.generatingDescription')
          }
        />
        <EditRequestPopup
          isOpen={isEditPopupOpen}
          onClose={() => setIsEditPopupOpen(false)}
          onEditRequest={handleEditRequest}
          isLoading={isEditLoading}
        />
        <ConfirmResetPopup
          isOpen={isResetPopupOpen}
          onClose={() => setIsResetPopupOpen(false)}
          onConfirm={handleReset}
        />
      </>
    );
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      hook.handleFileUpload(file);
    }
  };

  return (
    <div className="flex flex-col flex-1 bg-studio-content pb-[200px]">
      <div className="px-4 pt-6">
        <div className="text-studio-text-primary text-base font-pretendard-semibold mb-4">
          {t('virtualCasting.uploadImageTitle')}
        </div>

        <div
          className={`flex flex-col aspect-square w-full items-center justify-center bg-black rounded-[20px] transition-all duration-200 ease-out ${
            resultImage || isProcessing || isPolling
              ? 'cursor-not-allowed opacity-60'
              : 'cursor-pointer'
          } ${!previewUrl ? 'border-2 border-dashed' : ''} ${
            isDragOver && !(resultImage || isProcessing || isPolling)
              ? 'border-studio-button-primary scale-[1.02]'
              : 'border-studio-border hover:border-studio-button-primary/50'
          }`}
          onDragOver={
            resultImage || isProcessing || isPolling
              ? undefined
              : handleDragOver
          }
          onDragLeave={
            resultImage || isProcessing || isPolling
              ? undefined
              : handleDragLeave
          }
          onDrop={
            resultImage || isProcessing || isPolling ? undefined : handleDrop
          }
          onClick={
            resultImage || isProcessing || isPolling
              ? undefined
              : () => document.getElementById('mobile-file-upload')?.click()
          }
        >
          {previewUrl ? (
            <img
              className="w-full h-full object-contain rounded-[20px]"
              alt="Uploaded preview"
              src={previewUrl}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <Upload
                className={`w-8 h-8 mb-3 transition-all duration-200 ${
                  isDragOver
                    ? 'text-studio-button-primary scale-110'
                    : 'text-studio-text-secondary'
                }`}
              />
              <div
                className={`text-sm mb-1 font-pretendard-medium transition-colors duration-200 ${
                  isDragOver
                    ? 'text-studio-button-primary'
                    : 'text-studio-text-secondary'
                }`}
              >
                {isDragOver
                  ? t('virtualCasting.dropFile')
                  : t('virtualCasting.dragFileHere')}
              </div>
              <div className="text-studio-text-muted text-xs font-pretendard">
                {t('virtualCasting.fileSizeLimit')}
              </div>
            </div>
          )}
        </div>

        <input
          id="mobile-file-upload"
          type="file"
          accept="image/png,image/jpg,image/jpeg"
          onChange={handleInputChange}
          className="hidden"
        />
      </div>

      <MobileLoadingOverlay
        isVisible={isProcessing || isPolling || isEditLoading}
        title={
          isEditLoading
            ? t('virtualCasting.editing')
            : t('virtualCasting.generatingTitle')
        }
        description={
          isEditLoading
            ? t('virtualCasting.pleaseWait')
            : t('virtualCasting.generatingDescription')
        }
      />

      <EditRequestPopup
        isOpen={isEditPopupOpen}
        onClose={() => setIsEditPopupOpen(false)}
        onEditRequest={handleEditRequest}
        isLoading={isEditLoading}
      />

      <ConfirmResetPopup
        isOpen={isResetPopupOpen}
        onClose={() => setIsResetPopupOpen(false)}
        onConfirm={handleReset}
      />
    </div>
  );
}
