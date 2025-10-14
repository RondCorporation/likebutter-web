'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import TabItem from './ui/TabItem';
import SelectCard from './ui/SelectCard';
import StudioButton from './ui/StudioButton';
import { useRouter } from 'next/navigation';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { useScrollLock } from '@/hooks/useScrollLock';

interface ModelSelectPopupProps {
  onClose: () => void;
  lang?: string;
}

export default function ModelSelectPopup({
  onClose,
  lang,
}: ModelSelectPopupProps) {
  const { t } = useTranslation(['studio', 'common']);
  const router = useRouter();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<'image' | 'audio'>('image');

  useScrollLock(true);

  useEffect(() => {
    router.prefetch(`/${lang}/studio/digital-goods`);
    router.prefetch(`/${lang}/studio/stylist`);
    router.prefetch(`/${lang}/studio/virtual-casting`);
    router.prefetch(`/${lang}/studio/fanmeeting-studio`);
    router.prefetch(`/${lang}/studio/butter-cover`);
  }, [router, lang]);

  const navigateToTool = (toolType: string) => {
    let targetPath = '';
    let toolName = '';

    switch (toolType) {
      case 'digital-goods':
        targetPath = `/${lang}/studio/digital-goods`;
        toolName = 'digital-goods';
        break;
      case 'stylist':
        targetPath = `/${lang}/studio/stylist`;
        toolName = 'stylist';
        break;
      case 'virtual-casting':
        targetPath = `/${lang}/studio/virtual-casting`;
        toolName = 'virtual-casting';
        break;
      case 'fanmeeting':
        targetPath = `/${lang}/studio/fanmeeting-studio`;
        toolName = 'fanmeeting-studio';
        break;
      case 'butter-cover':
        targetPath = `/${lang}/studio/butter-cover`;
        toolName = 'butter-cover';
        break;
      default:
        console.warn('Unknown tool type:', toolType);
        return;
    }

    onClose();

    setTimeout(() => {
      if (
        typeof window !== 'undefined' &&
        (window as any).studioNavigateToTool
      ) {
        (window as any).studioNavigateToTool(toolName);
      } else {
        router.push(targetPath);
      }
    }, 100);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex ${
        isMobile ? 'items-end' : 'items-center justify-center'
      } bg-black/70 backdrop-blur-sm`}
      onClick={onClose}
      style={{
        paddingBottom: isMobile ? 'env(safe-area-inset-bottom)' : '0',
      }}
    >
      <div
        className={`${
          isMobile
            ? 'w-full max-h-[85vh] h-[85vh] rounded-t-xl'
            : 'w-[678px] max-h-[85vh] rounded-xl'
        } bg-studio-sidebar border border-solid border-studio-border ${
          isMobile ? 'p-4 pb-8' : 'p-8'
        } flex flex-col gap-4 md:gap-5 ${isMobile ? 'animate-slide-up' : ''}`}
        onClick={(e) => e.stopPropagation()}
        style={{
          maxHeight: isMobile
            ? 'calc(85vh - env(safe-area-inset-bottom))'
            : '85vh',
        }}
      >
        <div className="relative flex items-center justify-center w-full">
          <div className="font-bold text-studio-text-primary text-lg">
            {t('studio:modelSelect.title')}
          </div>
          <button
            onClick={onClose}
            className="absolute right-0 text-studio-text-primary hover:text-studio-text-secondary"
          >
            <X size={isMobile ? 24 : 20} />
          </button>
        </div>

        <div className="w-full border-b border-solid border-studio-border flex">
          <button onClick={() => setActiveTab('image')} className="flex-1">
            <TabItem
              state={activeTab === 'image' ? 'selected' : 'default'}
              text={t('studio:modelSelect.imageGeneration')}
            />
          </button>
          <button onClick={() => setActiveTab('audio')} className="flex-1">
            <TabItem
              state={activeTab === 'audio' ? 'selected' : 'default'}
              text={t('studio:modelSelect.audioGeneration')}
            />
          </button>
        </div>

        <div
          className="flex flex-col gap-3 flex-1 overflow-y-auto"
          style={{
            paddingBottom: isMobile ? '1rem' : '0',
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain',
          }}
        >
          {activeTab === 'image' ? (
            <>
              <div className="flex items-center justify-between mt-8">
                <h3 className="font-bold text-studio-text-primary text-sm">
                  {t('studio:modelSelect.imageCreationTitle')}
                </h3>
              </div>

              <div
                className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-4 pb-4`}
              >
                <SelectCard
                  state="default"
                  title={t('studio:modelSelect.tools.digitalGoods.title')}
                  subtitle={t('studio:modelSelect.tools.digitalGoods.subtitle')}
                  backgroundImage="/studio/model-select/digital-goods.png"
                  onClick={() => navigateToTool('digital-goods')}
                ></SelectCard>

                <SelectCard
                  state="default"
                  title={t('studio:modelSelect.tools.stylist.title')}
                  subtitle={t('studio:modelSelect.tools.stylist.subtitle')}
                  backgroundImage="/studio/model-select/stylist.png"
                  onClick={() => navigateToTool('stylist')}
                />

                <SelectCard
                  state="default"
                  title={t('studio:modelSelect.tools.fanmeeting.title')}
                  subtitle={t('studio:modelSelect.tools.fanmeeting.subtitle')}
                  backgroundImage="/studio/model-select/fanmeeting-studio.png"
                  onClick={() => navigateToTool('fanmeeting')}
                />

                <SelectCard
                  state="default"
                  title={t('studio:modelSelect.tools.virtualCasting.title')}
                  subtitle={t(
                    'studio:modelSelect.tools.virtualCasting.subtitle'
                  )}
                  backgroundImage="/studio/model-select/virtual_casting.png"
                  onClick={() => navigateToTool('virtual-casting')}
                />
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between mt-8">
                <h3 className="font-bold text-studio-text-primary text-sm">
                  {t('studio:modelSelect.idolVoiceAI')}
                </h3>
              </div>

              <div
                className={`border border-solid w-full ${isMobile ? 'h-[300px]' : 'h-[400px]'} rounded-md cursor-pointer mb-4 transition-colors relative border-[#4a4a4b] hover:border-[#6a6a6b]`}
                onClick={() => navigateToTool('butter-cover')}
              >
                <div
                  className="w-full h-full bg-cover bg-center relative rounded-md overflow-hidden"
                  style={{
                    backgroundImage:
                      'url(/studio/model-select/butter-cover.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <div className="absolute inset-0 bg-black/20"></div>

                  <div className="absolute bottom-6 left-6 text-white z-10">
                    <h2 className="text-2xl font-bold mb-1">
                      {t('studio:modelSelect.aiCompletedIdolVoice')}
                    </h2>
                    <p className="text-sm font-light opacity-90">
                      {t('studio:modelSelect.aiReproducedIdolVoice')}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
