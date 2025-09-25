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
    // 이전에 없는데 지금 새로 생긴거(임의더미 enum)
    // {
    //   name: 'Game of Thrones',
    //   image: '게임오브쓰론.jpg',
    //   style: 'GAME_OF_THRONES' as VirtualCastingStyle,
    // },

    // 이전에 있다가 없어진거
    // {
    //   name: t('virtualCasting.styles.MINIONS'),
    //   image: '미니언즈.png',
    //   style: VIRTUAL_CASTING_STYLES.MINIONS,
    // },
    // {
    //   name: t('virtualCasting.styles.SPONGEBOB'),
    //   image: '스폰지밥.png',
    //   style: VIRTUAL_CASTING_STYLES.SPONGEBOB,
    // },
    // {
    //   name: t('virtualCasting.styles.OVERWATCH'),
    //   image: '오버워치.png',
    //   style: VIRTUAL_CASTING_STYLES.OVERWATCH,
    // },
    // {
    //   name: t('virtualCasting.styles.TRUE_BEAUTY'),
    //   image: '여신강림.png',
    //   style: VIRTUAL_CASTING_STYLES.TRUE_BEAUTY,
    // },
    // {
    //   name: t('virtualCasting.styles.LOOKISM'),
    //   image: '외모지상주의.png',
    //   style: VIRTUAL_CASTING_STYLES.LOOKISM,
    // },
    // {
    //   name: t('virtualCasting.styles.KENGAN_ASHURA'),
    //   image: '케데헌.png',
    //   style: VIRTUAL_CASTING_STYLES.KENGAN_ASHURA,
    // },
    // {
    //   name: t('virtualCasting.styles.VOLCANO_RETURNS'),
    //   image: '화산귀환.png',
    //   style: VIRTUAL_CASTING_STYLES.VOLCANO_RETURNS,
    // },
    // {
    //   name: t('virtualCasting.styles.KIMI_NI_TODOKE'),
    //   image: '너에게 닿기를.png',
    //   style: VIRTUAL_CASTING_STYLES.KIMI_NI_TODOKE,
    // },
    // {
    //   name: t('virtualCasting.styles.FRIEREN'),
    //   image: '장송의 프리렌.png',
    //   style: VIRTUAL_CASTING_STYLES.FRIEREN,
    // },
    // {
    //   name: t('virtualCasting.styles.CRAYON_SHIN_CHAN'),
    //   image: '짱구는 못말려.png',
    //   style: VIRTUAL_CASTING_STYLES.CRAYON_SHIN_CHAN,
    // },
    // {
    //   name: t('virtualCasting.styles.MY_LOVE_MIX_UP'),
    //   image: '최애의 아이.png',
    //   style: VIRTUAL_CASTING_STYLES.MY_LOVE_MIX_UP,
    // },
    // {
    //   name: t('virtualCasting.styles.NANA'),
    //   image: '나나.png',
    //   style: VIRTUAL_CASTING_STYLES.NANA
    // },
    // {
    //   name: t('virtualCasting.styles.NARUTO'),
    //   image: '나루토.png',
    //   style: VIRTUAL_CASTING_STYLES.NARUTO,
    // },
    // {
    //   name: t('virtualCasting.styles.YOUR_NAME'),
    //   image: '너의이름은.png',
    //   style: VIRTUAL_CASTING_STYLES.YOUR_NAME,
    // },
    // {
    //   name: t('virtualCasting.styles.DORAEMON'),
    //   image: '도라에몽.png',
    //   style: VIRTUAL_CASTING_STYLES.DORAEMON,
    // },
    // {
    //   name: t('virtualCasting.styles.SPY_FAMILY'),
    //   image: '스파이패밀리.png',
    //   style: VIRTUAL_CASTING_STYLES.SPY_FAMILY,
    // },
    // {
    //   name: t('virtualCasting.styles.OURAN_HIGH_SCHOOL'),
    //   image: '오란고교.png',
    //   style: VIRTUAL_CASTING_STYLES.OURAN_HIGH_SCHOOL,
    // },
    // {
    //   name: t('virtualCasting.styles.JUJUTSU_KAISEN'),
    //   image: '주술회전.png',
    //   style: VIRTUAL_CASTING_STYLES.JUJUTSU_KAISEN,
    // },
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
                  className={`relative w-24 h-24 bg-studio-border rounded-md overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
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
