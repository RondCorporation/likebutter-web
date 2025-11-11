'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import StudioSidebarBase from '../../_components/StudioSidebarBase';
import {
  VirtualCastingStyle,
  VIRTUAL_CASTING_STYLES,
} from '@/app/_lib/apis/task.api';

interface VirtualCastingSidebarProps {
  onFormChange?: (formData: {
    selectedCharacter: {
      name: string;
      image: string;
      style: VirtualCastingStyle;
    } | null;
  }) => void;
}

interface Character {
  name: string;
  image: string;
  style: VirtualCastingStyle;
}

export default function VirtualCastingSidebar({
  onFormChange,
}: VirtualCastingSidebarProps = {}) {
  const { t } = useTranslation(['studio']);
  const [selectedCharacter, setSelectedCharacter] = useState<{
    name: string;
    image: string;
    style: VirtualCastingStyle;
  } | null>(null);

  const characters: Character[] = [
    // 이전에 있고 지금도 있고
    {
      name: t('virtualCasting.styles.FROZEN'),
      image: '겨울왕국.jpg',
      style: VIRTUAL_CASTING_STYLES.FROZEN,
    },
    {
      name: t('virtualCasting.styles.ALADDIN'),
      image: '알라딘.jpg',
      style: VIRTUAL_CASTING_STYLES.ALADDIN,
    },
    {
      name: t('virtualCasting.styles.INSIDE_OUT'),
      image: '인사이드아웃.jpg',
      style: VIRTUAL_CASTING_STYLES.INSIDE_OUT,
    },
    {
      name: t('virtualCasting.styles.ZOOTOPIA'),
      image: '주토피아.jpg',
      style: VIRTUAL_CASTING_STYLES.ZOOTOPIA,
    },
    {
      name: t('virtualCasting.styles.TOY_STORY'),
      image: '토이스토리.jpg',
      style: VIRTUAL_CASTING_STYLES.TOY_STORY,
    },
    {
      name: t('virtualCasting.styles.LORD_OF_THE_RINGS'),
      image: '반지의제왕.jpg',
      style: VIRTUAL_CASTING_STYLES.LORD_OF_THE_RINGS,
    },
    {
      name: t('virtualCasting.styles.STAR_WARS'),
      image: '스타워즈.jpg',
      style: VIRTUAL_CASTING_STYLES.STAR_WARS,
    },
    {
      name: t('virtualCasting.styles.AVENGERS'),
      image: '어벤져스.jpg',
      style: VIRTUAL_CASTING_STYLES.AVENGERS,
    },
    {
      name: t('virtualCasting.styles.TWILIGHT'),
      image: '트와일라잇.jpg',
      style: VIRTUAL_CASTING_STYLES.TWILIGHT,
    },
    {
      name: t('virtualCasting.styles.HARRY_POTTER'),
      image: '해리포터.jpg',
      style: VIRTUAL_CASTING_STYLES.HARRY_POTTER,
    },
    {
      name: t('virtualCasting.styles.SQUID_GAME'),
      image: '오징어 게임.jpg',
      style: VIRTUAL_CASTING_STYLES.SQUID_GAME,
    },
    {
      name: t('virtualCasting.styles.ITAEWON_CLASS'),
      image: '이태원클라쓰.jpg',
      style: VIRTUAL_CASTING_STYLES.ITAEWON_CLASS,
    },
    {
      name: t('virtualCasting.styles.DETECTIVE_CONAN'),
      image: '코난.jpg',
      style: VIRTUAL_CASTING_STYLES.DETECTIVE_CONAN,
    },
    {
      name: t('virtualCasting.styles.SLAM_DUNK'),
      image: '슬램덩크.jpg',
      style: VIRTUAL_CASTING_STYLES.SLAM_DUNK,
    },
    {
      name: t('virtualCasting.styles.KPOP_DEMON_HUNTERS'),
      image: '케이팝데몬헌터스.png',
      style: VIRTUAL_CASTING_STYLES.KPOP_DEMON_HUNTERS,
    },
  ];

  const handleCharacterSelect = (character: Character) => {
    const newSelection = {
      name: character.name,
      image: `/studio/virtual-casting/sidebar-menu-image/${character.image}`,
      style: character.style,
    };

    setSelectedCharacter(newSelection);
    onFormChange?.({
      selectedCharacter: newSelection,
    });
  };

  return (
    <StudioSidebarBase>
      <div className="flex flex-col items-start gap-4 relative flex-[0_0_auto] w-full">
        <div className="w-fit mt-[-1px] font-pretendard-medium text-studio-text-primary text-sm text-center leading-[19.6px] whitespace-nowrap relative tracking-[0]">
          {t('virtualCasting.stylePreset')}
        </div>

        <div className="grid grid-cols-2 gap-3 w-full">
          {characters.map((character) => {
            const isSelected =
              selectedCharacter?.name === character.name &&
              selectedCharacter?.style === character.style;

            return (
              <div
                key={`${character.style}-${character.name}`}
                className="flex flex-col items-center justify-center gap-1.5 cursor-pointer"
                onClick={() => handleCharacterSelect(character)}
              >
                <div
                  className={`relative w-full aspect-square max-w-[120px] md:w-24 md:h-24 bg-studio-border rounded-md overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
                    isSelected
                      ? 'border-butter-yellow shadow-lg'
                      : 'border-transparent hover:border-studio-button-primary/50'
                  }`}
                >
                  <Image
                    src={`/studio/virtual-casting/sidebar-menu-image/${character.image}`}
                    alt={character.name}
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
                  {character.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </StudioSidebarBase>
  );
}
