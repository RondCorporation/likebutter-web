'use client';

import { useState } from 'react';
import StepNavigation from './StepNavigation';
import ArtistSelection from './ArtistSelection';
import MusicUpload from './MusicUpload';
import StudioButton from '@/app/[lang]/(studio)/studio/_components/ui/StudioButton';
import { createButterCoverTask } from '@/app/_lib/apis/task.api';
import { useRouter } from 'next/navigation';

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
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleArtistNext = (data: ArtistData) => {
    setArtistData(data);
    setCurrentStep(2);
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleMusicGenerate = async (data: MusicData) => {
    if (!artistData) return;

    setCurrentStep(3);
    setIsLoading(true);

    try {
      // 실제 API 호출
      const voiceModel = artistData.customArtist || artistData.artist;
      const response = await createButterCoverTask(data.file, {
        voiceModel,
        pitchAdjust: data.pitch,
        outputFormat: data.format,
      });

      if (response.status === 200) {
        // 생성 완료 후 보관함으로 이동 // todo: 음원생성으로 이동해서 원형 프로그레스 로딩
        router.push('/studio/archive');
      } else {
        throw new Error(response.msg || '음원 생성에 실패했습니다.');
      }
    } catch (error) {
      console.error('Music generation failed:', error);
      alert(
        error instanceof Error
          ? error.message
          : '음원 생성에 실패했습니다. 다시 시도해주세요.'
      );
      setCurrentStep(2);
    } finally {
      setIsLoading(false);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <ArtistSelection onNext={handleArtistNext} />;
      case 2:
        return (
          <MusicUpload
            onGenerate={handleMusicGenerate}
            onPrevious={handlePrevious}
          />
        );
      case 3:
        return (
          <div className="flex flex-col items-center justify-center flex-1 px-6 py-8">
            <div className="text-center space-y-8">
              <div className="space-y-6">
                <div className="w-20 h-20 border-4 border-butter-yellow border-t-transparent rounded-full animate-spin mx-auto" />
                <div className="space-y-3">
                  <h2 className="text-2xl font-medium text-white">
                    AI 커버를 생성하고 있습니다...
                  </h2>
                  <p className="text-slate-400 text-lg">
                    잠시만 기다려주세요. 평균 7-20분 정도 소요됩니다.
                  </p>
                  <p className="text-slate-300 text-sm">
                    생성이 완료되면 보관함에서 확인하실 수 있습니다.
                  </p>
                </div>
              </div>

              <div className="w-full max-w-xs">
                <StudioButton
                  text="보관함으로 가기"
                  onClick={() => router.push('/studio/archive')}
                  className="w-full"
                />
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
