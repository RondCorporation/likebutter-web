'use client';

import React, { useState } from 'react';
import { Image, Music2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ToolCard {
  id: string;
  title: string;
  description: string;
  route: string;
  preview: string;
  isNew?: boolean;
  gradient?: string;
  bgColor?: string;
}

export default function DashboardClient() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<'image' | 'audio'>('image');

  const imageToolCards: ToolCard[] = [
    {
      id: 'digital-goods',
      title: '디지털 굿즈',
      description: '사진을 멋진 리얼리스틱 스케치로 변환',
      route: '/studio/digital-goods',
      preview: '/studio/model-select/digital-goods.png',
      isNew: true,
      gradient:
        'radial-gradient(50% 50% at 50% 50%, rgba(192,236,245,1) 0%, rgba(238,242,219,1) 100%)',
    },
    {
      id: 'stylist',
      title: '스타일리스트',
      description: '사진을 멋진 리얼리스틱 스케치로 변환',
      route: '/studio/stylist',
      preview: '/studio/model-select/stylist.png',
      gradient:
        'linear-gradient(90deg, rgba(192,236,245,1) 0%, rgba(242,235,30,1) 100%)',
    },
    {
      id: 'fanmeeting-studio',
      title: '온라인 팬미팅',
      description: '사진을 멋진 리얼리스틱 스케치로 변환',
      route: '/studio/fanmeeting-studio',
      preview: '/studio/model-select/fanmeeting-studio.png',
      isNew: true,
      bgColor: '#f5f5f5',
    },
    {
      id: 'virtual-casting',
      title: '가상 캐스팅',
      description: '사진을 멋진 리얼리스틱 스케치로 변환',
      route: '/studio/virtual-casting',
      preview: '/studio/model-select/virtual_casting.png',
      isNew: true,
      bgColor: '#202020',
    },
  ];

  const audioToolCards: ToolCard[] = [
    {
      id: 'butter-cover',
      title: '버터 커버',
      description: '좋아하는 곡을 내 목소리로 커버해보세요',
      route: '/studio/butter-cover',
      preview: '/studio/model-select/butter-cover.png',
      isNew: true,
      gradient:
        'linear-gradient(135deg, rgba(255,108,108,1) 0%, rgba(255,159,67,1) 100%)',
    },
  ];

  const handleToolClick = (route: string) => {
    // Extract tool name from route
    const toolName = route.split('/').pop() || 'dashboard';

    // Use the global navigation function if available (SPA mode)
    if (typeof window !== 'undefined' && (window as any).studioNavigateToTool) {
      (window as any).studioNavigateToTool(toolName);
    } else {
      // Fallback to traditional routing
      router.push(route);
    }
  };

  const currentToolCards =
    selectedTab === 'image' ? imageToolCards : audioToolCards;
  const currentSectionTitle =
    selectedTab === 'image' ? '이미지 생성' : '음원 생성';

  return (
    <div className="w-full min-h-screen bg-[#25282c]">
      {/* Hero Section */}
      <div className="relative w-full pt-2 md:pt-7 px-2 md:px-[90px]">
        <div className="relative w-full h-[140px] md:h-[150px] rounded-lg md:rounded-2xl bg-gradient-to-r from-[#ffd83b] via-[#f2eb1e] to-[#e5ff00] flex items-center justify-center">
          <h1 className="text-black text-xl md:text-3xl font-bold text-center px-4">
            오늘은 어떻게 놀아볼까요?
          </h1>
        </div>

        {/* Tab Switcher */}
        <div className="absolute left-1/2 transform -translate-x-1/2 top-28 md:top-32 flex bg-[#292c31] rounded-full p-1">
          <button
            onClick={() => setSelectedTab('image')}
            className={`flex items-center gap-2 md:gap-2 px-4 md:px-5 py-3 md:py-2 rounded-full font-medium transition-all ${
              selectedTab === 'image'
                ? 'bg-[#4a4d54] text-[#ffd93b]'
                : 'text-gray-400 hover:text-white'
            }`}
            style={{ fontSize: '14px' }}
          >
            <Image className="w-5 h-5 md:w-5 md:h-5" />
            이미지 생성
          </button>
          <button
            onClick={() => setSelectedTab('audio')}
            className={`flex items-center gap-2 md:gap-2 px-4 md:px-5 py-3 md:py-2 rounded-full font-medium transition-all ${
              selectedTab === 'audio'
                ? 'bg-[#4a4d54] text-[#ffd93b]'
                : 'text-gray-400 hover:text-white'
            }`}
            style={{ fontSize: '14px' }}
          >
            <Music2 className="w-5 h-5 md:w-5 md:h-5" />
            음원 생성
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-2 md:px-[90px] mt-20 md:mt-[100px]">
        {/* Section Title */}
        <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-[#ffcc00] to-[#e8fa07] bg-clip-text text-transparent mb-8 md:mb-7">
          {currentSectionTitle}
        </h2>

        {/* Tool Cards Grid */}
        <div
          className={
            selectedTab === 'audio'
              ? 'flex justify-start'
              : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-4'
          }
        >
          {currentToolCards.map((tool) => (
            <div
              key={tool.id}
              className={`flex flex-col cursor-pointer group ${
                selectedTab === 'audio' ? 'w-full max-w-2xl' : 'max-w-full'
              }`}
              onClick={() => handleToolClick(tool.route)}
            >
              {/* Card Preview */}
              <div
                className={`relative w-full rounded-xl md:rounded-2xl overflow-hidden transition-transform group-hover:scale-105 mb-4 ${
                  selectedTab === 'audio'
                    ? 'aspect-[2/1] h-[220px] md:h-[300px]'
                    : 'aspect-[283/165] h-[200px] md:h-auto'
                }`}
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

                {/* New Badge */}
                {tool.isNew && (
                  <div className="absolute top-3 right-3 bg-[#4f0089] text-white text-xs px-2 py-1 rounded">
                    New
                  </div>
                )}
              </div>

              {/* Card Info */}
              <div
                className={`w-full text-left ${selectedTab === 'audio' ? 'pl-2 md:pl-4' : 'pl-2'}`}
              >
                <h3
                  className={`text-white font-medium mb-2 ${
                    selectedTab === 'audio' ? 'text-xl md:text-2xl' : 'text-lg md:text-lg'
                  }`}
                >
                  {tool.title}
                </h3>
                <p
                  className={`text-[#a8a8aa] leading-relaxed ${
                    selectedTab === 'audio' ? 'text-base md:text-base' : 'text-sm md:text-sm'
                  }`}
                >
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
