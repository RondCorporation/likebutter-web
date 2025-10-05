'use client';

import { useTranslation } from 'react-i18next';
import {
  HelpCircle,
  Upload,
  Download,
  Loader2,
  Edit,
  RotateCcw,
  Plus,
} from 'lucide-react';
import StudioButton from '../../_components/ui/StudioButton';
import EditRequestPopup from '@/components/ui/EditRequestPopup';
import ConfirmResetPopup from '@/app/_components/ui/ConfirmResetPopup';
import { CREDIT_COSTS } from '@/app/_lib/apis/credit.api';
import {
  UseFanmeetingStudioReturn,
  FanmeetingFormData,
} from '../_hooks/useFanmeetingStudio';

interface FanmeetingStudioDesktopViewProps {
  hook: UseFanmeetingStudioReturn;
  formData: FanmeetingFormData;
}

export default function FanmeetingStudioDesktopView({
  hook,
  formData,
}: FanmeetingStudioDesktopViewProps) {
  const { t } = useTranslation(['studio']);

  const {
    idolFile,
    userFile,
    idolPreviewUrl,
    userPreviewUrl,
    isDragOverIdol,
    isDragOverUser,
    isProcessing,
    resultImage,
    isEditLoading,
    isPolling,
    isBackgroundProcessing,
    isEditPopupOpen,
    isResetPopupOpen,
    setIsDragOverIdol,
    setIsDragOverUser,
    handleFileUpload,
    handleDragOver,
    handleDragLeave,
    handleDropIdol,
    handleDropUser,
    handleGenerate,
    handleDownload,
    handleEditRequest,
    handleReset,
    isFormValid,
    setIsEditPopupOpen,
    setIsResetPopupOpen,
    checkTaskStatus,
    currentTaskId,
  } = hook;

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
    <div className="flex flex-col flex-1 h-full bg-studio-content">
      {/* Header */}
      <div className="flex items-center justify-between px-4 md:px-12 pb-0 pt-6 sticky top-0 bg-studio-content z-10 border-b border-studio-border/50 backdrop-blur-sm">
        <div className="flex-1 text-xl font-bold leading-7 font-pretendard bg-gradient-to-r from-[#FFCC00] to-[#E8FA07] bg-clip-text text-transparent">
          {t('fanmeeting.title')}
        </div>

        {/* PC-only buttons */}
        <div className="items-center gap-2 hidden md:flex">
          {resultImage ? (
            <>
              <StudioButton
                text={
                  isEditLoading ? t('fanmeeting.editing') : t('fanmeeting.edit')
                }
                onClick={() => setIsEditPopupOpen(true)}
                disabled={isEditLoading}
                loading={isEditLoading}
                creditCost={3}
                icon={<Edit className="w-4 h-4 text-black" />}
                className="px-3 md:px-5 py-2.5 h-[38px] text-xs md:text-sm"
                textClassName="font-bold leading-[14px] font-pretendard-bold !text-studio-header"
              />
              <button
                onClick={() => setIsResetPopupOpen(true)}
                className="inline-flex items-center overflow-hidden rounded-md justify-center border border-solid border-studio-button-primary px-3 md:px-5 py-2.5 h-[38px] hover:bg-studio-button-primary/10 active:scale-95 transition-all duration-200"
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                <div className="text-studio-button-primary text-xs md:text-sm font-bold leading-[14px] whitespace-nowrap font-pretendard-bold">
                  {t('fanmeeting.resetWork')}
                </div>
              </button>
            </>
          ) : (
            <StudioButton
              text={
                isProcessing
                  ? t('fanmeeting.generating')
                  : t('fanmeeting.generate')
              }
              onClick={() => handleGenerate(formData)}
              disabled={isProcessing || !isFormValid(formData)}
              loading={isProcessing}
              creditCost={CREDIT_COSTS.FANMEETING_STUDIO}
              className="px-3 md:px-5 py-2.5 h-[38px] text-xs md:text-sm"
              textClassName="font-bold leading-[14px] font-pretendard-bold !text-studio-header"
            />
          )}
        </div>
      </div>

      {/* Main Content */}
      <div
        className="flex flex-col md:flex-row flex-1 items-start gap-4 md:gap-6 self-stretch w-full px-4 md:px-12 pt-4 md:pt-6 md:h-[calc(100vh-180px)] md:overflow-hidden"
        style={{
          paddingBottom:
            'max(120px, calc(100px + env(safe-area-inset-bottom)))',
        }}
      >
        {/* Left Panel - Image Uploads */}
        <div
          className="flex flex-col w-full md:w-[330px] md:h-[calc(100vh-180px)] md:max-h-[calc(100vh-180px)] md:min-h-0 bg-transparent md:bg-studio-border rounded-[20px] p-[15px] gap-[18px] md:shadow-sm md:overflow-y-auto"
          style={{
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain',
          }}
        >
          {/* Two image upload areas */}
          <div className="flex items-start gap-3">
            {/* Idol upload section */}
            <div className="flex-1 flex flex-col gap-3">
              <div className="text-studio-text-primary text-xs font-pretendard-medium">
                {t('fanmeeting.idolPhoto')}
              </div>
              <div
                className={`flex flex-col h-[140px] w-full items-center justify-center bg-black rounded-[16px] transition-all duration-200 ease-out ${
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
                    : () => document.getElementById('idol-file-upload')?.click()
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
                        ? t('fanmeeting.dropFile')
                        : t('fanmeeting.idolPhoto')}
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={
                  resultImage || isProcessing || isPolling
                    ? undefined
                    : () => document.getElementById('idol-file-upload')?.click()
                }
                disabled={!!(resultImage || isProcessing || isPolling)}
                className="w-full h-[32px] bg-[#414141] hover:bg-[#515151] active:bg-[#313131] rounded-md flex items-center justify-center transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#414141] hidden md:flex"
              >
                <div className="text-studio-text-secondary text-xs font-semibold font-pretendard">
                  {t('fanmeeting.findIdolPhoto')}
                </div>
              </button>
            </div>

            {/* Plus icon */}
            <div className="flex items-center justify-center self-center">
              <Plus className="w-6 h-6 text-white" />
            </div>

            {/* User upload section */}
            <div className="flex-1 flex flex-col gap-3">
              <div className="text-studio-text-primary text-xs font-pretendard-medium">
                {t('fanmeeting.myPhoto')}
              </div>
              <div
                className={`flex flex-col h-[140px] w-full items-center justify-center bg-black rounded-[16px] transition-all duration-200 ease-out ${
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
                    : () => document.getElementById('user-file-upload')?.click()
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
                        ? t('fanmeeting.dropFile')
                        : t('fanmeeting.myPhoto')}
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={
                  resultImage || isProcessing || isPolling
                    ? undefined
                    : () => document.getElementById('user-file-upload')?.click()
                }
                disabled={!!(resultImage || isProcessing || isPolling)}
                className="w-full h-[32px] bg-[#414141] hover:bg-[#515151] active:bg-[#313131] rounded-md flex items-center justify-center transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#414141] hidden md:flex"
              >
                <div className="text-studio-text-secondary text-xs font-semibold font-pretendard">
                  {t('fanmeeting.findMyPhoto')}
                </div>
              </button>
            </div>
          </div>

          <input
            id="idol-file-upload"
            type="file"
            accept="image/png,image/jpg,image/jpeg"
            onChange={handleIdolInputChange}
            className="hidden"
          />

          <input
            id="user-file-upload"
            type="file"
            accept="image/png,image/jpg,image/jpeg"
            onChange={handleUserInputChange}
            className="hidden"
          />
        </div>

        {/* Right Panel - Result area (PC only) */}
        <div
          className="relative w-full md:flex-1 md:h-[calc(100vh-180px)] md:flex-shrink-0 bg-studio-border rounded-[20px] min-h-[300px] md:min-h-0 shadow-sm md:overflow-hidden hidden md:block"
          style={{
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain',
          }}
        >
          <div className="flex flex-col items-center justify-center gap-2.5 p-2.5 absolute top-[15px] left-[15px] right-[15px] bottom-[15px] bg-studio-header rounded-[20px] border border-dashed border-studio-header">
            {(isProcessing || isPolling) && !resultImage ? (
              <div className="flex flex-col items-center justify-center gap-4 w-full h-full">
                <Loader2 className="w-12 h-12 animate-spin text-studio-button-primary" />
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className="text-studio-text-primary text-base font-pretendard-medium">
                    {t('fanmeeting.generatingInProgress')}
                  </div>
                  <div className="text-studio-text-muted text-sm font-pretendard">
                    {t('fanmeeting.pleaseWait')}
                  </div>
                </div>
              </div>
            ) : isBackgroundProcessing ? (
              <div className="flex flex-col items-center justify-center gap-4 w-full h-full">
                <div className="flex flex-col items-center gap-2 text-center text-blue-400">
                  <div className="text-base font-pretendard-medium">
                    {t('fanmeeting.backgroundProcessing')}
                  </div>
                  <div className="text-sm font-pretendard max-w-[200px]">
                    {t('fanmeeting.takingLong')}
                  </div>
                  <button
                    onClick={() =>
                      currentTaskId && checkTaskStatus(currentTaskId)
                    }
                    className="mt-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-pretendard-medium rounded-lg transition-colors"
                  >
                    {t('fanmeeting.checkStatus')}
                  </button>
                </div>
              </div>
            ) : resultImage ? (
              <div className="relative w-full h-full group">
                <img
                  src={resultImage}
                  alt="Generated fanmeeting result"
                  className={`w-full h-full object-contain rounded-[20px] transition-opacity duration-500 ${
                    isEditLoading || isPolling ? 'opacity-50' : 'opacity-100'
                  }`}
                />
                {/* Edit/Polling loading overlay */}
                {(isEditLoading || isPolling) && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 backdrop-blur-sm rounded-[20px]">
                    <Loader2 className="w-12 h-12 animate-spin text-studio-button-primary mb-3" />
                    <div className="text-studio-text-primary text-base font-pretendard-medium">
                      {t('fanmeeting.editing')}
                    </div>
                    <div className="text-studio-text-muted text-sm font-pretendard mt-1">
                      {t('fanmeeting.pleaseWait')}
                    </div>
                  </div>
                )}
                {/* PC download icon - top right */}
                {!isEditLoading && !isPolling && (
                  <button
                    onClick={handleDownload}
                    className="absolute top-4 right-4 w-10 h-10 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 backdrop-blur-sm"
                  >
                    <Download className="w-5 h-5 text-white" />
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center w-full h-full">
                <div className="flex flex-col items-center text-center">
                  <HelpCircle className="w-12 h-12 text-studio-text-muted mb-4" />
                  <div className="font-pretendard-medium text-studio-text-secondary text-base leading-6 mb-2">
                    {t('fanmeeting.resultImage')}
                  </div>
                  <div className="font-pretendard text-studio-text-muted text-xs leading-[18px]">
                    {t('fanmeeting.completeSettings')}
                    <br />
                    {t('fanmeeting.pressStartFanmeeting')}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Popups */}
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
