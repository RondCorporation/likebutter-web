'use client';

import { useState, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import StudioLayout from '../../_components/StudioLayout';
import FanmeetingStudioClient from './FanmeetingStudioClient';
import FanmeetingStudioSidebar from './FanmeetingStudioSidebar';
import StudioButton from '../../_components/ui/StudioButton';
import { CREDIT_COSTS } from '@/app/_lib/apis/credit.api';
import ConfirmResetPopup from '@/app/_components/ui/ConfirmResetPopup';
import { Edit, RotateCcw } from 'lucide-react';
import { FanmeetingFormData } from '../_hooks/useFanmeetingStudio';

export default function FanmeetingStudioWithSidebar() {
  const { t } = useTranslation(['studio']);
  const [formData, setFormData] = useState<FanmeetingFormData>({
    mode: 'text',
    backgroundPrompt: '',
    situationPrompt: '',
  });
  const clientRef = useRef<any>(null);
  const [showMobileResult, setShowMobileResult] = useState(false);
  const [hidePCSidebar, setHidePCSidebar] = useState(false);
  const [isResetPopupOpen, setIsResetPopupOpen] = useState(false);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [idolFile, setIdolFile] = useState<File | null>(null);
  const [userFile, setUserFile] = useState<File | null>(null);

  const setClientRefCallback = useCallback((ref: any) => {
    clientRef.current = ref;
  }, []);

  const handleFormChange = useCallback((newFormData: FanmeetingFormData) => {
    setFormData(newFormData);
  }, []);

  const handleClientStateChange = useCallback(
    (state: {
      showMobileResult?: boolean;
      resultImage?: string | null;
      isProcessing?: boolean;
      isPolling?: boolean;
      uploadedFile?: File | null;
      isBottomSheetOpen?: boolean;
      idolFile?: File | null;
      userFile?: File | null;
    }) => {
      if (state.showMobileResult !== undefined) {
        setShowMobileResult(state.showMobileResult);
      }
      const isProcessingOrPolling = state.isProcessing || state.isPolling;
      setHidePCSidebar(!!state.resultImage || !!isProcessingOrPolling);

      if (state.idolFile !== undefined) {
        setIdolFile(state.idolFile);
      }
      if (state.userFile !== undefined) {
        setUserFile(state.userFile);
      }

      // Show BottomSheet when not in result mode (always visible except during results/processing)
      setShowBottomSheet(!state.resultImage && !isProcessingOrPolling);

      // Sync BottomSheet open state
      if (state.isBottomSheetOpen !== undefined) {
        setIsBottomSheetOpen(state.isBottomSheetOpen);
      }
    },
    []
  );

  const isFormValid = () => {
    if (!formData) return false;
    if (!idolFile || !userFile) return false;

    if (formData.mode === 'text') {
      if (
        !formData.backgroundPrompt ||
        formData.backgroundPrompt.trim().length < 2
      )
        return false;
      if (!formData.situationPrompt || formData.situationPrompt.trim().length < 2)
        return false;
    } else {
      if (!formData.imagePromptStyle) return false;
    }

    return true;
  };

  const handleGenerate = () => {
    if (clientRef.current?.handleGenerate) {
      clientRef.current.handleGenerate();
    }
  };

  const handleEdit = () => {
    if (clientRef.current?.handleEdit) {
      clientRef.current.handleEdit();
    }
  };

  const handleReset = () => {
    setIsResetPopupOpen(true);
  };

  const handleConfirmReset = () => {
    if (clientRef.current?.handleReset) {
      clientRef.current.handleReset();
    }
    setIsResetPopupOpen(false);
  };

  const handleBottomSheetToggle = useCallback((isOpen: boolean) => {
    setIsBottomSheetOpen(isOpen);
    if (clientRef.current?.setIsBottomSheetOpen) {
      clientRef.current.setIsBottomSheetOpen(isOpen);
    }
  }, []);

  const getMobileButton = () => {
    const isProcessing = clientRef.current?.isProcessing || false;
    const isPolling = clientRef.current?.isPolling || false;
    const resultImage = clientRef.current?.resultImage || null;
    const isEditLoading = clientRef.current?.isEditLoading || false;

    if (resultImage) {
      return (
        <div className="flex gap-2 w-full">
          {/* 수정하기 버튼 */}
          <StudioButton
            text={
              isEditLoading ? t('fanmeeting.editing') : t('fanmeeting.edit')
            }
            onClick={handleEdit}
            disabled={isEditLoading}
            loading={isEditLoading}
            creditCost={CREDIT_COSTS.IMAGE_EDIT}
            icon={<Edit className="w-4 h-4 text-black" />}
            className="flex-1 h-12"
            textClassName="font-bold text-sm"
          />

          {/* 다시 시작하기 버튼 - 아이콘만, 정사각형 */}
          <button
            onClick={handleReset}
            className="h-12 w-12 border-2 border-studio-button-primary rounded-xl flex items-center justify-center hover:bg-studio-button-primary/10 active:scale-[0.98] transition-all duration-200"
          >
            <RotateCcw className="w-5 h-5 text-studio-button-primary" />
          </button>
        </div>
      );
    }

    return (
      <StudioButton
        text={
          isProcessing || isPolling
            ? t('fanmeeting.generating')
            : t('fanmeeting.startFanmeeting')
        }
        onClick={handleGenerate}
        disabled={isProcessing || isPolling || !isFormValid()}
        loading={isProcessing || isPolling}
        creditCost={
          isProcessing || isPolling ? undefined : CREDIT_COSTS.FANMEETING_STUDIO
        }
        className="w-full"
      />
    );
  };

  return (
    <>
      <StudioLayout
        sidebar={<FanmeetingStudioSidebar onFormChange={handleFormChange} />}
        bottomSheetOptions={{
          initialHeight: 60,
          minHeight: 8,
        }}
        mobileBottomButton={getMobileButton()}
        hideMobileBottomSheet={!showBottomSheet}
        isBottomSheetOpen={isBottomSheetOpen}
        onBottomSheetToggle={handleBottomSheetToggle}
        hidePCSidebar={hidePCSidebar}
      >
        <FanmeetingStudioClient
          formData={formData}
          ref={setClientRefCallback}
          onStateChange={handleClientStateChange}
        />
      </StudioLayout>

      <ConfirmResetPopup
        isOpen={isResetPopupOpen}
        onClose={() => setIsResetPopupOpen(false)}
        onConfirm={handleConfirmReset}
      />
    </>
  );
}
