'use client';

import { forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import {
  useVideoGeneration,
  VideoGenerationFormData,
} from '../_hooks/useVideoGeneration';
import VideoGenerationMobileView from './VideoGenerationMobileView';
import VideoGenerationDesktopView from './VideoGenerationDesktopView';
import { useIsMobile } from '@/hooks/useMediaQuery';

interface VideoGenerationClientProps {
  formData?: VideoGenerationFormData;
  onStateChange?: (state: {
    showMobileResult?: boolean;
    resultVideo?: string | null;
    isGenerating?: boolean;
    isPolling?: boolean;
    uploadedFile?: File | null;
    isBottomSheetOpen?: boolean;
  }) => void;
}

export interface VideoGenerationClientRef {
  handleGenerate: () => void;
  handleReset: () => void;
  isGenerating: boolean;
  isPolling: boolean;
  isBackgroundProcessing: boolean;
  resultVideo: string | null;
  showMobileResult: boolean;
  checkTaskStatus: (taskId: number) => Promise<void>;
  currentTaskId: number | null;
  uploadedFile: File | null;
  setIsBottomSheetOpen: (isOpen: boolean) => void;
}

const VideoGenerationClient = forwardRef<
  VideoGenerationClientRef,
  VideoGenerationClientProps
>(function VideoGenerationClient({ formData, onStateChange }, ref) {
  const hook = useVideoGeneration();
  const [showMobileResult, setShowMobileResult] = useState(false);

  const {
    uploadedFile,
    isGenerating,
    isPolling,
    resultVideo,
    isBackgroundProcessing,
    handleGenerate,
    handleReset,
    checkTaskStatus,
    currentTaskId,
    isBottomSheetOpen,
    setIsBottomSheetOpen,
  } = hook;

  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile && resultVideo) {
      setShowMobileResult(true);
    } else {
      setShowMobileResult(false);
    }
  }, [isMobile, resultVideo]);

  useEffect(() => {
    onStateChange?.({
      showMobileResult,
      resultVideo,
      isGenerating,
      isPolling,
      uploadedFile,
      isBottomSheetOpen,
    });
  }, [
    showMobileResult,
    resultVideo,
    isGenerating,
    isPolling,
    uploadedFile,
    isBottomSheetOpen,
    onStateChange,
  ]);

  useImperativeHandle(
    ref,
    () => ({
      handleGenerate: () => {
        if (formData) {
          handleGenerate(formData);
        }
      },
      handleReset,
      isGenerating,
      isPolling,
      isBackgroundProcessing,
      resultVideo,
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
      resultVideo,
      showMobileResult,
      checkTaskStatus,
      currentTaskId,
      uploadedFile,
      setIsBottomSheetOpen,
    ]
  );

  if (isMobile) {
    return <VideoGenerationMobileView hook={hook} showResult={showMobileResult} />;
  }

  return <VideoGenerationDesktopView hook={hook} formData={formData || {}} />;
});

export default VideoGenerationClient;
