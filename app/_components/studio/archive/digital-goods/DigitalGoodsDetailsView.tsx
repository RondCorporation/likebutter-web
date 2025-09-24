import { DigitalGoodsDetails } from '@/types/task';
import { Palette, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import InfoCard from '../ui/InfoCard';
import ParameterBadge from '../ui/ParameterBadge';
import ImageDisplayCard from '../ui/ImageDisplayCard';
import DetailsModal from '../ui/DetailsModal';

interface Props {
  details?: DigitalGoodsDetails;
  onClose?: () => void;
}

export default function DigitalGoodsDetailsView({ details, onClose }: Props) {
  const { t } = useTranslation(['studio']);

  if (!details) {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-studio-text-muted">{t('digitalGoods.details.cannotLoadDetails')}</p>
      </div>
    );
  }

  const getStyleName = (style: string) => {
    return t(`digitalGoods.styles.${style}`) || style;
  };

  const content = (
    <div className="text-studio-text-primary">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-studio-button-primary rounded-lg">
            <Palette className="h-5 w-5 text-studio-header" />
          </div>
          <h3 className="text-xl font-semibold">{t('digitalGoods.details.creationTitle')}</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {details.request.style && (
            <ParameterBadge
              label={t('digitalGoods.details.styleLabel')}
              value={getStyleName(details.request.style)}
              variant="accent"
            />
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Before Image */}
        {details.request.imageUrl && (
          <ImageDisplayCard
            title={t('digitalGoods.details.originalImage')}
            subtitle={t('digitalGoods.details.originalImageSubtitle')}
            imageUrl={details.request.imageUrl}
            alt={t('digitalGoods.details.originalImageSubtitle')}
          />
        )}

        {/* After Image */}
        {details.result?.imageUrl && (
          <ImageDisplayCard
            title={t('digitalGoods.details.generatedResult')}
            subtitle={t('digitalGoods.details.generatedResultSubtitle', { style: getStyleName(details.request.style) })}
            imageUrl={details.result.imageUrl}
            alt={t('digitalGoods.details.generatedGoods')}
            downloadFilename={`digital-goods-${Date.now()}.png`}
          />
        )}
      </div>

      {/* Error State */}
      {details.error && (
        <div className="mt-6">
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
            <h4 className="text-red-400 font-medium mb-2">{t('digitalGoods.details.generationFailed')}</h4>
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
