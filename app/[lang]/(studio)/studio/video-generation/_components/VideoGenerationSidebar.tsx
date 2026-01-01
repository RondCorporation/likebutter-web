'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import StudioSidebarBase from '../../_components/StudioSidebarBase';

interface VideoGenerationSidebarProps {
  onFormChange?: (formData: {
    prompt?: string;
    negativePrompt?: string;
    duration?: 5 | 10;
  }) => void;
}

export default function VideoGenerationSidebar({
  onFormChange,
}: VideoGenerationSidebarProps = {}) {
  const { t } = useTranslation(['studio']);
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [duration, setDuration] = useState<5 | 10>(5);

  useEffect(() => {
    onFormChange?.({
      prompt: prompt || undefined,
      negativePrompt: negativePrompt || undefined,
      duration,
    });
  }, [prompt, negativePrompt, duration, onFormChange]);

  return (
    <StudioSidebarBase>
      <div className="flex flex-col items-start gap-6 relative flex-[0_0_auto] w-full">
        {/* Duration Selection */}
        <div className="flex flex-col gap-3 w-full">
          <div className="font-pretendard-medium text-studio-text-primary text-sm leading-[19.6px]">
            {t('videoGeneration.duration')}
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setDuration(5)}
              className={`flex-1 py-3 rounded-lg font-pretendard-medium text-sm transition-all duration-200 ${
                duration === 5
                  ? 'bg-studio-button-primary text-black'
                  : 'bg-studio-border text-studio-text-secondary hover:bg-studio-border/80'
              }`}
            >
              {t('videoGeneration.duration5s')}
            </button>
            <button
              type="button"
              onClick={() => setDuration(10)}
              className={`flex-1 py-3 rounded-lg font-pretendard-medium text-sm transition-all duration-200 ${
                duration === 10
                  ? 'bg-studio-button-primary text-black'
                  : 'bg-studio-border text-studio-text-secondary hover:bg-studio-border/80'
              }`}
            >
              {t('videoGeneration.duration10s')}
            </button>
          </div>
        </div>

        {/* Prompt Input */}
        <div className="flex flex-col gap-3 w-full">
          <div className="font-pretendard-medium text-studio-text-primary text-sm leading-[19.6px]">
            {t('videoGeneration.prompt')}
            <span className="text-studio-text-muted ml-1 text-xs">
              ({t('common:optional')})
            </span>
          </div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={t('videoGeneration.promptPlaceholder')}
            className="w-full h-24 p-3 bg-studio-border rounded-lg text-studio-text-primary text-sm font-pretendard resize-none focus:outline-none focus:ring-1 focus:ring-studio-button-primary placeholder:text-studio-text-muted"
          />
        </div>

        {/* Negative Prompt Input */}
        <div className="flex flex-col gap-3 w-full">
          <div className="font-pretendard-medium text-studio-text-primary text-sm leading-[19.6px]">
            {t('videoGeneration.negativePrompt')}
            <span className="text-studio-text-muted ml-1 text-xs">
              ({t('common:optional')})
            </span>
          </div>
          <textarea
            value={negativePrompt}
            onChange={(e) => setNegativePrompt(e.target.value)}
            placeholder={t('videoGeneration.negativePromptPlaceholder')}
            className="w-full h-20 p-3 bg-studio-border rounded-lg text-studio-text-primary text-sm font-pretendard resize-none focus:outline-none focus:ring-1 focus:ring-studio-button-primary placeholder:text-studio-text-muted"
          />
        </div>
      </div>
    </StudioSidebarBase>
  );
}
