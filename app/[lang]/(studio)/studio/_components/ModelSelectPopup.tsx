'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import TabItem from './ui/TabItem';
import SelectCard from './ui/SelectCard';
import Badge from './ui/Badge';
import StudioButton from './ui/StudioButton';
import { useRouter } from 'next/navigation';
import { useIsMobile } from '@/hooks/useMediaQuery';

interface ModelSelectPopupProps {
  onClose: () => void;
  lang?: string;
}

export default function ModelSelectPopup({
  onClose,
  lang,
}: ModelSelectPopupProps) {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<'image' | 'audio'>('image');
  const [selectedModel, setSelectedModel] = useState<string>('digital-goods');
  const [selectedAudioModel, setSelectedAudioModel] =
    useState<string>('butter-cover');

  // Prefetch routes when popup opens
  useEffect(() => {
    router.prefetch(`/${lang}/studio/digital-goods`);
    router.prefetch(`/${lang}/studio/stylist`);
    router.prefetch(`/${lang}/studio/virtual-casting`);
    router.prefetch(`/${lang}/studio/fanmeeting-studio`);
  }, [router, lang]);

  // Prefetch on hover for better UX
  const handleCardHover = (modelType: string) => {
    switch (modelType) {
      case 'digital-goods':
        router.prefetch(`/${lang}/studio/digital-goods`);
        break;
      case 'stylist':
        router.prefetch(`/${lang}/studio/stylist`);
        break;
      case 'virtual-casting':
        router.prefetch(`/${lang}/studio/virtual-casting`);
        break;
      case 'fanmeeting':
        router.prefetch(`/${lang}/studio/fanmeeting-studio`);
        break;
    }
  };

  const handleCreate = () => {
    let toolName = '';

    if (activeTab === 'audio') {
      toolName = selectedAudioModel;
    } else {
      toolName =
        selectedModel === 'fanmeeting' ? 'fanmeeting-studio' : selectedModel;
    }

    // Use SPA navigation if available
    if (typeof window !== 'undefined' && (window as any).studioNavigateToTool) {
      (window as any).studioNavigateToTool(toolName);
    } else {
      // Fallback to traditional routing
      if (activeTab === 'audio') {
        switch (selectedAudioModel) {
          case 'butter-cover':
            router.push(`/${lang}/studio/butter-cover`);
            break;
          default:
            break;
        }
      } else {
        switch (selectedModel) {
          case 'digital-goods':
            router.push(`/${lang}/studio/digital-goods`);
            break;
          case 'stylist':
            router.push(`/${lang}/studio/stylist`);
            break;
          case 'virtual-casting':
            router.push(`/${lang}/studio/virtual-casting`);
            break;
          case 'fanmeeting':
            router.push(`/${lang}/studio/fanmeeting-studio`);
            break;
          default:
            break;
        }
      }
    }
    onClose();
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
            : 'w-[678px] max-h-[80vh] rounded-xl'
        } bg-studio-sidebar border border-solid border-studio-border ${
          isMobile ? 'p-4 pb-8' : 'p-8'
        } flex flex-col gap-6 md:gap-8 ${isMobile ? 'animate-slide-up' : ''}`}
        onClick={(e) => e.stopPropagation()}
        style={{
          maxHeight: isMobile
            ? 'calc(85vh - env(safe-area-inset-bottom))'
            : '80vh',
        }}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex-1 text-center font-bold text-studio-text-primary text-lg">
            만들어보기
          </div>
          <button
            onClick={onClose}
            className="text-studio-text-primary hover:text-studio-text-secondary"
          >
            <X size={isMobile ? 24 : 20} />
          </button>
        </div>

        <div className="w-full border-b border-solid border-studio-border">
          <button onClick={() => setActiveTab('image')}>
            <TabItem
              state={activeTab === 'image' ? 'selected' : 'default'}
              text="이미지 생성"
            />
          </button>
          <button onClick={() => setActiveTab('audio')}>
            <TabItem
              state={activeTab === 'audio' ? 'selected' : 'default'}
              text="음원 생성"
            />
          </button>
        </div>

        <div
          className="flex flex-col gap-4 flex-1 overflow-y-auto"
          style={{
            paddingBottom: isMobile ? '1rem' : '0',
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain',
          }}
        >
          {activeTab === 'image' ? (
            <>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-studio-text-primary text-sm">
                  이미지 생성하기
                </h3>
                <span className="font-semibold text-studio-text-secondary text-sm cursor-pointer">
                  How to use
                </span>
              </div>

              <div
                className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-4 pb-4`}
              >
                <SelectCard
                  state={
                    selectedModel === 'digital-goods' ? 'selected' : 'default'
                  }
                  title="디지털 굿즈"
                  subtitle="사진을 멋진 리얼리스틱 스케치로 변환"
                  backgroundImage="/studio/model-select/digital-goods.png"
                  onClick={() => setSelectedModel('digital-goods')}
                  onMouseEnter={() => handleCardHover('digital-goods')}
                >
                  <Badge
                    text="New"
                    className="!absolute !right-2 !top-2 !bg-[#4f0089] !px-2 !py-1"
                    textClassName="!text-[10px] !leading-[10px]"
                  />
                </SelectCard>

                <SelectCard
                  state={selectedModel === 'stylist' ? 'selected' : 'default'}
                  title="스타일리스트"
                  subtitle="사진을 멋진 리얼리스틱 스케치로 변환"
                  backgroundImage="/studio/model-select/stylist.png"
                  onClick={() => setSelectedModel('stylist')}
                  onMouseEnter={() => handleCardHover('stylist')}
                />

                <SelectCard
                  state={
                    selectedModel === 'fanmeeting' ? 'selected' : 'default'
                  }
                  title="온라인 팬미팅"
                  subtitle="사진을 멋진 리얼리스틱 스케치로 변환"
                  backgroundImage="/studio/model-select/fanmeeting-studio.png"
                  onClick={() => setSelectedModel('fanmeeting')}
                  onMouseEnter={() => handleCardHover('fanmeeting')}
                />

                <SelectCard
                  state={
                    selectedModel === 'virtual-casting' ? 'selected' : 'default'
                  }
                  title="가상 캐스팅"
                  subtitle="사진을 멋진 리얼리스틱 스케치로 변환"
                  backgroundImage="/studio/model-select/virtual_casting.png"
                  onClick={() => setSelectedModel('virtual-casting')}
                  onMouseEnter={() => handleCardHover('virtual-casting')}
                />
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-studio-text-primary text-sm">
                  아이돌 보이스 AI
                </h3>
                <span className="font-semibold text-studio-text-secondary text-sm cursor-pointer">
                  How to use
                </span>
              </div>

              <div
                className={`border border-solid w-full ${isMobile ? 'h-[300px]' : 'h-[400px]'} rounded-md cursor-pointer mb-4 transition-colors relative ${
                  selectedAudioModel === 'butter-cover'
                    ? 'border-[#ffd83b] border-2'
                    : 'border-[#4a4a4b] hover:border-[#6a6a6b]'
                }`}
                onClick={() => setSelectedAudioModel('butter-cover')}
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
                      AI로 완성된 아이돌 음성
                    </h2>
                    <p className="text-sm font-light opacity-90">
                      AI 기술로 재현된 아이돌의 목소리.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <StudioButton
          text="만들기"
          className="!w-full"
          textClassName="!text-[#4a4a4b]"
          onClick={handleCreate}
        />
      </div>
    </div>
  );
}
