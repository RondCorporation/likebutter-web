'use client';

import { useState, useEffect } from 'react';
import ScrollableGrid from '../../_components/ScrollableGrid';

import { DigitalGoodsStyle } from '@/app/_lib/apis/task.api';

interface DigitalGoodsStyleSidebarProps {
  onFormChange?: (formData: {
    style?: DigitalGoodsStyle;
  }) => void;
}

export default function DigitalGoodsStyleSidebar({
  onFormChange,
}: DigitalGoodsStyleSidebarProps = {}) {
  const [selectedPreset, setSelectedPreset] = useState('지브리');

  // 스타일 이미지 매핑
  const getStyleImage = (style: string) => {
    const styleImageMap: Record<string, string> = {
      'GHIBLI': '/studio/digital-goods/지브리.png',
      'PIXEL_ART': '/studio/digital-goods/픽셀아트.png',
      'ANIMATION': '/studio/digital-goods/애니.png',
      'CARTOON': '/studio/digital-goods/카툰.png',
      'SKETCH': '/studio/digital-goods/스캐치.png',
      'GRADUATION_PHOTO': '/studio/digital-goods/졸업사진.png',
      'LEGO': '/studio/digital-goods/레고.png',
      'STICKER': '/studio/digital-goods/스티커.png',
      'FIGURE': '/studio/digital-goods/피규어.png',
    };
    return styleImageMap[style] || '/studio/digital-goods/지브리.png';
  };

  const stylePresets = [
    { name: '지브리', value: 'GHIBLI' },
    { name: '픽셀아트', value: 'PIXEL_ART' },
    { name: '애니메이션', value: 'ANIMATION' },
    { name: '카툰', value: 'CARTOON' },
    { name: '스케치', value: 'SKETCH' },
    { name: '졸업사진', value: 'GRADUATION_PHOTO' },
    { name: '레고', value: 'LEGO' },
    { name: '스티커', value: 'STICKER' },
    { name: '피규어', value: 'FIGURE' },
  ];

  // Form data 변경 감지 및 부모 컴포넌트로 전달
  useEffect(() => {
    const selectedPresetData = stylePresets.find(
      (preset) => preset.name === selectedPreset
    );
    const formData = {
      style: (selectedPresetData?.value || 'GHIBLI') as DigitalGoodsStyle,
    };

    onFormChange?.(formData);
  }, [selectedPreset, onFormChange]);

  return (
    <div className="flex flex-col w-full md:w-[260px] h-full items-start gap-6 md:gap-10 pt-3 md:pt-6 pb-3 px-3 relative bg-studio-sidebar md:border-r border-solid border-studio-border-light overflow-y-auto">
      <div className="flex flex-col items-start gap-8 relative self-stretch w-full flex-[0_0_auto]">
        {/* 스타일 프리셋 */}
        <div className="flex flex-col items-start gap-4 relative flex-[0_0_auto] w-full">
          <div className="w-fit mt-[-1px] font-pretendard-medium text-studio-text-primary text-sm text-center leading-[19.6px] whitespace-nowrap relative tracking-[0]">
            스타일 프리셋
          </div>

          <ScrollableGrid rows={2} scrollAmount={200}>
            <div className="flex flex-col gap-3">
              <div className="flex gap-3">
                {stylePresets.slice(0, 5).map((preset, index) => (
                  <div
                    key={preset.value}
                    className="flex flex-col items-center justify-center gap-1.5 cursor-pointer flex-shrink-0"
                    onClick={() => setSelectedPreset(preset.name)}
                  >
                    <div
                      className={`relative w-16 h-16 bg-studio-border rounded-md overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
                        preset.name === selectedPreset
                          ? 'border-studio-button-hover shadow-lg'
                          : 'border-transparent'
                      }`}
                    >
                      <img
                        src={getStyleImage(preset.value)}
                        alt={preset.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div
                      className={`font-pretendard-medium text-xs text-center leading-tight tracking-[0] transition-colors duration-200 w-16 ${
                        preset.name === selectedPreset
                          ? 'text-studio-button-hover font-semibold'
                          : 'text-studio-text-primary'
                      }`}
                    >
                      {preset.name}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                {stylePresets.slice(5, 9).map((preset, index) => (
                  <div
                    key={preset.value}
                    className="flex flex-col items-center justify-center gap-1.5 cursor-pointer flex-shrink-0"
                    onClick={() => setSelectedPreset(preset.name)}
                  >
                    <div
                      className={`relative w-16 h-16 bg-studio-border rounded-md overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
                        preset.name === selectedPreset
                          ? 'border-studio-button-hover shadow-lg'
                          : 'border-transparent'
                      }`}
                    >
                      <img
                        src={getStyleImage(preset.value)}
                        alt={preset.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div
                      className={`font-pretendard-medium text-xs text-center leading-tight tracking-[0] transition-colors duration-200 w-16 ${
                        preset.name === selectedPreset
                          ? 'text-studio-button-hover font-semibold'
                          : 'text-studio-text-primary'
                      }`}
                    >
                      {preset.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollableGrid>
        </div>


      </div>
    </div>
  );
}
