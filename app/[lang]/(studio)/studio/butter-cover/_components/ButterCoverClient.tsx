'use client';

import { useState } from 'react';
import StepNavigation from './StepNavigation';
import ArtistSelection from './ArtistSelection';
import MusicUpload from './MusicUpload';
import StudioButton from '@/app/[lang]/(studio)/studio/_components/ui/StudioButton';
import { createButterCoverTask } from '@/app/_lib/apis/task.api';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useTaskPolling } from '@/app/_hooks/useTaskPolling';
import { ButterCoverDetails } from '@/app/_types/task';
import { Download, Play, Pause, Volume2 } from 'lucide-react';

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
  const [resultAudioUrl, setResultAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(
    null
  );
  const router = useRouter();

  const {
    taskData,
    isPolling,
    isBackgroundProcessing,
    error: pollingError,
    startPolling,
    checkTaskStatus,
    currentTaskId,
  } = useTaskPolling({
    onCompleted: (result) => {
      const details = result.details as ButterCoverDetails;
      if (details?.result?.audioKey) {
        const audioUrl = `/api/audio/${details.result.audioKey}`;
        setResultAudioUrl(audioUrl);
        toast.success('AI 커버가 생성되었습니다!');
      }
      setIsLoading(false);
    },
    onFailed: () => {
      toast.error('AI 커버 생성에 실패했습니다.');
      setIsLoading(false);
    },
  });

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
    setResultAudioUrl(null);

    try {
      const voiceModel = artistData.customArtist || artistData.artist;
      const response = await createButterCoverTask(data.file, {
        voiceModel,
        pitchAdjust: data.pitch,
        outputFormat: data.format,
      });

      if ((response as any).isInsufficientCredit) {
        setCurrentStep(2);
        setIsLoading(false);
        return;
      }

      if (response.status === 200 && response.data) {
        toast.success('음원 생성이 시작되었습니다!');

        startPolling(response.data.taskId);
      } else {
        throw new Error(response.msg || '음원 생성에 실패했습니다.');
      }
    } catch (error: any) {
      console.error('Music generation failed:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : '음원 생성에 실패했습니다. 다시 시도해주세요.';
      toast.error(errorMessage);
      setCurrentStep(2);
      setIsLoading(false);
    }
  };

  const handlePlayPause = () => {
    if (!resultAudioUrl) return;

    if (!audioElement) {
      const audio = new Audio(resultAudioUrl);
      audio.addEventListener('ended', () => setIsPlaying(false));
      audio.addEventListener('error', () => {
        toast.error('오디오 재생에 실패했습니다.');
        setIsPlaying(false);
      });
      setAudioElement(audio);
      audio.play();
      setIsPlaying(true);
    } else {
      if (isPlaying) {
        audioElement.pause();
        setIsPlaying(false);
      } else {
        audioElement.play();
        setIsPlaying(true);
      }
    }
  };

  const handleDownload = async () => {
    if (!resultAudioUrl) return;

    try {
      const response = await fetch(resultAudioUrl);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `butter-cover-${Date.now()}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('음원이 다운로드되었습니다!');
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('다운로드에 실패했습니다.');
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
          <div className="flex flex-col items-center justify-center flex-1 min-h-0 px-6 py-12">
            <div className="text-center space-y-10 max-w-md mx-auto">
              {isLoading || isPolling ? (
                <div className="space-y-8">
                  <div className="w-24 h-24 border-4 border-butter-yellow border-t-transparent rounded-full animate-spin mx-auto" />
                  <div className="space-y-4">
                    <h2 className="text-2xl font-medium text-white">
                      AI 커버를 생성하고 있습니다...
                    </h2>
                    <p className="text-slate-400 text-lg leading-relaxed">
                      잠시만 기다려주세요. 평균 7-20분 정도 소요됩니다.
                    </p>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      생성이 완료되면 이 화면에서 바로 들으실 수 있습니다.
                    </p>
                  </div>
                </div>
              ) : isBackgroundProcessing ? (
                <div className="space-y-8">
                  <div className="space-y-4 text-center">
                    <h2 className="text-2xl font-medium text-blue-400">
                      백그라운드에서 처리 중
                    </h2>
                    <p className="text-slate-400 text-lg leading-relaxed max-w-[300px] mx-auto">
                      작업이 오래 걸리고 있어요. 백그라운드에서 처리 중입니다.
                    </p>
                    <button
                      onClick={() =>
                        currentTaskId && checkTaskStatus(currentTaskId)
                      }
                      className="mt-4 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      상태 확인
                    </button>
                  </div>
                </div>
              ) : resultAudioUrl ? (
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h2 className="text-2xl font-medium text-white">
                      🎵 AI 커버가 완성되었습니다!
                    </h2>
                    <p className="text-slate-400 text-lg leading-relaxed">
                      생성된 음원을 바로 들어보세요
                    </p>
                  </div>

                  {/* 오디오 플레이어 */}
                  <div className="bg-studio-border rounded-2xl p-6 space-y-4">
                    <div className="flex items-center justify-center space-x-4">
                      <button
                        onClick={handlePlayPause}
                        className="w-16 h-16 bg-butter-yellow hover:bg-[#f7c80d] rounded-full flex items-center justify-center transition-colors"
                      >
                        {isPlaying ? (
                          <Pause className="w-8 h-8 text-black" />
                        ) : (
                          <Play className="w-8 h-8 text-black ml-1" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-center space-x-2 text-slate-400">
                      <Volume2 className="w-4 h-4" />
                      <span className="text-sm">AI 커버 음원</span>
                    </div>
                  </div>
                </div>
              ) : pollingError ? (
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h2 className="text-2xl font-medium text-red-400">
                      생성에 실패했습니다
                    </h2>
                    <p className="text-slate-400 text-lg leading-relaxed">
                      {pollingError}
                    </p>
                  </div>
                </div>
              ) : null}

              <div className="w-full max-w-sm space-y-3">
                {resultAudioUrl && (
                  <StudioButton
                    text="음원 다운로드"
                    onClick={handleDownload}
                    className="w-full h-12"
                    icon={<Download className="w-4 h-4 text-black" />}
                  />
                )}
                <StudioButton
                  text="보관함으로 가기"
                  onClick={() => router.push('/studio/archive')}
                  className="w-full h-12"
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
