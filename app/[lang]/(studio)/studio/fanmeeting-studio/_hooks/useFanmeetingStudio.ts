import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { useRouter, usePathname } from 'next/navigation';
import {
  createFanmeetingStudioTask,
  FanmeetingStudioRequest,
  editTask,
} from '@/app/_lib/apis/task.api';
import { useTaskPolling } from '@/hooks/useTaskPolling';
import { CREDIT_COSTS } from '@/app/_lib/apis/credit.api';
import { useCreditStore } from '@/app/_stores/creditStore';

export interface FanmeetingFormData {
  backgroundPrompt: string;
  situationPrompt: string;
}

export interface UseFanmeetingStudioReturn {
  // File state
  idolFile: File | null;
  userFile: File | null;
  idolPreviewUrl: string;
  userPreviewUrl: string;
  setIdolFile: (file: File | null) => void;
  setUserFile: (file: File | null) => void;
  setIdolPreviewUrl: (url: string) => void;
  setUserPreviewUrl: (url: string) => void;
  handleFileUpload: (file: File, type: 'idol' | 'user') => void;

  // Drag & Drop state
  isDragOverIdol: boolean;
  isDragOverUser: boolean;
  setIsDragOverIdol: (isDragOver: boolean) => void;
  setIsDragOverUser: (isDragOver: boolean) => void;
  handleDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  handleDragLeave: (event: React.DragEvent<HTMLDivElement>) => void;
  handleDropIdol: (event: React.DragEvent<HTMLDivElement>) => void;
  handleDropUser: (event: React.DragEvent<HTMLDivElement>) => void;

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
  handleGenerate: (formData: FanmeetingFormData) => Promise<void>;
  handleDownload: () => Promise<void>;
  handleEditRequest: (editRequest: string) => Promise<void>;
  handleReset: () => void;
  isFormValid: (formData: FanmeetingFormData) => boolean;

  // Task polling
  checkTaskStatus: (taskId: number) => Promise<void>;
  currentTaskId: number | null;
}

