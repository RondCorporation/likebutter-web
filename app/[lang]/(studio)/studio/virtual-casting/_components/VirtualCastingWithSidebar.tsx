'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import StudioLayout from '../../_components/StudioLayout';
import VirtualCastingClient from './VirtualCastingClient';
import VirtualCastingSidebar from './VirtualCastingSidebar';
import { VirtualCastingStyle } from '@/app/_lib/apis/task.api';
import { Loader2, Download } from 'lucide-react';
import StudioButton from '../../_components/ui/StudioButton';
import { CREDIT_COSTS } from '@/app/_lib/apis/credit.api';

interface VirtualCastingFormData {
  selectedCharacter: {
    category: string;
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

  useEffect(() => {
    if (clientRef.current?.showMobileResult !== undefined) {
      setShowMobileResult(clientRef.current.showMobileResult);
    }
  }, []);

  useEffect(() => {
    const resultImage = clientRef.current?.resultImage;
    const isProcessing =
      clientRef.current?.isProcessing || clientRef.current?.isPolling;
    setHidePCSidebar(!!resultImage || !!isProcessing);
  }, []);

  const getMobileButton = () => {
    const isProcessing = clientRef.current?.isProcessing || false;
    const isPolling = clientRef.current?.isPolling || false;
    const resultImage = clientRef.current?.resultImage || null;

    if (resultImage) {
      return (
        <button
          onClick={handleDownload}
          className="w-full h-12 border border-studio-button-primary hover:bg-studio-button-primary/10 active:scale-[0.98] rounded-xl flex items-center justify-center transition-all duration-200"
        >
          <Download className="w-4 h-4 mr-2" />
          <div className="text-studio-button-primary text-sm font-bold font-pretendard-bold">
            {t('virtualCasting.download')}
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
      <VirtualCastingClient formData={formData} ref={setClientRefCallback} />
    </StudioLayout>
  );
}
