import { Task, VideoGenerationResponse } from '@/types/task';
import { Download, Play } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import DetailsModal from '../ui/DetailsModal';
import { downloadFile } from '@/app/_utils/download';
import { useState, useRef } from 'react';
import toast from 'react-hot-toast';

interface Props {
  task?: Task & { actionType: 'VIDEO_GENERATION' };
  details?: VideoGenerationResponse;
  onClose?: () => void;
}

export default function VideoGenerationDetailsView({
  task,
  details,
  onClose,
}: Props) {
  const { t } = useTranslation(['studio', 'common']);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const result = task?.videoGeneration || details;
  const error = task?.error;

  const handleDownload = async () => {
    const downloadUrl = result?.downloadUrl || result?.videoUrl;
    if (!downloadUrl) return;

    try {
      await downloadFile(
        downloadUrl,
        result?.filename || `video-generation-${Date.now()}.mp4`
      );
      toast.success(t('common:downloadComplete'));
    } catch (err) {
      console.error('Download failed:', err);
      toast.error(t('common:downloadFailed'));
    }
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  if (!result && task?.status !== 'PENDING' && task?.status !== 'PROCESSING') {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-studio-text-muted">
          {t('studio:videoGeneration.details.cannotLoadDetails', 'Cannot load details')}
        </p>
      </div>
    );
  }

  const content = (
    <div className="text-studio-text-primary">
      {result && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.requestImageUrl && (
              <div className="bg-studio-card rounded-xl p-4">
                <h4 className="text-sm font-medium text-studio-text-secondary mb-3">
                  {t('studio:videoGeneration.details.originalImage', 'Original Image')}
                </h4>
                <div className="relative aspect-square rounded-lg overflow-hidden bg-black/20">
                  <img
                    src={result.requestImageUrl}
                    alt="Original"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            )}

            <div className="bg-studio-card rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-studio-text-secondary">
                  {t('studio:videoGeneration.details.generatedVideo', 'Generated Video')}
                </h4>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-accent/20 hover:bg-accent/30 text-accent rounded-lg text-sm transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>{t('common:download', 'Download')}</span>
                </button>
              </div>
              <div className="relative aspect-square rounded-lg overflow-hidden bg-black/20">
                <video
                  ref={videoRef}
                  src={result.videoUrl}
                  className="w-full h-full object-contain"
                  controls
                  loop
                  playsInline
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />
              </div>
            </div>
          </div>

          <div className="text-sm text-studio-text-secondary space-y-1">
            {result.duration && (
              <p>
                {t('studio:videoGeneration.details.duration', 'Duration')}: {result.duration}s
              </p>
            )}
            {result.fileSize && (
              <p>
                {t('common:fileSize', { size: (result.fileSize / 1024 / 1024).toFixed(2) })}
              </p>
            )}
            {result.executionTime && (
              <p>
                {t('common:executionTime', { time: result.executionTime.toFixed(1) })}
              </p>
            )}
          </div>
        </div>
      )}

      {!result &&
        (task?.status === 'PENDING' || task?.status === 'PROCESSING') && (
          <div className="flex items-center justify-center h-40">
            <p className="text-studio-text-muted">
              {t('studio:videoGeneration.details.processing', 'Video is being generated...')}
            </p>
          </div>
        )}

      {error && (
        <div className="mt-6">
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
            <h4 className="text-red-400 font-medium mb-2">
              {t('studio:videoGeneration.details.generationFailed', 'Generation Failed')}
            </h4>
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        </div>
      )}
    </div>
  );

  return onClose ? (
    <DetailsModal
      title={t('studio:videoGeneration.details.title', 'Video Generation')}
      onClose={onClose}
      showEditButton={false}
    >
      {content}
    </DetailsModal>
  ) : (
    content
  );
}
