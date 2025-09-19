'use client';

import { useState } from 'react';
import CustomDropdown from '../../_components/CustomDropdown';
import StudioInput from '@/app/_components/shared/StudioInput';
import PrimaryButton from '../../_components/ui/PrimaryButton';

interface ArtistSelectionProps {
  onNext: (data: { group: string; artist: string; customArtist?: string }) => void;
}

const artistGroups = [
  { value: 'BTS', label: 'BTS' },
  { value: 'Red Velvet', label: 'Red Velvet' },
  { value: 'NewJeans', label: 'NewJeans' },
  { value: 'Stray Kids', label: 'Stray Kids' },
  { value: 'BLACKPINK', label: 'BLACKPINK' },
  { value: 'ILLIT', label: 'ILLIT' },
  { value: 'ENHYPEN', label: 'ENHYPEN' },
  { value: 'EXO', label: 'EXO' },
  { value: 'BabyMonster', label: 'BabyMonster' },
  { value: 'Monsta X', label: 'Monsta X' },
  { value: 'RIIZE', label: 'RIIZE' },
  { value: 'Seventeen', label: 'Seventeen' },
  { value: 'NCT', label: 'NCT' },
  { value: 'TXT', label: 'TXT' },
  { value: 'TWS', label: 'TWS' },
  { value: 'AESPA', label: 'AESPA' },
  { value: 'IVE', label: 'IVE' },
  { value: 'Le Sserafim', label: 'Le Sserafim' },
  { value: '솔로 가수', label: '솔로 가수' },
];

const artistMembers = {
  'BTS': [
    { value: 'Jhope', label: 'J-Hope' },
    { value: 'RapMonster', label: 'RM' },
    { value: 'Suga', label: 'Suga' },
    { value: 'Jungkook', label: '정국' },
    { value: 'V', label: '뷔' },
    { value: 'Jimin', label: '지민' },
    { value: 'Jin', label: '진' },
  ],
  'Red Velvet': [
    { value: 'Wendy', label: '웬디' },
    { value: 'SEULGI', label: '슬기' },
    { value: 'JOY', label: '조이' },
    { value: 'IRENE', label: '아이린' },
    { value: 'YERI', label: '예리' },
  ],
  'NewJeans': [
    { value: 'Hyein', label: '혜인' },
    { value: 'Hanni', label: '하니' },
    { value: 'Minji', label: '민지' },
    { value: 'DANIELLE', label: '다니엘' },
    { value: 'Haerin', label: '해린' },
  ],
  'Stray Kids': [
    { value: 'BangChan', label: '방찬' },
    { value: 'Hyunjin', label: '현진' },
    { value: 'Seungmin', label: '승민' },
    { value: 'HanJisung', label: '한' },
    { value: 'LeeKnow', label: '리노' },
    { value: 'Changbin', label: '창빈' },
    { value: 'I.N', label: '아이엔' },
  ],
  'BLACKPINK': [
    { value: 'LISA', label: '리사' },
    { value: 'JENNIE', label: '제니' },
    { value: 'JISOO', label: '지수' },
    { value: 'ROSE', label: '로제' },
  ],
  'ILLIT': [
    { value: 'Moka', label: '모카' },
    { value: 'Minju', label: '민주' },
    { value: 'Iroha', label: '이로하' },
    { value: 'Yunah', label: '유나' },
    { value: 'Wonhee', label: '원희' },
  ],
  'ENHYPEN': [
    { value: 'Heeseung', label: '희승' },
    { value: 'Jay', label: '제이' },
    { value: 'Jake', label: '제이크' },
    { value: 'Sunghoon', label: '성훈' },
    { value: 'Jungwon', label: '정원' },
    { value: 'Niki', label: '니키' },
    { value: 'Sunoo', label: '선우' },
  ],
  'EXO': [
    { value: 'BAEKHYUN', label: '백현' },
    { value: 'D.O', label: '디오' },
    { value: 'Sehun', label: '세훈' },
  ],
  'BabyMonster': [
    { value: 'Ahyeon', label: '아현' },
    { value: 'RUKA', label: '루카' },
    { value: 'PHARITA', label: '파리타' },
    { value: 'RAMI', label: '라미' },
    { value: 'ASA', label: '아사' },
    { value: 'Rora', label: '로라' },
    { value: 'Chiquita', label: '치키타' },
  ],
  'Monsta X': [
    { value: 'IMChangkyun', label: '아이엠' },
    { value: 'LeeMinhyuk', label: '민혁' },
  ],
  'RIIZE': [
    { value: 'Wonbin', label: '원빈' },
    { value: 'Sungchan', label: '성찬' },
    { value: 'Seunghan', label: '승한' },
    { value: 'Anton', label: '안톤' },
    { value: 'Shotaro', label: '쇼타로' },
    { value: 'Sohee', label: '소희' },
  ],
  'Seventeen': [
    { value: 'Dino', label: '디노' },
    { value: 'Joshua', label: '조슈아' },
    { value: 'JeonWonwoo', label: '원우' },
    { value: 'Scoups', label: '에스쿱스' },
    { value: 'Hoshi', label: '호시' },
    { value: 'Seungkwan', label: '승관' },
    { value: 'KimMingyu', label: '민규' },
    { value: 'DK', label: '도겸' },
    { value: 'Woozi', label: '우지' },
    { value: 'Jeonghan', label: '정한' },
  ],
  'NCT': [
    { value: 'Chenle', label: '천러' },
    { value: 'Mark', label: '마크' },
    { value: 'Jaemin', label: '재민' },
    { value: 'Renjun', label: '런쥔' },
    { value: 'Jisung', label: '지성' },
    { value: 'Jungwoo', label: '정우' },
    { value: 'Doyoung', label: '도영' },
    { value: 'Haechan', label: '해찬' },
    { value: 'TEN', label: '텐' },
    { value: 'Jaehyun', label: '재현' },
  ],
  'TXT': [
    { value: 'HueningKai', label: '휴닝카이' },
    { value: 'Soobin', label: '수빈' },
    { value: 'Beomgyu', label: '범규' },
    { value: 'Taehyun', label: '태현' },
    { value: 'Yeonjun', label: '연준' },
  ],
  'TWS': [
    { value: 'Jihoon', label: '지훈' },
    { value: 'Youngjae', label: '영재' },
    { value: 'Kyungmin', label: '경민' },
    { value: 'Shinyu', label: '신유' },
    { value: 'Dohoon', label: '도훈' },
  ],
  'AESPA': [
    { value: 'Karina', label: '카리나' },
    { value: 'Giselle', label: '지젤' },
    { value: 'Ningning', label: '닝닝' },
    { value: 'Winter', label: '윈터' },
  ],
  'IVE': [
    { value: 'Leeseo', label: '이서' },
    { value: 'Liz', label: '리즈' },
    { value: 'Yujin', label: '유진' },
    { value: 'Gaeul', label: '가을' },
    { value: 'Wonyoung', label: '원영' },
    { value: 'Rei', label: '레이' },
  ],
  'Le Sserafim': [
    { value: 'KimChaewon', label: '채원' },
    { value: 'HuhYunjin', label: '윤진' },
    { value: 'KAZUHA', label: '카즈하' },
    { value: 'SAKURA', label: '사쿠라' },
    { value: 'HONGEUNCHAE', label: '은채' },
  ],
  '솔로 가수': [
    { value: 'IU', label: '아이유' },
    { value: 'Backyerin', label: '백예린' },
    { value: 'ArianaGrande', label: '아리아나 그란데' },
    { value: 'Trump', label: '트럼프' },
  ],
};

