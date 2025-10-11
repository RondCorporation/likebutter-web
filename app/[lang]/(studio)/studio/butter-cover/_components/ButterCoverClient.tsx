'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import StepNavigation from './StepNavigation';
import ArtistSelection from './ArtistSelection';
import MusicUpload from './MusicUpload';
import StudioButton from '@/app/[lang]/(studio)/studio/_components/ui/StudioButton';
import { createButterCoverTask } from '@/app/_lib/apis/task.api';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useTaskPolling } from '@/app/_hooks/useTaskPolling';
import { Download, Play, Pause, Volume2 } from 'lucide-react';
import { useCreditStore } from '@/app/_stores/creditStore';
import { CREDIT_COSTS } from '@/app/_lib/apis/credit.api';

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
  const { t } = useTranslation(['studio']);
  const { deductCredit } = useCreditStore();
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
      if (result.actionType === 'BUTTER_COVER' && 'butterCover' in result) {
        const audioUrl = result.butterCover?.audioUrl;
        if (audioUrl) {
          setResultAudioUrl(audioUrl);
          toast.success(t('butterCover.messages.coverComplete'));
        }
      }
      setIsLoading(false);
    },
    onFailed: () => {
      toast.error(t('butterCover.messages.coverFailed'));
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
        // Deduct credit immediately for instant UI update
        deductCredit(CREDIT_COSTS.BUTTER_COVER);

        toast.success(t('butterCover.messages.requestSent'));

        startPolling(response.data.taskId);
      } else {
        throw new Error(response.msg || t('butterCover.generationFailed'));
      }
    } catch (error: any) {
      console.error('Music generation failed:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : t('butterCover.generationFailedRetry');
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
        toast.error(t('butterCover.messages.audioPlaybackFailed'));
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

      toast.success(t('butterCover.messages.downloadComplete'));
    } catch (error) {
      console.error('Download failed:', error);
      toast.error(t('butterCover.messages.downloadFailed'));
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
                    <h2 className="text-lg md:text-2xl font-medium text-white">
                      {t('butterCover.generatingCover')}
                    </h2>
                    <p className="text-slate-400 text-sm md:text-lg leading-relaxed">
                      {t('butterCover.generatingCoverWait')}
                    </p>
                    <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
                      {t('butterCover.generatingCoverListen')}
                    </p>
                  </div>
                </div>
              ) : isBackgroundProcessing ? (
                <div className="space-y-8">
                  <div className="space-y-4 text-center">
                    <h2 className="text-lg md:text-2xl font-medium text-blue-400">
                      {t('butterCover.backgroundProcessing')}
                    </h2>
                    <p className="text-slate-400 text-sm md:text-lg leading-relaxed max-w-[300px] mx-auto">
                      {t('butterCover.backgroundProcessingDescription')}
                    </p>
                    <button
                      onClick={() =>
                        currentTaskId && checkTaskStatus(currentTaskId)
                      }
                      className="mt-4 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      {t('butterCover.checkStatus')}
                    </button>
                  </div>
                </div>
              ) : resultAudioUrl ? (
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h2 className="text-lg md:text-2xl font-medium text-white">
                      {t('butterCover.coverCompleteTitle')}
                    </h2>
                    <p className="text-slate-400 text-sm md:text-lg leading-relaxed">
                      {t('butterCover.listenToCover')}
                    </p>
                  </div>

                  {/* Audio Player */}
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
                      <span className="text-sm">
                        {t('butterCover.aiCoverAudio')}
                      </span>
                    </div>
                  </div>
                </div>
              ) : pollingError ? (
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h2 className="text-lg md:text-2xl font-medium text-red-400">
                      {t('butterCover.generationFailedTitle')}
                    </h2>
                    <p className="text-slate-400 text-sm md:text-lg leading-relaxed">
                      {pollingError}
                    </p>
                  </div>
                </div>
              ) : null}

              <div className="w-full max-w-sm space-y-3">
                {resultAudioUrl && (
                  <StudioButton
                    text={t('butterCover.downloadAudio')}
                    onClick={handleDownload}
                    className="w-full h-12"
                    icon={<Download className="w-4 h-4 text-black" />}
                  />
                )}
                <StudioButton
                  text={t('butterCover.goToArchive')}
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
    <div className="flex flex-col flex-1 h-full bg-studio-content overflow-y-auto pb-28 md:pb-0">
      <div className="container mx-auto px-4">
        <StepNavigation currentStep={currentStep} />
        <div className="flex-1">{renderCurrentStep()}</div>
      </div>
    </div>
  );
}
