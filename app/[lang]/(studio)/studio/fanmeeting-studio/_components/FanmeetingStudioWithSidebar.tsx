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

interface FanmeetingFormData {
  backgroundPrompt: string;
  situationPrompt: string;
}

export default function FanmeetingStudioWithSidebar() {
  const { t } = useTranslation(['studio']);
  const [formData, setFormData] = useState<FanmeetingFormData>({
    backgroundPrompt: '',
    situationPrompt: '',
  });
  const clientRef = useRef<any>(null);
  const [showMobileResult, setShowMobileResult] = useState(false);
  const [hidePCSidebar, setHidePCSidebar] = useState(false);
  const [isResetPopupOpen, setIsResetPopupOpen] = useState(false);

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
    }) => {
      if (state.showMobileResult !== undefined) {
        setShowMobileResult(state.showMobileResult);
      }
      const isProcessingOrPolling = state.isProcessing || state.isPolling;
      setHidePCSidebar(!!state.resultImage || !!isProcessingOrPolling);
    },
    []
  );

  const isFormValid = () => {
    if (!formData) return false;
    if (
      !formData.backgroundPrompt ||
      formData.backgroundPrompt.trim().length < 2
    )
      return false;
    if (!formData.situationPrompt || formData.situationPrompt.trim().length < 2)
      return false;
    if (!clientRef.current?.idolFile || !clientRef.current?.userFile)
      return false;
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
          initialHeight: 50,
          maxHeight: 90,
          minHeight: 30,
        }}
        mobileBottomButton={getMobileButton()}
        hideMobileBottomSheet={showMobileResult}
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
