'use client';

import { forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import {
  useVirtualCasting,
  VirtualCastingFormData,
} from '../_hooks/useVirtualCasting';
import VirtualCastingMobileView from './VirtualCastingMobileView';
import VirtualCastingDesktopView from './VirtualCastingDesktopView';
import { useIsMobile } from '@/hooks/useMediaQuery';

interface VirtualCastingClientProps {
  formData?: VirtualCastingFormData;
  onStateChange?: (state: {
    showMobileResult?: boolean;
    resultImage?: string | null;
    isProcessing?: boolean;
    isPolling?: boolean;
    uploadedFile?: File | null;
    isBottomSheetOpen?: boolean;
  }) => void;
}

export interface VirtualCastingClientRef {
  handleGenerate: () => void;
  handleDownload: () => void;
  handleEdit: () => void;
  handleReset: () => void;
  isProcessing: boolean;
  isPolling: boolean;
  resultImage: string | null;
  uploadedFile: File | null;
  showMobileResult: boolean;
  isEditLoading: boolean;
  isBackgroundProcessing: boolean;
  checkTaskStatus: (taskId: number) => Promise<void>;
  currentTaskId: number | null;
  setIsBottomSheetOpen: (isOpen: boolean) => void;
}

const VirtualCastingClient = forwardRef<
  VirtualCastingClientRef,
  VirtualCastingClientProps
>(function VirtualCastingClient({ formData, onStateChange }, ref) {
  const hook = useVirtualCasting();
  const [showMobileResult, setShowMobileResult] = useState(false);

  const {
    uploadedFile,
    isProcessing,
    isPolling,
    resultImage,
    isEditLoading,
    isBackgroundProcessing,
    isBottomSheetOpen,
    handleGenerate,
    handleDownload,
    handleReset,
    setIsEditPopupOpen,
    setIsBottomSheetOpen,
    checkTaskStatus,
    currentTaskId,
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
    onStateChange?.({
      showMobileResult,
      resultImage,
      isProcessing,
      isPolling,
      uploadedFile,
      isBottomSheetOpen,
    });
  }, [
    showMobileResult,
    resultImage,
    isProcessing,
    isPolling,
    uploadedFile,
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
      uploadedFile,
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
      uploadedFile,
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
      <VirtualCastingMobileView hook={hook} showResult={showMobileResult} />
    );
  }

  return (
    <VirtualCastingDesktopView
      hook={hook}
      formData={formData || { selectedCharacter: null }}
    />
  );
});

export default VirtualCastingClient;
