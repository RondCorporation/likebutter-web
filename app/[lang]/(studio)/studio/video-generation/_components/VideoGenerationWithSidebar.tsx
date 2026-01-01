'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import StudioLayout from '../../_components/StudioLayout';
import VideoGenerationClient from './VideoGenerationClient';
import VideoGenerationSidebar from './VideoGenerationSidebar';
import StudioButton from '../../_components/ui/StudioButton';
import { CREDIT_COSTS } from '@/app/_lib/apis/credit.api';
import ConfirmResetPopup from '@/app/_components/ui/ConfirmResetPopup';
import ConfirmNavigationPopup from '@/app/_components/ui/ConfirmNavigationPopup';
import { RotateCcw } from 'lucide-react';

export default function VideoGenerationWithSidebar() {
  const { t } = useTranslation(['studio', 'common']);
  const [formData, setFormData] = useState<{
    prompt?: string;
    negativePrompt?: string;
    duration?: 5 | 10;
  }>({ duration: 5 });
  const [showMobileResult, setShowMobileResult] = useState(false);
  const [hidePCSidebar, setHidePCSidebar] = useState(false);
  const clientRef = useRef<any>(null);
  const [isResetPopupOpen, setIsResetPopupOpen] = useState(false);
  const [isNavigationPopupOpen, setIsNavigationPopupOpen] = useState(false);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const pendingNavigationResolveRef = useRef<((value: boolean) => void) | null>(
    null
  );

  const handleFormChange = useCallback((newFormData: typeof formData) => {
    setFormData(newFormData);
  }, []);

  const setClientRefCallback = useCallback((ref: any) => {
    clientRef.current = ref;
  }, []);

  const handleClientStateChange = useCallback(
    (state: {
      showMobileResult?: boolean;
      resultVideo?: string | null;
      isGenerating?: boolean;
      isPolling?: boolean;
      uploadedFile?: File | null;
      isBottomSheetOpen?: boolean;
    }) => {
      if (state.showMobileResult !== undefined) {
        setShowMobileResult(state.showMobileResult);
      }
      const isProcessing = state.isGenerating || state.isPolling;
      setHidePCSidebar(!!state.resultVideo || !!isProcessing);

      const isProcessingOrPolling = state.isGenerating || state.isPolling;
      setShowBottomSheet(!state.resultVideo && !isProcessingOrPolling);

      if (state.isBottomSheetOpen !== undefined) {
        setIsBottomSheetOpen(state.isBottomSheetOpen);
      }
    },
    []
  );

  const isFormValid = () => {
    if (!clientRef.current?.uploadedFile) return false;
    return true;
  };

  const handleGenerate = () => {
    if (clientRef.current?.handleGenerate) {
      clientRef.current.handleGenerate();
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

  const handleBottomSheetToggle = useCallback((isOpen: boolean) => {
    setIsBottomSheetOpen(isOpen);
    if (clientRef.current?.setIsBottomSheetOpen) {
      clientRef.current.setIsBottomSheetOpen(isOpen);
    }
  }, []);

  const isProcessing = () => {
    const isGenerating = clientRef.current?.isGenerating || false;
    const isPolling = clientRef.current?.isPolling || false;
    const isBackgroundProcessing =
      clientRef.current?.isBackgroundProcessing || false;
    return isGenerating || isPolling || isBackgroundProcessing;
  };

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isProcessing()) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  useEffect(() => {
    const navigationGuard = async (targetTool: string): Promise<boolean> => {
      if (!isProcessing()) {
        return true;
      }

      return new Promise((resolve) => {
        pendingNavigationResolveRef.current = resolve;
        setIsNavigationPopupOpen(true);
      });
    };

    const resetCurrentTool = () => {
      if (clientRef.current?.handleReset) {
        clientRef.current.handleReset();
      }
    };

    if (typeof window !== 'undefined') {
      (window as any).studioNavigationGuard = navigationGuard;
      (window as any).studioResetCurrentTool = resetCurrentTool;
    }

    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any).studioNavigationGuard;
        delete (window as any).studioResetCurrentTool;
      }
    };
  }, []);

  const handleConfirmNavigation = () => {
    setIsNavigationPopupOpen(false);
    if (pendingNavigationResolveRef.current) {
      pendingNavigationResolveRef.current(true);
      pendingNavigationResolveRef.current = null;
    }
  };

  const handleCancelNavigation = () => {
    setIsNavigationPopupOpen(false);
    if (pendingNavigationResolveRef.current) {
      pendingNavigationResolveRef.current(false);
      pendingNavigationResolveRef.current = null;
    }
  };

  const getMobileButton = () => {
    const isGenerating = clientRef.current?.isGenerating || false;
    const isPolling = clientRef.current?.isPolling || false;
    const resultVideo = clientRef.current?.resultVideo || null;

    if (resultVideo) {
      return (
        <div className="flex gap-2 w-full">
          <button
            onClick={handleReset}
            className="flex-1 h-12 border-2 border-studio-button-primary rounded-xl flex items-center justify-center gap-2 hover:bg-studio-button-primary/10 active:scale-[0.98] transition-all duration-200"
          >
            <RotateCcw className="w-5 h-5 text-studio-button-primary" />
            <span className="font-bold text-sm text-studio-button-primary">
              {t('studio:videoGeneration.resetWork')}
            </span>
          </button>
        </div>
      );
    }

    return (
      <StudioButton
        text={
          isGenerating || isPolling
            ? t('studio:videoGeneration.generating')
            : t('studio:videoGeneration.generate')
        }
        onClick={handleGenerate}
        disabled={isGenerating || isPolling || !isFormValid()}
        loading={isGenerating || isPolling}
        creditCost={
          isGenerating || isPolling ? undefined : CREDIT_COSTS.VIDEO_GENERATION
        }
        className="w-full"
      />
    );
  };

  return (
    <>
      <StudioLayout
        sidebar={<VideoGenerationSidebar onFormChange={handleFormChange} />}
        bottomSheetOptions={{
          initialHeight: 60,
          minHeight: 8,
        }}
        mobileBottomButton={getMobileButton()}
        hideMobileBottomSheet={!showBottomSheet}
        isBottomSheetOpen={isBottomSheetOpen}
        onBottomSheetToggle={handleBottomSheetToggle}
        hidePCSidebar={hidePCSidebar}
      >
        <VideoGenerationClient
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

      <ConfirmNavigationPopup
        isOpen={isNavigationPopupOpen}
        onClose={handleCancelNavigation}
        onConfirm={handleConfirmNavigation}
      />
    </>
  );
}
