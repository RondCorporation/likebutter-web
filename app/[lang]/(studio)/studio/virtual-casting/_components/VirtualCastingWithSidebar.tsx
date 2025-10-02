'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import StudioLayout from '../../_components/StudioLayout';
import VirtualCastingClient from './VirtualCastingClient';
import VirtualCastingSidebar from './VirtualCastingSidebar';
import { VirtualCastingStyle } from '@/app/_lib/apis/task.api';
import { Loader2, Download, Edit } from 'lucide-react';
import StudioButton from '../../_components/ui/StudioButton';
import { CREDIT_COSTS } from '@/app/_lib/apis/credit.api';

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

  const handleDownload = () => {
    if (clientRef.current?.handleDownload) {
      clientRef.current.handleDownload();
    }
  };

  const handleEdit = () => {
    if (clientRef.current?.handleEdit) {
      clientRef.current.handleEdit();
    }
  };

  const getMobileButton = () => {
    const isProcessing = clientRef.current?.isProcessing || false;
    const isPolling = clientRef.current?.isPolling || false;
    const resultImage = clientRef.current?.resultImage || null;
    const isEditLoading = clientRef.current?.isEditLoading || false;

    if (resultImage) {
      return (
        <button
          onClick={handleEdit}
          disabled={isEditLoading}
          className="w-full h-12 bg-studio-button-primary hover:bg-studio-button-hover active:scale-[0.98] rounded-xl flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isEditLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {!isEditLoading && <Edit className="w-4 h-4 mr-2" />}
          <div className="text-studio-header text-sm font-bold font-pretendard-bold">
            {isEditLoading
              ? t('virtualCasting.editing')
              : t('virtualCasting.edit')}
          </div>
        </button>
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

  return (
    <StudioLayout
      sidebar={<VirtualCastingSidebar onFormChange={handleFormChange} />}
      bottomSheetOptions={{
        initialHeight: 60,
        maxHeight: 90,
        minHeight: 40,
      }}
      mobileBottomButton={getMobileButton()}
      hideMobileBottomSheet={showMobileResult}
      hidePCSidebar={hidePCSidebar}
    >
      <VirtualCastingClient
        formData={formData}
        ref={setClientRefCallback}
        onStateChange={handleClientStateChange}
      />
    </StudioLayout>
  );
}
