'use client';

import { forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import {
  useDigitalGoods,
  DigitalGoodsFormData,
} from '../_hooks/useDigitalGoods';
import DigitalGoodsMobileView from './DigitalGoodsMobileView';
import DigitalGoodsDesktopView from './DigitalGoodsDesktopView';
import { useIsMobile } from '@/hooks/useMediaQuery';

interface DigitalGoodsClientProps {
  formData?: DigitalGoodsFormData;
  onStateChange?: (state: {
    showMobileResult?: boolean;
    resultImage?: string | null;
    isGenerating?: boolean;
    isPolling?: boolean;
    uploadedFile?: File | null;
    isBottomSheetOpen?: boolean;
  }) => void;
}

export interface DigitalGoodsClientRef {
  handleGenerate: () => void;
  handleEdit: () => void;
  handleReset: () => void;
  isGenerating: boolean;
  isPolling: boolean;
  isBackgroundProcessing: boolean;
  resultImage: string | null;
  isEditLoading: boolean;
  showMobileResult: boolean;
  checkTaskStatus: (taskId: number) => Promise<void>;
  currentTaskId: number | null;
  uploadedFile: File | null;
  setIsBottomSheetOpen: (isOpen: boolean) => void;
}

const DigitalGoodsClient = forwardRef<
  DigitalGoodsClientRef,
  DigitalGoodsClientProps
>(function DigitalGoodsClient({ formData, onStateChange }, ref) {
  const hook = useDigitalGoods();
  const [showMobileResult, setShowMobileResult] = useState(false);

  const {
    uploadedFile,
    isGenerating,
    isPolling,
    resultImage,
    isEditLoading,
    isBackgroundProcessing,
    handleGenerate,
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
    onStateChange?.({
      showMobileResult,
      resultImage,
      isGenerating,
      isPolling,
      uploadedFile,
      isBottomSheetOpen,
    });
  }, [
    showMobileResult,
    resultImage,
    isGenerating,
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
      handleEdit: () => setIsEditPopupOpen(true),
      handleReset,
      isGenerating,
      isPolling,
      isBackgroundProcessing,
      resultImage,
      isEditLoading,
      showMobileResult,
      checkTaskStatus,
      currentTaskId,
      uploadedFile,
      setIsBottomSheetOpen,
    }),
    [
      formData,
      handleGenerate,
      handleReset,
      isGenerating,
      isPolling,
      isBackgroundProcessing,
      resultImage,
      isEditLoading,
      showMobileResult,
      checkTaskStatus,
      currentTaskId,
      uploadedFile,
      setIsEditPopupOpen,
      setIsBottomSheetOpen,
    ]
  );

  if (isMobile) {
    return <DigitalGoodsMobileView hook={hook} showResult={showMobileResult} />;
  }

  return <DigitalGoodsDesktopView hook={hook} formData={formData || {}} />;
});

export default DigitalGoodsClient;
