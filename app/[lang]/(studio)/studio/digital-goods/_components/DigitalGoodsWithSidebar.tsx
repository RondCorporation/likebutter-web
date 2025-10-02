'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import StudioLayout from '../../_components/StudioLayout';
import DigitalGoodsClient from './DigitalGoodsClient';
import DigitalGoodsStyleSidebar from './DigitalGoodsStyleSidebar';
import { DigitalGoodsStyle } from '@/app/_lib/apis/task.api';
import { Loader2, Edit } from 'lucide-react';
import StudioButton from '../../_components/ui/StudioButton';
import { CREDIT_COSTS } from '@/app/_lib/apis/credit.api';

export default function DigitalGoodsWithSidebar() {
  const { t } = useTranslation(['studio', 'common']);
  const [formData, setFormData] = useState<{
    style?: DigitalGoodsStyle;
    customPrompt?: string;
    title?: string;
    subtitle?: string;
    accentColor?: string;
    productName?: string;
    brandName?: string;
  }>({});
  const [showMobileResult, setShowMobileResult] = useState(false);
  const [hidePCSidebar, setHidePCSidebar] = useState(false);
  const clientRef = useRef<any>(null);

  const handleFormChange = useCallback((newFormData: typeof formData) => {
    setFormData(newFormData);
  }, []);

  const setClientRefCallback = useCallback((ref: any) => {
    clientRef.current = ref;
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (clientRef.current?.showMobileResult !== undefined) {
        setShowMobileResult(clientRef.current.showMobileResult);
      }
      const resultImage = clientRef.current?.resultImage;
      const isProcessing =
        clientRef.current?.isGenerating || clientRef.current?.isPolling;
      setHidePCSidebar(!!resultImage || !!isProcessing);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const isFormValid = () => {
    if (!clientRef.current?.uploadedFile) return false;
    if (!formData) return false;
    if (!formData.style) return false;
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

  const getMobileButton = () => {
    const isGenerating = clientRef.current?.isGenerating || false;
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
              ? t('studio:digitalGoods.editingInProgress')
              : t('studio:digitalGoods.edit')}
          </div>
        </button>
      );
    }

    return (
      <StudioButton
        text={
          isGenerating || isPolling
            ? t('studio:digitalGoods.generating')
            : t('studio:digitalGoods.generate')
        }
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
      <DigitalGoodsClient formData={formData} ref={setClientRefCallback} />
    </StudioLayout>
  );
}
