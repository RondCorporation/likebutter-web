'use client';

import { useState, useEffect } from 'react';
import CustomDropdown from '../../_components/CustomDropdown';
import ScrollableGrid from '../../_components/ScrollableGrid';

import { DigitalGoodsStyle } from '@/lib/apis/task.api';

interface DigitalGoodsStyleSidebarProps {
  onFormChange: (formData: {
    style?: DigitalGoodsStyle;
    customPrompt?: string;
    title?: string;
    subtitle?: string;
    accentColor?: string;
    productName?: string;
    brandName?: string;
  }) => void;
}

export default function DigitalGoodsStyleSidebar({
  onFormChange,
}: DigitalGoodsStyleSidebarProps) {
  const [selectedPreset, setSelectedPreset] = useState('포스터');
  const [prompt, setPrompt] = useState('');

  // Style-specific parameters
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [accentColor, setAccentColor] = useState('#FF0000');
  const [productName, setProductName] = useState('');
  const [brandName, setBrandName] = useState('');

  const [imageSize, setImageSize] = useState('1:1(정방향)');

  const stylePresets = [
    { name: '포스터', value: 'POSTER', width: 84 },
    { name: '스티커', value: 'STICKER', width: 84 },
    { name: '지브리', value: 'GHIBLI', width: 84 },
    { name: '피규어', value: 'FIGURE', width: 84 },
    { name: '카툰', value: 'CARTOON', width: 84 },
  ];

  // Form data 변경 감지 및 부모 컴포넌트로 전달
  useEffect(() => {
    const selectedPresetData = stylePresets.find(
      (preset) => preset.name === selectedPreset
    );
    const formData: any = {
      style: (selectedPresetData?.value || 'POSTER') as DigitalGoodsStyle,
      customPrompt: prompt,
    };

    // Style-specific parameters
    if (selectedPresetData?.value === 'POSTER') {
      if (title) formData.title = title;
      if (subtitle) formData.subtitle = subtitle;
      if (accentColor) formData.accentColor = accentColor;
    } else if (selectedPresetData?.value === 'FIGURE') {
      if (productName) formData.productName = productName;
      if (brandName) formData.brandName = brandName;
    }

    onFormChange(formData);
  }, [
    prompt,
    selectedPreset,
    title,
    subtitle,
    accentColor,
    productName,
    brandName,
    onFormChange,
  ]);

  return (
    <div className="flex flex-col w-full md:w-[260px] h-full items-start gap-6 md:gap-10 pt-3 md:pt-6 pb-3 px-3 relative bg-studio-sidebar md:border-r border-solid border-studio-border-light overflow-y-auto">
      <div className="flex flex-col items-start gap-8 relative self-stretch w-full flex-[0_0_auto]">
        {/* 스타일 프리셋 */}
        <div className="flex flex-col items-start gap-4 relative flex-[0_0_auto] w-full">
          <div className="w-fit mt-[-1px] font-pretendard-medium text-studio-text-primary text-sm text-center leading-[19.6px] whitespace-nowrap relative tracking-[0]">
            스타일 프리셋
          </div>

          <ScrollableGrid rows={2} scrollAmount={180}>
            <div className="flex flex-col gap-2.5 flex-shrink-0">
              <div className="flex gap-3 flex-shrink-0">
                {stylePresets.slice(0, 3).map((preset, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center justify-center gap-1.5 cursor-pointer flex-shrink-0"
                    onClick={() => setSelectedPreset(preset.name)}
                  >
                    <div
                      className={`relative h-[89px] bg-studio-border rounded-md overflow-hidden`}
                      style={{ width: `${preset.width}px` }}
                    >
                      <div className="w-full h-full bg-gradient-to-br from-studio-border to-studio-border"></div>
                    </div>
                    <div
                      className={`font-pretendard-medium text-sm text-center leading-[19.6px] tracking-[0] transition-colors duration-200 ${
                        preset.name === selectedPreset
                          ? 'text-studio-button-hover'
                          : 'text-studio-text-primary'
                      }`}
                      style={{ width: `${preset.width}px` }}
                    >
                      {preset.name}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 flex-shrink-0">
                {stylePresets.slice(3, 5).map((preset, index) => (
                  <div
                    key={index + 6}
                    className="flex flex-col items-center justify-center gap-1.5 cursor-pointer flex-shrink-0"
                    onClick={() => setSelectedPreset(preset.name)}
                  >
                    <div
                      className={`relative h-[89px] bg-studio-border rounded-md overflow-hidden`}
                      style={{ width: `${preset.width}px` }}
                    >
                      <div className="w-full h-full bg-gradient-to-br from-studio-border to-studio-border"></div>
                    </div>
                    <div
                      className={`font-pretendard-medium text-sm text-center leading-[19.6px] tracking-[0] transition-colors duration-200 ${
                        preset.name === selectedPreset
                          ? 'text-studio-button-hover'
                          : 'text-studio-text-primary'
                      }`}
                      style={{ width: `${preset.width}px` }}
                    >
                      {preset.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollableGrid>
        </div>

        {/* 프롬프트 입력 (공통 필수) */}
        <div className="flex flex-col items-start gap-4 relative flex-[0_0_auto] self-stretch w-full">
          <div className="relative w-fit mt-[-1px] font-pretendard-medium text-studio-text-primary text-sm text-center tracking-[0] leading-[19.6px] whitespace-nowrap">
            프롬프트 <span className="text-red-400">*</span>
          </div>

          <div className="relative self-stretch w-full h-[unset] gap-4 flex-[0_0_auto] bg-studio-sidebar">
            <div className="relative w-[236px] h-[70px] rounded">
              <div className="flex w-[236px] h-[70px] items-center gap-3 px-3 py-2.5 absolute top-0 left-0 rounded overflow-hidden border border-solid border-studio-border bg-studio-sidebar">
                <div className="flex items-start gap-2.5 grow relative flex-1 self-stretch">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="원하는 디지털 굿즈에 대해 자세히 설명해주세요"
                    className="mt-[-1px] font-pretendard-medium text-studio-text-secondary text-sm tracking-[0] leading-[19.6px] relative flex-1 self-stretch bg-transparent border-0 resize-none focus:outline-none placeholder-studio-text-secondary"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 스타일별 동적 입력 필드 */}
        {stylePresets.find((p) => p.name === selectedPreset)?.value ===
          'POSTER' && (
          <>
            {/* 제목 */}
            <div className="flex flex-col items-start gap-4 relative flex-[0_0_auto] self-stretch w-full">
              <div className="relative w-fit mt-[-1px] font-pretendard-medium text-studio-text-primary text-sm text-center tracking-[0] leading-[19.6px] whitespace-nowrap">
                제목
              </div>
              <div className="relative self-stretch w-full">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="포스터 제목을 입력하세요"
                  className="w-full px-3 py-2.5 rounded border border-studio-border bg-studio-sidebar text-studio-text-secondary text-sm font-pretendard-medium focus:outline-none focus:border-studio-button-primary placeholder-studio-text-secondary"
                />
              </div>
            </div>

            {/* 부제목 */}
            <div className="flex flex-col items-start gap-4 relative flex-[0_0_auto] self-stretch w-full">
              <div className="relative w-fit mt-[-1px] font-pretendard-medium text-studio-text-primary text-sm text-center tracking-[0] leading-[19.6px] whitespace-nowrap">
                부제목
              </div>
              <div className="relative self-stretch w-full">
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="포스터 부제목을 입력하세요"
                  className="w-full px-3 py-2.5 rounded border border-studio-border bg-studio-sidebar text-studio-text-secondary text-sm font-pretendard-medium focus:outline-none focus:border-studio-button-primary placeholder-studio-text-secondary"
                />
              </div>
            </div>

            {/* 강조 색상 */}
            <div className="flex flex-col items-start gap-4 relative flex-[0_0_auto] self-stretch w-full">
              <div className="relative w-fit mt-[-1px] font-pretendard-medium text-studio-text-primary text-sm text-center tracking-[0] leading-[19.6px] whitespace-nowrap">
                강조 색상
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-12 h-10 rounded border border-studio-border bg-studio-sidebar cursor-pointer"
                />
                <input
                  type="text"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  placeholder="#FF0000"
                  className="flex-1 px-3 py-2.5 rounded border border-studio-border bg-studio-sidebar text-studio-text-secondary text-sm font-pretendard-medium focus:outline-none focus:border-studio-button-primary placeholder-studio-text-secondary"
                />
              </div>
            </div>
          </>
        )}

        {stylePresets.find((p) => p.name === selectedPreset)?.value ===
          'FIGURE' && (
          <>
            {/* 제품명 */}
            <div className="flex flex-col items-start gap-4 relative flex-[0_0_auto] self-stretch w-full">
              <div className="relative w-fit mt-[-1px] font-pretendard-medium text-studio-text-primary text-sm text-center tracking-[0] leading-[19.6px] whitespace-nowrap">
                제품명
              </div>
              <div className="relative self-stretch w-full">
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="피규어 제품명을 입력하세요"
                  className="w-full px-3 py-2.5 rounded border border-studio-border bg-studio-sidebar text-studio-text-secondary text-sm font-pretendard-medium focus:outline-none focus:border-studio-button-primary placeholder-studio-text-secondary"
                />
              </div>
            </div>

            {/* 브랜드명 */}
            <div className="flex flex-col items-start gap-4 relative flex-[0_0_auto] self-stretch w-full">
              <div className="relative w-fit mt-[-1px] font-pretendard-medium text-studio-text-primary text-sm text-center tracking-[0] leading-[19.6px] whitespace-nowrap">
                브랜드명
              </div>
              <div className="relative self-stretch w-full">
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="브랜드명을 입력하세요"
                  className="w-full px-3 py-2.5 rounded border border-studio-border bg-studio-sidebar text-studio-text-secondary text-sm font-pretendard-medium focus:outline-none focus:border-studio-button-primary placeholder-studio-text-secondary"
                />
              </div>
            </div>
          </>
        )}

        {/* 이미지 사이즈 - DropdownButton 컴포넌트 스타일 매칭 */}
        <div className="flex flex-col items-start gap-4 relative flex-[0_0_auto] self-stretch w-full">
          <div className="w-fit mt-[-1px] font-pretendard-medium text-studio-text-primary text-sm text-center leading-[19.6px] whitespace-nowrap relative tracking-[0]">
            이미지 사이즈
          </div>

          <CustomDropdown
            options={[
              { value: '1:1(정방향)', label: '1:1(정방향)' },
              { value: '16:9(가로형)', label: '16:9(가로형)' },
              { value: '9:16(세로형)', label: '9:16(세로형)' },
            ]}
            value={imageSize}
            onChange={setImageSize}
          />
        </div>
      </div>
    </div>
  );
}
