'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import { DigitalGoodsStyle } from '@/app/_lib/apis/task.api';
import StudioSidebarBase from '../../_components/StudioSidebarBase';

interface DigitalGoodsStyleSidebarProps {
  onFormChange?: (formData: { style?: DigitalGoodsStyle }) => void;
}

export default function DigitalGoodsStyleSidebar({
  onFormChange,
}: DigitalGoodsStyleSidebarProps = {}) {
  const { t } = useTranslation(['studio']);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  const getStyleImage = (style: string) => {
    const styleImageMap: Record<string, string> = {
      GHIBLI: '/studio/digital-goods/지브리.png',
      PIXEL_ART: '/studio/digital-goods/픽셀아트.png',
      ANIMATION: '/studio/digital-goods/애니.png',
      CARTOON: '/studio/digital-goods/카툰.png',
      SKETCH: '/studio/digital-goods/스캐치.png',
      GRADUATION_PHOTO: '/studio/digital-goods/졸업사진.png',
      LEGO: '/studio/digital-goods/레고.png',
      STICKER: '/studio/digital-goods/스티커.png',
      FIGURE: '/studio/digital-goods/피규어.png',
    };
    return styleImageMap[style] || '/studio/digital-goods/지브리.png';
  };

  const stylePresets = [
    { name: t('digitalGoods.styles.GHIBLI'), value: 'GHIBLI' },
    { name: t('digitalGoods.styles.PIXEL_ART'), value: 'PIXEL_ART' },
    { name: t('digitalGoods.styles.ANIMATION'), value: 'ANIMATION' },
    { name: t('digitalGoods.styles.CARTOON'), value: 'CARTOON' },
    { name: t('digitalGoods.styles.SKETCH'), value: 'SKETCH' },
    {
      name: t('digitalGoods.styles.GRADUATION_PHOTO'),
      value: 'GRADUATION_PHOTO',
    },
    { name: t('digitalGoods.styles.LEGO'), value: 'LEGO' },
    { name: t('digitalGoods.styles.STICKER'), value: 'STICKER' },
    { name: t('digitalGoods.styles.FIGURE'), value: 'FIGURE' },
  ];

  useEffect(() => {
    if (!selectedPreset) {
      onFormChange?.({});
      return;
    }

    const selectedPresetData = stylePresets.find(
      (preset) => preset.name === selectedPreset
    );

    if (selectedPresetData) {
      const formData = {
        style: selectedPresetData.value as DigitalGoodsStyle,
      };
      onFormChange?.(formData);
    }
  }, [selectedPreset, onFormChange]);

  return (
    <StudioSidebarBase>
      {/* Style Preset */}
      <div className="flex flex-col items-start gap-4 relative flex-[0_0_auto] w-full">
        <div className="w-fit mt-[-1px] font-pretendard-medium text-studio-text-primary text-sm text-center leading-[19.6px] whitespace-nowrap relative tracking-[0]">
          {t('digitalGoods.stylePreset')}
        </div>

        <div className="grid grid-cols-2 gap-3 w-full">
          {stylePresets.map((preset, index) => (
            <div
              key={preset.value}
              className="flex flex-col items-center justify-center gap-1.5 cursor-pointer"
              onClick={() => setSelectedPreset(preset.name)}
            >
              <div
                className={`relative w-full aspect-square max-w-[120px] md:w-24 md:h-24 bg-studio-border rounded-md overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
                  preset.name === selectedPreset
                    ? 'border-studio-button-hover shadow-lg'
                    : 'border-transparent'
                }`}
              >
                <Image
                  src={getStyleImage(preset.value)}
                  alt={preset.name}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
              <div
                className={`font-pretendard-medium text-xs text-center leading-tight tracking-[0] transition-colors duration-200 w-full px-1 ${
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
    </StudioSidebarBase>
  );
}
