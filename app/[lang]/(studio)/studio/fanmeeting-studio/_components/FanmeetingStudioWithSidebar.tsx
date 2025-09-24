'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import StudioLayout from '../../_components/StudioLayout';
import FanmeetingStudioClient from './FanmeetingStudioClient';
import FanmeetingStudioSidebar from './FanmeetingStudioSidebar';
import { Loader2, Download } from 'lucide-react';
import StudioButton from '../../_components/ui/StudioButton';
import { CREDIT_COSTS } from '@/app/_lib/apis/credit.api';

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

  const setClientRefCallback = useCallback((ref: any) => {
    clientRef.current = ref;
  }, []);

  const handleFormChange = useCallback((newFormData: FanmeetingFormData) => {
    setFormData(newFormData);
  }, []);

  useEffect(() => {
    if (clientRef.current?.showMobileResult !== undefined) {
      setShowMobileResult(clientRef.current.showMobileResult);
    }
  }, []);

  useEffect(() => {
    const resultImage = clientRef.current?.resultImage;
    const isProcessing = clientRef.current?.isProcessing || clientRef.current?.isPolling;
    setHidePCSidebar(!!resultImage || !!isProcessing);
  }, []);

  const isFormValid = () => {
    if (!formData) return false;
    if (
      !formData.backgroundPrompt ||
      formData.backgroundPrompt.trim().length < 2
    )
      return false;
    if (!formData.situationPrompt || formData.situationPrompt.trim().length < 2)
      return false;
    if (!clientRef.current?.idolFile || !clientRef.current?.userFile) return false;
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
            {t('fanmeeting.download')}
          </div>
        </button>
      );
    }

    return (
      <StudioButton
        text={isProcessing || isPolling ? t('fanmeeting.generating') : t('fanmeeting.startFanmeeting')}
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
      <FanmeetingStudioClient formData={formData} ref={setClientRefCallback} />
    </StudioLayout>
  );
}
