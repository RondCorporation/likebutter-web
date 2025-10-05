import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import {
  createDigitalGoodsTask,
  DigitalGoodsRequest,
  DigitalGoodsStyle,
  editTask,
} from '@/app/_lib/apis/task.api';
import { useTaskPolling } from '@/hooks/useTaskPolling';
import { CREDIT_COSTS } from '@/app/_lib/apis/credit.api';
import { useCreditStore } from '@/app/_stores/creditStore';

export interface DigitalGoodsFormData {
  style?: DigitalGoodsStyle;
}

export interface UseDigitalGoodsReturn {
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
  isGenerating: boolean;
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
  handleGenerate: (formData: DigitalGoodsFormData) => Promise<void>;
  handleDownload: () => Promise<void>;
  handleEditRequest: (editRequest: string) => Promise<void>;
  handleReset: () => void;
  isFormValid: (formData: DigitalGoodsFormData) => boolean;

  // Task polling
  checkTaskStatus: (taskId: number) => Promise<void>;
  currentTaskId: number | null;
}

export function useDigitalGoods(): UseDigitalGoodsReturn {
  const { t } = useTranslation(['studio', 'common']);
  const { deductCredit } = useCreditStore();

  // File state
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  // Drag & Drop state
  const [isDragOver, setIsDragOver] = useState(false);

  // Processing state
  const [isGenerating, setIsGenerating] = useState(false);
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
      const details = result.details as any;
      if (details?.result?.imageUrl) {
        setResultImage(details.result.imageUrl);
        toast.success(t('studio:digitalGoods.messages.generationComplete'));
      }
      setIsGenerating(false);
      setIsEditLoading(false);
    },
    onFailed: () => {
      toast.error(t('studio:digitalGoods.generationFailed'));
      setIsGenerating(false);
      setIsEditLoading(false);
    },
  });

  const handleFileUpload = useCallback(
    (file: File) => {
      if (file.size > 200 * 1024 * 1024) {
        toast.error(t('studio:digitalGoods.messages.fileSizeExceeded'));
        return;
      }

      if (!['image/png', 'image/jpg', 'image/jpeg'].includes(file.type)) {
        toast.error(t('studio:digitalGoods.messages.unsupportedFormat'));
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
    async (formData: DigitalGoodsFormData) => {
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

        if ((response as any).isInsufficientCredit) {
          setIsGenerating(false);
          return;
        }

        if (response.status === 200 && response.data) {
          deductCredit(CREDIT_COSTS.DIGITAL_GOODS);
          toast.success(t('studio:digitalGoods.messages.requestSent'));
          startPolling(response.data.taskId);
        } else {
          throw new Error(`Failed to create task: ${response.status}`);
        }
      } catch (error: any) {
        console.error('Error creating digital goods task:', error);
        toast.error(t('studio:digitalGoods.generationFailed'));
        setIsGenerating(false);
      }
    },
    [uploadedFile, deductCredit, t, startPolling]
  );

  const handleDownload = useCallback(async () => {
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

      toast.success(t('studio:digitalGoods.messages.downloadComplete'));
    } catch (error) {
      console.error('Download failed:', error);
      toast.error(t('studio:digitalGoods.messages.downloadFailed'));
    }
  }, [resultImage, t]);

  const handleEditRequest = useCallback(
    async (editRequest: string) => {
      if (!taskData || !taskData.taskId) {
        toast.error('Cannot find original task.');
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

        if ((response as any).isInsufficientCredit) {
          setIsEditLoading(false);
          return;
        }

        if (response.data) {
          deductCredit(CREDIT_COSTS.IMAGE_EDIT);
          toast.success('Edit request has been sent!');
          startPolling(response.data.taskId);
        } else {
          toast.error('Edit request failed.');
          setIsEditLoading(false);
        }
      } catch (error: any) {
        console.error('Edit request failed:', error);
        toast.error('Edit request failed.');
        setIsEditLoading(false);
      }
    },
    [taskData, deductCredit, startPolling]
  );

  const handleReset = useCallback(() => {
    setUploadedFile(null);
    setPreviewUrl('');
    setResultImage(null);
    setIsGenerating(false);
    setIsEditPopupOpen(false);
    setIsEditLoading(false);
    setIsResetPopupOpen(false);
    setIsBottomSheetOpen(false);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    toast.success(t('studio:digitalGoods.messages.workReset'));
  }, [previewUrl, t]);

  const isFormValid = useCallback(
    (formData: DigitalGoodsFormData) => {
      if (!uploadedFile) return false;
      if (!formData) return false;
      if (!formData.style) return false;
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
    isGenerating,
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
