'use client';

import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';

interface MobileLoadingOverlayProps {
  isVisible: boolean;
  title?: string;
  description?: string;
}

export default function MobileLoadingOverlay({
  isVisible,
  title,
  description,
}: MobileLoadingOverlayProps) {
  const { t } = useTranslation('studio');
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!isVisible || !mounted) return null;

  const finalTitle = title || t('digitalGoods.generationInProgress');
  const finalDescription = description || t('digitalGoods.pleaseWait');

  const handleGoToArchive = () => {
    const lang = window.location.pathname.split('/')[1] || 'ko';
    router.push(`/${lang}/studio?tool=archive`);
  };

  const handleGoToHome = () => {
    const lang = window.location.pathname.split('/')[1] || 'ko';
    router.push(`/${lang}/studio`);
  };

  const overlayContent = (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[99999] flex items-center justify-center md:hidden">
      <div className="flex flex-col items-center justify-center gap-6 p-8">
        <Loader2 className="w-16 h-16 animate-spin text-studio-button-primary" />
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="text-white text-lg font-pretendard-medium">
            {finalTitle}
          </div>
          <div className="text-white/70 text-sm font-pretendard">
            {finalDescription}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-row gap-3 w-full max-w-[320px]">
          <button
            onClick={handleGoToArchive}
            className="flex-1 h-[44px] bg-studio-button-primary hover:bg-studio-button-primary/90 active:bg-studio-button-primary/80 rounded-lg flex items-center justify-center transition-all duration-200 active:scale-[0.98]"
          >
            <div className="text-studio-header text-sm font-bold font-pretendard-bold">
              {t('common.goToArchive')}
            </div>
          </button>
          <button
            onClick={handleGoToHome}
            className="flex-1 h-[44px] bg-white/10 hover:bg-white/20 active:bg-white/5 border border-white/30 rounded-lg flex items-center justify-center transition-all duration-200 active:scale-[0.98]"
          >
            <div className="text-white text-sm font-bold font-pretendard-bold">
              {t('common.goToHome')}
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(overlayContent, document.body);
}
