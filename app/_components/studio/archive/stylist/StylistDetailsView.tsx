import { Task, StylistResponse } from '@/types/task';
import { Scissors } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ImageDisplayCard from '../ui/ImageDisplayCard';
import DetailsModal from '../ui/DetailsModal';

interface Props {
  task?: Task & { actionType: 'STYLIST' | 'STYLIST_EDIT' };
  details?: StylistResponse; // For backward compatibility
  onClose?: () => void;
}

export default function StylistDetailsView({ task, details, onClose }: Props) {
  const { t } = useTranslation(['studio']);

  // Use the new task structure or fall back to old details prop
  const result = task?.stylist || details;
  const error = task?.error;

  if (!result && task?.status !== 'PENDING' && task?.status !== 'PROCESSING') {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-studio-text-muted">
          {t('stylist.details.cannotLoadDetails')}
        </p>
      </div>
    );
  }

  const content = (
    <div className="text-studio-text-primary">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-studio-button-primary rounded-lg">
            <Scissors className="h-5 w-5 text-studio-header" />
          </div>
          <h3 className="text-xl font-semibold">
            {t('stylist.details.creationTitle')}
          </h3>
        </div>
      </div>

      {/* Main Content */}
      {result && (
        <div className="grid grid-cols-1 gap-6">
          {/* Before/After Comparison */}
          {result.requestImageUrl ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Request Image */}
              <ImageDisplayCard
                title={t('stylist.details.originalImage')}
                subtitle={t('stylist.details.uploadedIdolImage')}
                imageUrl={result.requestImageUrl}
                alt={t('stylist.details.originalImageAlt')}
                downloadFilename={`original-${result.filename || `stylist-${Date.now()}.png`}`}
              />

              {/* Result Image */}
              <ImageDisplayCard
                title={t('stylist.details.generatedResult')}
                subtitle={t('stylist.details.styledResult')}
                imageUrl={result.imageUrl}
                alt={t('stylist.details.styledResult')}
                downloadFilename={
                  result.filename || `stylist-${Date.now()}.png`
                }
              />
            </div>
          ) : (
            /* Result Only (for backward compatibility) */
            <ImageDisplayCard
              title={t('stylist.details.generatedResult')}
              subtitle={t('stylist.details.styledResult')}
              imageUrl={result.imageUrl}
              alt={t('stylist.details.styledResult')}
              downloadFilename={result.filename || `stylist-${Date.now()}.png`}
            />
          )}

          {/* Reference Images Grid */}
          {(result.hairStyleImageUrl ||
            result.outfitImageUrl ||
            result.backgroundImageUrl ||
            result.accessoryImageUrl ||
            result.moodImageUrl) && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-studio-text-primary">
                {t('stylist.details.referenceImages')}
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {result.hairStyleImageUrl && (
                  <div className="bg-studio-bg-secondary rounded-lg border border-studio-border overflow-hidden">
                    <img
                      src={result.hairStyleImageUrl}
                      alt={t('stylist.details.hairStyle')}
                      className="w-full aspect-square object-cover"
                    />
                    <div className="p-2 text-xs text-studio-text-secondary text-center">
                      {t('stylist.details.hairStyle')}
                    </div>
                  </div>
                )}
                {result.outfitImageUrl && (
                  <div className="bg-studio-bg-secondary rounded-lg border border-studio-border overflow-hidden">
                    <img
                      src={result.outfitImageUrl}
                      alt={t('stylist.details.outfit')}
                      className="w-full aspect-square object-cover"
                    />
                    <div className="p-2 text-xs text-studio-text-secondary text-center">
                      {t('stylist.details.outfit')}
                    </div>
                  </div>
                )}
                {result.backgroundImageUrl && (
                  <div className="bg-studio-bg-secondary rounded-lg border border-studio-border overflow-hidden">
                    <img
                      src={result.backgroundImageUrl}
                      alt={t('stylist.details.background')}
                      className="w-full aspect-square object-cover"
                    />
                    <div className="p-2 text-xs text-studio-text-secondary text-center">
                      {t('stylist.details.background')}
                    </div>
                  </div>
                )}
                {result.accessoryImageUrl && (
                  <div className="bg-studio-bg-secondary rounded-lg border border-studio-border overflow-hidden">
                    <img
                      src={result.accessoryImageUrl}
                      alt={t('stylist.details.accessory')}
                      className="w-full aspect-square object-cover"
                    />
                    <div className="p-2 text-xs text-studio-text-secondary text-center">
                      {t('stylist.details.accessory')}
                    </div>
                  </div>
                )}
                {result.moodImageUrl && (
                  <div className="bg-studio-bg-secondary rounded-lg border border-studio-border overflow-hidden">
                    <img
                      src={result.moodImageUrl}
                      alt={t('stylist.details.mood')}
                      className="w-full aspect-square object-cover"
                    />
                    <div className="p-2 text-xs text-studio-text-secondary text-center">
                      {t('stylist.details.mood')}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

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
              {t('stylist.details.processing')}
            </p>
          </div>
        )}

      {/* Error State */}
      {error && (
        <div className="mt-6">
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
            <h4 className="text-red-400 font-medium mb-2">
              {t('stylist.details.generationFailed')}
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
