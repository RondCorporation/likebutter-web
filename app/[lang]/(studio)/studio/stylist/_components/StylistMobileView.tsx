'use client';

import { useTranslation } from 'react-i18next';
import { Upload, X } from 'lucide-react';
import BeforeAfterToggle from '@/app/_components/ui/BeforeAfterToggle';
import MobileLoadingOverlay from '@/app/_components/ui/MobileLoadingOverlay';
import EditRequestPopup from '@/components/ui/EditRequestPopup';
import ConfirmResetPopup from '@/app/_components/ui/ConfirmResetPopup';
import { UseStylistReturn, StylistFormData } from '../_hooks/useStylist';

interface StylistMobileViewProps {
  hook: UseStylistReturn;
  showResult: boolean;
  formData?: StylistFormData;
}

export default function StylistMobileView({
  hook,
  showResult,
  formData,
}: StylistMobileViewProps) {
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
    additionalImagePreviews,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDownload,
    handleEditRequest,
    handleReset,
    handleAdditionalFileUpload,
    handleAdditionalFileRemove,
    getImageUploadSlots,
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
          editButtonText={t('stylist.edit')}
          isEditLoading={isEditLoading}
        />
        <MobileLoadingOverlay
          isVisible={isProcessing || isPolling || isEditLoading}
          title={
            isEditLoading
              ? t('stylist.editing')
              : t('stylist.stylingInProgress')
          }
          description={
            isEditLoading
              ? t('stylist.pleaseWait')
              : t('stylist.pleaseWaitForResults')
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
    <div className="flex flex-col flex-1 bg-studio-content min-h-full">
      {formData?.mode === 'image' &&
        formData.imageSettings &&
        getImageUploadSlots(formData).length > 0 && (
          <div className="px-4 pt-6">
            <div className="grid grid-cols-3 gap-2 mb-4">
              {getImageUploadSlots(formData).map((slot) => (
                <div key={slot.id} className="flex flex-col">
                  <div
                    className={`relative flex flex-col h-[80px] w-full items-center justify-center bg-black rounded-[12px] transition-all duration-200 ease-out cursor-pointer ${
                      !slot.previewUrl ? 'border-2 border-dashed' : ''
                    } ${
                      additionalImagePreviews[slot.id]
                        ? 'border-studio-button-primary'
                        : 'border-studio-border hover:border-studio-button-primary/50'
                    }`}
                    onClick={() =>
                      document.getElementById(`${slot.id}-upload`)?.click()
                    }
                  >
                    {slot.previewUrl ? (
                      <>
                        <img
                          className="w-full h-full object-cover rounded-[12px]"
                          alt={`${slot.label} preview`}
                          src={slot.previewUrl}
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAdditionalFileRemove(slot.id, formData);
                          }}
                          className="absolute top-1 right-1 w-4 h-4 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors duration-200"
                        >
                          <X className="w-2 h-2 text-white" />
                        </button>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-center p-1">
                        <Upload className="w-3 h-3 mb-1 text-studio-text-secondary" />
                        <div className="text-[10px] font-pretendard-medium text-studio-text-secondary">
                          {slot.label}
                        </div>
                      </div>
                    )}
                  </div>

                  <input
                    id={`${slot.id}-upload`}
                    type="file"
                    accept="image/png,image/jpg,image/jpeg"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleAdditionalFileUpload(slot.id, file, formData);
                      }
                    }}
                    className="hidden"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

      {/* 메인 이미지 업로드 영역 - 상단에 배치 */}
      <div className="px-4 pt-6 pb-12">
        <div className="text-studio-text-primary text-base font-pretendard-semibold mb-4">
          {t('stylist.uploadImageTitle')}
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
                {isDragOver ? t('stylist.dropFile') : t('stylist.tapToSelect')}
              </div>
              <div className="text-studio-text-muted text-xs font-pretendard">
                {t('stylist.fileSizeLimit')}
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
          isEditLoading ? t('stylist.editing') : t('stylist.stylingInProgress')
        }
        description={
          isEditLoading
            ? t('stylist.pleaseWait')
            : t('stylist.pleaseWaitForResults')
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
