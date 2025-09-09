'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CustomDropdown } from '../../_components/ui';

export default function DigitalGoodsStyleSidebar() {
  const [selectedPreset, setSelectedPreset] = useState('지브리');
  const [description, setDescription] = useState('');
  const [imageSize, setImageSize] = useState('1:1(정방향)');
  const [fileUpload, setFileUpload] = useState('1:1(정방향)');
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const stylePresets = [
    { name: '지브리', width: 84, selected: true },
    { name: '액션', width: 84, selected: false },
    { name: '지브리2', width: 84, selected: false },
    { name: '포스터', width: 84, selected: false },
    { name: '스티커', width: 84, selected: false },
    { name: '카툰', width: 84, selected: false },
    { name: '웹툰', width: 84, selected: false },
    { name: '일러스트', width: 84, selected: false },
    { name: '판타지', width: 84, selected: false },
    { name: '미니먀', width: 84, selected: false },
    { name: '빈티지', width: 84, selected: false },
    { name: '모던', width: 84, selected: false },
  ];

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current && canScrollLeft) {
      scrollContainerRef.current.scrollBy({
        left: -180,
        behavior: 'smooth',
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current && canScrollRight) {
      scrollContainerRef.current.scrollBy({
        left: 180,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      checkScrollButtons();
      scrollContainer.addEventListener('scroll', checkScrollButtons);

      return () => {
        scrollContainer.removeEventListener('scroll', checkScrollButtons);
      };
    }
  }, []);


  return (
    <div className="flex flex-col w-[260px] h-full items-start gap-10 pt-6 pb-3 px-3 relative bg-studio-sidebar border-r border-solid border-studio-border-light overflow-y-auto">
      <div className="flex flex-col items-start gap-8 relative self-stretch w-full flex-[0_0_auto]">
        {/* 스타일 프리셋 */}
        <div className="flex flex-col items-start gap-4 relative flex-[0_0_auto] w-full">
          <div className="w-fit mt-[-1px] font-pretendard-medium text-studio-text-primary text-sm text-center leading-[19.6px] whitespace-nowrap relative tracking-[0]">
            스타일 프리셋
          </div>

          <div className="relative w-full overflow-hidden group">
            {/* 스크롤 컨테이너 */}
            <div
              ref={scrollContainerRef}
              className="flex flex-col gap-2.5 overflow-x-auto scroll-smooth pb-2 [&::-webkit-scrollbar]:hidden [-webkit-scrollbar-width:none] [scrollbar-width:none]"
            >
              <div className="flex gap-3 flex-shrink-0">
                {stylePresets.slice(0, 6).map((preset, index) => (
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
                      className={`font-pretendard-medium text-sm text-center leading-[19.6px] tracking-[0] ${
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
                {stylePresets.slice(6, 12).map((preset, index) => (
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
                      className={`font-pretendard-medium text-sm text-center leading-[19.6px] tracking-[0] ${
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

            {/* 얇은 그라데이션 페이드 */}
            {canScrollLeft && (
              <div className="absolute left-0 top-0 w-4 h-full bg-gradient-to-r from-studio-sidebar to-transparent pointer-events-none z-10 opacity-60" />
            )}

            {canScrollRight && (
              <div className="absolute right-0 top-0 w-4 h-full bg-gradient-to-l from-studio-sidebar to-transparent pointer-events-none z-10 opacity-60" />
            )}

            {/* 미니멀한 화살표 - 호버시만 표시 */}
            {canScrollLeft && (
              <button
                onClick={scrollLeft}
                className="absolute left-1 top-1/2 transform -translate-y-1/2 p-1 rounded-full opacity-0 group-hover:opacity-70 hover:opacity-100 bg-studio-sidebar/80 backdrop-blur-sm transition-all duration-300 z-20"
              >
                <ChevronLeft className="w-3 h-3 text-studio-text-primary" />
              </button>
            )}

            {canScrollRight && (
              <button
                onClick={scrollRight}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 p-1 rounded-full opacity-0 group-hover:opacity-70 hover:opacity-100 bg-studio-sidebar/80 backdrop-blur-sm transition-all duration-300 z-20"
              >
                <ChevronRight className="w-3 h-3 text-studio-text-primary" />
              </button>
            )}
          </div>
        </div>

        {/* 편집 설명 - InputTextArea 컴포넌트 스타일 매칭 */}
        <div className="flex flex-col items-start gap-4 relative flex-[0_0_auto] self-stretch w-full">
          <div className="inline-flex items-start gap-1 relative flex-[0_0_auto]">
            <div className="inline-flex items-center gap-1 px-px py-0 relative self-stretch flex-[0_0_auto]">
              <div className="inline-flex items-center gap-0.5 relative flex-[0_0_auto]">
                <div className="inline-flex items-center gap-2 relative flex-[0_0_auto]">
                  <div className="relative w-fit mt-[-1px] font-pretendard-medium text-studio-text-primary text-sm text-center tracking-[0] leading-[19.6px] whitespace-nowrap">
                    편집 설명
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative self-stretch w-full h-[unset] gap-4 flex-[0_0_auto] bg-studio-sidebar">
            <div className="relative w-[236px] h-[70px] rounded">
              <div className="flex w-[236px] h-[70px] items-center gap-3 px-3 py-2.5 absolute top-0 left-0 rounded overflow-hidden border border-solid border-studio-border bg-studio-sidebar">
                <div className="flex items-start gap-2.5 grow relative flex-1 self-stretch">
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="원하는 디스크립션 디스크립션"
                    className="mt-[-1px] font-pretendard-medium text-studio-text-secondary text-sm tracking-[0] leading-[19.6px] relative flex-1 self-stretch bg-transparent border-0 resize-none focus:outline-none placeholder-studio-text-secondary"
                  />
                </div>
              </div>
              <div className="absolute w-2 h-2 top-[58px] left-56 bg-[url(/img/resizer-1.svg)] bg-[100%_100%]"></div>
            </div>
          </div>
        </div>

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

        {/* 파일업로드 - DropdownButton 컴포넌트 스타일 매칭 */}
        <div className="flex flex-col items-start gap-4 relative flex-[0_0_auto] self-stretch w-full">
          <div className="w-fit mt-[-1px] font-pretendard-medium text-studio-text-primary text-sm text-center leading-[19.6px] whitespace-nowrap relative tracking-[0]">
            파일업로드
          </div>

          <CustomDropdown
            options={[
              { value: '1:1(정방향)', label: '1:1(정방향)' },
              { value: '16:9(가로형)', label: '16:9(가로형)' },
              { value: '9:16(세로형)', label: '9:16(세로형)' },
            ]}
            value={fileUpload}
            onChange={setFileUpload}
          />
        </div>
      </div>
    </div>
  );
}
