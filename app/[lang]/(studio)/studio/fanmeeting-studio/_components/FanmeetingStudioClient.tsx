'use client';

import { forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import {
  useFanmeetingStudio,
  FanmeetingFormData,
} from '../_hooks/useFanmeetingStudio';
import FanmeetingStudioMobileView from './FanmeetingStudioMobileView';
import FanmeetingStudioDesktopView from './FanmeetingStudioDesktopView';
import { useIsMobile } from '@/hooks/useMediaQuery';

interface FanmeetingStudioClientProps {
  formData?: FanmeetingFormData;
  onStateChange?: (state: {
    showMobileResult?: boolean;
    resultImage?: string | null;
    isProcessing?: boolean;
    isPolling?: boolean;
    uploadedFile?: File | null;
    isBottomSheetOpen?: boolean;
    idolFile?: File | null;
    userFile?: File | null;
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
  setIsBottomSheetOpen: (isOpen: boolean) => void;
}

const FanmeetingStudioClient = forwardRef<
  FanmeetingStudioClientRef,
  FanmeetingStudioClientProps
>(function FanmeetingStudioClient({ formData, onStateChange }, ref) {
  const hook = useFanmeetingStudio();
  const [showMobileResult, setShowMobileResult] = useState(false);

  const {
    idolFile,
    userFile,
    isProcessing,
    isPolling,
    resultImage,
    isEditLoading,
    isBackgroundProcessing,
    handleGenerate,
    handleDownload,
    handleReset,
    setIsEditPopupOpen,
    checkTaskStatus,
    currentTaskId,
    isBottomSheetOpen,
    setIsBottomSheetOpen,
  } = hook;

  const isMobile = useIsMobile();

  // 모바일 결과 화면 표시 여부 관리
  useEffect(() => {
    if (isMobile && resultImage) {
      setShowMobileResult(true);
    } else {
      setShowMobileResult(false);
    }
  }, [isMobile, resultImage]);

  // Notify parent of state changes
  useEffect(() => {
    const uploadedFile = idolFile || userFile;
    onStateChange?.({
      showMobileResult,
      resultImage,
      isProcessing,
      isPolling,
      uploadedFile,
      isBottomSheetOpen,
      idolFile,
      userFile,
    });
  }, [
    showMobileResult,
    resultImage,
    isProcessing,
    isPolling,
    idolFile,
    userFile,
    isBottomSheetOpen,
    onStateChange,
  ]);

  // Expose methods via ref for WithSidebar component
  useImperativeHandle(
    ref,
    () => ({
      handleGenerate: () => {
        if (formData) {
          handleGenerate(formData);
        }
      },
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
      setIsBottomSheetOpen,
    }),
    [
      formData,
      handleGenerate,
      handleDownload,
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
      setIsEditPopupOpen,
      setIsBottomSheetOpen,
    ]
  );

  if (isMobile) {
    return (
      <FanmeetingStudioMobileView hook={hook} showResult={showMobileResult} />
    );
  }

  return (
    <FanmeetingStudioDesktopView
      hook={hook}
      formData={formData || { backgroundPrompt: '', situationPrompt: '' }}
    />
  );
});

export default FanmeetingStudioClient;
