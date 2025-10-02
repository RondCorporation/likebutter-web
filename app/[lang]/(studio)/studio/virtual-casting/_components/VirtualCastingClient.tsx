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
  Edit,
  RotateCcw,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import {
  createVirtualCastingTask,
  VirtualCastingRequest,
  VirtualCastingStyle,
  VIRTUAL_CASTING_STYLES,
  editTask,
} from '@/app/_lib/apis/task.api';
import { useTaskPolling } from '@/hooks/useTaskPolling';
import MobileLoadingOverlay from '@/app/_components/ui/MobileLoadingOverlay';
import BeforeAfterToggle from '@/app/_components/ui/BeforeAfterToggle';
import { CREDIT_COSTS } from '@/app/_lib/apis/credit.api';
import StudioButton from '../../_components/ui/StudioButton';
import EditRequestPopup from '@/components/ui/EditRequestPopup';
import ConfirmResetPopup from '@/app/_components/ui/ConfirmResetPopup';

interface VirtualCastingFormData {
  selectedCharacter: {
    name: string;
    image: string;
    style: VirtualCastingStyle;
  } | null;
}

interface VirtualCastingClientProps {
  formData?: VirtualCastingFormData;
  onStateChange?: (state: {
    showMobileResult?: boolean;
    resultImage?: string | null;
    isProcessing?: boolean;
    isPolling?: boolean;
  }) => void;
}

export interface VirtualCastingClientRef {
  handleGenerate: () => void;
  handleDownload: () => void;
  handleEdit: () => void;
  isProcessing: boolean;
  isPolling: boolean;
  resultImage: string | null;
  uploadedFile: File | null;
  showMobileResult: boolean;
  isEditLoading: boolean;
  isBackgroundProcessing: boolean;
  checkTaskStatus: (taskId: number) => Promise<void>;
  currentTaskId: number | null;
}

const VirtualCastingClient = forwardRef<
  VirtualCastingClientRef,
  VirtualCastingClientProps
