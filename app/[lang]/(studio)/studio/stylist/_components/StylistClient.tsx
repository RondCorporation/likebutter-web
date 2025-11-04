'use client';

import { forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import { useStylist, StylistFormData } from '../_hooks/useStylist';
import StylistMobileView from './StylistMobileView';
import StylistDesktopView from './StylistDesktopView';
import { useIsMobile } from '@/hooks/useMediaQuery';

interface StylistClientProps {
  formData?: StylistFormData;
  onStateChange?: (state: {
    showMobileResult?: boolean;
    resultImage?: string | null;
    isProcessing?: boolean;
    isPolling?: boolean;
    uploadedFile?: File | null;
    isBottomSheetOpen?: boolean;
    uploadedFiles?: {
      hairStyleImage?: File;
      outfitImage?: File;
      backgroundImage?: File;
      accessoryImage?: File;
      moodImage?: File;
    };
  }) => void;
}

export interface StylistClientRef {
  handleGenerate: () => void;
  handleDownload: () => void;
  handleEdit: () => void;
  handleReset: () => void;
  isProcessing: boolean;
  isPolling: boolean;
  isBackgroundProcessing: boolean;
  resultImage: string | null;
  uploadedFile: File | null;
  uploadedFiles: {
    hairStyleImage?: File;
    outfitImage?: File;
    backgroundImage?: File;
    accessoryImage?: File;
    moodImage?: File;
  };
  showMobileResult: boolean;
  isEditLoading: boolean;
  checkTaskStatus: (taskId: number) => Promise<void>;
  currentTaskId: number | null;
  setIsBottomSheetOpen: (isOpen: boolean) => void;
}

const StylistClient = forwardRef<StylistClientRef, StylistClientProps>(
  function StylistClient({ formData, onStateChange }, ref) {
    const hook = useStylist();
    const [showMobileResult, setShowMobileResult] = useState(false);

    const {
      uploadedFile,
      uploadedFiles,
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
      onStateChange?.({
        showMobileResult,
        resultImage,
        isProcessing,
        isPolling,
        uploadedFile,
        isBottomSheetOpen,
        uploadedFiles,
      });
    }, [
      showMobileResult,
      resultImage,
      isProcessing,
      isPolling,
      uploadedFile,
      isBottomSheetOpen,
      uploadedFiles,
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
        isBackgroundProcessing,
        resultImage,
        uploadedFile,
        uploadedFiles,
        showMobileResult,
        isEditLoading,
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
        isBackgroundProcessing,
        resultImage,
        uploadedFile,
        uploadedFiles,
        showMobileResult,
        isEditLoading,
        checkTaskStatus,
        currentTaskId,
        setIsEditPopupOpen,
        setIsBottomSheetOpen,
      ]
    );

    if (isMobile) {
      return (
        <StylistMobileView
          hook={hook}
          showResult={showMobileResult}
          formData={formData}
        />
      );
    }

    return (
      <StylistDesktopView
        hook={hook}
        formData={
          formData || {
            mode: 'text',
            textPrompt: '',
            imagePrompt: '',
            imageSettings: {
              hairstyle: false,
              costume: false,
              background: false,
              accessory: false,
              atmosphere: false,
            },
            uploadedFiles: {},
          }
        }
      />
    );
  }
);

export default StylistClient;
