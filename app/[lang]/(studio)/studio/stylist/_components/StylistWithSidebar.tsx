'use client';

import { useState, useCallback, useEffect } from 'react';
import StudioLayout from '../../_components/StudioLayout';
import StylistClient from './StylistClient';
import StylistSidebar from './StylistSidebar';
import StudioButton from '../../_components/ui/StudioButton';
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
  const [hidePCSidebar, setHidePCSidebar] = useState(false);

  const handleFormChange = useCallback((newFormData: StylistFormData) => {
    setFormData(newFormData);
  }, []);

  useEffect(() => {
    if (clientRef?.showMobileResult !== undefined) {
      setShowMobileResult(clientRef.showMobileResult);
    }
  }, [clientRef?.showMobileResult]);

  useEffect(() => {
    const resultImage = clientRef?.resultImage;
    const isProcessing = clientRef?.isProcessing || clientRef?.isPolling;
    setHidePCSidebar(!!resultImage || !!isProcessing);
  }, [clientRef?.resultImage, clientRef?.isProcessing, clientRef?.isPolling]);

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

    if (resultImage) {
      return null;
    }

    return (
      <StudioButton
        text={isProcessing || isPolling ? '스타일링중...' : '스타일링시작'}
        onClick={handleGenerate}
        disabled={isProcessing || isPolling || !isFormValid()}
        loading={isProcessing || isPolling}
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
      hidePCSidebar={hidePCSidebar}
    >
      <StylistClient formData={formData} ref={setClientRef} />
    </StudioLayout>
  );
}
