'use client';

import { useState } from 'react';
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
  const [selectedCharacter, setSelectedCharacter] = useState<{
    category: string;
    name: string;
    image: string;
    style: VirtualCastingStyle;
  } | null>(null);

  const categories = [
    {
      id: 'disney',
      title: '디즈니, 픽사 & 할리우드 애니메이션',
      folder: 'sidebar-menu-image-1',
      characters: [
        {
          name: '겨울왕국',
          image: '겨울왕국.png',
          style: VIRTUAL_CASTING_STYLES.FROZEN,
        },
        {
          name: '미니언즈',
          image: '미니언즈.png',
          style: VIRTUAL_CASTING_STYLES.MINIONS,
        },
        {
          name: '스폰지밥',
          image: '스폰지밥.png',
          style: VIRTUAL_CASTING_STYLES.SPONGEBOB,
        },
        {
          name: '알라딘',
          image: '알라딘.png',
          style: VIRTUAL_CASTING_STYLES.ALADDIN,
        },
        {
          name: '인사이드아웃',
          image: '인사이드아웃.png',
          style: VIRTUAL_CASTING_STYLES.INSIDE_OUT,
        },
        {
          name: '주토피아',
          image: '주토피아.png',
          style: VIRTUAL_CASTING_STYLES.ZOOTOPIA,
        },
        {
          name: '토이스토리',
          image: '토이스토리.png',
          style: VIRTUAL_CASTING_STYLES.TOY_STORY,
        },
      ],
    },
    {
      id: 'fantasy',
      title: '판타지 & SF (영화 & 게임)',
      folder: 'sidebar-menu-image-2',
      characters: [
        {
          name: '반지의제왕',
          image: '반지의제왕.png',
          style: VIRTUAL_CASTING_STYLES.LORD_OF_THE_RINGS,
        },
        {
          name: '스타워즈',
          image: '스타워즈.png',
          style: VIRTUAL_CASTING_STYLES.STAR_WARS,
        },
        {
          name: '어벤져스',
          image: '어벤져스.png',
          style: VIRTUAL_CASTING_STYLES.AVENGERS,
        },
        {
          name: '오버워치',
          image: '오버워치.png',
          style: VIRTUAL_CASTING_STYLES.OVERWATCH,
        },
        {
          name: '트와일라잇',
          image: '트와일라잇.png',
          style: VIRTUAL_CASTING_STYLES.TWILIGHT,
        },
        {
          name: '해리포터',
          image: '해리포터.png',
          style: VIRTUAL_CASTING_STYLES.HARRY_POTTER,
        },
      ],
    },
    {
      id: 'webtoon',
      title: '웹툰 원작 & 한국 드라마',
      folder: 'sidebar-menu-image-3',
      characters: [
        {
          name: '여신강림',
          image: '여신강림.png',
          style: VIRTUAL_CASTING_STYLES.TRUE_BEAUTY,
        },
        {
          name: '오징어게임',
          image: '오징어게임.png',
          style: VIRTUAL_CASTING_STYLES.SQUID_GAME,
        },
        {
          name: '외모지상주의',
          image: '외모지상주의.png',
          style: VIRTUAL_CASTING_STYLES.LOOKISM,
        },
        {
          name: '이태원클라스',
          image: '이태원클라스.png',
          style: VIRTUAL_CASTING_STYLES.ITAEWON_CLASS,
        },
        {
          name: '케데헌',
          image: '케데헌.png',
          style: VIRTUAL_CASTING_STYLES.KENGAN_ASHURA,
        },
        {
          name: '화산귀환',
          image: '화산귀환.png',
          style: VIRTUAL_CASTING_STYLES.VOLCANO_RETURNS,
        },
      ],
    },
    {
      id: 'anime',
      title: '일본 애니메이션',
      folder: 'sidebar-menu-image-4',
      characters: [
        {
          name: '너에게 닿기를',
          image: '너에게 닿기를.png',
          style: VIRTUAL_CASTING_STYLES.KIMI_NI_TODOKE,
        },
        {
          name: '명탐정 코난',
          image: '명탐정 코난.png',
          style: VIRTUAL_CASTING_STYLES.DETECTIVE_CONAN,
        },
        {
          name: '장송의 프리렌',
          image: '장송의 프리렌.png',
          style: VIRTUAL_CASTING_STYLES.FRIEREN,
        },
        {
          name: '짱구는 못말려',
          image: '짱구는 못말려.png',
          style: VIRTUAL_CASTING_STYLES.CRAYON_SHIN_CHAN,
        },
        {
          name: '최애의 아이',
          image: '최애의 아이.png',
          style: VIRTUAL_CASTING_STYLES.MY_LOVE_MIX_UP,
        },
        { name: '나나', image: '나나.png', style: VIRTUAL_CASTING_STYLES.NANA },
        {
          name: '나루토',
          image: '나루토.png',
          style: VIRTUAL_CASTING_STYLES.NARUTO,
        },
        {
          name: '너의이름은',
          image: '너의이름은.png',
          style: VIRTUAL_CASTING_STYLES.YOUR_NAME,
        },
        {
          name: '도라에몽',
          image: '도라에몽.png',
          style: VIRTUAL_CASTING_STYLES.DORAEMON,
        },
        {
          name: '스파이패밀리',
          image: '스파이패밀리.png',
          style: VIRTUAL_CASTING_STYLES.SPY_FAMILY,
        },
        {
          name: '슬램덩크',
          image: '슬램덩크.png',
          style: VIRTUAL_CASTING_STYLES.SLAM_DUNK,
        },
        {
          name: '오란고교',
          image: '오란고교.png',
          style: VIRTUAL_CASTING_STYLES.OURAN_HIGH_SCHOOL,
        },
        {
          name: '주술회전',
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
