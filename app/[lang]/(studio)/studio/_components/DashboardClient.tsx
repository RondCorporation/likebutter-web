'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Image as ImageIcon, Music2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import TopThreeStylesSection from './TopThreeStylesSection';
import FeatureCardCarousel from './FeatureCardCarousel';
import NewAIStylesSection from './NewAIStylesSection';

interface ToolCard {
  id: string;
  title: string;
  description: string;
  route: string;
  preview: string;
  gradient?: string;
  bgColor?: string;
}

export default function DashboardClient() {
  const { t } = useTranslation(['studio', 'common']);
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<'image' | 'audio'>('image');
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  const bannerImages = [
    '/studio/main_banner/main-banner-1.png',
    '/studio/main_banner/main-banner-2.png',
    '/studio/main_banner/main-banner-3.png',
    '/studio/main_banner/main-banner-4.png',
  ];

  const bannerImagesMobile = [
    '/studio/main_banner_mobile/main-banner-1.png',
    '/studio/main_banner_mobile/main-banner-2.png',
    '/studio/main_banner_mobile/main-banner-3.png',
    '/studio/main_banner_mobile/main-banner-4.png',
  ];

  // Auto-slide banner every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % bannerImages.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [bannerImages.length]);

  const imageToolCards: ToolCard[] = [
    {
      id: 'digital-goods',
      title: t('studio:tools.digitalGoods.title'),
      description: t('studio:tools.digitalGoods.description'),
      route: '/studio/digital-goods',
      preview: '/studio/model-select/digital-goods.png',
      gradient:
        'radial-gradient(50% 50% at 50% 50%, rgba(192,236,245,1) 0%, rgba(238,242,219,1) 100%)',
    },
    {
      id: 'stylist',
      title: t('studio:tools.stylist.title'),
      description: t('studio:tools.stylist.description'),
      route: '/studio/stylist',
      preview: '/studio/model-select/stylist.png',
      gradient:
        'linear-gradient(90deg, rgba(192,236,245,1) 0%, rgba(242,235,30,1) 100%)',
    },
    {
      id: 'fanmeeting-studio',
      title: t('studio:tools.fanmeetingStudio.title'),
      description: t('studio:tools.fanmeetingStudio.description'),
      route: '/studio/fanmeeting-studio',
      preview: '/studio/model-select/fanmeeting-studio.png',
      bgColor: '#f5f5f5',
    },
    {
      id: 'virtual-casting',
      title: t('studio:tools.virtualCasting.title'),
      description: t('studio:tools.virtualCasting.description'),
      route: '/studio/virtual-casting',
      preview: '/studio/model-select/virtual_casting.png',
      bgColor: '#202020',
    },
  ];

  const audioToolCards: ToolCard[] = [
    {
      id: 'butter-cover',
      title: t('studio:tools.butterCoverTool.title'),
      description: t('studio:tools.butterCoverTool.description'),
      route: '/studio/butter-cover',
      preview: '/studio/model-select/butter-cover.png',
      gradient:
        'linear-gradient(135deg, rgba(255,108,108,1) 0%, rgba(255,159,67,1) 100%)',
    },
  ];

  const topThreeStyles = [
    {
      rank: 1,
      title: '폴라로이드',
      description: '요즘 유행하는 바로 그거',
      image: '/studio/fanmeeting/polaroid.png',
      route: '/studio/fanmeeting-studio',
      styleParam: 'POLAROID',
    },
    {
      rank: 2,
      title: '겨울 삿포로',
      description: '요즘 유행하는 바로 그거',
      image: '/studio/fanmeeting/winter-sapporo.png',
      route: '/studio/fanmeeting-studio',
      styleParam: 'WINTER_SAPPORO',
    },
    {
      rank: 3,
      title: '스케치 스타일',
      description: '요즘 유행하는 바로 그거',
      image: '/studio/digital-goods/sketch.png',
      route: '/studio/digital-goods',
      styleParam: 'SKETCH',
    },
  ];

  const newAIStyles = [
    {
      id: 'polaroid',
      title: '폴라로이드',
      image: '/studio/fanmeeting/polaroid.png',
      route: '/studio/fanmeeting-studio',
      styleParam: 'POLAROID',
    },
    {
      id: 'winter-sapporo',
      title: '겨울 삿포로',
      image: '/studio/fanmeeting/winter-sapporo.png',
      route: '/studio/fanmeeting-studio',
      styleParam: 'WINTER_SAPPORO',
    },
    {
      id: 'graduation',
      title: '졸업앨범 스타일',
      image: '/studio/digital-goods/graduation-photo.png',
      route: '/studio/digital-goods',
      styleParam: 'GRADUATION_PHOTO',
    },
    {
      id: 'zootopia',
      title: '주토피아 스타일',
      image: '/studio/virtual-casting/sidebar-menu-image/zootopia.jpg',
      route: '/studio/virtual-casting',
      styleParam: 'ZOOTOPIA',
    },
    {
      id: 'kpop-demon-hunters',
      title: '케데헌 스타일',
      image:
        '/studio/virtual-casting/sidebar-menu-image/kpop-demon-hunters.png',
      route: '/studio/virtual-casting',
      styleParam: 'KPOP_DEMON_HUNTERS',
    },
  ];

  const handleToolClick = (route: string) => {
    const toolName = route.split('/').pop() || 'dashboard';

    if (typeof window !== 'undefined' && (window as any).studioNavigateToTool) {
      (window as any).studioNavigateToTool(toolName);
    } else {
      router.push(route);
    }
  };

  const currentToolCards =
    selectedTab === 'image' ? imageToolCards : audioToolCards;
  const currentSectionTitle =
    selectedTab === 'image'
      ? t('studio:dashboard.imageGeneration')
      : t('studio:dashboard.audioGeneration');

  return (
    <div className="w-full min-h-full bg-studio-content-home pb-12 md:pb-16">
      {/* Banner Section */}
      <div className="relative w-full">
        {/* Desktop Banner - Full Width */}
        <div className="hidden md:block relative w-full overflow-hidden bg-studio-content-home">
          <div className="relative w-full" style={{ aspectRatio: '2720/870' }}>
            {bannerImages.map((banner, index) => (
              <div
                key={index}
                className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
                style={{
                  opacity: currentBannerIndex === index ? 1 : 0,
                  zIndex: currentBannerIndex === index ? 1 : 0,
                }}
              >
                <Image
                  src={banner}
                  alt={`Banner ${index + 1}`}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority={index === 0}
                />
              </div>
            ))}
          </div>
          {/* Page Indicator */}
          <div
            className="absolute top-6 right-6 px-4 py-2 font-semibold text-xs shadow-lg z-10"
            style={{
              borderRadius: '100px',
              backgroundColor: '#F8F9FB',
              opacity: 0.9,
              color: '#6B7280',
            }}
          >
            {currentBannerIndex + 1} / {bannerImages.length}
          </div>
        </div>

        {/* Mobile Banner - Square with padding */}
        <div className="block md:hidden relative w-full px-4">
          <div className="relative w-full aspect-square rounded-2xl overflow-hidden">
            {bannerImagesMobile.map((banner, index) => (
              <div
                key={index}
                className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
                style={{
                  opacity: currentBannerIndex === index ? 1 : 0,
                  zIndex: currentBannerIndex === index ? 1 : 0,
                }}
              >
                <Image
                  src={banner}
                  alt={`Banner ${index + 1}`}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority={index === 0}
                />
              </div>
            ))}
            {/* Page Indicator */}
            <div
              className="absolute top-4 right-4 px-3 py-1.5 font-semibold text-xs shadow-lg z-10"
              style={{
                borderRadius: '100px',
                backgroundColor: '#F8F9FB',
                opacity: 0.9,
                color: '#6B7280',
              }}
            >
              {currentBannerIndex + 1} / {bannerImagesMobile.length}
            </div>
          </div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="relative w-full flex justify-center -mt-6 md:-mt-5 z-10">
        <div className="flex bg-[#292c31] rounded-full p-1">
          <button
            onClick={() => setSelectedTab('image')}
            className={`flex items-center gap-2 md:gap-2 px-6 md:px-5 py-3 md:py-2 rounded-full font-medium transition-all whitespace-nowrap ${
              selectedTab === 'image'
                ? 'bg-[#4a4d54] text-[#ffd93b]'
                : 'text-gray-400 hover:text-white'
            }`}
            style={{ fontSize: '14px' }}
          >
            <ImageIcon className="w-5 h-5 md:w-5 md:h-5" />
            {t('studio:dashboard.imageGeneration')}
          </button>
          <button
            onClick={() => setSelectedTab('audio')}
            className={`flex items-center gap-2 md:gap-2 px-6 md:px-5 py-3 md:py-2 rounded-full font-medium transition-all whitespace-nowrap ${
              selectedTab === 'audio'
                ? 'bg-[#4a4d54] text-[#ffd93b]'
                : 'text-gray-400 hover:text-white'
            }`}
            style={{ fontSize: '14px' }}
          >
            <Music2 className="w-5 h-5 md:w-5 md:h-5" />
            {t('studio:dashboard.audioGeneration')}
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-4 md:px-[90px] mt-20 md:mt-[100px]">
        {selectedTab === 'image' ? (
          <>
            {/* Desktop Layout - 2 Rows */}
            <div className="hidden md:block space-y-12">
              {/* First Row - 3:2 Grid */}
              <div className="grid grid-cols-5 gap-6">
                <div className="col-span-3">
                  <TopThreeStylesSection styles={topThreeStyles} />
                </div>
                <div className="col-span-2">
                  <FeatureCardCarousel cards={imageToolCards} />
                </div>
              </div>

              {/* Second Row - New AI Styles */}
              <NewAIStylesSection styles={newAIStyles} />
            </div>

            {/* Mobile Layout - 3 Sections Stacked */}
            <div className="block md:hidden space-y-8">
              <NewAIStylesSection styles={newAIStyles} />
              <TopThreeStylesSection styles={topThreeStyles} />

              {/* 4 Feature Cards - Vertical List */}
              <div className="flex flex-col gap-8">
                {imageToolCards.map((tool) => (
                  <div
                    key={tool.id}
                    className="flex flex-col cursor-pointer group"
                    onClick={() => handleToolClick(tool.route)}
                  >
                    <div
                      className="relative w-full rounded-xl overflow-hidden transition-transform group-hover:scale-105 mb-4 aspect-[283/165] h-[200px]"
                      style={{
                        background: tool.gradient || tool.bgColor || '#f5f5f5',
                      }}
                    >
                      {tool.preview && (
                        <Image
                          src={tool.preview}
                          alt={tool.title}
                          fill
                          className="object-cover"
                          sizes="100vw"
                          priority={false}
                        />
                      )}
                    </div>
                    <div className="w-full text-left pl-2">
                      <h3 className="text-white font-medium mb-2 text-lg">
                        {tool.title}
                      </h3>
                      <p className="text-[#a8a8aa] leading-relaxed text-sm">
                        {tool.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-[#ffcc00] to-[#e8fa07] bg-clip-text text-transparent mb-8 md:mb-7">
              {currentSectionTitle}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-4">
              {currentToolCards.map((tool) => (
                <div
                  key={tool.id}
                  className="flex flex-col cursor-pointer group max-w-full"
                  onClick={() => handleToolClick(tool.route)}
                >
                  <div
                    className="relative w-full rounded-xl md:rounded-2xl overflow-hidden transition-transform group-hover:scale-105 mb-4 aspect-[283/165] h-[200px] md:h-auto"
                    style={{
                      background: tool.gradient || tool.bgColor || '#f5f5f5',
                    }}
                  >
                    {tool.preview && (
                      <Image
                        src={tool.preview}
                        alt={tool.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        priority={false}
                      />
                    )}
                  </div>
                  <div className="w-full text-left pl-2">
                    <h3 className="text-white font-medium mb-2 text-lg md:text-lg">
                      {tool.title}
                    </h3>
                    <p className="text-[#a8a8aa] leading-relaxed text-sm md:text-sm">
                      {tool.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
