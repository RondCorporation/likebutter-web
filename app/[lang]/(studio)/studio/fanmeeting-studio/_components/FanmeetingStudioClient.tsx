'use client';

import {
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from 'react';
import { useTranslation } from 'react-i18next';
import {
  HelpCircle,
  Upload,
  Download,
  Loader2,
  Plus,
  Edit,
  RotateCcw,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import {
  createFanmeetingStudioTask,
  FanmeetingStudioRequest,
  editTask,
} from '@/app/_lib/apis/task.api';
import { useTaskPolling } from '@/hooks/useTaskPolling';
import MobileLoadingOverlay from '@/app/_components/ui/MobileLoadingOverlay';
import BeforeAfterToggle from '@/app/_components/ui/BeforeAfterToggle';
import { CREDIT_COSTS } from '@/app/_lib/apis/credit.api';
import StudioButton from '../../_components/ui/StudioButton';
import EditRequestPopup from '@/components/ui/EditRequestPopup';
import ConfirmResetPopup from '@/app/_components/ui/ConfirmResetPopup';
import { useCreditStore } from '@/app/_stores/creditStore';

interface FanmeetingFormData {
  backgroundPrompt: string;
  situationPrompt: string;
}

interface FanmeetingStudioClientProps {
  formData?: FanmeetingFormData;
  onStateChange?: (state: {
    showMobileResult?: boolean;
    resultImage?: string | null;
    isProcessing?: boolean;
    isPolling?: boolean;
  }) => void;
}

export interface FanmeetingStudioClientRef {
  handleGenerate: () => void;
  handleDownload: () => void;
  handleEdit: () => void;
  handleReset: () => void;
  isProcessing: boolean;
  isPolling: boolean;
  resultImage: string | null;
  idolFile: File | null;
  userFile: File | null;
  showMobileResult: boolean;
  isEditLoading: boolean;
  isBackgroundProcessing: boolean;
  checkTaskStatus: (taskId: number) => Promise<void>;
  currentTaskId: number | null;
}

const FanmeetingStudioClient = forwardRef<
  FanmeetingStudioClientRef,
  FanmeetingStudioClientProps
>(function FanmeetingStudioClient({ formData, onStateChange }, ref) {
  const { t } = useTranslation(['studio']);
  const { deductCredit } = useCreditStore();
  const [idolFile, setIdolFile] = useState<File | null>(null);
  const [userFile, setUserFile] = useState<File | null>(null);
  const [idolPreviewUrl, setIdolPreviewUrl] = useState<string>('');
  const [userPreviewUrl, setUserPreviewUrl] = useState<string>('');
  const [isDragOverIdol, setIsDragOverIdol] = useState(false);
  const [isDragOverUser, setIsDragOverUser] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [showMobileResult, setShowMobileResult] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [isResetPopupOpen, setIsResetPopupOpen] = useState(false);

  const {
    taskData,
    isPolling,
    isBackgroundProcessing,
    startPolling,
    checkTaskStatus,
    currentTaskId,
  } = useTaskPolling({
    onCompleted: (result) => {
      if (result.details?.result?.imageUrl) {
        setResultImage(result.details.result.imageUrl);
        setShowMobileResult(true);
        toast.success(t('fanmeeting.messages.fanmeetingComplete'));
      }
      setIsProcessing(false);
      setIsEditLoading(false);
    },
    onFailed: () => {
      toast.error(t('fanmeeting.messages.fanmeetingFailed'));
      setIsProcessing(false);
      setIsEditLoading(false);
    },
  });

  // Notify parent of state changes
  useEffect(() => {
    onStateChange?.({
      showMobileResult,
      resultImage,
      isProcessing,
      isPolling,
    });
  }, [showMobileResult, resultImage, isProcessing, isPolling, onStateChange]);

  useImperativeHandle(
    ref,
    () => ({
      handleGenerate,
      handleDownload,
      handleEdit: () => setIsEditPopupOpen(true),
      handleReset,
      isProcessing,
      isPolling,
      resultImage,
      idolFile,
      userFile,
      showMobileResult,
      isEditLoading,
      isBackgroundProcessing,
      checkTaskStatus,
      currentTaskId,
    }),
    [
      isProcessing,
      isPolling,
      resultImage,
      idolFile,
      userFile,
      showMobileResult,
      isEditLoading,
      isBackgroundProcessing,
      checkTaskStatus,
      currentTaskId,
    ]
  );

  const handleFileUpload = (file: File, type: 'idol' | 'user') => {
    if (file.size > 200 * 1024 * 1024) {
      toast.error(t('fanmeeting.messages.fileSizeExceeded'));
      return;
    }

    if (!['image/png', 'image/jpg', 'image/jpeg'].includes(file.type)) {
      toast.error(t('fanmeeting.messages.unsupportedFormat'));
      return;
    }

    if (type === 'idol') {
      setIdolFile(file);
      const url = URL.createObjectURL(file);
      setIdolPreviewUrl(url);
    } else {
      setUserFile(file);
      const url = URL.createObjectURL(file);
      setUserPreviewUrl(url);
    }
  };

  const handleGenerate = async () => {
    if (!formData || !idolFile || !userFile) return;

    setIsProcessing(true);
    setResultImage(null);

    try {
      const request: FanmeetingStudioRequest = {
        situationPrompt: formData.situationPrompt,
        backgroundPrompt: formData.backgroundPrompt,
      };

      const response = await createFanmeetingStudioTask(
        userFile,
        idolFile,
        request
      );

      if ((response as any).isInsufficientCredit) {
        setIsProcessing(false);
        return;
      }

      if (response.status === 200 && response.data) {
        // Deduct credit immediately for instant UI update
        deductCredit(CREDIT_COSTS.FANMEETING_STUDIO);

        toast.success(t('fanmeeting.messages.requestSent'));
        startPolling(response.data.taskId);
      } else {
        throw new Error('API request failed');
      }
    } catch (error: any) {
      console.error('Failed to generate fanmeeting result:', error);
      toast.error(t('fanmeeting.messages.requestFailed'));
      setIsProcessing(false);
    }
  };

  const handleDownload = async () => {
    if (!resultImage) return;

    try {
      const response = await fetch(resultImage);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `fanmeeting-result-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(t('fanmeeting.messages.downloadComplete'));
    } catch (error) {
      console.error('Download failed:', error);
      toast.error(t('fanmeeting.messages.downloadFailed'));
    }
  };

  const handleEditRequest = async (editRequest: string) => {
    if (!taskData || !taskData.taskId) {
      toast.error(t('fanmeeting.messages.originalNotFound'));
      return;
    }

    setIsEditLoading(true);
    setIsEditPopupOpen(false);
    // Keep the existing image while editing

    try {
      const response = await editTask(
        taskData.taskId,
        'FANMEETING_STUDIO',
        editRequest
      );

      if ((response as any).isInsufficientCredit) {
        setIsEditLoading(false);
        return;
      }

      if (response.data) {
        // Deduct credit immediately for instant UI update
        deductCredit(CREDIT_COSTS.IMAGE_EDIT);

        toast.success(t('fanmeeting.messages.editRequestSent'));

        startPolling(response.data.taskId);
      } else {
        toast.error(t('fanmeeting.messages.editRequestFailed'));
        setIsEditLoading(false);
      }
    } catch (error: any) {
      console.error('Edit request failed:', error);
      toast.error(t('fanmeeting.messages.editRequestFailed'));
      setIsEditLoading(false);
    }
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: 'idol' | 'user'
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file, type);
    }
  };

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
    },
    []
  );

  const handleDragLeave = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
    },
    []
  );

  const handleDropIdol = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragOverIdol(false);

      const files = event.dataTransfer.files;
      if (files.length > 0) {
        handleFileUpload(files[0], 'idol');
      }
    },
    []
  );

  const handleDropUser = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragOverUser(false);

      const files = event.dataTransfer.files;
      if (files.length > 0) {
        handleFileUpload(files[0], 'user');
      }
    },
    []
  );

  const isFormValid = () => {
    if (!idolFile || !userFile) return false;

    if (!formData) return false;

    if (
      !formData.backgroundPrompt ||
      formData.backgroundPrompt.trim().length < 2
    )
      return false;
    if (!formData.situationPrompt || formData.situationPrompt.trim().length < 2)
      return false;

    return true;
  };

  const handleReset = () => {
    setIdolFile(null);
    setUserFile(null);
    setIdolPreviewUrl('');
    setUserPreviewUrl('');
    setResultImage(null);
    setIsProcessing(false);
    setShowMobileResult(false);
    setIsEditPopupOpen(false);
    setIsEditLoading(false);
    setIsResetPopupOpen(false);

    if (idolPreviewUrl) {
      URL.revokeObjectURL(idolPreviewUrl);
    }
    if (userPreviewUrl) {
      URL.revokeObjectURL(userPreviewUrl);
    }

    toast.success(t('fanmeeting.messages.workReset'));
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  if (showMobileResult && resultImage && isMobile) {
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

  return (
    <div className="flex flex-col flex-1 h-full bg-studio-content">
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
              onClick={handleGenerate}
              disabled={isProcessing || !isFormValid()}
              loading={isProcessing}
              creditCost={CREDIT_COSTS.FANMEETING_STUDIO}
              className="px-3 md:px-5 py-2.5 h-[38px] text-xs md:text-sm"
              textClassName="font-bold leading-[14px] font-pretendard-bold !text-studio-header"
            />
          )}
        </div>
      </div>

      <div
        className="flex flex-col md:flex-row flex-1 items-start gap-4 md:gap-6 self-stretch w-full px-4 md:px-12 pt-4 md:pt-6 md:h-[calc(100vh-180px)] md:overflow-hidden"
        style={{
          paddingBottom:
            'max(120px, calc(100px + env(safe-area-inset-bottom)))',
        }}
      >
        <div
          className="flex flex-col w-full md:w-[330px] md:h-[calc(100vh-180px)] md:max-h-[calc(100vh-180px)] md:min-h-0 bg-transparent md:bg-studio-border rounded-[20px] p-[15px] gap-[18px] md:shadow-sm md:overflow-y-auto"
          style={{
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain',
          }}
        >
          {/* Two image upload areas */}
          <div className="flex flex-col gap-4">
            {/* Top image area */}
            <div className="flex items-center gap-3">
              {/* Idol image */}
              <div className="flex-1">
                <div className="mb-2">
                  <div className="text-studio-text-primary text-xs font-pretendard-medium">
                    {t('fanmeeting.idolPhoto')}
                  </div>
                </div>
                <div
                  className={`flex flex-col h-[140px] w-full items-center justify-center bg-black rounded-[16px] transition-all duration-200 ease-out ${
                    resultImage || isProcessing || isPolling
                      ? 'cursor-not-allowed opacity-60'
                      : 'cursor-pointer'
                  } ${!idolPreviewUrl ? 'border-2 border-dashed' : ''} ${
                    isDragOverIdol &&
                    !(resultImage || isProcessing || isPolling)
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
                      : () =>
                          document.getElementById('idol-file-upload')?.click()
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
                    </div>
                  )}
                </div>
              </div>

              {/* Plus icon */}
              <div className="flex items-center justify-center">
                <Plus className="w-6 h-6 text-white" />
              </div>

              {/* User image */}
              <div className="flex-1">
                <div className="mb-2">
                  <div className="text-studio-text-primary text-xs font-pretendard-medium">
                    {t('fanmeeting.myPhoto')}
                  </div>
                </div>
                <div
                  className={`flex flex-col h-[140px] w-full items-center justify-center bg-black rounded-[16px] transition-all duration-200 ease-out ${
                    resultImage || isProcessing || isPolling
                      ? 'cursor-not-allowed opacity-60'
                      : 'cursor-pointer'
                  } ${!userPreviewUrl ? 'border-2 border-dashed' : ''} ${
                    isDragOverUser &&
                    !(resultImage || isProcessing || isPolling)
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
                      : () =>
                          document.getElementById('user-file-upload')?.click()
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
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Browse file buttons (PC only) */}
            <div className="gap-3 hidden md:flex">
              <button
                onClick={
                  resultImage || isProcessing || isPolling
                    ? undefined
                    : () => document.getElementById('idol-file-upload')?.click()
                }
                disabled={!!(resultImage || isProcessing || isPolling)}
                className="w-[calc(50%-6px)] h-[32px] bg-[#414141] hover:bg-[#515151] active:bg-[#313131] rounded-md flex items-center justify-center transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#414141]"
              >
                <div className="text-studio-text-secondary text-xs font-semibold font-pretendard">
                  {t('fanmeeting.findIdolPhoto')}
                </div>
              </button>

              <button
                onClick={
                  resultImage || isProcessing || isPolling
                    ? undefined
                    : () => document.getElementById('user-file-upload')?.click()
                }
                disabled={!!(resultImage || isProcessing || isPolling)}
                className="w-[calc(50%-6px)] h-[32px] bg-[#414141] hover:bg-[#515151] active:bg-[#313131] rounded-md flex items-center justify-center transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#414141]"
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
            onChange={(e) => handleInputChange(e, 'idol')}
            className="hidden"
          />

          <input
            id="user-file-upload"
            type="file"
            accept="image/png,image/jpg,image/jpeg"
            onChange={(e) => handleInputChange(e, 'user')}
            className="hidden"
          />
        </div>

        {/* Result area (PC only, hidden on mobile) */}
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
});

export default FanmeetingStudioClient;
