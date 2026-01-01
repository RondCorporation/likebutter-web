import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { useRouter, usePathname } from 'next/navigation';
import {
  createVideoGenerationTask,
  VideoGenerationRequest,
} from '@/app/_lib/apis/task.api';
import { useTaskSSE } from '@/hooks/useTaskSSE';
import { CREDIT_COSTS } from '@/app/_lib/apis/credit.api';
import { useCreditStore } from '@/app/_stores/creditStore';
import { downloadFile } from '@/app/_utils/download';

export interface VideoGenerationFormData {
  prompt?: string;
  negativePrompt?: string;
  duration?: 5 | 10;
}

export interface UseVideoGenerationReturn {
  uploadedFile: File | null;
  previewUrl: string;
  setUploadedFile: (file: File | null) => void;
  setPreviewUrl: (url: string) => void;
  handleFileUpload: (file: File) => void;

  isDragOver: boolean;
  setIsDragOver: (isDragOver: boolean) => void;
  handleDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  handleDragLeave: (event: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (event: React.DragEvent<HTMLDivElement>) => void;

  isGenerating: boolean;
  resultVideo: string | null;
  isPolling: boolean;
  isBackgroundProcessing: boolean;

  isResetPopupOpen: boolean;
  setIsResetPopupOpen: (isOpen: boolean) => void;

  isBottomSheetOpen: boolean;
  setIsBottomSheetOpen: (isOpen: boolean) => void;

  handleGenerate: (formData: VideoGenerationFormData) => Promise<void>;
  handleDownload: () => Promise<void>;
  handleReset: () => void;
  isFormValid: (formData: VideoGenerationFormData) => boolean;

  checkTaskStatus: (taskId: number) => Promise<void>;
  currentTaskId: number | null;
}

export function useVideoGeneration(): UseVideoGenerationReturn {
  const { t } = useTranslation(['studio', 'common']);
  const { deductCredit } = useCreditStore();
  const router = useRouter();
  const pathname = usePathname();
  const lang = pathname.split('/')[1];

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const [isDragOver, setIsDragOver] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [resultVideo, setResultVideo] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const [isResetPopupOpen, setIsResetPopupOpen] = useState(false);

  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const {
    isPolling,
    isBackgroundProcessing,
    startPolling,
    stopPolling,
    stopBackgroundProcessing,
    checkTaskStatus,
    currentTaskId,
  } = useTaskSSE({
    onCompleted: (result) => {
      if (result.actionType === 'VIDEO_GENERATION') {
        const videoUrl = result.videoGeneration?.videoUrl || null;
        const downloadUrlFromTask = result.videoGeneration?.downloadUrl || null;

        if (videoUrl) {
          setResultVideo(videoUrl);
          setDownloadUrl(downloadUrlFromTask);
          toast.success(t('studio:videoGeneration.messages.generationComplete'));
        }
      }
      setIsGenerating(false);
    },
    onFailed: () => {
      toast.error(t('studio:videoGeneration.generationFailed'));
      setIsGenerating(false);
    },
  });

  const handleFileUpload = useCallback(
    (file: File) => {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(t('studio:videoGeneration.messages.fileSizeExceeded'));
        return;
      }

      if (!['image/png', 'image/jpg', 'image/jpeg'].includes(file.type)) {
        toast.error(t('studio:videoGeneration.messages.unsupportedFormat'));
        return;
      }

      setUploadedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setIsBottomSheetOpen(true);
    },
    [t]
  );

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

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragOver(false);

      const files = event.dataTransfer.files;
      if (files.length > 0) {
        handleFileUpload(files[0]);
      }
    },
    [handleFileUpload]
  );

  const handleGenerate = useCallback(
    async (formData: VideoGenerationFormData) => {
      if (!uploadedFile) return;

      setIsGenerating(true);
      setResultVideo(null);

      try {
        const request: VideoGenerationRequest = {
          prompt: formData.prompt,
          negativePrompt: formData.negativePrompt,
          duration: formData.duration || 5,
        };

        const response = await createVideoGenerationTask(uploadedFile, request);

        if ((response as any).isInsufficientCredit) {
          setIsGenerating(false);
          router.push(`/${lang}/billing`);
          return;
        }

        if (response.status === 200 && response.data) {
          deductCredit(CREDIT_COSTS.VIDEO_GENERATION);
          toast.success(t('studio:videoGeneration.messages.requestSent'));
          startPolling(response.data.taskId);
        } else {
          throw new Error(`Failed to create task: ${response.status}`);
        }
      } catch (error: any) {
        console.error('Error creating video generation task:', error);
        toast.error(t('studio:videoGeneration.generationFailed'));
        setIsGenerating(false);
      }
    },
    [uploadedFile, deductCredit, t, startPolling, router, lang]
  );

  const handleDownload = useCallback(async () => {
    const urlToDownload = downloadUrl || resultVideo;
    if (!urlToDownload) return;

    try {
      await downloadFile(urlToDownload, `video-generation-${Date.now()}.mp4`);
      toast.success(t('studio:videoGeneration.messages.downloadComplete'));
    } catch (error) {
      console.error('Download failed:', error);
      toast.error(t('studio:videoGeneration.messages.downloadFailed'));
    }
  }, [downloadUrl, resultVideo, t]);

  const handleReset = useCallback(() => {
    stopPolling();
    stopBackgroundProcessing();

    setIsGenerating(false);

    setResultVideo(null);
    setDownloadUrl(null);
    setUploadedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl('');

    setIsResetPopupOpen(false);

    setIsBottomSheetOpen(false);
    setIsDragOver(false);
  }, [previewUrl, stopPolling, stopBackgroundProcessing]);

  const isFormValid = useCallback(
    (formData: VideoGenerationFormData) => {
      if (!uploadedFile) return false;
      return true;
    },
    [uploadedFile]
  );

  return {
    uploadedFile,
    previewUrl,
    setUploadedFile,
    setPreviewUrl,
    handleFileUpload,

    isDragOver,
    setIsDragOver,
    handleDragOver,
    handleDragLeave,
    handleDrop,

    isGenerating,
    resultVideo,
    isPolling,
    isBackgroundProcessing,

    isResetPopupOpen,
    setIsResetPopupOpen,

    isBottomSheetOpen,
    setIsBottomSheetOpen,

    handleGenerate,
    handleDownload,
    handleReset,
    isFormValid,

    checkTaskStatus,
    currentTaskId,
  };
}
