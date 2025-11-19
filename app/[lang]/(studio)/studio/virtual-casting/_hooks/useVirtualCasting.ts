import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { useRouter, usePathname } from 'next/navigation';
import {
  createVirtualCastingTask,
  VirtualCastingRequest,
  VirtualCastingStyle,
  editTask,
} from '@/app/_lib/apis/task.api';
import { useTaskSSE } from '@/hooks/useTaskSSE';
import { CREDIT_COSTS } from '@/app/_lib/apis/credit.api';
import { useCreditStore } from '@/app/_stores/creditStore';
import { downloadFile } from '@/app/_utils/download';

export interface VirtualCastingFormData {
  selectedCharacter: {
    name: string;
    image: string;
    style: VirtualCastingStyle;
  } | null;
}

export interface UseVirtualCastingReturn {
  // File state
  uploadedFile: File | null;
  previewUrl: string;
  setUploadedFile: (file: File | null) => void;
  setPreviewUrl: (url: string) => void;
  handleFileUpload: (file: File) => void;

  // Drag & Drop state
  isDragOver: boolean;
  setIsDragOver: (isDragOver: boolean) => void;
  handleDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  handleDragLeave: (event: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (event: React.DragEvent<HTMLDivElement>) => void;

  // Processing state
  isProcessing: boolean;
  resultImage: string | null;
  isEditLoading: boolean;
  isPolling: boolean;
  isBackgroundProcessing: boolean;

  // Popup state
  isEditPopupOpen: boolean;
  setIsEditPopupOpen: (isOpen: boolean) => void;
  isResetPopupOpen: boolean;
  setIsResetPopupOpen: (isOpen: boolean) => void;

  // BottomSheet state
  isBottomSheetOpen: boolean;
  setIsBottomSheetOpen: (isOpen: boolean) => void;

  // Actions
  handleGenerate: (formData: VirtualCastingFormData) => Promise<void>;
  handleDownload: () => Promise<void>;
  handleEditRequest: (editRequest: string) => Promise<void>;
  handleReset: () => void;
  isFormValid: (formData: VirtualCastingFormData) => boolean;

  // Task polling
  checkTaskStatus: (taskId: number) => Promise<void>;
  currentTaskId: number | null;
}

export function useVirtualCasting(): UseVirtualCastingReturn {
  const { t } = useTranslation(['studio']);
  const { deductCredit } = useCreditStore();
  const router = useRouter();
  const pathname = usePathname();
  const lang = pathname.split('/')[1];

  // File state
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  // Drag & Drop state
  const [isDragOver, setIsDragOver] = useState(false);

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [isEditLoading, setIsEditLoading] = useState(false);

  // Popup state
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isResetPopupOpen, setIsResetPopupOpen] = useState(false);

  // BottomSheet state
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const {
    taskData,
    isPolling,
    isBackgroundProcessing,
    startPolling,
    stopPolling,
    stopBackgroundProcessing,
    checkTaskStatus,
    currentTaskId,
  } = useTaskSSE({
    onCompleted: (result) => {
      if (
        result.actionType === 'VIRTUAL_CASTING' ||
        result.actionType === 'VIRTUAL_CASTING_EDIT'
      ) {
        const imageUrl = result.virtualCasting?.imageUrl || null;
        const downloadUrlFromTask = result.virtualCasting?.downloadUrl || null;

        if (imageUrl) {
          setResultImage(imageUrl);
          setDownloadUrl(downloadUrlFromTask);
          toast.success(t('virtualCasting.messages.castingComplete'));
        }
      }
      setIsProcessing(false);
      setIsEditLoading(false);
    },
    onFailed: () => {
      toast.error(t('virtualCasting.messages.castingFailed'));
      setIsProcessing(false);
      setIsEditLoading(false);
    },
  });

  const handleFileUpload = useCallback(
    (file: File) => {
      if (file.size > 10 * 1024 * 1024) {
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
      setIsBottomSheetOpen(true); // Open BottomSheet after successful upload
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
    async (formData: VirtualCastingFormData) => {
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
          router.push(`/${lang}/billing`);
          // TODO: 플랜에 따라 이미 구독된 사람이면 크레딧 결제 쪽으로 이동하는 부분 고려하기
          return;
        }

        if (response.status === 200 && response.data) {
          deductCredit(CREDIT_COSTS.VIRTUAL_CASTING);
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
    },
    [uploadedFile, deductCredit, t, startPolling]
  );

  const handleDownload = useCallback(async () => {
    const urlToDownload = downloadUrl || resultImage;
    if (!urlToDownload) return;

    try {
      await downloadFile(
        urlToDownload,
        `virtual-casting-result-${Date.now()}.png`
      );
      toast.success(t('virtualCasting.messages.downloadComplete'));
    } catch (error) {
      console.error('Download failed:', error);
      toast.error(t('virtualCasting.messages.downloadFailed'));
    }
  }, [downloadUrl, resultImage, t]);

  const handleEditRequest = useCallback(
    async (editRequest: string) => {
      if (!taskData || !taskData.taskId) {
        toast.error(t('virtualCasting.messages.originalNotFound'));
        return;
      }

      setIsEditLoading(true);
      setIsEditPopupOpen(false);

      try {
        const response = await editTask(
          taskData.taskId,
          'VIRTUAL_CASTING',
          editRequest
        );

        if ((response as any).isInsufficientCredit) {
          setIsEditLoading(false);
          router.push(`/${lang}/billing`);
          // TODO: 플랜에 따라 이미 구독된 사람이면 크레딧 결제 쪽으로 이동하는 부분 고려하기
          return;
        }

        if (response.data) {
          deductCredit(CREDIT_COSTS.IMAGE_EDIT);
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
    },
    [taskData, deductCredit, t, startPolling]
  );

  const handleReset = useCallback(() => {
    // 1. Stop all polling first
    stopPolling();
    stopBackgroundProcessing();

    // 2. Reset processing states
    setIsProcessing(false);
    setIsEditLoading(false);

    // 3. Clear result and file states
    setResultImage(null);
    setDownloadUrl(null);
    setUploadedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl('');

    // 4. Close all popups
    setIsEditPopupOpen(false);
    setIsResetPopupOpen(false);

    // 5. Reset UI states
    setIsBottomSheetOpen(false);
    setIsDragOver(false);
  }, [previewUrl, stopPolling, stopBackgroundProcessing]);

  const isFormValid = useCallback(
    (formData: VirtualCastingFormData) => {
      if (!uploadedFile) return false;
      if (!formData) return false;
      if (!formData.selectedCharacter) return false;
      return true;
    },
    [uploadedFile]
  );

  return {
    // File state
    uploadedFile,
    previewUrl,
    setUploadedFile,
    setPreviewUrl,
    handleFileUpload,

    // Drag & Drop state
    isDragOver,
    setIsDragOver,
    handleDragOver,
    handleDragLeave,
    handleDrop,

    // Processing state
    isProcessing,
    resultImage,
    isEditLoading,
    isPolling,
    isBackgroundProcessing,

    // Popup state
    isEditPopupOpen,
    setIsEditPopupOpen,
    isResetPopupOpen,
    setIsResetPopupOpen,

    // BottomSheet state
    isBottomSheetOpen,
    setIsBottomSheetOpen,

    // Actions
    handleGenerate,
    handleDownload,
    handleEditRequest,
    handleReset,
    isFormValid,

    // Task polling
    checkTaskStatus,
    currentTaskId,
  };
}