export default function ArtistSelection({ onNext }: ArtistSelectionProps) {
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedArtist, setSelectedArtist] = useState('');
  const [customArtist, setCustomArtist] = useState('');

  const handleNext = () => {
    if (!selectedGroup || !selectedArtist) {
      alert('아티스트 그룹과 아티스트를 모두 선택해주세요.');
      return;
    }

    onNext({
      group: selectedGroup,
      artist: selectedArtist,
      customArtist: customArtist || undefined,
    });
  };

  const handleGroupChange = (value: string) => {
    setSelectedGroup(value);
    setSelectedArtist(''); // Reset artist selection when group changes
  };

  const availableArtists = selectedGroup ? artistMembers[selectedGroup as keyof typeof artistMembers] || [] : [];

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-6 py-8">
      <div className="w-full max-w-lg space-y-8">
        <div className="space-y-6">
          <div>
            <label className="block text-white text-lg font-medium mb-4">
              아티스트 그룹
            </label>
            <CustomDropdown
              value={selectedGroup}
              onChange={handleGroupChange}
              placeholder="그룹을 선택하세요"
              options={artistGroups}
              width="w-full"
            />
          </div>

          <div>
            <label className="block text-white text-lg font-medium mb-4">
              아티스트 선택
            </label>
            <CustomDropdown
              value={selectedArtist}
              onChange={setSelectedArtist}
              placeholder={selectedGroup ? "아티스트를 선택하세요" : "먼저 그룹을 선택하세요"}
              options={availableArtists}
              width="w-full"
            />
          </div>

          <div className="opacity-30">
            <label className="block text-white text-lg font-medium mb-4">
              직접 입력
            </label>
            <StudioInput
              value={customArtist}
              onChange={(e) => setCustomArtist(e.target.value)}
              placeholder="아이돌을 입력해주세요"
              disabled
            />
          </div>
        </div>

        <div className="pt-4">
          <PrimaryButton
            text="다음단계"
            onClick={handleNext}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}