'use client';

import { useState, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import StudioLayout from '../../_components/StudioLayout';
import VirtualCastingClient from './VirtualCastingClient';
import VirtualCastingSidebar from './VirtualCastingSidebar';
import { VirtualCastingStyle } from '@/app/_lib/apis/task.api';
import StudioButton from '../../_components/ui/StudioButton';
import { CREDIT_COSTS } from '@/app/_lib/apis/credit.api';
import ConfirmResetPopup from '@/app/_components/ui/ConfirmResetPopup';
import { Edit, RotateCcw } from 'lucide-react';

interface VirtualCastingFormData {
  selectedCharacter: {
    name: string;
    image: string;
    style: VirtualCastingStyle;
  } | null;
}

export default function VirtualCastingWithSidebar() {
  const { t } = useTranslation(['studio']);
  const [formData, setFormData] = useState<VirtualCastingFormData>({
    selectedCharacter: null,
  });
  const clientRef = useRef<any>(null);
  const [showMobileResult, setShowMobileResult] = useState(false);
  const [hidePCSidebar, setHidePCSidebar] = useState(false);
  const [isResetPopupOpen, setIsResetPopupOpen] = useState(false);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const setClientRefCallback = useCallback((ref: any) => {
    clientRef.current = ref;
  }, []);

  const handleFormChange = useCallback(
    (newFormData: VirtualCastingFormData) => {
      setFormData(newFormData);
    },
    []
  );

  const handleClientStateChange = useCallback(
    (state: {
      showMobileResult?: boolean;
      resultImage?: string | null;
      isProcessing?: boolean;
      isPolling?: boolean;
      uploadedFile?: File | null;
      isBottomSheetOpen?: boolean;
    }) => {
      if (state.showMobileResult !== undefined) {
        setShowMobileResult(state.showMobileResult);
      }
      const isProcessingOrPolling = state.isProcessing || state.isPolling;
      setHidePCSidebar(!!state.resultImage || !!isProcessingOrPolling);

      // Show BottomSheet only when image is uploaded and not in result mode
      setShowBottomSheet(
        !!state.uploadedFile && !state.resultImage && !isProcessingOrPolling
      );

      // Sync BottomSheet open state
      if (state.isBottomSheetOpen !== undefined) {
        setIsBottomSheetOpen(state.isBottomSheetOpen);
      }
    },
    []
  );

  const isFormValid = () => {
    if (!clientRef.current?.uploadedFile) return false;
    if (!formData) return false;
    if (!formData.selectedCharacter) return false;
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
              isEditLoading
                ? t('virtualCasting.editing')
                : t('virtualCasting.edit')
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
            ? t('virtualCasting.generating')
            : t('virtualCasting.startCasting')
        }
        onClick={handleGenerate}
        disabled={isProcessing || isPolling || !isFormValid()}
        loading={isProcessing || isPolling}
        creditCost={
          isProcessing || isPolling ? undefined : CREDIT_COSTS.VIRTUAL_CASTING
        }
        className="w-full"
      />
    );
  };

  const handleBottomSheetToggle = useCallback((isOpen: boolean) => {
    setIsBottomSheetOpen(isOpen);
    if (clientRef.current?.setIsBottomSheetOpen) {
      clientRef.current.setIsBottomSheetOpen(isOpen);
    }
  }, []);

  return (
    <>
      <StudioLayout
        sidebar={<VirtualCastingSidebar onFormChange={handleFormChange} />}
        bottomSheetOptions={{
          initialHeight: 60,
          maxHeight: 90,
          minHeight: 8,
        }}
        mobileBottomButton={getMobileButton()}
        hideMobileBottomSheet={!showBottomSheet}
        hidePCSidebar={hidePCSidebar}
        isBottomSheetOpen={isBottomSheetOpen}
        onBottomSheetToggle={handleBottomSheetToggle}
      >
        <VirtualCastingClient
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
