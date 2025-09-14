'use client';

import { useState } from 'react';
import StudioSidebarBase from '../../_components/StudioSidebarBase';
import CustomDropdown from '../../_components/CustomDropdown';

interface FanmeetingStudioSidebarProps {
  onFormChange: (formData: {
    place: string;
    pose: string;
  }) => void;
}

export default function FanmeetingStudioSidebar({ onFormChange }: FanmeetingStudioSidebarProps) {
  const [place, setPlace] = useState('');
  const [pose, setPose] = useState('');
  const [imageSize, setImageSize] = useState('1:1(정방향)');

  const placePrompts = [
    '팬싸인회장',
    '홍대 앞',
    '카페',
    '공항',
    '바닷가',
    '뉴욕 맨헤튼',
  ];

  const posePrompts = [
    '손가락 하트',
    '함께 하트 포즈',
    '포옹',
    '어깨동무',
    '손잡기',
    '머리 쓰다듬기',
    '서로 마주보기',
  ];

  const handlePlaceChange = (value: string) => {
    setPlace(value);
    onFormChange({
      place: value,
      pose,
    });
  };

  const handlePoseChange = (value: string) => {
    setPose(value);
    onFormChange({
      place,
      pose: value,
    });
  };

  const handlePlacePromptClick = (prompt: string) => {
    const newPlace = place ? `${place}, ${prompt}` : prompt;
    handlePlaceChange(newPlace);
  };

  const handlePosePromptClick = (prompt: string) => {
    const newPose = pose ? `${pose}, ${prompt}` : prompt;
    handlePoseChange(newPose);
  };

  return (
    <StudioSidebarBase>
      {/* 어떤 장소에서? */}
      <div className="flex flex-col items-start gap-4 relative flex-[0_0_auto] self-stretch w-full">
        <div className="relative w-fit mt-[-1px] font-pretendard-medium text-studio-text-primary text-sm text-center tracking-[0] leading-[19.6px] whitespace-nowrap">
          어떤 장소에서? <span className="text-red-400">*</span>
        </div>

        <div className="relative self-stretch w-full h-[unset] gap-4 flex-[0_0_auto] bg-studio-sidebar">
          <div className="relative w-full h-[70px] rounded">
            <div className="flex w-full h-[70px] items-center gap-3 px-3 py-2.5 absolute top-0 left-0 rounded overflow-hidden border border-solid border-studio-border bg-studio-sidebar">
              <div className="flex items-start gap-2.5 grow relative flex-1 self-stretch">
                <textarea
                  value={place}
                  onChange={(e) => handlePlaceChange(e.target.value)}
                  placeholder="어떤 장소에서 만나고 싶나요?"
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
              onClick={() => handlePlacePromptClick(prompt)}
              className="px-3 py-1.5 text-xs font-pretendard-medium text-studio-text-secondary bg-studio-border rounded-md hover:bg-studio-border-light transition-colors duration-200"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* 어떤 포즈로? */}
      <div className="flex flex-col items-start gap-4 relative flex-[0_0_auto] self-stretch w-full">
        <div className="relative w-fit mt-[-1px] font-pretendard-medium text-studio-text-primary text-sm text-center tracking-[0] leading-[19.6px] whitespace-nowrap">
          어떤 포즈로? <span className="text-red-400">*</span>
        </div>

        <div className="relative self-stretch w-full h-[unset] gap-4 flex-[0_0_auto] bg-studio-sidebar">
          <div className="relative w-full h-[70px] rounded">
            <div className="flex w-full h-[70px] items-center gap-3 px-3 py-2.5 absolute top-0 left-0 rounded overflow-hidden border border-solid border-studio-border bg-studio-sidebar">
              <div className="flex items-start gap-2.5 grow relative flex-1 self-stretch">
                <textarea
                  value={pose}
                  onChange={(e) => handlePoseChange(e.target.value)}
                  placeholder="어떤 포즈로 사진을 찍고 싶나요?"
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
              onClick={() => handlePosePromptClick(prompt)}
              className="px-3 py-1.5 text-xs font-pretendard-medium text-studio-text-secondary bg-studio-border rounded-md hover:bg-studio-border-light transition-colors duration-200"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

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