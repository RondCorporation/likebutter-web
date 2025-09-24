'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import StudioSidebarBase from '../../_components/StudioSidebarBase';

interface FanmeetingStudioSidebarProps {
  onFormChange?: (formData: {
    backgroundPrompt: string;
    situationPrompt: string;
  }) => void;
}

export default function FanmeetingStudioSidebar({
  onFormChange,
}: FanmeetingStudioSidebarProps = {}) {
  const { t } = useTranslation(['studio']);
  const [backgroundPrompt, setBackgroundPrompt] = useState('');
  const [situationPrompt, setSituationPrompt] = useState('');

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

  const handleBackgroundChange = (value: string) => {
    setBackgroundPrompt(value);
    onFormChange?.({
      backgroundPrompt: value,
      situationPrompt,
    });
  };

  const handleSituationChange = (value: string) => {
    setSituationPrompt(value);
    onFormChange?.({
      backgroundPrompt,
      situationPrompt: value,
    });
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

  return (
    <StudioSidebarBase>
      {/* 배경 */}
      <div className="flex flex-col items-start gap-4 relative flex-[0_0_auto] self-stretch w-full">
        <div className="relative w-fit mt-[-1px] font-pretendard-medium text-studio-text-primary text-sm text-center tracking-[0] leading-[19.6px] whitespace-nowrap">
          {t('fanmeeting.background')} <span className="text-red-400">*</span>
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

        {/* 장소 추천 프롬프트 */}
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

      {/* 상황 */}
      <div className="flex flex-col items-start gap-4 relative flex-[0_0_auto] self-stretch w-full">
        <div className="relative w-fit mt-[-1px] font-pretendard-medium text-studio-text-primary text-sm text-center tracking-[0] leading-[19.6px] whitespace-nowrap">
          {t('fanmeeting.situation')} <span className="text-red-400">*</span>
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

        {/* 포즈 추천 프롬프트 */}
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
    </StudioSidebarBase>
  );
}