export function useFanmeetingStudio(): UseFanmeetingStudioReturn {
  const { t } = useTranslation(['studio']);
  const { deductCredit } = useCreditStore();
  const router = useRouter();
  const pathname = usePathname();
  const lang = pathname.split('/')[1];

  // File state
  const [idolFile, setIdolFile] = useState<File | null>(null);
  const [userFile, setUserFile] = useState<File | null>(null);
  const [idolPreviewUrl, setIdolPreviewUrl] = useState<string>('');
  const [userPreviewUrl, setUserPreviewUrl] = useState<string>('');

  // Drag & Drop state
  const [isDragOverIdol, setIsDragOverIdol] = useState(false);
  const [isDragOverUser, setIsDragOverUser] = useState(false);

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
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
    checkTaskStatus,
    currentTaskId,
  } = useTaskPolling({
    onCompleted: (result) => {
      // Check for both FANMEETING_STUDIO and FANMEETING_STUDIO_EDIT
      const imageUrl =
        (result.actionType === 'FANMEETING_STUDIO' ||
          result.actionType === 'FANMEETING_STUDIO_EDIT') &&
        result.fanmeetingStudio?.imageUrl
          ? result.fanmeetingStudio.imageUrl
          : null;

      if (imageUrl) {
        setResultImage(imageUrl);
        toast.success(t('fanmeeting.messages.fanmeetingComplete'));
      }
      setIsProcessing(false);
      setIsEditLoading(false);
    },
    onFailed: () => {
      toast.error(t('fanmeeting.messages.fanmeetingFailed'));
      setIsProcessing(false);
      setIsEditLoading(false);
    },
  });

  const handleFileUpload = useCallback(
    (file: File, type: 'idol' | 'user') => {
      if (file.size > 200 * 1024 * 1024) {
        toast.error(t('fanmeeting.messages.fileSizeExceeded'));
        return;
      }

      if (!['image/png', 'image/jpg', 'image/jpeg'].includes(file.type)) {
        toast.error(t('fanmeeting.messages.unsupportedFormat'));
        return;
      }

      if (type === 'idol') {
        setIdolFile(file);
        const url = URL.createObjectURL(file);
        setIdolPreviewUrl(url);
      } else {
        setUserFile(file);
        const url = URL.createObjectURL(file);
        setUserPreviewUrl(url);
      }
      setIsBottomSheetOpen(true); // Open BottomSheet after successful upload
    },
    [t]
  );

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
    },
    []
  );

  const handleDragLeave = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
    },
    []
  );

  const handleDropIdol = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragOverIdol(false);

      const files = event.dataTransfer.files;
      if (files.length > 0) {
        handleFileUpload(files[0], 'idol');
      }
    },
    [handleFileUpload]
  );

  const handleDropUser = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragOverUser(false);

      const files = event.dataTransfer.files;
      if (files.length > 0) {
        handleFileUpload(files[0], 'user');
      }
    },
    [handleFileUpload]
  );

  const handleGenerate = useCallback(
    async (formData: FanmeetingFormData) => {
      if (!formData || !idolFile || !userFile) return;

      setIsProcessing(true);
      setResultImage(null);

      try {
        const request: FanmeetingStudioRequest = {
          situationPrompt: formData.situationPrompt,
          backgroundPrompt: formData.backgroundPrompt,
        };

        const response = await createFanmeetingStudioTask(
          userFile,
          idolFile,
          request
        );

        if ((response as any).isInsufficientCredit) {
          setIsProcessing(false);
          router.push(`/${lang}/billing`);
          // TODO: 플랜에 따라 이미 구독된 사람이면 크레딧 결제 쪽으로 이동하는 부분 고려하기
          return;
        }

        if (response.status === 200 && response.data) {
          deductCredit(CREDIT_COSTS.FANMEETING_STUDIO);
          toast.success(t('fanmeeting.messages.requestSent'));
          startPolling(response.data.taskId);
        } else {
          throw new Error('API request failed');
        }
      } catch (error: any) {
        console.error('Failed to generate fanmeeting result:', error);
        toast.error(t('fanmeeting.messages.requestFailed'));
        setIsProcessing(false);
      }
    },
    [idolFile, userFile, deductCredit, t, startPolling]
  );

  const handleDownload = useCallback(async () => {
    if (!resultImage) return;

    try {
      const response = await fetch(resultImage);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `fanmeeting-result-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(t('fanmeeting.messages.downloadComplete'));
    } catch (error) {
      console.error('Download failed:', error);
      toast.error(t('fanmeeting.messages.downloadFailed'));
    }
  }, [resultImage, t]);

  const handleEditRequest = useCallback(
    async (editRequest: string) => {
      if (!taskData || !taskData.taskId) {
        toast.error(t('fanmeeting.messages.originalNotFound'));
        return;
      }

      setIsEditLoading(true);
      setIsEditPopupOpen(false);

      try {
        const response = await editTask(
          taskData.taskId,
          'FANMEETING_STUDIO',
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
          toast.success(t('fanmeeting.messages.editRequestSent'));
          startPolling(response.data.taskId);
        } else {
          toast.error(t('fanmeeting.messages.editRequestFailed'));
          setIsEditLoading(false);
        }
      } catch (error: any) {
        console.error('Edit request failed:', error);
        toast.error(t('fanmeeting.messages.editRequestFailed'));
        setIsEditLoading(false);
      }
    },
    [taskData, deductCredit, t, startPolling]
  );

  const handleReset = useCallback(() => {
    setIdolFile(null);
    setUserFile(null);
    setIdolPreviewUrl('');
    setUserPreviewUrl('');
    setResultImage(null);
    setIsProcessing(false);
    setIsEditPopupOpen(false);
    setIsEditLoading(false);
    setIsResetPopupOpen(false);
    setIsBottomSheetOpen(false);

    if (idolPreviewUrl) {
      URL.revokeObjectURL(idolPreviewUrl);
    }
    if (userPreviewUrl) {
      URL.revokeObjectURL(userPreviewUrl);
    }

    toast.success(t('fanmeeting.messages.workReset'));
  }, [idolPreviewUrl, userPreviewUrl, t]);

  const isFormValid = useCallback(
    (formData: FanmeetingFormData) => {
      if (!idolFile || !userFile) return false;
      if (!formData) return false;
      if (
        !formData.backgroundPrompt ||
        formData.backgroundPrompt.trim().length < 2
      )
        return false;
      if (
        !formData.situationPrompt ||
        formData.situationPrompt.trim().length < 2
      )
        return false;
      return true;
    },
    [idolFile, userFile]
  );

  return {
    // File state
    idolFile,
    userFile,
    idolPreviewUrl,
    userPreviewUrl,
    setIdolFile,
    setUserFile,
    setIdolPreviewUrl,
    setUserPreviewUrl,
    handleFileUpload,

    // Drag & Drop state
    isDragOverIdol,
    isDragOverUser,
    setIsDragOverIdol,
    setIsDragOverUser,
    handleDragOver,
    handleDragLeave,
    handleDropIdol,
    handleDropUser,

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
