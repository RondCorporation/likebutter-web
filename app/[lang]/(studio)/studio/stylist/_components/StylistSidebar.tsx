'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import StudioSidebarBase from '../../_components/StudioSidebarBase';
import SquareToggleButton from '../../_components/ui/SquareToggleButton';
import ToggleSwitch from '../../_components/ui/ToggleSwitch';
import { useIsDesktop } from '@/hooks/useMediaQuery';

interface StylistSidebarProps {
  onFormChange?: (formData: {
    mode: 'text' | 'image';
    textPrompt?: string;
    imagePrompt?: string;
    imageSettings?: {
      hairstyle: boolean;
      costume: boolean;
      background: boolean;
      accessory: boolean;
      atmosphere: boolean;
    };
    uploadedFiles?: {
      hairStyleImage?: File;
      outfitImage?: File;
      backgroundImage?: File;
      accessoryImage?: File;
      moodImage?: File;
    };
  }) => void;
}

export default function StylistSidebar({
  onFormChange,
}: StylistSidebarProps = {}) {
  const { t } = useTranslation(['studio']);
  const [mode, setMode] = useState<'text' | 'image'>('text');
  const [textPrompt, setTextPrompt] = useState('');
  const [imagePrompt, setImagePrompt] = useState('');
  const isDesktop = useIsDesktop();
  const [imageSettings, setImageSettings] = useState({
    hairstyle: false,
    costume: false,
    background: false,
    accessory: false,
    atmosphere: false,
  });
  const [uploadedFiles, setUploadedFiles] = useState<{
    hairStyleImage?: File;
    outfitImage?: File;
    backgroundImage?: File;
    accessoryImage?: File;
    moodImage?: File;
  }>({});

  const recommendedPrompts = [
    t('stylist.suggestions.changeToBlonde'),
    t('stylist.suggestions.wearHanbok'),
    t('stylist.suggestions.wearSuit'),
    t('stylist.suggestions.gyeongbokgungBackground'),
    t('stylist.suggestions.wearSunglasses'),
    t('stylist.suggestions.wearHat'),
  ];

  const imageCategories = [
    {
      key: 'hairstyle',
      label: t('stylist.categories.hairstyle'),
      icon: '/studio/stylist/sidebar-hairstyle.svg',
    },
    {
      key: 'costume',
      label: t('stylist.categories.costume'),
      icon: '/studio/stylist/sidebar-costume.svg',
    },
    {
      key: 'background',
      label: t('stylist.categories.background'),
      icon: '/studio/stylist/sidebar-background.svg',
    },
    {
      key: 'accessory',
      label: t('stylist.categories.accessory'),
      icon: '/studio/stylist/sidebar-accessory.svg',
    },
    {
      key: 'atmosphere',
      label: t('stylist.categories.mood'),
      icon: '/studio/stylist/sidebar-atmosphere.svg',
    },
  ];

  const updateFormData = () => {
    onFormChange?.({
      mode,
      textPrompt: mode === 'text' ? textPrompt : undefined,
      imagePrompt: mode === 'image' ? imagePrompt : undefined,
      imageSettings: mode === 'image' ? imageSettings : undefined,
      uploadedFiles: mode === 'image' ? uploadedFiles : undefined,
    });
  };

  const handleModeToggle = (value: 'left' | 'right') => {
    const newMode = value === 'left' ? 'text' : 'image';
    setMode(newMode);
  };

  const handleTextPromptChange = (value: string) => {
    setTextPrompt(value);
  };

  const handleImagePromptChange = (value: string) => {
    setImagePrompt(value);
  };

  const handleRecommendedPromptClick = (prompt: string) => {
    const newPrompt = textPrompt ? `${textPrompt}, ${prompt}` : prompt;
    setTextPrompt(newPrompt);
  };

  const handleImageSettingToggle = (key: string, value: boolean) => {
    const newSettings = { ...imageSettings, [key]: value };
    setImageSettings(newSettings);
  };

  const handleFileUpload = (category: string, file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      return;
    }

    if (!['image/png', 'image/jpg', 'image/jpeg'].includes(file.type)) {
      return;
    }

    const fileMapping: { [key: string]: keyof typeof uploadedFiles } = {
      hairstyle: 'hairStyleImage',
      costume: 'outfitImage',
      background: 'backgroundImage',
      accessory: 'accessoryImage',
      atmosphere: 'moodImage',
    };

    const fileKey = fileMapping[category];
    if (fileKey) {
      setUploadedFiles((prev) => ({ ...prev, [fileKey]: file }));
    }
  };

  React.useEffect(() => {
    updateFormData();
  }, [mode, textPrompt, imagePrompt, imageSettings, uploadedFiles]);

  return (
    <StudioSidebarBase>
      {/* 스타일 바꾸기 토글 */}
      <div className="flex flex-col items-start gap-4 relative flex-[0_0_auto] self-stretch w-full">
        <div className="w-fit mt-[-1px] font-pretendard-medium text-studio-text-primary text-sm text-center leading-[19.6px] whitespace-nowrap relative tracking-[0]">
          {t('stylist.changeStyle')}
        </div>
        <SquareToggleButton
          leftLabel={t('stylist.form.textDescription')}
          rightLabel={t('stylist.form.imageAttachment')}
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
                      placeholder={t('stylist.form.promptPlaceholder')}
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
                      checked={
                        imageSettings[
                          category.key as keyof typeof imageSettings
                        ]
                      }
                      onChange={(checked) =>
                        handleImageSettingToggle(category.key, checked)
                      }
                      size="sm"
                    />
                  </div>

                  {/* 업로드 영역 (토글 활성화 시) - 모바일에서만 표시 */}
                  {imageSettings[category.key as keyof typeof imageSettings] &&
                    !isDesktop && (
                      <div className="w-full">
                        <input
                          id={`file-${category.key}`}
                          type="file"
                          accept="image/png,image/jpg,image/jpeg"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleFileUpload(category.key, file);
                            }
                          }}
                          className="hidden"
                        />
                        <button
                          onClick={() =>
                            document
                              .getElementById(`file-${category.key}`)
                              ?.click()
                          }
                          className="flex items-center gap-2 w-full h-[36px] px-3 py-2 bg-studio-border rounded-md text-studio-text-primary text-sm font-pretendard-medium hover:bg-studio-border-light transition-colors duration-200"
                        >
                          <Image
                            src="/studio/stylist/sidebar-upload.svg"
                            alt="Upload"
                            width={16}
                            height={16}
                          />
                          {uploadedFiles[
                            {
                              hairstyle: 'hairStyleImage',
                              costume: 'outfitImage',
                              background: 'backgroundImage',
                              accessory: 'accessoryImage',
                              atmosphere: 'moodImage',
                            }[category.key] as keyof typeof uploadedFiles
                          ]
                            ? `${category.label} 변경`
                            : `${category.label} 첨부`}
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
                      value={imagePrompt}
                      onChange={(e) => handleImagePromptChange(e.target.value)}
                      placeholder={t('stylist.form.additionalRequestsPlaceholder')}
                      className="mt-[-1px] font-pretendard-medium text-studio-text-secondary text-sm tracking-[0] leading-[19.6px] relative flex-1 self-stretch bg-transparent border-0 resize-none focus:outline-none placeholder-studio-text-secondary"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </StudioSidebarBase>
  );
}
