'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import StudioSidebarBase from '../../_components/StudioSidebarBase';
import ScrollableGrid from '../../_components/ScrollableGrid';
import {
  VirtualCastingStyle,
  VIRTUAL_CASTING_STYLES,
} from '@/app/_lib/apis/task.api';

interface VirtualCastingSidebarProps {
  onFormChange?: (formData: {
    selectedCharacter: {
      category: string;
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
    category: string;
    name: string;
    image: string;
    style: VirtualCastingStyle;
  } | null>(null);

  const categories = [
    {
      id: 'disney',
      title: t('virtualCasting.categories.disney'),
      folder: 'sidebar-menu-image-1',
      characters: [
        {
          name: t('virtualCasting.styles.FROZEN'),
          image: '겨울왕국.png',
          style: VIRTUAL_CASTING_STYLES.FROZEN,
        },
        {
          name: t('virtualCasting.styles.MINIONS'),
          image: '미니언즈.png',
          style: VIRTUAL_CASTING_STYLES.MINIONS,
        },
        {
          name: t('virtualCasting.styles.SPONGEBOB'),
          image: '스폰지밥.png',
          style: VIRTUAL_CASTING_STYLES.SPONGEBOB,
        },
        {
          name: t('virtualCasting.styles.ALADDIN'),
          image: '알라딘.png',
          style: VIRTUAL_CASTING_STYLES.ALADDIN,
        },
        {
          name: t('virtualCasting.styles.INSIDE_OUT'),
          image: '인사이드아웃.png',
          style: VIRTUAL_CASTING_STYLES.INSIDE_OUT,
        },
        {
          name: t('virtualCasting.styles.ZOOTOPIA'),
          image: '주토피아.png',
          style: VIRTUAL_CASTING_STYLES.ZOOTOPIA,
        },
        {
          name: t('virtualCasting.styles.TOY_STORY'),
          image: '토이스토리.png',
          style: VIRTUAL_CASTING_STYLES.TOY_STORY,
        },
      ],
    },
    {
      id: 'fantasy',
      title: t('virtualCasting.categories.fantasy'),
      folder: 'sidebar-menu-image-2',
      characters: [
        {
          name: t('virtualCasting.styles.LORD_OF_THE_RINGS'),
          image: '반지의제왕.png',
          style: VIRTUAL_CASTING_STYLES.LORD_OF_THE_RINGS,
        },
        {
          name: t('virtualCasting.styles.STAR_WARS'),
          image: '스타워즈.png',
          style: VIRTUAL_CASTING_STYLES.STAR_WARS,
        },
        {
          name: t('virtualCasting.styles.AVENGERS'),
          image: '어벤져스.png',
          style: VIRTUAL_CASTING_STYLES.AVENGERS,
        },
        {
          name: t('virtualCasting.styles.OVERWATCH'),
          image: '오버워치.png',
          style: VIRTUAL_CASTING_STYLES.OVERWATCH,
        },
        {
          name: t('virtualCasting.styles.TWILIGHT'),
          image: '트와일라잇.png',
          style: VIRTUAL_CASTING_STYLES.TWILIGHT,
        },
        {
          name: t('virtualCasting.styles.HARRY_POTTER'),
          image: '해리포터.png',
          style: VIRTUAL_CASTING_STYLES.HARRY_POTTER,
        },
      ],
    },
    {
      id: 'webtoon',
      title: t('virtualCasting.categories.webtoon'),
      folder: 'sidebar-menu-image-3',
      characters: [
        {
          name: t('virtualCasting.styles.TRUE_BEAUTY'),
          image: '여신강림.png',
          style: VIRTUAL_CASTING_STYLES.TRUE_BEAUTY,
        },
        {
          name: t('virtualCasting.styles.SQUID_GAME'),
          image: '오징어게임.png',
          style: VIRTUAL_CASTING_STYLES.SQUID_GAME,
        },
        {
          name: t('virtualCasting.styles.LOOKISM'),
          image: '외모지상주의.png',
          style: VIRTUAL_CASTING_STYLES.LOOKISM,
        },
        {
          name: t('virtualCasting.styles.ITAEWON_CLASS'),
          image: '이태원클라스.png',
          style: VIRTUAL_CASTING_STYLES.ITAEWON_CLASS,
        },
        {
          name: t('virtualCasting.styles.KENGAN_ASHURA'),
          image: '케데헌.png',
          style: VIRTUAL_CASTING_STYLES.KENGAN_ASHURA,
        },
        {
          name: t('virtualCasting.styles.VOLCANO_RETURNS'),
          image: '화산귀환.png',
          style: VIRTUAL_CASTING_STYLES.VOLCANO_RETURNS,
        },
      ],
    },
    {
      id: 'anime',
      title: t('virtualCasting.categories.anime'),
      folder: 'sidebar-menu-image-4',
      characters: [
        {
          name: t('virtualCasting.styles.KIMI_NI_TODOKE'),
          image: '너에게 닿기를.png',
          style: VIRTUAL_CASTING_STYLES.KIMI_NI_TODOKE,
        },
        {
          name: t('virtualCasting.styles.DETECTIVE_CONAN'),
          image: '명탐정 코난.png',
          style: VIRTUAL_CASTING_STYLES.DETECTIVE_CONAN,
        },
        {
          name: t('virtualCasting.styles.FRIEREN'),
          image: '장송의 프리렌.png',
          style: VIRTUAL_CASTING_STYLES.FRIEREN,
        },
        {
          name: t('virtualCasting.styles.CRAYON_SHIN_CHAN'),
          image: '짱구는 못말려.png',
          style: VIRTUAL_CASTING_STYLES.CRAYON_SHIN_CHAN,
        },
        {
          name: t('virtualCasting.styles.MY_LOVE_MIX_UP'),
          image: '최애의 아이.png',
          style: VIRTUAL_CASTING_STYLES.MY_LOVE_MIX_UP,
        },
        {
          name: t('virtualCasting.styles.NANA'),
          image: '나나.png',
          style: VIRTUAL_CASTING_STYLES.NANA
        },
        {
          name: t('virtualCasting.styles.NARUTO'),
          image: '나루토.png',
          style: VIRTUAL_CASTING_STYLES.NARUTO,
        },
        {
          name: t('virtualCasting.styles.YOUR_NAME'),
          image: '너의이름은.png',
          style: VIRTUAL_CASTING_STYLES.YOUR_NAME,
        },
        {
          name: t('virtualCasting.styles.DORAEMON'),
          image: '도라에몽.png',
          style: VIRTUAL_CASTING_STYLES.DORAEMON,
        },
        {
          name: t('virtualCasting.styles.SPY_FAMILY'),
          image: '스파이패밀리.png',
          style: VIRTUAL_CASTING_STYLES.SPY_FAMILY,
        },
        {
          name: t('virtualCasting.styles.SLAM_DUNK'),
          image: '슬램덩크.png',
          style: VIRTUAL_CASTING_STYLES.SLAM_DUNK,
        },
        {
          name: t('virtualCasting.styles.OURAN_HIGH_SCHOOL'),
          image: '오란고교.png',
          style: VIRTUAL_CASTING_STYLES.OURAN_HIGH_SCHOOL,
        },
        {
          name: t('virtualCasting.styles.JUJUTSU_KAISEN'),
          image: '주술회전.png',
          style: VIRTUAL_CASTING_STYLES.JUJUTSU_KAISEN,
        },
      ],
    },
  ];

  const handleCharacterSelect = (
    categoryId: string,
    character: Character,
    folder: string
  ) => {
    const newSelection = {
      category: categoryId,
      name: character.name,
      image: `/studio/virtual-casting/${folder}/${character.image}`,
      style: character.style,
    };

    setSelectedCharacter(newSelection);
    onFormChange?.({
      selectedCharacter: newSelection,
    });
  };

  return (
    <StudioSidebarBase>
      {categories.map((category) => (
        <CategorySection
          key={category.id}
          category={category}
          selectedCharacter={selectedCharacter}
          onCharacterSelect={handleCharacterSelect}
        />
      ))}
    </StudioSidebarBase>
  );
}

interface CategorySectionProps {
  category: {
    id: string;
    title: string;
    folder: string;
    characters: Character[];
  };
  selectedCharacter: {
    category: string;
    name: string;
    image: string;
    style: VirtualCastingStyle;
  } | null;
  onCharacterSelect: (
    categoryId: string,
    character: Character,
    folder: string
  ) => void;
}

function CategorySection({
  category,
  selectedCharacter,
  onCharacterSelect,
}: CategorySectionProps) {
  return (
    <div className="flex flex-col items-start gap-4 relative flex-[0_0_auto] self-stretch w-full">
      <div className="relative w-fit mt-[-1px] font-pretendard-medium text-studio-text-primary text-sm text-center tracking-[0] leading-[19.6px] whitespace-nowrap">
        {category.title}
      </div>

      <ScrollableGrid rows={1} scrollAmount={200}>
        {category.characters.map((character) => {
          const isSelected =
            selectedCharacter?.category === category.id &&
            selectedCharacter?.name === character.name;

          return (
            <div
              key={character.name}
              className="flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer"
              onClick={() =>
                onCharacterSelect(category.id, character, category.folder)
              }
            >
              <div
                className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  isSelected
                    ? 'border-butter-yellow scale-105'
                    : 'border-studio-border hover:border-studio-button-primary/50'
                }`}
              >
                <Image
                  src={`/studio/virtual-casting/${category.folder}/${character.image}`}
                  alt={character.name}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
              <div
                className={`text-xs font-pretendard text-center max-w-16 leading-tight transition-colors duration-200 ${
                  isSelected
                    ? 'text-butter-yellow font-medium'
                    : 'text-studio-text-secondary'
                }`}
              >
                {character.name}
              </div>
            </div>
          );
        })}
      </ScrollableGrid>
    </div>
  );
}
