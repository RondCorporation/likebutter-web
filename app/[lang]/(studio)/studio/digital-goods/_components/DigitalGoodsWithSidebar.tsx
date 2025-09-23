'use client';

import { useState, useCallback, useEffect } from 'react';
import StudioLayout from '../../_components/StudioLayout';
import DigitalGoodsClient from './DigitalGoodsClient';
import DigitalGoodsStyleSidebar from './DigitalGoodsStyleSidebar';
import { DigitalGoodsStyle } from '@/app/_lib/apis/task.api';
import { Loader2, Edit } from 'lucide-react';
import StudioButton from '../../_components/ui/StudioButton';
import { CREDIT_COSTS } from '@/app/_lib/apis/credit.api';

export default function DigitalGoodsWithSidebar() {
  const [formData, setFormData] = useState<{
    style?: DigitalGoodsStyle;
    customPrompt?: string;
    title?: string;
    subtitle?: string;
    accentColor?: string;
    productName?: string;
    brandName?: string;
  }>({});
  const [clientRef, setClientRef] = useState<any>(null);
  const [showMobileResult, setShowMobileResult] = useState(false);
  const [hidePCSidebar, setHidePCSidebar] = useState(false);

  const handleFormChange = useCallback((newFormData: typeof formData) => {
    setFormData(newFormData);
  }, []);

  useEffect(() => {
    if (clientRef?.showMobileResult !== undefined) {
      setShowMobileResult(clientRef.showMobileResult);
    }
  }, [clientRef?.showMobileResult]);

  useEffect(() => {
    const resultImage = clientRef?.resultImage;
    const isProcessing = clientRef?.isGenerating || clientRef?.isPolling;
    setHidePCSidebar(!!resultImage || !!isProcessing);
  }, [clientRef?.resultImage, clientRef?.isGenerating, clientRef?.isPolling]);

  const isFormValid = () => {
    if (!formData) return false;
    if (!formData.style) return false;
    return true;
  };

  const handleGenerate = () => {
    if (clientRef?.handleGenerate) {
      clientRef.handleGenerate();
    }
  };

  const handleEdit = () => {
    if (clientRef?.handleEdit) {
      clientRef.handleEdit();
    }
  };

  const getMobileButton = () => {
    const isGenerating = clientRef?.isGenerating || false;
    const isPolling = clientRef?.isPolling || false;
    const isBackgroundProcessing = clientRef?.isBackgroundProcessing || false;
    const resultImage = clientRef?.resultImage || null;
    const isEditLoading = clientRef?.isEditLoading || false;

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
            {isEditLoading ? '수정중...' : '수정하기'}
          </div>
        </button>
      );
    }

    return (
      <StudioButton
        text={isGenerating || isPolling ? '생성중...' : '굿즈생성'}
        onClick={handleGenerate}
        disabled={isGenerating || isPolling || !isFormValid()}
        loading={isGenerating || isPolling}
        creditCost={
          isGenerating || isPolling ? undefined : CREDIT_COSTS.DIGITAL_GOODS
        }
        className="w-full"
      />
    );
  };

  return (
    <StudioLayout
      sidebar={<DigitalGoodsStyleSidebar onFormChange={handleFormChange} />}
      bottomSheetOptions={{
        initialHeight: 40,
        maxHeight: 85,
        minHeight: 20,
      }}
      mobileBottomButton={getMobileButton()}
      hideMobileBottomSheet={showMobileResult}
      hidePCSidebar={hidePCSidebar}
    >
      <DigitalGoodsClient formData={formData} ref={setClientRef} />
    </StudioLayout>
  );
}
