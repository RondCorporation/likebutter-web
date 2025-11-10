import { Task, DigitalGoodsResponse } from '@/types/task';
import { Palette, Edit } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ImageDisplayCard from '../ui/ImageDisplayCard';
import DetailsModal from '../ui/DetailsModal';

interface Props {
  task?: Task & { actionType: 'DIGITAL_GOODS' | 'DIGITAL_GOODS_EDIT' };
  details?: DigitalGoodsResponse; // For backward compatibility
  onClose?: () => void;
  onEdit?: () => void;
}

export default function DigitalGoodsDetailsView({
  task,
  details,
  onClose,
  onEdit,
}: Props) {
  const { t } = useTranslation(['studio']);

  // Use the new task structure or fall back to old details prop
  const result = task?.digitalGoods || details;
  const error = task?.error;

  if (!result && task?.status !== 'PENDING' && task?.status !== 'PROCESSING') {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-studio-text-muted">
          {t('digitalGoods.details.cannotLoadDetails')}
        </p>
      </div>
    );
  }

  const content = (
    <div className="text-studio-text-primary">
      {/* Main Content */}
      {result && (
        <div className="grid grid-cols-1 gap-6">
          {/* Before/After Comparison */}
          {result.requestImageUrl ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Request Image */}
              <ImageDisplayCard
                title={t('digitalGoods.details.originalImage')}
                subtitle={t('digitalGoods.details.uploadedImage')}
                imageUrl={result.requestImageUrl}
                alt={t('digitalGoods.details.originalImageAlt')}
                downloadFilename={`original-${result.filename || `digital-goods-${Date.now()}.png`}`}
              />

              {/* Result Image */}
              <ImageDisplayCard
                title={t('digitalGoods.details.generatedResult')}
                subtitle={t('digitalGoods.details.generatedResultSubtitle', {
                  style: result.style || 'Unknown',
                })}
                imageUrl={result.imageUrl}
                downloadUrl={result.downloadUrl}
                alt={t('digitalGoods.details.generatedGoods')}
                downloadFilename={
                  result.filename || `digital-goods-${Date.now()}.png`
                }
              />
            </div>
          ) : (
            /* Result Only (for backward compatibility) */
            <ImageDisplayCard
              title={t('digitalGoods.details.generatedResult')}
              subtitle={t('digitalGoods.details.generatedResultSubtitle', {
                style: result.style || 'Unknown',
              })}
              imageUrl={result.imageUrl}
              downloadUrl={result.downloadUrl}
              alt={t('digitalGoods.details.generatedGoods')}
              downloadFilename={
                result.filename || `digital-goods-${Date.now()}.png`
              }
            />
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
              {t('digitalGoods.details.processing')}
            </p>
          </div>
        )}

      {/* Error State */}
      {error && (
        <div className="mt-6">
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
            <h4 className="text-red-400 font-medium mb-2">
              {t('digitalGoods.details.generationFailed')}
            </h4>
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        </div>
      )}
    </div>
  );

  return onClose ? (
    <DetailsModal
      title={t('digitalGoods.details.creationTitle')}
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
