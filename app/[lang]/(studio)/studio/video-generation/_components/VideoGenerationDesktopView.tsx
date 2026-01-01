'use client';

import { useTranslation } from 'react-i18next';
import {
  HelpCircle,
  Upload,
  Download,
  Loader2,
  RotateCcw,
} from 'lucide-react';
import StudioButton from '../../_components/ui/StudioButton';
import ConfirmResetPopup from '@/app/_components/ui/ConfirmResetPopup';
import { CREDIT_COSTS } from '@/app/_lib/apis/credit.api';
import {
  UseVideoGenerationReturn,
  VideoGenerationFormData,
} from '../_hooks/useVideoGeneration';

interface VideoGenerationDesktopViewProps {
  hook: UseVideoGenerationReturn;
  formData: VideoGenerationFormData;
}

export default function VideoGenerationDesktopView({
  hook,
  formData,
}: VideoGenerationDesktopViewProps) {
  const { t } = useTranslation(['studio']);

  const {
    previewUrl,
    isDragOver,
    isGenerating,
    resultVideo,
    isPolling,
    isBackgroundProcessing,
    isResetPopupOpen,
    handleFileUpload,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleGenerate,
    handleDownload,
    handleReset,
    isFormValid,
    setIsResetPopupOpen,
    checkTaskStatus,
    currentTaskId,
  } = hook;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  return (
    <div className="flex flex-col flex-1 h-full bg-studio-content">
      {/* Header */}
      <div className="flex items-center justify-between px-4 md:px-12 pb-0 pt-6 sticky top-0 bg-studio-content z-10 border-b border-studio-border/50 backdrop-blur-sm">
        <div className="flex-1 text-xl font-bold leading-7 font-pretendard bg-gradient-to-r from-[#FFCC00] to-[#E8FA07] bg-clip-text text-transparent">
          {t('videoGeneration.title')}
        </div>

        {/* PC-only buttons */}
        <div className="items-center gap-2 hidden md:flex">
          {resultVideo ? (
            <button
              onClick={() => setIsResetPopupOpen(true)}
              className="inline-flex items-center overflow-hidden rounded-md justify-center border border-solid border-studio-button-primary px-3 md:px-5 py-2.5 h-[38px] hover:bg-studio-button-primary/10 active:scale-95 transition-all duration-200"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              <div className="text-studio-button-primary text-xs md:text-sm font-bold leading-[14px] whitespace-nowrap font-pretendard-bold">
                {t('videoGeneration.resetWork')}
              </div>
            </button>
          ) : (
            <StudioButton
              text={
                isGenerating || isPolling
                  ? t('videoGeneration.generating')
                  : t('videoGeneration.generate')
              }
              onClick={() => handleGenerate(formData)}
              disabled={isGenerating || isPolling || !isFormValid(formData)}
              loading={isGenerating || isPolling}
              creditCost={CREDIT_COSTS.VIDEO_GENERATION}
              className="px-3 md:px-5 py-2.5 h-[38px] text-xs md:text-sm"
              textClassName="font-bold leading-[14px] font-pretendard-bold !text-studio-header"
            />
          )}
        </div>
      </div>

      {/* Main Content */}
      <div
        className="flex flex-col md:flex-row flex-1 items-start gap-4 md:gap-6 self-stretch w-full px-4 md:px-12 pt-4 md:pt-6 md:h-[calc(100dvh-180px)] md:overflow-hidden"
        style={{
          paddingBottom:
            'max(120px, calc(100px + env(safe-area-inset-bottom)))',
        }}
      >
        {/* Left Panel - Image Upload */}
        <div
          className="flex flex-col w-full md:w-[330px] md:h-[calc(100dvh-180px)] md:max-h-[calc(100dvh-180px)] md:min-h-0 bg-transparent md:bg-studio-border rounded-[20px] p-[15px] gap-[18px] md:shadow-sm md:overflow-y-auto"
          style={{
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain',
          }}
        >
          {/* Drag and drop area */}
          <div
            className={`flex flex-col h-[280px] w-full items-center justify-center bg-black rounded-[20px] transition-all duration-200 ease-out flex-shrink-0 ${
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
                : () => document.getElementById('video-gen-file-upload')?.click()
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
                    : t('videoGeneration.dragAndDrop')}
                </div>
                <div className="text-studio-text-muted text-xs font-pretendard">
                  {t('videoGeneration.fileSizeLimit')}
                </div>
              </div>
            )}
          </div>

          {/* Browse file button (PC only) */}
          <button
            onClick={
              resultVideo || isGenerating || isPolling
                ? undefined
                : () => document.getElementById('video-gen-file-upload')?.click()
            }
            disabled={!!resultVideo || isGenerating || isPolling}
            className="w-full h-[38px] bg-[#414141] hover:bg-[#515151] active:bg-[#313131] rounded-md flex items-center justify-center transition-all duration-200 flex-shrink-0 active:scale-[0.98] hidden md:flex disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#414141]"
          >
            <div className="text-studio-text-secondary text-xs font-semibold font-pretendard">
              {t('videoGeneration.uploadFile')}
            </div>
          </button>

          <input
            id="video-gen-file-upload"
            type="file"
            accept="image/png,image/jpg,image/jpeg"
            onChange={handleInputChange}
            className="hidden"
          />
        </div>

        {/* Right Panel - Result area (PC only) */}
        <div
          className="relative w-full md:flex-1 md:h-[calc(100dvh-180px)] md:flex-shrink-0 bg-studio-border rounded-[20px] min-h-[300px] md:min-h-0 shadow-sm md:overflow-hidden hidden md:block"
          style={{
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain',
          }}
        >
          <div className="flex flex-col items-center justify-center gap-2.5 p-2.5 absolute top-[15px] left-[15px] right-[15px] bottom-[15px] bg-studio-header rounded-[20px] border border-dashed border-studio-header">
            {(isGenerating || isPolling) && !resultVideo ? (
              <div className="flex flex-col items-center justify-center gap-4 w-full h-full">
                <Loader2 className="w-12 h-12 animate-spin text-studio-button-primary" />
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className="text-studio-text-primary text-base font-pretendard-medium">
                    {isGenerating
                      ? t('videoGeneration.generationInProgress')
                      : t('videoGeneration.generating')}
                  </div>
                  <div className="text-studio-text-muted text-sm font-pretendard">
                    {t('videoGeneration.pleaseWait')}
                  </div>
                  <div className="text-studio-text-muted text-xs font-pretendard mt-2">
                    {t('videoGeneration.estimatedTime')}
                  </div>
                </div>
              </div>
            ) : resultVideo ? (
              <div className="relative w-full h-full group">
                <video
                  src={resultVideo}
                  controls
                  autoPlay
                  loop
                  className="w-full h-full object-contain rounded-[20px]"
                />
                {/* PC download icon - top right */}
                <button
                  onClick={handleDownload}
                  className="absolute top-4 right-4 w-10 h-10 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 backdrop-blur-sm"
                >
                  <Download className="w-5 h-5 text-white" />
                </button>
              </div>
            ) : isBackgroundProcessing ? (
              <div className="flex flex-col items-center justify-center gap-4 w-full h-full">
                <div className="flex flex-col items-center gap-2 text-center text-blue-400">
                  <div className="text-base font-pretendard-medium">
                    {t('videoGeneration.backgroundProcessing')}
                  </div>
                  <div className="text-sm font-pretendard max-w-[200px]">
                    {t('videoGeneration.takingLong')}
                  </div>
                  <button
                    onClick={() =>
                      currentTaskId && checkTaskStatus(currentTaskId)
                    }
                    className="mt-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-pretendard-medium rounded-lg transition-colors"
                  >
                    {t('videoGeneration.checkStatus')}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center w-full h-full">
                <div className="flex flex-col items-center text-center">
                  <HelpCircle className="w-12 h-12 text-studio-text-muted mb-4" />
                  <div className="font-pretendard-medium text-studio-text-secondary text-base leading-6 mb-2">
                    {t('videoGeneration.resultVideo')}
                  </div>
                  <div className="font-pretendard text-studio-text-muted text-xs leading-[18px]">
                    {t('videoGeneration.completeSettings')}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Popups */}
      <ConfirmResetPopup
        isOpen={isResetPopupOpen}
        onClose={() => setIsResetPopupOpen(false)}
        onConfirm={handleReset}
      />
    </div>
  );
}
