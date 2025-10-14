'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Music2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
    <div className="w-full min-h-full bg-[#25282c] pb-12 md:pb-0">
      {/* Hero Section */}
      <div className="relative w-full pt-2 md:pt-7 px-0 md:px-[90px]">
        <div className="relative w-full h-[140px] md:h-[150px] rounded-none md:rounded-2xl bg-gradient-to-r from-[#ffd83b] via-[#f2eb1e] to-[#e5ff00] flex items-center justify-center">
          <h1 className="text-black text-xl md:text-3xl font-bold text-center px-4">
            {t('studio:dashboard.heroTitle')}
          </h1>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="relative w-full flex justify-center -mt-6 md:-mt-6 z-10">
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
            <Image className="w-5 h-5 md:w-5 md:h-5" />
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
        {/* Section Title */}
        <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-[#ffcc00] to-[#e8fa07] bg-clip-text text-transparent mb-8 md:mb-7">
          {currentSectionTitle}
        </h2>

        {/* Tool Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-4">
          {currentToolCards.map((tool) => (
            <div
              key={tool.id}
              className="flex flex-col cursor-pointer group max-w-full"
              onClick={() => handleToolClick(tool.route)}
            >
              {/* Card Preview */}
              <div
                className="relative w-full rounded-xl md:rounded-2xl overflow-hidden transition-transform group-hover:scale-105 mb-4 aspect-[283/165] h-[200px] md:h-auto"
                style={{
                  background: tool.gradient || tool.bgColor || '#f5f5f5',
                }}
              >
                {tool.preview && (
                  <img
                    src={tool.preview}
                    alt={tool.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Card Info */}
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
      </div>
    </div>
  );
}
