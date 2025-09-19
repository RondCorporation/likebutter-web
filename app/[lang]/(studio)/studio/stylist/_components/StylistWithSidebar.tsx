'use client';

import { useState, useCallback, useEffect } from 'react';
import StudioLayout from '../../_components/StudioLayout';
import StylistClient from './StylistClient';
import StylistSidebar from './StylistSidebar';
import PrimaryButton from '../../_components/ui/PrimaryButton';
import { CREDIT_COSTS } from '@/app/_lib/apis/credit.api';

interface StylistFormData {
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

export default function StylistWithSidebar() {
  const [formData, setFormData] = useState<StylistFormData>({
    mode: 'text',
  });
  const [clientRef, setClientRef] = useState<any>(null);
  const [showMobileResult, setShowMobileResult] = useState(false);

  const handleFormChange = useCallback((newFormData: StylistFormData) => {
    setFormData(newFormData);
  }, []);

  // Track mobile result state from client ref
  useEffect(() => {
    if (clientRef?.showMobileResult !== undefined) {
      setShowMobileResult(clientRef.showMobileResult);
    }
  }, [clientRef?.showMobileResult]);

  const isFormValid = () => {
    if (!clientRef?.uploadedFile) return false;
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
  };

  const handleGenerate = () => {
    if (clientRef?.handleGenerate) {
      clientRef.handleGenerate();
    }
  };

  const getMobileButton = () => {
    const isProcessing = clientRef?.isProcessing || false;
    const isPolling = clientRef?.isPolling || false;
    const resultImage = clientRef?.resultImage || null;

    // 결과 이미지가 있으면 숨김 (모바일에서는 Before/After 뷰로 전환)
    if (resultImage) {
      return null;
    }

    return (
      <PrimaryButton
        text={isProcessing || isPolling ? '스타일링중...' : '스타일링시작'}
        onClick={handleGenerate}
        disabled={isProcessing || isPolling || !isFormValid()}
        creditCost={
          isProcessing || isPolling ? undefined : CREDIT_COSTS.STYLIST
        }
        className="w-full"
      />
    );
  };

  return (
    <StudioLayout
      sidebar={<StylistSidebar onFormChange={handleFormChange} />}
      bottomSheetOptions={{
        initialHeight: 50,
        maxHeight: 90,
        minHeight: 30,
      }}
      mobileBottomButton={getMobileButton()}
      hideMobileBottomSheet={showMobileResult}
    >
      <StylistClient formData={formData} ref={setClientRef} />
    </StudioLayout>
  );
}
