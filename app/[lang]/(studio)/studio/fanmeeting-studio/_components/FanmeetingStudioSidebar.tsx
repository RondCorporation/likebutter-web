'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import StudioSidebarBase from '../../_components/StudioSidebarBase';
import SquareToggleButton from '../../_components/ui/SquareToggleButton';
import {
  FanmeetingImagePromptStyle,
  FANMEETING_IMAGE_PROMPT_STYLES,
} from '@/app/_lib/apis/task.api';

interface FanmeetingStudioSidebarProps {
  onFormChange?: (formData: {
    mode: 'text' | 'image';
    backgroundPrompt?: string;
    situationPrompt?: string;
    imagePromptStyle?: FanmeetingImagePromptStyle;
  }) => void;
}

export default function FanmeetingStudioSidebar({
  onFormChange,
}: FanmeetingStudioSidebarProps = {}) {
  const { t } = useTranslation(['studio']);
  const [mode, setMode] = useState<'text' | 'image'>('text');
  const [backgroundPrompt, setBackgroundPrompt] = useState('');
  const [situationPrompt, setSituationPrompt] = useState('');
  const [selectedImagePrompt, setSelectedImagePrompt] =
    useState<FanmeetingImagePromptStyle | null>(null);

  const imagePromptOptions = [
    {
      style: FANMEETING_IMAGE_PROMPT_STYLES.WINTER_SAPPORO,
      name: t('fanmeeting.imagePrompts.WINTER_SAPPORO'),
      image: '/studio/fanmeeting/겨울삿포로.png',
    },
    {
      style: FANMEETING_IMAGE_PROMPT_STYLES.POLAROID,
      name: t('fanmeeting.imagePrompts.POLAROID'),
      image: '/studio/fanmeeting/폴라로이드.png',
    },
  ];

  const placePrompts = [
    t('fanmeeting.places.fanSigningVenue'),
    t('fanmeeting.places.hongdaeFront'),
    t('fanmeeting.places.cafe'),
    t('fanmeeting.places.airport'),
    t('fanmeeting.places.beach'),
    t('fanmeeting.places.newYorkManhattan'),
  ];

  const posePrompts = [
    t('fanmeeting.poses.fingerHeart'),
    t('fanmeeting.poses.heartPoseTogether'),
    t('fanmeeting.poses.hug'),
    t('fanmeeting.poses.armInArm'),
    t('fanmeeting.poses.holdHands'),
    t('fanmeeting.poses.patHead'),
    t('fanmeeting.poses.facingEachOther'),
  ];

  const updateFormData = () => {
    if (mode === 'text') {
      onFormChange?.({
        mode: 'text',
        backgroundPrompt,
        situationPrompt,
      });
    } else {
      onFormChange?.({
        mode: 'image',
        imagePromptStyle: selectedImagePrompt || undefined,
      });
    }
  };

  useEffect(() => {
    updateFormData();
  }, [mode, backgroundPrompt, situationPrompt, selectedImagePrompt]);

  const handleModeToggle = (value: 'left' | 'right') => {
    const newMode = value === 'left' ? 'text' : 'image';
    setMode(newMode);
  };

  const handleBackgroundChange = (value: string) => {
    setBackgroundPrompt(value);
  };

  const handleSituationChange = (value: string) => {
    setSituationPrompt(value);
  };

  const handleBackgroundPromptClick = (prompt: string) => {
    const newBackground = backgroundPrompt
      ? `${backgroundPrompt}, ${prompt}`
      : prompt;
    handleBackgroundChange(newBackground);
  };

  const handleSituationPromptClick = (prompt: string) => {
    const newSituation = situationPrompt
      ? `${situationPrompt}, ${prompt}`
      : prompt;
    handleSituationChange(newSituation);
  };

  const handleImagePromptSelect = (style: FanmeetingImagePromptStyle) => {
    setSelectedImagePrompt(style);
  };

  return (
    <StudioSidebarBase>
      {/* Mode Toggle */}
      <div className="flex flex-col items-start gap-4 relative flex-[0_0_auto] w-full">
        <div className="w-fit mt-[-1px] font-pretendard-medium text-studio-text-primary text-sm text-center leading-[19.6px] whitespace-nowrap relative tracking-[0]">
          {t('fanmeeting.mode.label')}
        </div>
        <SquareToggleButton
          leftLabel={t('fanmeeting.mode.text')}
          rightLabel={t('fanmeeting.mode.image')}
          onToggle={handleModeToggle}
          initialValue="left"
        />
      </div>

      {mode === 'text' ? (
        <>
          {/* Background */}
          <div className="flex flex-col items-start gap-4 relative flex-[0_0_auto] self-stretch w-full">
            <div className="relative w-fit mt-[-1px] font-pretendard-medium text-studio-text-primary text-sm text-center tracking-[0] leading-[19.6px] whitespace-nowrap">
              {t('fanmeeting.background')}{' '}
              <span className="text-red-400">*</span>
            </div>

            <div className="relative self-stretch w-full h-[unset] gap-4 flex-[0_0_auto] bg-studio-sidebar">
              <div className="relative w-full h-[70px] rounded">
                <div className="flex w-full h-[70px] items-center gap-3 px-3 py-2.5 absolute top-0 left-0 rounded overflow-hidden border border-solid border-studio-border bg-studio-sidebar">
                  <div className="flex items-start gap-2.5 grow relative flex-1 self-stretch">
                    <textarea
                      value={backgroundPrompt}
                      onChange={(e) => handleBackgroundChange(e.target.value)}
                      placeholder={t('fanmeeting.backgroundPlaceholder')}
                      className="mt-[-1px] font-pretendard-medium text-studio-text-secondary text-sm tracking-[0] leading-[19.6px] relative flex-1 self-stretch bg-transparent border-0 resize-none focus:outline-none placeholder-studio-text-secondary"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Recommended place prompts */}
            <div className="flex flex-wrap gap-2">
              {placePrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleBackgroundPromptClick(prompt)}
                  className="px-3 py-1.5 text-xs font-pretendard-medium text-studio-text-secondary bg-studio-border rounded-md hover:bg-studio-border-light transition-colors duration-200"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Situation */}
          <div className="flex flex-col items-start gap-4 relative flex-[0_0_auto] self-stretch w-full">
            <div className="relative w-fit mt-[-1px] font-pretendard-medium text-studio-text-primary text-sm text-center tracking-[0] leading-[19.6px] whitespace-nowrap">
              {t('fanmeeting.situation')}{' '}
              <span className="text-red-400">*</span>
            </div>

            <div className="relative self-stretch w-full h-[unset] gap-4 flex-[0_0_auto] bg-studio-sidebar">
              <div className="relative w-full h-[70px] rounded">
                <div className="flex w-full h-[70px] items-center gap-3 px-3 py-2.5 absolute top-0 left-0 rounded overflow-hidden border border-solid border-studio-border bg-studio-sidebar">
                  <div className="flex items-start gap-2.5 grow relative flex-1 self-stretch">
                    <textarea
                      value={situationPrompt}
                      onChange={(e) => handleSituationChange(e.target.value)}
                      placeholder={t('fanmeeting.situationPlaceholder')}
                      className="mt-[-1px] font-pretendard-medium text-studio-text-secondary text-sm tracking-[0] leading-[19.6px] relative flex-1 self-stretch bg-transparent border-0 resize-none focus:outline-none placeholder-studio-text-secondary"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Recommended pose prompts */}
            <div className="flex flex-wrap gap-2">
              {posePrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleSituationPromptClick(prompt)}
                  className="px-3 py-1.5 text-xs font-pretendard-medium text-studio-text-secondary bg-studio-border rounded-md hover:bg-studio-border-light transition-colors duration-200"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Image Prompt Selection */}
          <div className="flex flex-col items-start gap-4 relative flex-[0_0_auto] w-full">
            <div className="w-fit mt-[-1px] font-pretendard-medium text-studio-text-primary text-sm text-center leading-[19.6px] whitespace-nowrap relative tracking-[0]">
              {t('fanmeeting.imagePrompt.label')}{' '}
              <span className="text-red-400">*</span>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full">
              {imagePromptOptions.map((option) => {
                const isSelected = selectedImagePrompt === option.style;

                return (
                  <div
                    key={option.style}
                    className="flex flex-col items-center justify-center gap-1.5 cursor-pointer"
                    onClick={() => handleImagePromptSelect(option.style)}
                  >
                    <div
                      className={`relative w-full aspect-square max-w-[120px] md:w-24 md:h-24 bg-studio-border rounded-md overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
                        isSelected
                          ? 'border-butter-yellow shadow-lg'
                          : 'border-transparent hover:border-studio-button-primary/50'
                      }`}
                    >
                      <Image
                        src={option.image}
                        alt={option.name}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div
                      className={`font-pretendard-medium text-xs text-center leading-tight tracking-[0] transition-colors duration-200 w-full px-1 ${
                        isSelected
                          ? 'text-butter-yellow font-semibold'
                          : 'text-studio-text-primary'
                      }`}
                    >
                      {option.name}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </StudioSidebarBase>
  );
}
