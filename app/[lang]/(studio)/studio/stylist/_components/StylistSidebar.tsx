'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import StudioSidebarBase from '../../_components/StudioSidebarBase';
import SquareToggleButton from '../../_components/ui/SquareToggleButton';
import ToggleSwitch from '../../_components/ui/ToggleSwitch';

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
  const [imageSettings, setImageSettings] = useState({
    hairstyle: false,
    costume: false,
    background: false,
    accessory: false,
    atmosphere: false,
  });

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
      uploadedFiles: undefined,
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

  React.useEffect(() => {
    updateFormData();
  }, [mode, textPrompt, imagePrompt, imageSettings]);

  return (
    <StudioSidebarBase>
      {/* Toggle style change */}
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

      {/* Text mode */}
      {mode === 'text' && (
        <>
          {/* Prompt input */}
          <div className="flex flex-col items-start gap-4 relative flex-[0_0_auto] self-stretch w-full">
            <div className="relative w-fit mt-[-1px] font-pretendard-medium text-studio-text-primary text-sm text-center tracking-[0] leading-[19.6px] whitespace-nowrap">
              {t('stylist.form.textDescription')}{' '}
              <span className="text-red-400">*</span>
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

          {/* Recommended prompts */}
          <div className="flex flex-col items-start gap-4 relative flex-[0_0_auto] self-stretch w-full">
            <div className="relative w-fit mt-[-1px] font-pretendard-medium text-studio-text-primary text-sm text-center tracking-[0] leading-[19.6px] whitespace-nowrap">
              {t('stylist.suggestions.title')}
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

      {/* Image mode */}
      {mode === 'image' && (
        <>
          <div className="flex flex-col items-start gap-4 relative flex-[0_0_auto] self-stretch w-full">
            <div className="relative w-fit mt-[-1px] font-pretendard-medium text-studio-text-primary text-sm text-center tracking-[0] leading-[19.6px] whitespace-nowrap">
              {t('stylist.changeElement')}
            </div>

            <div className="flex flex-col gap-4 w-full">
              {imageCategories.map((category) => (
                <div key={category.key} className="flex flex-col gap-2">
                  {/* Toggle item */}
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
                </div>
              ))}
            </div>
          </div>

          {/* Prompt input (for image mode) */}
          <div className="flex flex-col items-start gap-4 relative flex-[0_0_auto] self-stretch w-full">
            <div className="relative w-fit mt-[-1px] font-pretendard-medium text-studio-text-primary text-sm text-center tracking-[0] leading-[19.6px] whitespace-nowrap">
              {t('stylist.additionalPrompt')}
            </div>

            <div className="relative self-stretch w-full h-[unset] gap-4 flex-[0_0_auto] bg-studio-sidebar">
              <div className="relative w-full h-[70px] rounded">
                <div className="flex w-full h-[70px] items-center gap-3 px-3 py-2.5 absolute top-0 left-0 rounded overflow-hidden border border-solid border-studio-border bg-studio-sidebar">
                  <div className="flex items-start gap-2.5 grow relative flex-1 self-stretch">
                    <textarea
                      value={imagePrompt}
                      onChange={(e) => handleImagePromptChange(e.target.value)}
                      placeholder={t(
                        'stylist.form.additionalRequestsPlaceholder'
                      )}
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
