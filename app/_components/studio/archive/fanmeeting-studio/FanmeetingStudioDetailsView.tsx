import { FanmeetingStudioDetails } from '@/types/task';
import { Users, Camera, MapPin, Heart } from 'lucide-react';
import InfoCard from '../ui/InfoCard';
import ParameterBadge from '../ui/ParameterBadge';
import ImageDisplayCard from '../ui/ImageDisplayCard';
import DetailsModal from '../ui/DetailsModal';
import { useTranslation } from 'react-i18next';

interface Props {
  details?: FanmeetingStudioDetails;
  onClose?: () => void;
}

export default function FanmeetingStudioDetailsView({
  details,
  onClose,
}: Props) {
  const { t } = useTranslation('studio');
  if (!details) {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-studio-text-muted">
          {t('fanmeeting.details.detailsNotAvailable')}
        </p>
      </div>
    );
  }

  const content = (
    <div className="bg-studio-sidebar border border-studio-border rounded-xl p-6 text-studio-text-primary">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-studio-button-primary rounded-lg">
            <Users className="h-5 w-5 text-studio-header" />
          </div>
          <h3 className="text-xl font-semibold">
            {t('fanmeeting.details.title')}
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <ParameterBadge
            label={t('fanmeeting.details.mode')}
            value={t('fanmeeting.details.sceneGeneration')}
            variant="accent"
          />
        </div>
      </div>

      {/* Main Content - 3 Column Layout */}
      <div className="space-y-6">
        {/* Source Images Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Fan Image */}
          {details.request.fanImageUrl && (
            <ImageDisplayCard
              title={t('fanmeeting.details.fanImage')}
              subtitle={t('fanmeeting.details.fanSubtitle')}
              imageUrl={details.request.fanImageUrl}
              alt={t('fanmeeting.details.fanImageAlt')}
              imageClassName="h-48 object-cover"
            />
          )}

          {/* Idol Image */}
          {details.request.idolImageUrl && (
            <ImageDisplayCard
              title={t('fanmeeting.details.idolImage')}
              subtitle={t('fanmeeting.details.idolSubtitle')}
              imageUrl={details.request.idolImageUrl}
              alt={t('fanmeeting.details.idolImageAlt')}
              imageClassName="h-48 object-cover"
            />
          )}

          {/* Result Preview or Placeholder */}
          {details.result?.imageUrl ? (
            <ImageDisplayCard
              title={t('fanmeeting.details.generatedScene')}
              subtitle={t('fanmeeting.details.generatedSceneSubtitle')}
              imageUrl={details.result.imageUrl}
              alt={t('fanmeeting.details.generatedSceneAlt')}
              imageClassName="h-48 object-contain"
            />
          ) : (
            <div className="bg-studio-sidebar border border-studio-border rounded-xl p-4">
              <h4 className="text-sm font-medium text-studio-text-primary mb-3">
                {t('fanmeeting.details.waitingForResult')}
              </h4>
              <div className="bg-studio-border rounded-lg p-3 h-48 flex items-center justify-center">
                <div className="text-center">
                  <Camera className="h-8 w-8 text-studio-text-secondary mx-auto mb-2" />
                  <span className="text-sm text-studio-text-secondary">
                    {t('fanmeeting.details.sceneGenerationScheduled')}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Full Result Image (if exists) */}
        {details.result?.imageUrl && (
          <InfoCard title={t('fanmeeting.details.fullGeneratedScene')}>
            <div className="bg-studio-border rounded-lg p-3">
              <img
                src={details.result.imageUrl}
                alt={t('fanmeeting.details.generatedSceneAlt')}
                className="w-full h-auto max-h-[400px] object-contain rounded-md"
              />
            </div>
          </InfoCard>
        )}
      </div>

      {/* Error State */}
      {details.error && (
        <div className="mt-6">
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
            <h4 className="text-red-400 font-medium mb-2">
              {t('fanmeeting.details.generationFailed')}
            </h4>
            <p className="text-red-300 text-sm">{details.error}</p>
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
