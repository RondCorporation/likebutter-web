'use client';

import { useState, useCallback, useEffect } from 'react';
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
  const [formData, setFormData] = useState<FanmeetingFormData>({
    backgroundPrompt: '',
    situationPrompt: '',
  });
  const [clientRef, setClientRef] = useState<any>(null);
  const [showMobileResult, setShowMobileResult] = useState(false);

  const handleFormChange = useCallback((newFormData: FanmeetingFormData) => {
    setFormData(newFormData);
  }, []);

  // Track mobile result state from client ref
  useEffect(() => {
    if (clientRef?.showMobileResult !== undefined) {
      setShowMobileResult(clientRef.showMobileResult);
    }
  }, [clientRef?.showMobileResult]);

  const isFormValid = () => {
    if (!formData) return false;
    if (
      !formData.backgroundPrompt ||
      formData.backgroundPrompt.trim().length < 2
    )
      return false;
    if (!formData.situationPrompt || formData.situationPrompt.trim().length < 2)
      return false;
    if (!clientRef?.idolFile || !clientRef?.userFile) return false;
    return true;
  };

  const handleGenerate = () => {
    if (clientRef?.handleGenerate) {
      clientRef.handleGenerate();
    }
  };

  const handleDownload = () => {
    if (clientRef?.handleDownload) {
      clientRef.handleDownload();
    }
  };

  const getMobileButton = () => {
    const isProcessing = clientRef?.isProcessing || false;
    const isPolling = clientRef?.isPolling || false;
    const resultImage = clientRef?.resultImage || null;

    if (resultImage) {
      return (
        <button
          onClick={handleDownload}
          className="w-full h-12 border border-studio-button-primary hover:bg-studio-button-primary/10 active:scale-[0.98] rounded-xl flex items-center justify-center transition-all duration-200"
        >
          <Download className="w-4 h-4 mr-2" />
          <div className="text-studio-button-primary text-sm font-bold font-pretendard-bold">
            다운로드
          </div>
        </button>
      );
    }

    return (
      <StudioButton
        text={isProcessing || isPolling ? '생성중...' : '팬미팅생성'}
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
    >
      <FanmeetingStudioClient formData={formData} ref={setClientRef} />
    </StudioLayout>
  );
}
