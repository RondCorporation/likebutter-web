'use client';

import { useState } from 'react';
import CustomDropdown from '../../_components/CustomDropdown';
import StudioButton from '../../_components/ui/StudioButton';
import { useTranslation } from 'react-i18next';

interface ArtistSelectionProps {
  onNext: (data: { group: string; artist: string }) => void;
}

export default function ArtistSelection({ onNext }: ArtistSelectionProps) {
  const { t } = useTranslation(['studio']);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedArtist, setSelectedArtist] = useState('');

  const artistGroups = [
    { value: 'BTS', label: t('artistGroups.BTS') },
    { value: 'Red Velvet', label: t('artistGroups.Red Velvet') },
    { value: 'NewJeans', label: t('artistGroups.NewJeans') },
    { value: 'Stray Kids', label: t('artistGroups.Stray Kids') },
    { value: 'BLACKPINK', label: t('artistGroups.BLACKPINK') },
    { value: 'ILLIT', label: t('artistGroups.ILLIT') },
    { value: 'ENHYPEN', label: t('artistGroups.ENHYPEN') },
    { value: 'EXO', label: t('artistGroups.EXO') },
    { value: 'BabyMonster', label: t('artistGroups.BabyMonster') },
    { value: 'Monsta X', label: t('artistGroups.Monsta X') },
    { value: 'RIIZE', label: t('artistGroups.RIIZE') },
    { value: 'Seventeen', label: t('artistGroups.Seventeen') },
    { value: 'NCT', label: t('artistGroups.NCT') },
    { value: 'TXT', label: t('artistGroups.TXT') },
    { value: 'TWS', label: t('artistGroups.TWS') },
    { value: 'AESPA', label: t('artistGroups.AESPA') },
    { value: 'IVE', label: t('artistGroups.IVE') },
    { value: 'Le Sserafim', label: t('artistGroups.Le Sserafim') },
    { value: 'SOLO', label: t('artistGroups.SOLO') },
  ];

  const artistMembers: { [key: string]: { value: string; label: string }[] } = {
    BTS: [
      { value: 'Jhope', label: t('artists.Jhope') },
      { value: 'RapMonster', label: t('artists.RapMonster') },
      { value: 'Suga', label: t('artists.Suga') },
      { value: 'Jungkook', label: t('artists.Jungkook') },
      { value: 'V', label: t('artists.V') },
      { value: 'Jimin', label: t('artists.Jimin') },
      { value: 'Jin', label: t('artists.Jin') },
    ],
    'Red Velvet': [
      { value: 'Wendy', label: t('artists.Wendy') },
      { value: 'SEULGI', label: t('artists.SEULGI') },
      { value: 'JOY', label: t('artists.JOY') },
      { value: 'IRENE', label: t('artists.IRENE') },
      { value: 'YERI', label: t('artists.YERI') },
    ],
    NewJeans: [
      { value: 'Hyein', label: t('artists.Hyein') },
      { value: 'Hanni', label: t('artists.Hanni') },
      { value: 'Minji', label: t('artists.Minji') },
      { value: 'DANIELLE', label: t('artists.DANIELLE') },
      { value: 'Haerin', label: t('artists.Haerin') },
    ],
    'Stray Kids': [
      { value: 'BangChan', label: t('artists.BangChan') },
      { value: 'Hyunjin', label: t('artists.Hyunjin') },
      { value: 'Seungmin', label: t('artists.Seungmin') },
      { value: 'HanJisung', label: t('artists.HanJisung') },
      { value: 'LeeKnow', label: t('artists.LeeKnow') },
      { value: 'Changbin', label: t('artists.Changbin') },
      { value: 'I.N', label: t('artists.I.N') },
    ],
    BLACKPINK: [
      { value: 'LISA', label: t('artists.LISA') },
      { value: 'JENNIE', label: t('artists.JENNIE') },
      { value: 'JISOO', label: t('artists.JISOO') },
      { value: 'ROSE', label: t('artists.ROSE') },
    ],
    ILLIT: [
      { value: 'Moka', label: t('artists.Moka') },
      { value: 'Minju', label: t('artists.Minju') },
      { value: 'Iroha', label: t('artists.Iroha') },
      { value: 'Yunah', label: t('artists.Yunah') },
      { value: 'Wonhee', label: t('artists.Wonhee') },
    ],
    ENHYPEN: [
      { value: 'Heeseung', label: t('artists.Heeseung') },
      { value: 'Jay', label: t('artists.Jay') },
      { value: 'Jake', label: t('artists.Jake') },
      { value: 'Sunghoon', label: t('artists.Sunghoon') },
      { value: 'Jungwon', label: t('artists.Jungwon') },
      { value: 'Niki', label: t('artists.Niki') },
      { value: 'Sunoo', label: t('artists.Sunoo') },
    ],
    EXO: [
      { value: 'BAEKHYUN', label: t('artists.BAEKHYUN') },
      { value: 'D.O', label: t('artists.D.O') },
      { value: 'Sehun', label: t('artists.Sehun') },
    ],
    BabyMonster: [
      { value: 'Ahyeon', label: t('artists.Ahyeon') },
      { value: 'RUKA', label: t('artists.RUKA') },
      { value: 'PHARITA', label: t('artists.PHARITA') },
      { value: 'RAMI', label: t('artists.RAMI') },
      { value: 'ASA', label: t('artists.ASA') },
      { value: 'Rora', label: t('artists.Rora') },
      { value: 'Chiquita', label: t('artists.Chiquita') },
    ],
    'Monsta X': [
      { value: 'IMChangkyun', label: t('artists.IMChangkyun') },
      { value: 'LeeMinhyuk', label: t('artists.LeeMinhyuk') },
    ],
    RIIZE: [
      { value: 'Wonbin', label: t('artists.Wonbin') },
      { value: 'Sungchan', label: t('artists.Sungchan') },
      { value: 'Seunghan', label: t('artists.Seunghan') },
      { value: 'Anton', label: t('artists.Anton') },
      { value: 'Shotaro', label: t('artists.Shotaro') },
      { value: 'Sohee', label: t('artists.Sohee') },
    ],
    Seventeen: [
      { value: 'Dino', label: t('artists.Dino') },
      { value: 'Joshua', label: t('artists.Joshua') },
      { value: 'JeonWonwoo', label: t('artists.JeonWonwoo') },
      { value: 'Scoups', label: t('artists.Scoups') },
      { value: 'Hoshi', label: t('artists.Hoshi') },
      { value: 'Seungkwan', label: t('artists.Seungkwan') },
      { value: 'KimMingyu', label: t('artists.KimMingyu') },
      { value: 'DK', label: t('artists.DK') },
      { value: 'Woozi', label: t('artists.Woozi') },
      { value: 'Jeonghan', label: t('artists.Jeonghan') },
    ],
    NCT: [
      { value: 'Chenle', label: t('artists.Chenle') },
      { value: 'Mark', label: t('artists.Mark') },
      { value: 'Jaemin', label: t('artists.Jaemin') },
      { value: 'Renjun', label: t('artists.Renjun') },
      { value: 'Jisung', label: t('artists.Jisung') },
      { value: 'Jungwoo', label: t('artists.Jungwoo') },
      { value: 'Doyoung', label: t('artists.Doyoung') },
      { value: 'Haechan', label: t('artists.Haechan') },
      { value: 'TEN', label: t('artists.TEN') },
      { value: 'Jaehyun', label: t('artists.Jaehyun') },
    ],
    TXT: [
      { value: 'HueningKai', label: t('artists.HueningKai') },
      { value: 'Soobin', label: t('artists.Soobin') },
      { value: 'Beomgyu', label: t('artists.Beomgyu') },
      { value: 'Taehyun', label: t('artists.Taehyun') },
      { value: 'Yeonjun', label: t('artists.Yeonjun') },
    ],
    TWS: [
      { value: 'Jihoon', label: t('artists.Jihoon') },
      { value: 'Youngjae', label: t('artists.Youngjae') },
      { value: 'Kyungmin', label: t('artists.Kyungmin') },
      { value: 'Shinyu', label: t('artists.Shinyu') },
      { value: 'Dohoon', label: t('artists.Dohoon') },
    ],
    AESPA: [
      { value: 'Karina', label: t('artists.Karina') },
      { value: 'Giselle', label: t('artists.Giselle') },
      { value: 'Ningning', label: t('artists.Ningning') },
      { value: 'Winter', label: t('artists.Winter') },
    ],
    IVE: [
      { value: 'Leeseo', label: t('artists.Leeseo') },
      { value: 'Liz', label: t('artists.Liz') },
      { value: 'Yujin', label: t('artists.Yujin') },
      { value: 'Gaeul', label: t('artists.Gaeul') },
      { value: 'Wonyoung', label: t('artists.Wonyoung') },
      { value: 'Rei', label: t('artists.Rei') },
    ],
    'Le Sserafim': [
      { value: 'KimChaewon', label: t('artists.KimChaewon') },
      { value: 'HuhYunjin', label: t('artists.HuhYunjin') },
      { value: 'KAZUHA', label: t('artists.KAZUHA') },
      { value: 'SAKURA', label: t('artists.SAKURA') },
      { value: 'HONGEUNCHAE', label: t('artists.HONGEUNCHAE') },
    ],
    SOLO: [
      { value: 'IU', label: t('artists.IU') },
      { value: 'Backyerin', label: t('artists.Backyerin') },
      { value: 'ArianaGrande', label: t('artists.ArianaGrande') },
      { value: 'Trump', label: t('artists.Trump') },
    ],
  };

  const handleNext = () => {
    if (!selectedGroup || !selectedArtist) {
      alert(t('butterCover.artistSelection.selectGroupAndArtistError'));
      return;
    }

    onNext({
      group: selectedGroup,
      artist: selectedArtist,
    });
  };

  const handleGroupChange = (value: string) => {
    setSelectedGroup(value);
    setSelectedArtist('');
  };

  const availableArtists = selectedGroup
    ? artistMembers[selectedGroup as keyof typeof artistMembers] || []
    : [];

  return (
    <div className="flex flex-col items-center justify-center flex-1 sm:px-6 py-6 sm:py-8">
      <div className="w-full max-w-lg space-y-6 sm:space-y-8">
        <div className="space-y-6">
          <div>
            <label className="block text-white text-base sm:text-lg font-medium mb-3 sm:mb-4">
              {t('butterCover.artistSelection.artistGroup')}
            </label>
            <CustomDropdown
              value={selectedGroup}
              onChange={handleGroupChange}
              placeholder={t(
                'butterCover.artistSelection.selectGroupPlaceholder'
              )}
              options={artistGroups}
              width="w-full"
            />
          </div>

          <div>
            <label className="block text-white text-base sm:text-lg font-medium mb-3 sm:mb-4">
              {t('butterCover.artistSelection.artistSelection')}
            </label>
            <CustomDropdown
              value={selectedArtist}
              onChange={setSelectedArtist}
              placeholder={
                selectedGroup
                  ? t('butterCover.artistSelection.selectArtistPlaceholder')
                  : t('butterCover.artistSelection.selectGroupFirstPlaceholder')
              }
              options={availableArtists}
              width="w-full"
            />
          </div>
        </div>

        <div className="pt-4">
          <StudioButton
            text={t('butterCover.artistSelection.nextStep')}
            onClick={handleNext}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
