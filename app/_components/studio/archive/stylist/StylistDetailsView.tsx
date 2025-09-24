import { StylistDetails } from '@/types/task';
import { Scissors, FileText, Image as ImageIcon, Palette } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import InfoCard from '../ui/InfoCard';
import ParameterBadge from '../ui/ParameterBadge';
import ImageDisplayCard from '../ui/ImageDisplayCard';
import DetailsModal from '../ui/DetailsModal';

interface Props {
  details?: StylistDetails;
  onClose?: () => void;
}

export default function StylistDetailsView({ details, onClose }: Props) {
  const { t } = useTranslation(['studio']);

  if (!details) {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-studio-text-muted">{t('stylist.details.cannotLoadDetails')}</p>
      </div>
    );
  }

  const getReferenceImages = () => {
    const references = [];

    if (details.request.hairStyleImageUrl) {
      references.push({
        url: details.request.hairStyleImageUrl,
        label: t('stylist.details.hairstyle'),
        key: 'hair',
      });
    }

    if (details.request.outfitImageUrl) {
      references.push({
        url: details.request.outfitImageUrl,
        label: t('stylist.details.outfit'),
        key: 'outfit',
      });
    }

    if (details.request.backgroundImageUrl) {
      references.push({
        url: details.request.backgroundImageUrl,
        label: t('stylist.details.background'),
        key: 'background',
      });
    }

    if (details.request.accessoryImageUrl) {
      references.push({
        url: details.request.accessoryImageUrl,
        label: t('stylist.details.accessory'),
        key: 'accessory',
      });
    }

    if (details.request.moodImageUrl) {
      references.push({
        url: details.request.moodImageUrl,
        label: t('stylist.details.mood'),
        key: 'mood',
      });
    }

    return references;
  };

  const referenceImages = getReferenceImages();

  const content = (
    <div className="text-studio-text-primary">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-studio-button-primary rounded-lg">
            <Scissors className="h-5 w-5 text-studio-header" />
          </div>
          <h3 className="text-xl font-semibold">{t('stylist.details.creationTitle')}</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <ParameterBadge
            label={t('stylist.details.referenceImages')}
            value={`${referenceImages.length}`}
            variant="accent"
          />
        </div>
      </div>

      {/* Main Content - Grid Layout */}
      <div className="space-y-6">
        {/* Original and Result Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Original Image */}
          {details.request.idolImageUrl && (
            <ImageDisplayCard
              title={t('stylist.details.originalImage')}
              subtitle={t('stylist.details.originalImageSubtitle')}
              imageUrl={details.request.idolImageUrl}
              alt={t('stylist.details.originalImageSubtitle')}
            />
          )}

          {/* Result Image */}
          {details.result?.imageUrl && (
            <ImageDisplayCard
              title={t('stylist.details.generatedResult')}
              subtitle={t('stylist.details.styledResult')}
              imageUrl={details.result.imageUrl}
              alt={t('stylist.details.styledResult')}
            />
          )}
        </div>

        {/* Reference Images Grid */}
        {referenceImages.length > 0 && (
          <InfoCard title={t('stylist.details.referenceImagesUsed')}>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {referenceImages.map((ref) => (
                <div key={ref.key} className="bg-studio-border rounded-lg p-2">
                  <div className="mb-2">
                    <span className="text-xs font-medium text-studio-text-secondary flex items-center gap-1">
                      <ImageIcon className="h-3 w-3" />
                      {ref.label}
                    </span>
                  </div>
                  <img
                    src={ref.url}
                    alt={ref.label}
                    className="w-full h-20 object-cover rounded-md"
                  />
                </div>
              ))}
            </div>
          </InfoCard>
        )}
      </div>

      {/* Error State */}
      {details.error && (
        <div className="mt-6">
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
            <h4 className="text-red-400 font-medium mb-2">{t('stylist.details.generationFailed')}</h4>
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
