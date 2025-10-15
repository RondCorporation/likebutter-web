import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { useRouter, usePathname } from 'next/navigation';
import {
  createStylistTask,
  StylistRequest,
  editTask,
} from '@/app/_lib/apis/task.api';
import { useTaskPolling } from '@/hooks/useTaskPolling';
import { CREDIT_COSTS } from '@/app/_lib/apis/credit.api';
import { useCreditStore } from '@/app/_stores/creditStore';

export interface StylistFormData {
  mode: 'text' | 'image';
  textPrompt?: string;
  imagePrompt?: string;
  imageSettings?: {
    hairstyle: boolean;
    costume: boolean;
    background: boolean;
    accessory: boolean;
    atmosphere: boolean;
  };
  uploadedFiles?: {
    hairStyleImage?: File;
    outfitImage?: File;
    backgroundImage?: File;
    accessoryImage?: File;
    moodImage?: File;
  };
}

export interface UseStylistReturn {
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

  // Additional image state
  additionalImagePreviews: { [key: string]: string };
  handleAdditionalFileUpload: (
    slotId: string,
    file: File,
    formData?: StylistFormData
  ) => void;
  handleAdditionalFileRemove: (
    slotId: string,
    formData?: StylistFormData
  ) => void;
  getImageUploadSlots: (formData?: StylistFormData) => Array<{
    id: string;
    label: string;
    previewUrl: string | undefined;
  }>;

  // Actions
  handleGenerate: (formData: StylistFormData) => Promise<void>;
  handleDownload: () => Promise<void>;
  handleEditRequest: (editRequest: string) => Promise<void>;
  handleReset: () => void;
  isFormValid: (formData: StylistFormData) => boolean;

  // Task polling
  checkTaskStatus: (taskId: number) => Promise<void>;
  currentTaskId: number | null;
}

