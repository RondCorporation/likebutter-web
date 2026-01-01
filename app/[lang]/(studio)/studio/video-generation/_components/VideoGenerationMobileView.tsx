'use client';

import { useTranslation } from 'react-i18next';
import { Upload, Download, RotateCcw } from 'lucide-react';
import MobileLoadingOverlay from '@/app/_components/ui/MobileLoadingOverlay';
import ConfirmResetPopup from '@/app/_components/ui/ConfirmResetPopup';
import { UseVideoGenerationReturn } from '../_hooks/useVideoGeneration';

interface VideoGenerationMobileViewProps {
  hook: UseVideoGenerationReturn;
  showResult: boolean;
}

export default function VideoGenerationMobileView({
  hook,
  showResult,
}: VideoGenerationMobileViewProps) {
  const { t } = useTranslation(['studio']);

  const {
    previewUrl,
    resultVideo,
    isDragOver,
    isGenerating,
    isPolling,
    isResetPopupOpen,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDownload,
    handleReset,
    setIsResetPopupOpen,
  } = hook;

  if (showResult && resultVideo) {
    return (
      <>
        <div className="flex flex-col flex-1 bg-studio-content min-h-full">
          <div className="px-4 pt-6 pb-12">
            <div className="text-studio-text-primary text-base font-pretendard-semibold mb-4">
              {t('videoGeneration.generatedVideo')}
            </div>

            <div className="relative w-full aspect-video bg-black rounded-[20px] overflow-hidden">
              <video
                src={resultVideo}
                controls
                autoPlay
                loop
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={handleDownload}
                className="flex-1 h-12 bg-studio-button-primary rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all duration-200"
              >
                <Download className="w-5 h-5 text-black" />
                <span className="font-bold text-sm text-black">
                  {t('videoGeneration.download')}
                </span>
              </button>
              <button
                onClick={() => setIsResetPopupOpen(true)}
                className="h-12 w-12 border-2 border-studio-button-primary rounded-xl flex items-center justify-center hover:bg-studio-button-primary/10 active:scale-[0.98] transition-all duration-200"
              >
                <RotateCcw className="w-5 h-5 text-studio-button-primary" />
              </button>
            </div>
          </div>
        </div>

        <MobileLoadingOverlay
          isVisible={isGenerating || isPolling}
          title={t('videoGeneration.generationInProgress')}
          description={t('videoGeneration.pleaseWait')}
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
      <div className="px-4 pt-6 pb-12">
        <div className="text-studio-text-primary text-base font-pretendard-semibold mb-4">
          {t('videoGeneration.uploadImageTitle')}
        </div>

        <div
          className={`flex flex-col aspect-square w-full items-center justify-center bg-black rounded-[20px] transition-all duration-200 ease-out ${
            resultVideo || isGenerating || isPolling
              ? 'cursor-not-allowed opacity-60'
              : 'cursor-pointer'
          } ${!previewUrl ? 'border-2 border-dashed' : ''} ${
            isDragOver && !(resultVideo || isGenerating || isPolling)
              ? 'border-studio-button-primary scale-[1.02]'
              : 'border-studio-border hover:border-studio-button-primary/50'
          }`}
          onDragOver={
            resultVideo || isGenerating || isPolling
              ? undefined
              : handleDragOver
          }
          onDragLeave={
            resultVideo || isGenerating || isPolling
              ? undefined
              : handleDragLeave
          }
          onDrop={
            resultVideo || isGenerating || isPolling ? undefined : handleDrop
          }
          onClick={
            resultVideo || isGenerating || isPolling
              ? undefined
              : () =>
                  document
                    .getElementById('mobile-video-generation-upload')
                    ?.click()
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
                  ? t('videoGeneration.dropFile')
                  : t('videoGeneration.tapToUpload')}
              </div>
              <div className="text-studio-text-muted text-xs font-pretendard">
                {t('videoGeneration.fileSizeLimit')}
              </div>
            </div>
          )}
        </div>

        <input
          id="mobile-video-generation-upload"
          type="file"
          accept="image/png,image/jpg,image/jpeg"
          onChange={handleInputChange}
          className="hidden"
        />
      </div>

      <MobileLoadingOverlay
        isVisible={isGenerating || isPolling}
        title={t('videoGeneration.generationInProgress')}
        description={t('videoGeneration.pleaseWait')}
      />

      <ConfirmResetPopup
        isOpen={isResetPopupOpen}
        onClose={() => setIsResetPopupOpen(false)}
        onConfirm={handleReset}
      />
    </div>
  );
}
