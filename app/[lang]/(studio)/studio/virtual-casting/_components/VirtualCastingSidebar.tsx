'use client';

import { useState } from 'react';
import Image from 'next/image';
import StudioSidebarBase from '../../_components/StudioSidebarBase';
import CustomDropdown from '../../_components/CustomDropdown';
import ScrollableGrid from '../../_components/ScrollableGrid';

interface VirtualCastingSidebarProps {
  onFormChange: (formData: {
    selectedCharacter: {
      category: string;
      name: string;
      image: string;
    } | null;
  }) => void;
}

interface Character {
  name: string;
  image: string;
}

export default function VirtualCastingSidebar({ onFormChange }: VirtualCastingSidebarProps) {
  const [selectedCharacter, setSelectedCharacter] = useState<{
    category: string;
    name: string;
    image: string;
  } | null>(null);
  const [imageSize, setImageSize] = useState('1:1(정방향)');

  const categories = [
    {
      id: 'disney',
      title: '디즈니, 픽사 & 할리우드 애니메이션',
      folder: 'sidebar-menu-image-1',
      characters: [
        { name: '겨울왕국', image: '겨울왕국.png' },
        { name: '미니언즈', image: '미니언즈.png' },
        { name: '스폰지밥', image: '스폰지밥.png' },
        { name: '알라딘', image: '알라딘.png' },
        { name: '인사이드아웃', image: '인사이드아웃.png' },
        { name: '주토피아', image: '주토피아.png' },
        { name: '토이스토리', image: '토이스토리.png' },
      ],
    },
    {
      id: 'fantasy',
      title: '판타지 & SF (영화 & 게임)',
      folder: 'sidebar-menu-image-2',
      characters: [
        { name: '반지의제왕', image: '반지의제왕.png' },
        { name: '스타워즈', image: '스타워즈.png' },
        { name: '어벤져스', image: '어벤져스.png' },
        { name: '오버워치', image: '오버워치.png' },
        { name: '트와일라잇', image: '트와일라잇.png' },
        { name: '해리포터', image: '해리포터.png' },
      ],
    },
    {
      id: 'webtoon',
      title: '웹툰 원작 & 한국 드라마',
      folder: 'sidebar-menu-image-3',
      characters: [
        { name: '여신강림', image: '여신강림.png' },
        { name: '오징어게임', image: '오징어게임.png' },
        { name: '외모지상주의', image: '외모지상주의.png' },
        { name: '이태원클라스', image: '이태원클라스.png' },
        { name: '케데헌', image: '케데헌.png' },
        { name: '화산귀환', image: '화산귀환.png' },
      ],
    },
    {
      id: 'anime',
      title: '일본 애니메이션',
      folder: 'sidebar-menu-image-4',
      characters: [
        { name: '너에게 닿기를', image: '너에게 닿기를.png' },
        { name: '명탐정 코난', image: '명탐정 코난.png' },
        { name: '장송의 프리렌', image: '장송의 프리렌.png' },
        { name: '짱구는 못말려', image: '짱구는 못말려.png' },
        { name: '최애의 아이', image: '최애의 아이.png' },
        { name: '나나', image: '나나.png' },
        { name: '나루토', image: '나루토.png' },
        { name: '너의이름은', image: '너의이름은.png' },
        { name: '도라에몽', image: '도라에몽.png' },
        { name: '스파이패밀리', image: '스파이패밀리.png' },
        { name: '슬램덩크', image: '슬램덩크.png' },
        { name: '오란고교', image: '오란고교.png' },
        { name: '주술회전', image: '주술회전.png' },
      ],
    },
  ];

  const handleCharacterSelect = (categoryId: string, character: Character, folder: string) => {
    const newSelection = {
      category: categoryId,
      name: character.name,
      image: `/studio/virtual-casting/${folder}/${character.image}`,
    };

    setSelectedCharacter(newSelection);
    onFormChange({
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
  } | null;
  onCharacterSelect: (categoryId: string, character: Character, folder: string) => void;
}

function CategorySection({ category, selectedCharacter, onCharacterSelect }: CategorySectionProps) {
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
              onClick={() => onCharacterSelect(category.id, character, category.folder)}
            >
              <div className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                isSelected
                  ? 'border-butter-yellow scale-105'
                  : 'border-studio-border hover:border-studio-button-primary/50'
              }`}>
                <Image
                  src={`/studio/virtual-casting/${category.folder}/${character.image}`}
                  alt={character.name}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className={`text-xs font-pretendard text-center max-w-16 leading-tight transition-colors duration-200 ${
                isSelected
                  ? 'text-butter-yellow font-medium'
                  : 'text-studio-text-secondary'
              }`}>
                {character.name}
              </div>
            </div>
          );
        })}
      </ScrollableGrid>
    </div>
  );
}