export function useStylist(): UseStylistReturn {
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
  const [isEditLoading, setIsEditLoading] = useState(false);

  // Popup state
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isResetPopupOpen, setIsResetPopupOpen] = useState(false);

  // BottomSheet state
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  // Additional image state
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<{
    [key: string]: string;
  }>({});

  const {
    taskData,
    isPolling,
    isBackgroundProcessing,
    startPolling,
    checkTaskStatus,
    currentTaskId,
  } = useTaskPolling({
    onCompleted: (result) => {
      // Check for both STYLIST and STYLIST_EDIT
      const imageUrl =
        (result.actionType === 'STYLIST' ||
          result.actionType === 'STYLIST_EDIT') &&
        result.stylist?.imageUrl
          ? result.stylist.imageUrl
          : null;

      if (imageUrl) {
        setResultImage(imageUrl);
        toast.success(t('stylist.messages.stylingComplete'));
      }
      setIsProcessing(false);
      setIsEditLoading(false);
    },
    onFailed: () => {
      toast.error(t('stylist.messages.stylingFailed'));
      setIsProcessing(false);
      setIsEditLoading(false);
    },
  });

  const handleFileUpload = useCallback(
    (file: File) => {
      if (file.size > 200 * 1024 * 1024) {
        toast.error(t('stylist.messages.fileSizeExceeded'));
        return;
      }

      if (!['image/png', 'image/jpg', 'image/jpeg'].includes(file.type)) {
        toast.error(t('stylist.messages.unsupportedFormat'));
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

  const handleAdditionalFileUpload = useCallback(
    (slotId: string, file: File, formData?: StylistFormData) => {
      const url = URL.createObjectURL(file);
      setAdditionalImagePreviews((prev) => ({
        ...prev,
        [slotId]: url,
      }));

      if (formData?.uploadedFiles) {
        const fileKey = slotId as keyof typeof formData.uploadedFiles;
        (formData.uploadedFiles as any)[fileKey] = file;
      }
    },
    []
  );

  const handleAdditionalFileRemove = useCallback(
    (slotId: string, formData?: StylistFormData) => {
      setAdditionalImagePreviews((prev) => {
        const newPreviews = { ...prev };
        delete newPreviews[slotId];
        return newPreviews;
      });

      if (formData?.uploadedFiles) {
        const fileKey = slotId as keyof typeof formData.uploadedFiles;
        delete (formData.uploadedFiles as any)[fileKey];
      }
    },
    []
  );

  const getImageUploadSlots = useCallback(
    (formData?: StylistFormData) => {
      if (formData?.mode !== 'image' || !formData.imageSettings) return [];

      const slots = [];
      const settings = formData.imageSettings;

      if (settings.hairstyle) {
        slots.push({
          id: 'hairStyleImage',
          label: t('stylist.categories.hairstyle'),
          previewUrl: additionalImagePreviews['hairStyleImage'],
        });
      }
      if (settings.costume) {
        slots.push({
          id: 'outfitImage',
          label: t('stylist.categories.costume'),
          previewUrl: additionalImagePreviews['outfitImage'],
        });
      }
      if (settings.background) {
        slots.push({
          id: 'backgroundImage',
          label: t('stylist.categories.background'),
          previewUrl: additionalImagePreviews['backgroundImage'],
        });
      }
      if (settings.accessory) {
        slots.push({
          id: 'accessoryImage',
          label: t('stylist.categories.accessory'),
          previewUrl: additionalImagePreviews['accessoryImage'],
        });
      }
      if (settings.atmosphere) {
        slots.push({
          id: 'moodImage',
          label: t('stylist.categories.mood'),
          previewUrl: additionalImagePreviews['moodImage'],
        });
      }

      return slots;
    },
    [additionalImagePreviews, t]
  );

  const handleGenerate = useCallback(
    async (formData: StylistFormData) => {
      if (!formData || !uploadedFile) return;

      setIsProcessing(true);
      setResultImage(null);

      try {
        const prompt =
          formData.mode === 'text'
            ? formData.textPrompt || ''
            : formData.imagePrompt || '';

        const request: StylistRequest = {
          prompt,
          customPrompt:
            formData.mode === 'image' ? formData.imagePrompt : undefined,
        };

        if (formData.mode === 'image' && formData.uploadedFiles) {
          if (formData.uploadedFiles.hairStyleImage) {
            request.hairStyleImage = formData.uploadedFiles.hairStyleImage;
          }
          if (formData.uploadedFiles.outfitImage) {
            request.outfitImage = formData.uploadedFiles.outfitImage;
          }
          if (formData.uploadedFiles.backgroundImage) {
            request.backgroundImage = formData.uploadedFiles.backgroundImage;
          }
          if (formData.uploadedFiles.accessoryImage) {
            request.accessoryImage = formData.uploadedFiles.accessoryImage;
          }
          if (formData.uploadedFiles.moodImage) {
            request.moodImage = formData.uploadedFiles.moodImage;
          }
        }

        const response = await createStylistTask(uploadedFile, request);

        if ((response as any).isInsufficientCredit) {
          setIsProcessing(false);
          router.push(`/${lang}/billing`);
          // TODO: 플랜에 따라 이미 구독된 사람이면 크레딧 결제 쪽으로 이동하는 부분 고려하기
          return;
        }

        if (response.status === 200 && response.data) {
          deductCredit(CREDIT_COSTS.STYLIST);
          toast.success(t('stylist.messages.requestSent'));
          startPolling(response.data.taskId);
        } else {
          throw new Error('API request failed');
        }
      } catch (error: any) {
        console.error('Failed to generate stylist result:', error);
        toast.error(t('stylist.messages.requestFailed'));
        setIsProcessing(false);
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
      link.download = `stylist-result-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(t('stylist.messages.downloadComplete'));
    } catch (error) {
      console.error('Download failed:', error);
      toast.error(t('stylist.messages.downloadFailed'));
    }
  }, [resultImage, t]);

  const handleEditRequest = useCallback(
    async (editRequest: string) => {
      if (!taskData || !taskData.taskId) {
        toast.error(t('stylist.messages.originalNotFound'));
        return;
      }

      setIsEditLoading(true);
      setIsEditPopupOpen(false);

      try {
        const response = await editTask(
          taskData.taskId,
          'STYLIST',
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
          toast.success(t('stylist.messages.editRequestSent'));
          startPolling(response.data.taskId);
        } else {
          toast.error(t('stylist.messages.editRequestFailed'));
          setIsEditLoading(false);
        }
      } catch (error: any) {
        console.error('Edit request failed:', error);
        toast.error(t('stylist.messages.editRequestFailed'));
        setIsEditLoading(false);
      }
    },
    [taskData, deductCredit, t, startPolling]
  );

  const handleReset = useCallback(() => {
    setUploadedFile(null);
    setPreviewUrl('');
    setResultImage(null);
    setIsProcessing(false);
    setIsEditPopupOpen(false);
    setIsEditLoading(false);
    setIsResetPopupOpen(false);
    setIsBottomSheetOpen(false);
    setAdditionalImagePreviews({});

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    Object.values(additionalImagePreviews).forEach((url) => {
      URL.revokeObjectURL(url);
    });

    toast.success(t('stylist.messages.workReset'));
  }, [previewUrl, additionalImagePreviews, t]);

  const isFormValid = useCallback(
    (formData: StylistFormData) => {
      if (!uploadedFile) return false;
      if (!formData) return false;
      if (!formData.mode) return false;

      if (formData.mode === 'text') {
        if (!formData.textPrompt || formData.textPrompt.trim().length < 5)
          return false;
      } else if (formData.mode === 'image') {
        const hasUploadedFiles =
          formData.uploadedFiles &&
          Object.values(formData.uploadedFiles).some(
            (file) => file instanceof File
          );
        if (!hasUploadedFiles) return false;
      }

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

    // Additional image state
    additionalImagePreviews,
    handleAdditionalFileUpload,
    handleAdditionalFileRemove,
    getImageUploadSlots,

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