>(function VirtualCastingClient({ formData, onStateChange }, ref) {
  const { t } = useTranslation(['studio']);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState(false);
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
      console.log('✅ Virtual Casting - Task completed:', result);
      console.log('📦 Full result object:', JSON.stringify(result, null, 2));
      console.log('🔍 Checking result structure:');
      console.log('  - result.details:', result.details);
      console.log('  - result.details?.result:', result.details?.result);
      console.log('  - result.details?.result?.imageUrl:', result.details?.result?.imageUrl);
      console.log('  - typeof result.details:', typeof result.details);
      console.log('  - Object.keys(result):', Object.keys(result));
      if (result.details) {
        console.log('  - Object.keys(result.details):', Object.keys(result.details));
      }

      if (result.details?.result?.imageUrl) {
        const imageUrl = result.details.result.imageUrl;
        // Add timestamp to prevent browser caching
        const urlWithTimestamp = imageUrl.includes('?')
          ? `${imageUrl}&t=${Date.now()}`
          : `${imageUrl}?t=${Date.now()}`;

        console.log('🔄 Setting result image with URL:', urlWithTimestamp);
        setResultImage(urlWithTimestamp);
        setShowMobileResult(true);
        toast.success(t('virtualCasting.messages.castingComplete'));
      } else {
        console.warn('⚠️ No image URL in result!');
        console.warn('Full result details:', result.details);
        // Try alternative paths
        const alternativeUrl =
          result.details?.imageUrl ||
          result.details?.resultUrl ||
          (result as any).imageUrl ||
          (result as any).resultUrl;

        if (alternativeUrl) {
          console.log('🔄 Found alternative URL:', alternativeUrl);
          const urlWithTimestamp = alternativeUrl.includes('?')
            ? `${alternativeUrl}&t=${Date.now()}`
            : `${alternativeUrl}?t=${Date.now()}`;
          setResultImage(urlWithTimestamp);
          setShowMobileResult(true);
          toast.success(t('virtualCasting.messages.castingComplete'));
        } else {
          console.error('❌ No valid image URL found in any expected location');
        }
      }

      console.log('🏁 Resetting processing states');
      setIsProcessing(false);
      setIsEditLoading(false);
    },
    onFailed: () => {
      console.error('❌ Virtual Casting - Task failed');
      toast.error(t('virtualCasting.messages.castingFailed'));
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
      isProcessing,
      isPolling,
      resultImage,
      uploadedFile,
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
      uploadedFile,
      showMobileResult,
      isEditLoading,
      isBackgroundProcessing,
      checkTaskStatus,
      currentTaskId,
    ]
  );

  const handleFileUpload = (file: File) => {
    if (file.size > 200 * 1024 * 1024) {
      toast.error(t('virtualCasting.messages.fileSizeExceeded'));
      return;
    }

    if (!['image/png', 'image/jpg', 'image/jpeg'].includes(file.type)) {
      toast.error(t('virtualCasting.messages.unsupportedFormat'));
      return;
    }

    setUploadedFile(file);

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleGenerate = async () => {
    if (!formData || !formData.selectedCharacter || !uploadedFile) return;

    setIsProcessing(true);
    setResultImage(null);

    try {
      const request: VirtualCastingRequest = {
        style: formData.selectedCharacter.style,
      };

      const response = await createVirtualCastingTask(uploadedFile, request);

      if ((response as any).isInsufficientCredit) {
        setIsProcessing(false);
        return;
      }

      if (response.status === 200 && response.data) {
        toast.success(t('virtualCasting.messages.requestSent'));
        startPolling(response.data.taskId);
      } else {
        throw new Error('API request failed');
      }
    } catch (error: any) {
      console.error('Failed to generate virtual casting result:', error);
      toast.error(t('virtualCasting.messages.requestFailed'));
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
      link.download = `virtual-casting-result-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(t('virtualCasting.messages.downloadComplete'));
    } catch (error) {
      console.error('Download failed:', error);
      toast.error(t('virtualCasting.messages.downloadFailed'));
    }
  };

  const handleEditRequest = async (editRequest: string) => {
    if (!taskData || !taskData.taskId) {
      toast.error(t('virtualCasting.messages.originalNotFound'));
      return;
    }

    setIsEditLoading(true);
    setIsEditPopupOpen(false);
    // Keep the existing image while editing

    try {
      const response = await editTask(
        taskData.taskId,
        'VIRTUAL_CASTING',
        editRequest
      );

      if ((response as any).isInsufficientCredit) {
        setIsEditLoading(false);
        return;
      }

      if (response.data) {
        toast.success(t('virtualCasting.messages.editRequestSent'));

        startPolling(response.data.taskId);
      } else {
        toast.error(t('virtualCasting.messages.editRequestFailed'));
        setIsEditLoading(false);
      }
    } catch (error: any) {
      console.error('Edit request failed:', error);
      toast.error(t('virtualCasting.messages.editRequestFailed'));
      setIsEditLoading(false);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragOver(true);
    },
    []
  );

  const handleDragLeave = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragOver(false);
    },
    []
  );

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);

    const files = event.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, []);

  const handleReset = () => {
    setUploadedFile(null);
    setPreviewUrl('');
    setResultImage(null);
    setIsProcessing(false);
    setShowMobileResult(false);
    setIsEditPopupOpen(false);
    setIsEditLoading(false);
    setIsResetPopupOpen(false);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    toast.success(t('virtualCasting.messages.workReset'));
  };

  const isFormValid = () => {
    if (!uploadedFile) return false;

    if (!formData) return false;

    if (!formData.selectedCharacter) return false;

    return true;
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  if (showMobileResult && resultImage && isMobile) {
    return (
      <BeforeAfterToggle
        beforeImage={previewUrl || '/placeholder-image.png'}
        afterImage={resultImage}
        onDownload={handleDownload}
        onEdit={() => setIsEditPopupOpen(true)}
        showEditButton={true}
        editButtonText={t('virtualCasting.edit')}
        isEditLoading={isEditLoading}
      />
    );
  }

  return (
    <div className="flex flex-col flex-1 h-full bg-studio-content">
      <div className="flex items-center justify-between px-4 md:px-12 pb-0 pt-6 sticky top-0 bg-studio-content z-10 border-b border-studio-border/50 backdrop-blur-sm">
        <div className="flex-1 text-xl font-bold leading-7 font-pretendard bg-gradient-to-r from-[#FFCC00] to-[#E8FA07] bg-clip-text text-transparent">
          {t('virtualCasting.title')}
        </div>

        {/* PC-only buttons */}
        <div className="items-center gap-2 hidden md:flex">
          {resultImage ? (
            <>
              <StudioButton
                text={
                  isEditLoading
                    ? t('virtualCasting.editing')
                    : t('virtualCasting.edit')
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
                  {t('virtualCasting.resetWork')}
                </div>
              </button>
            </>
          ) : (
            <StudioButton
              text={
                isProcessing
                  ? t('virtualCasting.generating')
                  : t('virtualCasting.generate')
              }
              onClick={handleGenerate}
              disabled={isProcessing || !isFormValid()}
              loading={isProcessing}
              creditCost={CREDIT_COSTS.VIRTUAL_CASTING}
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
          {/* Title */}
          <div className="flex items-center justify-between">
            <div className="text-studio-text-primary text-sm font-pretendard-medium">
              {t('virtualCasting.myPhoto')}
            </div>
          </div>

          {/* Drag and drop area */}
          <div
            className={`flex flex-col h-[280px] w-full items-center justify-center bg-black rounded-[20px] transition-all duration-200 ease-out flex-shrink-0 ${
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
                : () => document.getElementById('file-upload')?.click()
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

          {/* Browse file button (PC only) */}
          <button
            onClick={
              resultImage || isProcessing || isPolling
                ? undefined
                : () => document.getElementById('file-upload')?.click()
            }
            disabled={!!(resultImage || isProcessing || isPolling)}
            className="w-full h-[38px] bg-[#414141] hover:bg-[#515151] active:bg-[#313131] rounded-md flex items-center justify-center transition-all duration-200 flex-shrink-0 active:scale-[0.98] hidden md:flex disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#414141]"
          >
            <div className="text-studio-text-secondary text-xs font-semibold font-pretendard">
              {t('virtualCasting.browseFile')}
            </div>
          </button>

          <input
            id="file-upload"
            type="file"
            accept="image/png,image/jpg,image/jpeg"
            onChange={handleInputChange}
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
                    {t('virtualCasting.generatingInProgress')}
                  </div>
                  <div className="text-studio-text-muted text-sm font-pretendard">
                    {t('virtualCasting.pleaseWait')}
                  </div>
                </div>
              </div>
            ) : isBackgroundProcessing ? (
              <div className="flex flex-col items-center justify-center gap-4 w-full h-full">
                <div className="flex flex-col items-center gap-2 text-center text-blue-400">
                  <div className="text-base font-pretendard-medium">
                    {t('virtualCasting.backgroundProcessing')}
                  </div>
                  <div className="text-sm font-pretendard max-w-[200px]">
                    {t('virtualCasting.takingLong')}
                  </div>
                  <button
                    onClick={() =>
                      currentTaskId && checkTaskStatus(currentTaskId)
                    }
                    className="mt-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-pretendard-medium rounded-lg transition-colors"
                  >
                    {t('virtualCasting.checkStatus')}
                  </button>
                </div>
              </div>
            ) : resultImage ? (
              <div className="relative w-full h-full group">
                <img
                  src={resultImage}
                  alt="Generated virtual casting result"
                  className={`w-full h-full object-contain rounded-[20px] transition-opacity duration-500 ${
                    isEditLoading || isPolling ? 'opacity-50' : 'opacity-100'
                  }`}
                  onError={(e) => {
                    console.error('❌ Image load error:', e);
                    console.error('Failed to load image URL:', resultImage);
                    toast.error(t('virtualCasting.messages.imageLoadFailed'));
                  }}
                />
                {/* Edit/Polling loading overlay */}
                {(isEditLoading || isPolling) && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 backdrop-blur-sm rounded-[20px]">
                    <Loader2 className="w-12 h-12 animate-spin text-studio-button-primary mb-3" />
                    <div className="text-studio-text-primary text-base font-pretendard-medium">
                      {t('virtualCasting.editing')}
                    </div>
                    <div className="text-studio-text-muted text-sm font-pretendard mt-1">
                      {t('virtualCasting.pleaseWait')}
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
                    {t('virtualCasting.resultImage')}
                  </div>
                  <div className="font-pretendard text-studio-text-muted text-xs leading-[18px]">
                    {t('virtualCasting.completeSettings')}
                    <br />
                    {t('virtualCasting.pressStartCasting')}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <MobileLoadingOverlay
        isVisible={isProcessing || isPolling}
        title={t('virtualCasting.generatingTitle')}
        description={t('virtualCasting.generatingDescription')}
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

export default VirtualCastingClient;
