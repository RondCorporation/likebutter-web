'use client';

import { useState } from 'react';
import Image from 'next/image';
import StudioSidebarBase from '../../_components/StudioSidebarBase';
import SquareToggleButton from '../../_components/ui/SquareToggleButton';
import ToggleSwitch from '../../_components/ui/ToggleSwitch';
import CustomDropdown from '../../_components/CustomDropdown';

interface StylistSidebarProps {
  onFormChange: (formData: {
    mode: 'text' | 'image';
    textPrompt?: string;
    imageSettings?: {
      hairstyle: boolean;
      costume: boolean;
      background: boolean;
      accessory: boolean;
      atmosphere: boolean;
    };
  }) => void;
}

export default function StylistSidebar({ onFormChange }: StylistSidebarProps) {
  const [mode, setMode] = useState<'text' | 'image'>('text');
  const [textPrompt, setTextPrompt] = useState('');
  const [imageSettings, setImageSettings] = useState({
    hairstyle: false,
    costume: false,
    background: false,
    accessory: false,
    atmosphere: false,
  });
  const [imageSize, setImageSize] = useState('1:1(정방향)');

  const recommendedPrompts = [
    '금발로 변경해줘',
    '한복 입혀줘',
    '정장 입혀줘',
    '경복궁 배경으로 만들어줘',
    '선글라스 착용해줘',
    '모자 씌워줘',
  ];

  const imageCategories = [
    { key: 'hairstyle', label: '헤어 스타일', icon: '/studio/stylist/sidebar-hairstyle.svg' },
    { key: 'costume', label: '의상', icon: '/studio/stylist/sidebar-costume.svg' },
    { key: 'background', label: '배경', icon: '/studio/stylist/sidebar-background.svg' },
    { key: 'accessory', label: '액세서리', icon: '/studio/stylist/sidebar-accessory.svg' },
    { key: 'atmosphere', label: '분위기', icon: '/studio/stylist/sidebar-atmosphere.svg' },
  ];

  const handleModeToggle = (value: 'left' | 'right') => {
    const newMode = value === 'left' ? 'text' : 'image';
    setMode(newMode);
    onFormChange({
      mode: newMode,
      textPrompt: newMode === 'text' ? textPrompt : undefined,
      imageSettings: newMode === 'image' ? imageSettings : undefined,
    });
  };

  const handleTextPromptChange = (value: string) => {
    setTextPrompt(value);
    onFormChange({
      mode: 'text',
      textPrompt: value,
    });
  };

  const handleRecommendedPromptClick = (prompt: string) => {
    const newPrompt = textPrompt ? `${textPrompt}, ${prompt}` : prompt;
    handleTextPromptChange(newPrompt);
  };

  const handleImageSettingToggle = (key: string, value: boolean) => {
    const newSettings = { ...imageSettings, [key]: value };
    setImageSettings(newSettings);
    onFormChange({
      mode: 'image',
      imageSettings: newSettings,
    });
  };

  return (
    <StudioSidebarBase>
      {/* 스타일 바꾸기 토글 */}
      <div className="flex flex-col items-start gap-4 relative flex-[0_0_auto] self-stretch w-full">
        <div className="w-fit mt-[-1px] font-pretendard-medium text-studio-text-primary text-sm text-center leading-[19.6px] whitespace-nowrap relative tracking-[0]">
          스타일 바꾸기
        </div>
        <SquareToggleButton
          leftLabel="텍스트 설명"
          rightLabel="이미지 첨부"
          onToggle={handleModeToggle}
          initialValue="left"
        />
      </div>

      {/* 텍스트 모드 */}
      {mode === 'text' && (
        <>
          {/* 프롬프트 입력 */}
          <div className="flex flex-col items-start gap-4 relative flex-[0_0_auto] self-stretch w-full">
            <div className="relative w-fit mt-[-1px] font-pretendard-medium text-studio-text-primary text-sm text-center tracking-[0] leading-[19.6px] whitespace-nowrap">
              텍스트 설명 <span className="text-red-400">*</span>
            </div>

            <div className="relative self-stretch w-full h-[unset] gap-4 flex-[0_0_auto] bg-studio-sidebar">
              <div className="relative w-full h-[70px] rounded">
                <div className="flex w-full h-[70px] items-center gap-3 px-3 py-2.5 absolute top-0 left-0 rounded overflow-hidden border border-solid border-studio-border bg-studio-sidebar">
                  <div className="flex items-start gap-2.5 grow relative flex-1 self-stretch">
                    <textarea
                      value={textPrompt}
                      onChange={(e) => handleTextPromptChange(e.target.value)}
                      placeholder="프롬프트를 입력해주세요"
                      className="mt-[-1px] font-pretendard-medium text-studio-text-secondary text-sm tracking-[0] leading-[19.6px] relative flex-1 self-stretch bg-transparent border-0 resize-none focus:outline-none placeholder-studio-text-secondary"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 추천 프롬프트 */}
          <div className="flex flex-col items-start gap-4 relative flex-[0_0_auto] self-stretch w-full">
            <div className="relative w-fit mt-[-1px] font-pretendard-medium text-studio-text-primary text-sm text-center tracking-[0] leading-[19.6px] whitespace-nowrap">
              추천 프롬프트
            </div>
            <div className="flex flex-wrap gap-2">
              {recommendedPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleRecommendedPromptClick(prompt)}
                  className="px-3 py-1.5 text-xs font-pretendard-medium text-studio-text-secondary bg-studio-border rounded-md hover:bg-studio-border-light transition-colors duration-200"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* 이미지 모드 */}
      {mode === 'image' && (
        <>
          <div className="flex flex-col items-start gap-4 relative flex-[0_0_auto] self-stretch w-full">
            <div className="relative w-fit mt-[-1px] font-pretendard-medium text-studio-text-primary text-sm text-center tracking-[0] leading-[19.6px] whitespace-nowrap">
              바꾸고 싶은 요소
            </div>

            <div className="flex flex-col gap-4 w-full">
              {imageCategories.map((category) => (
                <div key={category.key} className="flex flex-col gap-2">
                  {/* 토글 항목 */}
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <Image
                        src={category.icon}
                        alt={category.label}
                        width={20}
                        height={20}
                        className="text-studio-text-secondary"
                      />
                      <span className="text-sm font-pretendard-medium text-studio-text-primary">
                        {category.label}
                      </span>
                    </div>
                    <ToggleSwitch
                      checked={imageSettings[category.key as keyof typeof imageSettings]}
                      onChange={(checked) => handleImageSettingToggle(category.key, checked)}
                      size="sm"
                    />
                  </div>

                  {/* 업로드 영역 (토글 활성화 시) */}
                  {imageSettings[category.key as keyof typeof imageSettings] && (
                    <div className="w-full">
                      <button className="flex items-center gap-2 w-full h-[36px] px-3 py-2 bg-studio-border rounded-md text-studio-text-primary text-sm font-pretendard-medium hover:bg-studio-border-light transition-colors duration-200">
                        <Image
                          src="/studio/stylist/sidebar-upload.svg"
                          alt="Upload"
                          width={16}
                          height={16}
                        />
                        {category.label} 첨부
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 프롬프트 입력 (이미지 모드용) */}
          <div className="flex flex-col items-start gap-4 relative flex-[0_0_auto] self-stretch w-full">
            <div className="relative w-fit mt-[-1px] font-pretendard-medium text-studio-text-primary text-sm text-center tracking-[0] leading-[19.6px] whitespace-nowrap">
              추가 프롬프트
            </div>

            <div className="relative self-stretch w-full h-[unset] gap-4 flex-[0_0_auto] bg-studio-sidebar">
              <div className="relative w-full h-[70px] rounded">
                <div className="flex w-full h-[70px] items-center gap-3 px-3 py-2.5 absolute top-0 left-0 rounded overflow-hidden border border-solid border-studio-border bg-studio-sidebar">
                  <div className="flex items-start gap-2.5 grow relative flex-1 self-stretch">
                    <textarea
                      value={textPrompt}
                      onChange={(e) => handleTextPromptChange(e.target.value)}
                      placeholder="추가 요청사항을 입력해주세요"
                      className="mt-[-1px] font-pretendard-medium text-studio-text-secondary text-sm tracking-[0] leading-[19.6px] relative flex-1 self-stretch bg-transparent border-0 resize-none focus:outline-none placeholder-studio-text-secondary"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* 이미지 사이즈 - 항상 표시 */}
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
    </StudioSidebarBase>
  );
}