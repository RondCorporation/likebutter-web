'use client';

import { useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import { useTranslation } from 'react-i18next';
import {
  HelpCircle,
  Upload,
  Download,
  Loader2,
  X,
  Edit,
  RotateCcw,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import {
  createStylistTask,
  StylistRequest,
  editTask,
} from '@/app/_lib/apis/task.api';
import { useTaskPolling } from '@/hooks/useTaskPolling';
import MobileLoadingOverlay from '@/app/_components/ui/MobileLoadingOverlay';
import BeforeAfterToggle from '@/app/_components/ui/BeforeAfterToggle';
import { CREDIT_COSTS } from '@/app/_lib/apis/credit.api';
import StudioButton from '../../_components/ui/StudioButton';
import EditRequestPopup from '@/components/ui/EditRequestPopup';
import ConfirmResetPopup from '@/app/_components/ui/ConfirmResetPopup';

interface StylistFormData {
  mode: 'text' | 'image';
  textPrompt?: string;
  imagePrompt?: string;
  imageSettings?: {
    hairstyle: boolean;
    costume: boolean;
    background: boolean;
    accessory: boolean;
    atmosphere: boolean;
  };
  uploadedFiles?: {
    hairStyleImage?: File;
    outfitImage?: File;
    backgroundImage?: File;
    accessoryImage?: File;
    moodImage?: File;
  };
}

interface StylistClientProps {
  formData?: StylistFormData;
}

export interface StylistClientRef {
  handleGenerate: () => void;
  handleDownload: () => void;
  isProcessing: boolean;
  isPolling: boolean;
  isBackgroundProcessing: boolean;
  resultImage: string | null;
  uploadedFile: File | null;
  showMobileResult: boolean;
  checkTaskStatus: (taskId: number) => Promise<void>;
  currentTaskId: number | null;
}

const StylistClient = forwardRef<StylistClientRef, StylistClientProps>(
  function StylistClient({ formData }, ref) {
    const { t } = useTranslation(['studio']);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [isDragOver, setIsDragOver] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [resultImage, setResultImage] = useState<string | null>(null);
    const [showMobileResult, setShowMobileResult] = useState(false);
    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
    const [isEditLoading, setIsEditLoading] = useState(false);
    const [additionalImagePreviews, setAdditionalImagePreviews] = useState<{
      [key: string]: string;
    }>({});
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
          toast.success(t('stylist.messages.stylingComplete'));
        }
        setIsProcessing(false);
      },
      onFailed: () => {
        toast.error(t('stylist.messages.stylingFailed'));
        setIsProcessing(false);
      },
    });

    useImperativeHandle(
      ref,
      () => ({
        handleGenerate,
        handleDownload,
        isProcessing,
        isPolling,
        isBackgroundProcessing,
        resultImage,
        uploadedFile,
        showMobileResult,
        checkTaskStatus,
        currentTaskId,
      }),
      [
        isProcessing,
        isPolling,
        isBackgroundProcessing,
        resultImage,
        uploadedFile,
        showMobileResult,
        checkTaskStatus,
        currentTaskId,
      ]
    );

    const handleFileUpload = (file: File) => {
      if (file.size > 200 * 1024 * 1024) {
        toast.error(t('stylist.messages.fileSizeExceeded'));
        return;
      }

      if (!['image/png', 'image/jpg', 'image/jpeg'].includes(file.type)) {
        toast.error(t('stylist.messages.unsupportedFormat'));
        return;
      }

      setUploadedFile(file);

      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    };

    const handleGenerate = async () => {
      if (!formData || !uploadedFile) return;

      setIsProcessing(true);
      setResultImage(null);

      try {
        const prompt =
          formData.mode === 'text'
            ? formData.textPrompt || ''
            : formData.imagePrompt || '';

        const request: StylistRequest = {
          prompt,
          customPrompt:
            formData.mode === 'image' ? formData.imagePrompt : undefined,
        };

        if (formData.mode === 'image' && formData.uploadedFiles) {
          if (formData.uploadedFiles.hairStyleImage) {
            request.hairStyleImage = formData.uploadedFiles.hairStyleImage;
          }
          if (formData.uploadedFiles.outfitImage) {
            request.outfitImage = formData.uploadedFiles.outfitImage;
          }
          if (formData.uploadedFiles.backgroundImage) {
            request.backgroundImage = formData.uploadedFiles.backgroundImage;
          }
          if (formData.uploadedFiles.accessoryImage) {
            request.accessoryImage = formData.uploadedFiles.accessoryImage;
          }
          if (formData.uploadedFiles.moodImage) {
            request.moodImage = formData.uploadedFiles.moodImage;
          }
        }

        const response = await createStylistTask(uploadedFile, request);

        if ((response as any).isInsufficientCredit) {
          setIsProcessing(false);
          return;
        }

        if (response.status === 200 && response.data) {
          toast.success(t('stylist.messages.requestSent'));
          startPolling(response.data.taskId);
        } else {
          throw new Error('API request failed');
        }
      } catch (error: any) {
        console.error('Failed to generate stylist result:', error);
        toast.error(t('stylist.messages.requestFailed'));
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
        link.download = `stylist-result-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        toast.success(t('stylist.messages.downloadComplete'));
      } catch (error) {
        console.error('Download failed:', error);
        toast.error(t('stylist.messages.downloadFailed'));
      }
    };

    const handleEditRequest = async (editRequest: string) => {
      if (!taskData || !taskData.taskId) {
        toast.error(t('stylist.messages.originalNotFound'));
        return;
      }

      setIsEditLoading(true);
      setIsEditPopupOpen(false);
      setResultImage(null);

      try {
        const response = await editTask(
          taskData.taskId,
          'STYLIST',
          editRequest
        );

        if ((response as any).isInsufficientCredit) {
          return;
        }

        if (response.data) {
          toast.success(t('stylist.messages.editRequestSent'));

          startPolling(response.data.taskId);
        } else {
          toast.error(t('stylist.messages.editRequestFailed'));
        }
      } catch (error: any) {
        console.error('Edit request failed:', error);
        toast.error(t('stylist.messages.editRequestFailed'));
      } finally {
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

    const handleAdditionalFileUpload = (slotId: string, file: File) => {
      const url = URL.createObjectURL(file);
      setAdditionalImagePreviews((prev) => ({
        ...prev,
        [slotId]: url,
      }));

      if (formData?.uploadedFiles) {
        const fileKey = slotId as keyof typeof formData.uploadedFiles;
        (formData.uploadedFiles as any)[fileKey] = file;
      }
    };

    const handleAdditionalFileRemove = (slotId: string) => {
      setAdditionalImagePreviews((prev) => {
        const newPreviews = { ...prev };
        delete newPreviews[slotId];
        return newPreviews;
      });

      if (formData?.uploadedFiles) {
        const fileKey = slotId as keyof typeof formData.uploadedFiles;
        delete (formData.uploadedFiles as any)[fileKey];
      }
    };

    const handleReset = () => {
      setUploadedFile(null);
      setPreviewUrl('');
      setResultImage(null);
      setIsProcessing(false);
      setShowMobileResult(false);
      setIsEditPopupOpen(false);
      setIsEditLoading(false);
      setIsResetPopupOpen(false);
      setAdditionalImagePreviews({});

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      Object.values(additionalImagePreviews).forEach((url) => {
        URL.revokeObjectURL(url);
      });

      toast.success(t('stylist.messages.workReset'));
    };

    const getImageUploadSlots = () => {
      if (formData?.mode !== 'image' || !formData.imageSettings) return [];

      const slots = [];
      const settings = formData.imageSettings;

      if (settings.hairstyle) {
        slots.push({
          id: 'hairStyleImage',
          label: t('stylist.categories.hairstyle'),
          previewUrl: additionalImagePreviews['hairStyleImage'],
        });
      }
      if (settings.costume) {
        slots.push({
          id: 'outfitImage',
          label: t('stylist.categories.costume'),
          previewUrl: additionalImagePreviews['outfitImage'],
        });
      }
      if (settings.background) {
        slots.push({
          id: 'backgroundImage',
          label: t('stylist.categories.background'),
          previewUrl: additionalImagePreviews['backgroundImage'],
        });
      }
      if (settings.accessory) {
        slots.push({
          id: 'accessoryImage',
          label: t('stylist.categories.accessory'),
          previewUrl: additionalImagePreviews['accessoryImage'],
        });
      }
      if (settings.atmosphere) {
        slots.push({
          id: 'moodImage',
          label: t('stylist.categories.mood'),
          previewUrl: additionalImagePreviews['moodImage'],
        });
      }

      return slots;
    };

    const isFormValid = () => {
      if (!uploadedFile) return false;

      if (!formData) return false;

      if (!formData.mode) return false;

      if (formData.mode === 'text') {
        if (!formData.textPrompt || formData.textPrompt.trim().length < 5)
          return false;
      } else if (formData.mode === 'image') {
        const hasUploadedFiles =
          formData.uploadedFiles &&
          Object.values(formData.uploadedFiles).some(
            (file) => file instanceof File
          );
        if (!hasUploadedFiles) return false;
      }

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
          editButtonText={t('stylist.edit')}
          isEditLoading={isEditLoading}
        />
      );
    }

    return (
      <div className="flex flex-col flex-1 h-full bg-studio-content">
        <div className="flex items-center justify-between px-4 md:px-12 pb-0 pt-6 sticky top-0 bg-studio-content z-10 border-b border-studio-border/50 backdrop-blur-sm">
          <div className="flex-1 text-xl font-bold leading-7 font-pretendard bg-gradient-to-r from-[#FFCC00] to-[#E8FA07] bg-clip-text text-transparent">
            스타일리스트
          </div>

          {/* PC에서만 표시되는 버튼들 */}
          <div className="items-center gap-2 hidden md:flex">
            {resultImage ? (
              <>
                <StudioButton
                  text={isEditLoading ? t('stylist.editing') : t('stylist.edit')}
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
                    다시 만들기
                  </div>
                </button>
              </>
            ) : (
              <StudioButton
                text={isProcessing ? t('stylist.styling') : t('stylist.generate')}
                onClick={handleGenerate}
                disabled={isProcessing || !isFormValid()}
                loading={isProcessing}
                creditCost={CREDIT_COSTS.STYLIST}
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
            {/* 이미지 모드일 때 상단에 3열 그리드 이미지 업로드 */}
            {formData?.mode === 'image' && formData.imageSettings && (
              <div className="grid grid-cols-3 gap-2 mb-4">
                {getImageUploadSlots().map((slot) => (
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
                              handleAdditionalFileRemove(slot.id);
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
                          handleAdditionalFileUpload(slot.id, file);
                        }
                      }}
                      className="hidden"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* 제목 */}
            <div className="flex items-center justify-between">
              <div className="text-studio-text-primary text-sm font-pretendard-medium">
                아이돌 이미지
              </div>
            </div>

            {/* 드래그 앤 드롭 영역 */}
            <div
              className={`flex flex-col h-[280px] w-full items-center justify-center bg-black rounded-[20px] transition-all duration-200 ease-out flex-shrink-0 ${
                resultImage || isProcessing || isPolling
                  ? 'cursor-not-allowed opacity-60'
                  : 'cursor-pointer'
              } ${!previewUrl ? 'border-2 border-dashed' : ''} ${
                isDragOver && !resultImage && !isProcessing && !isPolling
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
                resultImage || isProcessing || isPolling
                  ? undefined
                  : handleDrop
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
                      ? t('stylist.dropFile')
                      : t('stylist.dragFileHere')}
                  </div>
                  <div className="text-studio-text-muted text-xs font-pretendard">
                    파일당 200mb 제한 (png, jpg, jpeg)
                  </div>
                </div>
              )}
            </div>

            {/* PC에서만 파일 찾아보기 버튼 표시 */}
            <button
              onClick={
                resultImage || isProcessing || isPolling
                  ? undefined
                  : () => document.getElementById('file-upload')?.click()
              }
              disabled={!!resultImage || isProcessing || isPolling}
              className="w-full h-[38px] bg-[#414141] hover:bg-[#515151] active:bg-[#313131] rounded-md flex items-center justify-center transition-all duration-200 flex-shrink-0 active:scale-[0.98] hidden md:flex disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#414141]"
            >
              <div className="text-studio-text-secondary text-xs font-semibold font-pretendard">
                파일 찾아보기
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

          {/* PC에서만 결과 영역 표시, 모바일에서는 숨김 */}
          <div
            className="relative w-full md:flex-1 md:h-[calc(100vh-180px)] md:flex-shrink-0 bg-studio-border rounded-[20px] min-h-[300px] md:min-h-0 shadow-sm md:overflow-hidden hidden md:block"
            style={{
              WebkitOverflowScrolling: 'touch',
              overscrollBehavior: 'contain',
            }}
          >
            <div className="flex flex-col items-center justify-center gap-2.5 p-2.5 absolute top-[15px] left-[15px] right-[15px] bottom-[15px] bg-studio-header rounded-[20px] border border-dashed border-studio-header">
              {isProcessing ? (
                <div className="flex flex-col items-center justify-center gap-4 w-full h-full">
                  <Loader2 className="w-12 h-12 animate-spin text-studio-button-primary" />
                  <div className="flex flex-col items-center gap-2 text-center">
                    <div className="text-studio-text-primary text-base font-pretendard-medium">
                      스타일링 중...
                    </div>
                    <div className="text-studio-text-muted text-sm font-pretendard">
                      잠시 기다리시면 결과가 나옵니다
                    </div>
                  </div>
                </div>
              ) : resultImage ? (
                <div className="relative w-full h-full group">
                  <img
                    src={resultImage}
                    alt="Generated stylist result"
                    className="w-full h-full object-contain rounded-[20px]"
                  />
                  {/* PC 다운로드 아이콘 - 우측 상단 */}
                  <button
                    onClick={handleDownload}
                    className="absolute top-4 right-4 w-10 h-10 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 backdrop-blur-sm"
                  >
                    <Download className="w-5 h-5 text-white" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center w-full h-full">
                  <div className="flex flex-col items-center text-center">
                    <HelpCircle className="w-12 h-12 text-studio-text-muted mb-4" />
                    <div className="font-pretendard-medium text-studio-text-secondary text-base leading-6 mb-2">
                      결과 이미지
                    </div>
                    <div className="font-pretendard text-studio-text-muted text-xs leading-[18px]">
                      사이드바에서 설정을 완료하고
                      <br />
                      {t('stylist.pressStartStyling')}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <MobileLoadingOverlay
          isVisible={isProcessing || isPolling}
          title={t('stylist.stylingInProgress')}
          description={t('stylist.pleaseWaitForResults')}
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
);

export default StylistClient;
