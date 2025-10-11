import { Task, ButterCoverResponse } from '@/types/task';
import { Music, Download, Headphones } from 'lucide-react';
import DetailsModal from '../ui/DetailsModal';
import { downloadFile } from '@/app/_utils/download';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  task?: Task & { actionType: 'BUTTER_COVER' };
  details?: ButterCoverResponse; // For backward compatibility
  onClose?: () => void;
}

export default function ButterCoverDetailsView({
  task,
  details,
  onClose,
}: Props) {
  const { t } = useTranslation('studio');
  const [isDownloading, setIsDownloading] = useState(false);

  // Use the new task structure or fall back to old details prop
  const result = task?.butterCover || details;
  const error = task?.error;

  if (!result && task?.status !== 'PENDING' && task?.status !== 'PROCESSING') {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-studio-text-muted">
          {t('butterCover.details.detailsNotAvailable')}
        </p>
      </div>
    );
  }

  const handleDownload = async (url: string, filename: string) => {
    if (isDownloading) return;

    setIsDownloading(true);
    try {
      await downloadFile(url, filename);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const content = (
    <div className="text-studio-text-primary">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-studio-button-primary rounded-lg">
            <Headphones className="h-5 w-5 text-studio-header" />
          </div>
          <h3 className="text-xl font-semibold">
            {t('butterCover.details.title')}
          </h3>
        </div>
      </div>

      {/* Main Content */}
      {result && (
        <div className="grid grid-cols-1 gap-6">
          {/* Audio Player and Download */}
          <div className="bg-studio-bg-secondary rounded-xl p-6 border border-studio-border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-studio-button-primary rounded-lg">
                  <Music className="h-5 w-5 text-studio-header" />
                </div>
                <div>
                  <h4 className="font-medium text-studio-text-primary">
                    {t('butterCover.details.generatedAudio')}
                  </h4>
                  <p className="text-sm text-studio-text-secondary">
                    {t('butterCover.details.generatedAudioSubtitle')}
                  </p>
                </div>
              </div>
              <button
                onClick={() =>
                  handleDownload(
                    result.audioUrl,
                    result.filename || `butter-cover-${Date.now()}.mp3`
                  )
                }
                disabled={isDownloading}
                className="p-2 bg-studio-button-primary hover:bg-studio-button-primary/80 disabled:opacity-50 rounded-lg transition-colors"
                title={t('butterCover.details.download')}
              >
                <Download className="h-4 w-4 text-studio-header" />
              </button>
            </div>

            {/* Audio Player */}
            <audio controls className="w-full" src={result.audioUrl}>
              Your browser does not support the audio element.
            </audio>
          </div>

          {/* File Info */}
          {result.fileSize && (
            <div className="text-sm text-studio-text-secondary">
              <p>
                {t('common.fileSize', {
                  size: (result.fileSize / 1024 / 1024).toFixed(2),
                })}
              </p>
              {result.executionTime && (
                <p>
                  {t('common.executionTime', {
                    time: result.executionTime.toFixed(1),
                  })}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Processing State */}
      {!result &&
        (task?.status === 'PENDING' || task?.status === 'PROCESSING') && (
          <div className="flex items-center justify-center h-40">
            <p className="text-studio-text-muted">
              {t('butterCover.details.processing')}
            </p>
          </div>
        )}

      {/* Error State */}
      {error && (
        <div className="mt-6">
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
            <h4 className="text-red-400 font-medium mb-2">
              {t('butterCover.details.generationFailed')}
            </h4>
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        </div>
      )}
    </div>
  );

  return onClose ? (
    <DetailsModal onClose={onClose}>{content}</DetailsModal>
  ) : (
    content
  );
}
