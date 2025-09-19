'use client';

import { useState, useCallback, useEffect } from 'react';
import StudioLayout from '../../_components/StudioLayout';
import VirtualCastingClient from './VirtualCastingClient';
import VirtualCastingSidebar from './VirtualCastingSidebar';
import { VirtualCastingStyle } from '@/app/_lib/apis/task.api';
import { Loader2, Download } from 'lucide-react';
import PrimaryButton from '../../_components/ui/PrimaryButton';
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
  const [formData, setFormData] = useState<VirtualCastingFormData>({
    selectedCharacter: null,
  });
  const [clientRef, setClientRef] = useState<any>(null);
  const [showMobileResult, setShowMobileResult] = useState(false);

  const handleFormChange = useCallback(
    (newFormData: VirtualCastingFormData) => {
      setFormData(newFormData);
    },
    []
  );

  const isFormValid = () => {
    if (!clientRef?.uploadedFile) return false;
    if (!formData) return false;
    if (!formData.selectedCharacter) return false;
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

  // Track mobile result state from client ref
  useEffect(() => {
    if (clientRef?.showMobileResult !== undefined) {
      setShowMobileResult(clientRef.showMobileResult);
    }
  }, [clientRef?.showMobileResult]);

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
      <PrimaryButton
        text={isProcessing || isPolling ? '생성중...' : '캐스팅생성'}
        onClick={handleGenerate}
        disabled={isProcessing || isPolling || !isFormValid()}
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
    >
      <VirtualCastingClient formData={formData} ref={setClientRef} />
    </StudioLayout>
  );
}
