'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import TabItem from './ui/TabItem';
import SelectCard from './ui/SelectCard';
import Badge from './ui/Badge';
import PrimaryButton from './ui/PrimaryButton';
import { useRouter } from 'next/navigation';
import { useIsMobile } from '@/hooks/useMediaQuery';

interface ModelSelectPopupProps {
  onClose: () => void;
  lang?: string;
}

export default function ModelSelectPopup({
  onClose,
  lang,
}: ModelSelectPopupProps) {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<'image' | 'audio'>('image');
  const [selectedModel, setSelectedModel] = useState<string>('digital-goods');

  const handleCreate = () => {
    switch (selectedModel) {
      case 'digital-goods':
        router.push(`/${lang}/studio/digital-goods`);
        break;
      case 'idol-editor':
        console.log('Idol Photo Editor page is not ready yet.');
        break;
      case 'fanmeeting':
        console.log('Fanmeeting Studio page is not ready yet.');
        break;
      case 'dream-conte':
        console.log('AI Dream Conte page is not ready yet.');
        break;
      default:
        break;
    }
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex ${
        isMobile ? 'items-end' : 'items-center justify-center'
      } bg-black/70 backdrop-blur-sm`}
      onClick={onClose}
    >
      <div
        className={`${
          isMobile
            ? 'w-full h-[85vh] rounded-t-xl'
            : 'w-[678px] rounded-xl'
        } bg-studio-sidebar border border-solid border-studio-border ${
          isMobile ? 'p-4' : 'p-8'
        } flex flex-col gap-6 md:gap-8 ${
          isMobile ? 'animate-slide-up' : ''
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex-1 text-center font-bold text-studio-text-primary text-lg">
            만들어보기
          </div>
          <button onClick={onClose} className="text-studio-text-primary hover:text-studio-text-secondary">
            <X size={isMobile ? 24 : 20} />
          </button>
        </div>

        <div className="w-full border-b border-solid border-studio-border">
          <button onClick={() => setActiveTab('image')}>
            <TabItem
              state={activeTab === 'image' ? 'selected' : 'default'}
              text="이미지 생성"
            />
          </button>
          <button onClick={() => setActiveTab('audio')} disabled>
            <TabItem
              state={activeTab === 'audio' ? 'selected' : 'default'}
              text="음원 생성"
            />
          </button>
        </div>

        <div className="flex flex-col gap-4 flex-1 overflow-y-auto">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-studio-text-primary text-sm">이미지 생성하기</h3>
            <span className="font-semibold text-studio-text-secondary text-sm cursor-pointer">
              How to use
            </span>
          </div>

          <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-4`}>
            <SelectCard
              state={selectedModel === 'digital-goods' ? 'selected' : 'default'}
              title="디지털 굿즈"
              backgroundImage="/studio/model-select/select-size.png"
              onClick={() => setSelectedModel('digital-goods')}
            >
              <Badge
                text="New"
                className="!absolute !right-2 !top-2 !bg-[#4f0089] !px-2 !py-1"
                textClassName="!text-[10px] !leading-[10px]"
              />
            </SelectCard>

            <SelectCard
              state={selectedModel === 'idol-editor' ? 'selected' : 'default'}
              title="아이돌 사진 에디터"
              onClick={() => setSelectedModel('idol-editor')}
            />

            <SelectCard
              state={selectedModel === 'fanmeeting' ? 'selected' : 'default'}
              title="팬미팅 스튜디오"
              onClick={() => setSelectedModel('fanmeeting')}
            />

            <SelectCard
              state={selectedModel === 'dream-conte' ? 'selected' : 'default'}
              title="AI 드림 콘티"
              onClick={() => setSelectedModel('dream-conte')}
            />
          </div>
        </div>

        <PrimaryButton
          text="만들기"
          className="!w-full"
          textClassName="!text-[#4a4a4b]"
          onClick={handleCreate}
        />
      </div>
    </div>
  );
}
