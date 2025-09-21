'use client';

import { useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import { HelpCircle, Upload, Download, Loader2, Edit } from 'lucide-react';
import {
  createDigitalGoodsTask,
  DigitalGoodsRequest,
  DigitalGoodsStyle,
  editTask,
} from '@/app/_lib/apis/task.api';
import { useTaskPolling } from '@/hooks/useTaskPolling';
import { toast } from 'react-hot-toast';
import { DigitalGoodsDetails } from '@/types/task';
import EditRequestPopup from '@/components/ui/EditRequestPopup';
import MobileLoadingOverlay from '@/app/_components/ui/MobileLoadingOverlay';
import BeforeAfterToggle from '@/app/_components/ui/BeforeAfterToggle';
import { CREDIT_COSTS } from '@/app/_lib/apis/credit.api';
import StudioButton from '../../_components/ui/StudioButton';

interface DigitalGoodsClientProps {
  formData?: {
    style?: DigitalGoodsStyle;
  };
}

export interface DigitalGoodsClientRef {
  handleGenerate: () => void;
  handleEdit: () => void;
  isGenerating: boolean;
  isPolling: boolean;
  resultImage: string | null;
  isEditLoading: boolean;
  showMobileResult: boolean;
}

const DigitalGoodsClient = forwardRef<
  DigitalGoodsClientRef,
  DigitalGoodsClientProps
>(function DigitalGoodsClient({ formData = {} }, ref) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [showMobileResult, setShowMobileResult] = useState(false);

  const {
    taskData,
    isPolling,
    error: pollingError,
    startPolling,
  } = useTaskPolling({
    onCompleted: (result) => {
      const details = result.details as DigitalGoodsDetails;
      if (details?.result?.imageUrl) {
        setResultImage(details.result.imageUrl);
        setShowMobileResult(true);
        toast.success('디지털 굿즈 생성이 완료되었습니다!');
      }
      setIsGenerating(false);
    },
    onFailed: (error) => {
      toast.error(`생성 실패: ${error}`);
      setIsGenerating(false);
    },
  });

  const handleFileUpload = (file: File) => {
    // Check file size (200MB limit)
    if (file.size > 200 * 1024 * 1024) {
      toast.error('파일 크기가 200MB를 초과합니다.');
      return;
    }

    // Check file type
    if (!['image/png', 'image/jpg', 'image/jpeg'].includes(file.type)) {
      toast.error('지원하지 않는 파일 형식입니다. (png, jpg, jpeg만 지원)');
      return;
    }

    setUploadedFile(file);

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleGenerate = async () => {
    if (!formData) return;

    setIsGenerating(true);
    setResultImage(null);

    try {
      const request: DigitalGoodsRequest = {
        style: formData.style || 'GHIBLI',
      };

      const response = await createDigitalGoodsTask(
        request,
        uploadedFile || undefined
      );

      console.log('API Response:', response); // 디버깅용

      if (response.status === 200 && response.data) {
        toast.success('디지털 굿즈 생성 요청이 전송되었습니다!');
        startPolling(response.data.taskId);
      } else {
        console.error(
          'Response status:',
          response.status,
          'Response data:',
          response.data
        );
        throw new Error(`Failed to create task: ${response.status}`);
      }
    } catch (error) {
      console.error('Error creating digital goods task:', error);
      toast.error('디지털 굿즈 생성 요청에 실패했습니다.');
      setIsGenerating(false);
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
      link.download = `digital-goods-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('이미지가 다운로드되었습니다!');
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('다운로드에 실패했습니다.');
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

  const handleEditRequest = async (editRequest: string) => {
    if (!taskData || !taskData.taskId) {
      toast.error('원본 작업을 찾을 수 없습니다.');
      return;
    }

    setIsEditLoading(true);
    setIsEditPopupOpen(false);

    try {
      const response = await editTask(
        taskData.taskId,
        'DIGITAL_GOODS',
        editRequest
      );

      if (response.data) {
        toast.success('수정 요청이 전송되었습니다!');
        // 새로운 edit task에 대해 폴링 시작
        startPolling(response.data.taskId);
      } else {
        toast.error('수정 요청에 실패했습니다.');
      }
    } catch (error) {
      console.error('Edit request failed:', error);
      toast.error('수정 요청에 실패했습니다.');
    } finally {
      setIsEditLoading(false);
    }
  };

  useImperativeHandle(
    ref,
    () => ({
      handleGenerate,
      handleEdit: () => setIsEditPopupOpen(true),
      isGenerating,
      isPolling,
      resultImage,
      isEditLoading,
      showMobileResult,
    }),
    [isGenerating, isPolling, resultImage, isEditLoading, showMobileResult]
  );

  const isFormValid = () => {
    // 이미지는 선택사항 (텍스트 전용 생성 가능)
    // sidebar에서 formData가 설정되어야 함
    if (!formData) return false;

    // 스타일은 필수
    if (!formData.style) return false;

    return true;
  };

  // Mobile result view - 모바일에서만 전체 화면 전환
  // PC에서는 이 조건을 실행하지 않고 메인 레이아웃을 유지
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  if (showMobileResult && resultImage && isMobile) {
    return (
      <>
        <BeforeAfterToggle
          beforeImage={previewUrl || '/placeholder-image.png'}
          afterImage={resultImage}
          onDownload={handleDownload}
          onEdit={() => setIsEditPopupOpen(true)}
          showEditButton={true}
          editButtonText="수정하기"
          isEditLoading={isEditLoading}
        />
        <EditRequestPopup
          isOpen={isEditPopupOpen}
          onClose={() => setIsEditPopupOpen(false)}
          onEditRequest={handleEditRequest}
          isLoading={isEditLoading}
        />
      </>
    );
  }

  return (
    <div className="flex flex-col flex-1 h-full bg-studio-content">
      <div className="flex items-center justify-between px-4 md:px-12 pb-0 pt-6 sticky top-0 bg-studio-content z-10 border-b border-studio-border/50 backdrop-blur-sm">
        <div className="flex-1 text-xl font-bold leading-7 font-pretendard bg-gradient-to-r from-[#FFCC00] to-[#E8FA07] bg-clip-text text-transparent">
          디지털 굿즈
        </div>

        {/* PC에서만 표시되는 버튼들 */}
        <div className="items-center gap-2 hidden md:flex">
          {resultImage ? (
            <StudioButton
              text={isEditLoading ? '수정중...' : '수정하기'}
              onClick={() => setIsEditPopupOpen(true)}
              disabled={isEditLoading}
              loading={isEditLoading}
              creditCost={3}
              icon={<Edit className="w-4 h-4 text-black" />}
              className="px-3 md:px-5 py-2.5 h-[38px] text-xs md:text-sm"
              textClassName="font-bold leading-[14px] font-pretendard-bold !text-studio-header"
            />
          ) : (
            <StudioButton
              text={isGenerating || isPolling ? '생성중...' : '생성하기'}
              onClick={handleGenerate}
              disabled={isGenerating || isPolling || !isFormValid()}
              loading={isGenerating || isPolling}
              creditCost={CREDIT_COSTS.DIGITAL_GOODS}
              className="px-3 md:px-5 py-2.5 h-[38px] text-xs md:text-sm"
              textClassName="font-bold leading-[14px] font-pretendard-bold !text-studio-header"
            />
          )}

          {resultImage && (
            <button
              onClick={handleDownload}
              className="inline-flex items-center overflow-hidden rounded-md justify-center border border-solid border-studio-button-primary px-3 md:px-5 py-2.5 h-[38px] hover:bg-studio-button-primary/10 active:scale-95 transition-all duration-200"
            >
              <Download className="w-4 h-4 mr-1" />
              <div className="text-studio-button-primary text-xs md:text-sm font-bold leading-[14px] whitespace-nowrap font-pretendard-bold">
                저장하기
              </div>
            </button>
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
          {/* 드래그 앤 드롭 영역 */}
          <div
            className={`flex flex-col h-[280px] w-full items-center justify-center bg-black rounded-[20px] transition-all duration-200 ease-out flex-shrink-0 cursor-pointer ${
              !previewUrl ? 'border-2 border-dashed' : ''
            } ${
              isDragOver
                ? 'border-studio-button-primary scale-[1.02]'
                : 'border-studio-border hover:border-studio-button-primary/50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-upload')?.click()}
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
                    ? '파일을 놓아주세요'
                    : '파일을 여기다 끌어다 놓으세요'}
                </div>
                <div className="text-studio-text-muted text-xs font-pretendard">
                  파일당 200mb 제한 (png, jpg, jpeg)
                </div>
              </div>
            )}
          </div>

          {/* PC에서만 파일 찾아보기 버튼 표시 */}
          <button
            onClick={() => document.getElementById('file-upload')?.click()}
            className="w-full h-[38px] bg-[#414141] hover:bg-[#515151] active:bg-[#313131] rounded-md flex items-center justify-center transition-all duration-200 flex-shrink-0 active:scale-[0.98] hidden md:flex"
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
            {isGenerating || isPolling ? (
              // 로딩 상태
              <div className="flex flex-col items-center justify-center gap-4 w-full h-full">
                <Loader2 className="w-12 h-12 animate-spin text-studio-button-primary" />
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className="text-studio-text-primary text-base font-pretendard-medium">
                    {isGenerating
                      ? '디지털 굿즈 생성 중...'
                      : '생성 진행 중...'}
                  </div>
                  <div className="text-studio-text-muted text-sm font-pretendard">
                    잠시 기다리시면 결과가 나옵니다
                  </div>
                  {taskData?.status && (
                    <div className="mt-2 text-xs text-studio-text-secondary">
                      상태: {taskData.status}
                    </div>
                  )}
                </div>
              </div>
            ) : resultImage ? (
              // 결과 이미지 표시
              <div className="relative w-full h-full">
                <img
                  src={resultImage}
                  alt="Generated digital goods"
                  className="w-full h-full object-contain rounded-[20px]"
                  onError={(e) => {
                    console.error('Image load error:', e);
                    setResultImage(null);
                    toast.error('이미지 로드에 실패했습니다.');
                  }}
                />
              </div>
            ) : pollingError ? (
              // 에러 상태
              <div className="flex flex-col items-center justify-center gap-4 w-full h-full">
                <div className="flex flex-col items-center gap-2 text-center text-red-400">
                  <div className="text-base font-pretendard-medium">
                    생성 실패
                  </div>
                  <div className="text-sm font-pretendard max-w-[200px]">
                    {pollingError}
                  </div>
                </div>
              </div>
            ) : (
              // 기본 상태
              <div className="flex flex-col items-center justify-center w-full h-full">
                <div className="flex flex-col items-center text-center">
                  <HelpCircle className="w-12 h-12 text-studio-text-muted mb-4" />
                  <div className="font-pretendard-medium text-studio-text-secondary text-base leading-6 mb-2">
                    결과 이미지
                  </div>
                  <div className="font-pretendard text-studio-text-muted text-xs leading-[18px]">
                    사이드바에서 설정을 완료하고
                    <br />
                    '굿즈생성'을 눌러주세요
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <EditRequestPopup
        isOpen={isEditPopupOpen}
        onClose={() => setIsEditPopupOpen(false)}
        onEditRequest={handleEditRequest}
        isLoading={isEditLoading}
      />

      <MobileLoadingOverlay
        isVisible={isGenerating || isPolling}
        title="디지털 굿즈 생성중"
        description="잠시 기다리시면 결과가 나옵니다"
      />
    </div>
  );
});

export default DigitalGoodsClient;
