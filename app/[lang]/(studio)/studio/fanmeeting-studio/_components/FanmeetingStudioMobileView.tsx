'use client';

import { useTranslation } from 'react-i18next';
import { Upload, Plus } from 'lucide-react';
import BeforeAfterToggle from '@/app/_components/ui/BeforeAfterToggle';
import MobileLoadingOverlay from '@/app/_components/ui/MobileLoadingOverlay';
import EditRequestPopup from '@/components/ui/EditRequestPopup';
import ConfirmResetPopup from '@/app/_components/ui/ConfirmResetPopup';
import { UseFanmeetingStudioReturn } from '../_hooks/useFanmeetingStudio';

interface FanmeetingStudioMobileViewProps {
  hook: UseFanmeetingStudioReturn;
  showResult: boolean;
}

export default function FanmeetingStudioMobileView({
  hook,
  showResult,
}: FanmeetingStudioMobileViewProps) {
  const { t } = useTranslation(['studio']);

  const {
    idolPreviewUrl,
    userPreviewUrl,
    resultImage,
    isDragOverIdol,
    isDragOverUser,
    isProcessing,
    isPolling,
    isEditLoading,
    isEditPopupOpen,
    isResetPopupOpen,
    setIsDragOverIdol,
    setIsDragOverUser,
    handleDragOver,
    handleDragLeave,
    handleDropIdol,
    handleDropUser,
    handleDownload,
    handleEditRequest,
    handleReset,
    setIsEditPopupOpen,
    setIsResetPopupOpen,
    handleFileUpload,
  } = hook;

  // 결과 화면 표시
  if (showResult && resultImage) {
    const beforeImage =
      userPreviewUrl || idolPreviewUrl || '/placeholder-image.png';

    return (
      <>
        <BeforeAfterToggle
          beforeImage={beforeImage}
          afterImage={resultImage}
          onDownload={handleDownload}
          onEdit={() => setIsEditPopupOpen(true)}
          onReset={() => setIsResetPopupOpen(true)}
          showEditButton={true}
          editButtonText={t('fanmeeting.edit')}
          isEditLoading={isEditLoading}
        />
        <MobileLoadingOverlay
          isVisible={isProcessing || isPolling || isEditLoading}
          title={
            isEditLoading
              ? t('fanmeeting.editing')
              : t('fanmeeting.generatingTitle')
          }
          description={
            isEditLoading
              ? t('fanmeeting.pleaseWait')
              : t('fanmeeting.generatingDescription')
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

  const handleIdolInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file, 'idol');
    }
  };

  const handleUserInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file, 'user');
    }
  };

  return (
    <div className="flex flex-col flex-1 bg-studio-content min-h-screen pb-[200px]">
      <div className="px-4 pt-6">
        <div className="text-studio-text-primary text-base font-pretendard-semibold mb-4">
          {t('fanmeeting.uploadImageTitle')}
        </div>

        <div className="flex items-center gap-2 mb-3">
          <div className="text-studio-text-primary text-xs font-pretendard-medium flex-1 text-center">
            {t('fanmeeting.idolPhoto')}
          </div>
          <div className="w-6"></div>
          <div className="text-studio-text-primary text-xs font-pretendard-medium flex-1 text-center">
            {t('fanmeeting.myPhoto')}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Idol Image Upload */}
          <div
            className={`flex flex-col h-[140px] w-full flex-1 items-center justify-center bg-black rounded-[16px] transition-all duration-200 ease-out ${
              resultImage || isProcessing || isPolling
                ? 'cursor-not-allowed opacity-60'
                : 'cursor-pointer'
            } ${!idolPreviewUrl ? 'border-2 border-dashed' : ''} ${
              isDragOverIdol && !(resultImage || isProcessing || isPolling)
                ? 'border-studio-button-primary scale-[1.02]'
                : 'border-studio-border hover:border-studio-button-primary/50'
            }`}
            onDragOver={
              resultImage || isProcessing || isPolling
                ? undefined
                : (e) => {
                    handleDragOver(e);
                    setIsDragOverIdol(true);
                  }
            }
            onDragLeave={
              resultImage || isProcessing || isPolling
                ? undefined
                : (e) => {
                    handleDragLeave(e);
                    setIsDragOverIdol(false);
                  }
            }
            onDrop={
              resultImage || isProcessing || isPolling
                ? undefined
                : handleDropIdol
            }
            onClick={
              resultImage || isProcessing || isPolling
                ? undefined
                : () => document.getElementById('mobile-idol-upload')?.click()
            }
          >
            {idolPreviewUrl ? (
              <img
                className="w-full h-full object-contain rounded-[16px]"
                alt="Idol preview"
                src={idolPreviewUrl}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-2">
                <Upload
                  className={`w-5 h-5 mb-1 transition-all duration-200 ${
                    isDragOverIdol
                      ? 'text-studio-button-primary scale-110'
                      : 'text-studio-text-secondary'
                  }`}
                />
                <div
                  className={`text-xs font-pretendard-medium transition-colors duration-200 ${
                    isDragOverIdol
                      ? 'text-studio-button-primary'
                      : 'text-studio-text-secondary'
                  }`}
                >
                  {isDragOverIdol
                    ? t('fanmeeting.dropHere')
                    : t('fanmeeting.idolPhoto')}
                </div>
                {!isDragOverIdol && (
                  <div className="text-studio-text-muted text-[10px] font-pretendard mt-1">
                    {t('fanmeeting.fileSizeLimit')}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Plus Icon */}
          <div className="flex items-center justify-center flex-shrink-0">
            <Plus className="w-5 h-5 text-studio-text-secondary" />
          </div>

          {/* User Image Upload */}
          <div
            className={`flex flex-col h-[140px] w-full flex-1 items-center justify-center bg-black rounded-[16px] transition-all duration-200 ease-out ${
              resultImage || isProcessing || isPolling
                ? 'cursor-not-allowed opacity-60'
                : 'cursor-pointer'
            } ${!userPreviewUrl ? 'border-2 border-dashed' : ''} ${
              isDragOverUser && !(resultImage || isProcessing || isPolling)
                ? 'border-studio-button-primary scale-[1.02]'
                : 'border-studio-border hover:border-studio-button-primary/50'
            }`}
            onDragOver={
              resultImage || isProcessing || isPolling
                ? undefined
                : (e) => {
                    handleDragOver(e);
                    setIsDragOverUser(true);
                  }
            }
            onDragLeave={
              resultImage || isProcessing || isPolling
                ? undefined
                : (e) => {
                    handleDragLeave(e);
                    setIsDragOverUser(false);
                  }
            }
            onDrop={
              resultImage || isProcessing || isPolling
                ? undefined
                : handleDropUser
            }
            onClick={
              resultImage || isProcessing || isPolling
                ? undefined
                : () => document.getElementById('mobile-user-upload')?.click()
            }
          >
            {userPreviewUrl ? (
              <img
                className="w-full h-full object-contain rounded-[16px]"
                alt="User preview"
                src={userPreviewUrl}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-2">
                <Upload
                  className={`w-5 h-5 mb-1 transition-all duration-200 ${
                    isDragOverUser
                      ? 'text-studio-button-primary scale-110'
                      : 'text-studio-text-secondary'
                  }`}
                />
                <div
                  className={`text-xs font-pretendard-medium transition-colors duration-200 ${
                    isDragOverUser
                      ? 'text-studio-button-primary'
                      : 'text-studio-text-secondary'
                  }`}
                >
                  {isDragOverUser
                    ? t('fanmeeting.dropHere')
                    : t('fanmeeting.myPhoto')}
                </div>
                {!isDragOverUser && (
                  <div className="text-studio-text-muted text-[10px] font-pretendard mt-1">
                    {t('fanmeeting.fileSizeLimit')}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <input
          id="mobile-idol-upload"
          type="file"
          accept="image/png,image/jpg,image/jpeg"
          onChange={handleIdolInputChange}
          className="hidden"
        />

        <input
          id="mobile-user-upload"
          type="file"
          accept="image/png,image/jpg,image/jpeg"
          onChange={handleUserInputChange}
          className="hidden"
        />
      </div>

      <MobileLoadingOverlay
        isVisible={isProcessing || isPolling || isEditLoading}
        title={
          isEditLoading
            ? t('fanmeeting.editing')
            : t('fanmeeting.generatingTitle')
        }
        description={
          isEditLoading
            ? t('fanmeeting.pleaseWait')
            : t('fanmeeting.generatingDescription')
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
