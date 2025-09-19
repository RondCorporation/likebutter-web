'use client';

import { useState } from 'react';
import StepNavigation from './StepNavigation';
import ArtistSelection from './ArtistSelection';
import MusicUpload from './MusicUpload';

interface ButterCoverClientProps {
  dictionary?: any;
}

interface ArtistData {
  group: string;
  artist: string;
  customArtist?: string;
}

interface MusicData {
  file: File;
  pitch: number;
  format: 'mp3' | 'wav';
}

export default function ButterCoverClient({}: ButterCoverClientProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [artistData, setArtistData] = useState<ArtistData | null>(null);

  const handleArtistNext = (data: ArtistData) => {
    setArtistData(data);
    setCurrentStep(2);
  };

  const handleMusicGenerate = async (data: MusicData) => {
    if (!artistData) return;

    setCurrentStep(3);

    try {
      // TODO: API 연동 - 음악 생성 요청
      console.log('Generating music with:', {
        artist: artistData,
        music: data,
      });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // TODO: 실제 구현에서는 성공/실패 처리
      alert('음원 생성이 완료되었습니다!');
    } catch (error) {
      console.error('Music generation failed:', error);
      alert('음원 생성에 실패했습니다. 다시 시도해주세요.');
      setCurrentStep(2);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <ArtistSelection onNext={handleArtistNext} />;
      case 2:
        return <MusicUpload onGenerate={handleMusicGenerate} />;
      case 3:
        return (
          <div className="flex flex-col items-center justify-center flex-1 px-6 py-8">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 border-4 border-butter-yellow border-t-transparent rounded-full animate-spin mx-auto" />
              <div className="space-y-3">
                <h2 className="text-2xl font-medium text-white">
                  음원을 생성하고 있습니다...
                </h2>
                <p className="text-slate-400 text-lg">
                  잠시만 기다려주세요. 최고 품질의 음원을 만들어드리고 있어요.
                </p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col flex-1 h-full bg-studio-content">
      <div className="container mx-auto px-4">
        <StepNavigation currentStep={currentStep} />
        <div className="flex-1">{renderCurrentStep()}</div>
      </div>
    </div>
  );
}
