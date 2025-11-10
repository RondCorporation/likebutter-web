import { Task, FanmeetingStudioResponse } from '@/types/task';
import { Users, Edit } from 'lucide-react';
import ImageDisplayCard from '../ui/ImageDisplayCard';
import DetailsModal from '../ui/DetailsModal';
import { useTranslation } from 'react-i18next';

interface Props {
  task?: Task & { actionType: 'FANMEETING_STUDIO' | 'FANMEETING_STUDIO_EDIT' };
  details?: FanmeetingStudioResponse; // For backward compatibility
  onClose?: () => void;
  onEdit?: () => void;
}

export default function FanmeetingStudioDetailsView({
  task,
  details,
  onClose,
  onEdit,
}: Props) {
  const { t } = useTranslation(['studio']);

  // Use the new task structure or fall back to old details prop
  const result = task?.fanmeetingStudio || details;
  const error = task?.error;

  if (!result && task?.status !== 'PENDING' && task?.status !== 'PROCESSING') {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-studio-text-muted">
          {t('fanmeeting.details.detailsNotAvailable')}
        </p>
      </div>
    );
  }

  const content = (
    <div className="text-studio-text-primary">
      {/* Main Content */}
      {result && (
        <div className="grid grid-cols-1 gap-6">
          {/* Input Images (2 people) */}
          {(result.requestImage1Url || result.requestImage2Url) && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-studio-text-primary">
                {t('fanmeeting.details.inputImages')}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {result.requestImage1Url && (
                  <ImageDisplayCard
                    title={t('fanmeeting.details.person1')}
                    subtitle={t('fanmeeting.details.firstPerson')}
                    imageUrl={result.requestImage1Url}
                    alt={t('fanmeeting.details.person1Alt')}
                    downloadFilename={`person1-${result.filename || `fanmeeting-${Date.now()}.png`}`}
                  />
                )}
                {result.requestImage2Url && (
                  <ImageDisplayCard
                    title={t('fanmeeting.details.person2')}
                    subtitle={t('fanmeeting.details.secondPerson')}
                    imageUrl={result.requestImage2Url}
                    alt={t('fanmeeting.details.person2Alt')}
                    downloadFilename={`person2-${result.filename || `fanmeeting-${Date.now()}.png`}`}
                  />
                )}
              </div>
            </div>
          )}

          {/* Result Image */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-studio-text-primary">
              {t('fanmeeting.details.composedResult')}
            </h4>
            <ImageDisplayCard
              title={t('fanmeeting.details.generatedScene')}
              subtitle={t('fanmeeting.details.generatedSceneSubtitle')}
              imageUrl={result.imageUrl}
              downloadUrl={result.downloadUrl}
              alt={t('fanmeeting.details.generatedSceneAlt')}
              downloadFilename={
                result.filename || `fanmeeting-${Date.now()}.png`
              }
            />
          </div>

          {/* File Info */}
          {result.fileSize && (
            <div className="text-sm text-studio-text-secondary space-y-1">
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
              {t('fanmeeting.details.processing')}
            </p>
          </div>
        )}

      {/* Error State */}
      {error && (
        <div className="mt-6">
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
            <h4 className="text-red-400 font-medium mb-2">
              {t('fanmeeting.details.generationFailed')}
            </h4>
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        </div>
      )}
    </div>
  );

  return onClose ? (
    <DetailsModal
      title={t('fanmeeting.details.title')}
      onClose={onClose}
      onEdit={onEdit}
      showEditButton={!!result}
    >
      {content}
    </DetailsModal>
  ) : (
    content
  );
}
