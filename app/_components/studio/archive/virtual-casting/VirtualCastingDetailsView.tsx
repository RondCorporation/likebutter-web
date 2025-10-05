import { VirtualCastingDetails } from '@/types/task';
import { Wand2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ImageDisplayCard from '../ui/ImageDisplayCard';
import DetailsModal from '../ui/DetailsModal';

interface Props {
  details?: VirtualCastingDetails;
  onClose?: () => void;
}

export default function VirtualCastingDetailsView({ details, onClose }: Props) {
  const { t } = useTranslation(['studio']);

  if (!details) {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-studio-text-muted">
          {t('virtualCasting.detailsNotAvailable')}
        </p>
      </div>
    );
  }

  const getCharacterName = (style: string) => {
    try {
      return t(`virtualCasting.styles.${style}`);
    } catch {
      return style;
    }
  };

  const content = (
    <div className="text-studio-text-primary">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-studio-button-primary rounded-lg">
            <Wand2 className="h-5 w-5 text-studio-header" />
          </div>
          <h3 className="text-xl font-semibold">{t('virtualCasting.title')}</h3>
        </div>
      </div>

      {/* Main Content - Side by Side Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Before Image */}
        {details.request.idolImageUrl && (
          <ImageDisplayCard
            title={t('virtualCasting.originalImage')}
            subtitle={t('virtualCasting.originalImageSubtitle')}
            imageUrl={details.request.idolImageUrl}
            alt={t('virtualCasting.originalImageAlt')}
          />
        )}

        {/* After Image */}
        {details.result?.imageUrl && (
          <ImageDisplayCard
            title={t('virtualCasting.transformedResult')}
            subtitle={t('virtualCasting.transformedSubtitle', {
              character: getCharacterName(details.request.style),
            })}
            imageUrl={details.result.imageUrl}
            alt={t('virtualCasting.transformedImageAlt')}
          />
        )}
      </div>

      {/* Error State */}
      {details.error && (
        <div className="mt-6">
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
            <h4 className="text-red-400 font-medium mb-2">
              {t('virtualCasting.transformFailed')}
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
