import { PhotoEditorDetails } from '@/types/task';
import { Edit3, Image, Sliders, Sun, Contrast, Palette } from 'lucide-react';
import InfoCard from '../ui/InfoCard';
import ParameterBadge from '../ui/ParameterBadge';
import DetailsModal from '../ui/DetailsModal';
import { useTranslation } from 'react-i18next';

interface Props {
  details?: PhotoEditorDetails;
  onClose?: () => void;
}

export default function PhotoEditorDetailsView({ details, onClose }: Props) {
  const { t } = useTranslation('studio');
  if (!details) {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-studio-text-muted">
          {t('photoEditor.detailsNotAvailable')}
        </p>
      </div>
    );
  }

  const content = (
    <div className="text-studio-text-primary space-y-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-studio-button-primary rounded-lg">
            <Edit3 className="h-5 w-5 text-studio-header" />
          </div>
          <h3 className="text-xl font-semibold">{t('photoEditor.title')}</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <ParameterBadge
            label={t('photoEditor.editType')}
            value={
              details.request.editType || t('photoEditor.defaultEnhancement')
            }
            variant="accent"
          />
          {details.request.applyFilter &&
            details.request.applyFilter !== 'None' && (
              <ParameterBadge
                label={t('photoEditor.filter')}
                value={details.request.applyFilter}
              />
            )}
          {details.request.enhanceQuality && (
            <ParameterBadge
              label={t('photoEditor.qualityEnhancement')}
              value={t('photoEditor.applied')}
            />
          )}
        </div>
      </div>

      {/* Before & After Images */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Original Image */}
        <div className="bg-studio-sidebar border border-studio-border rounded-xl p-4">
          <h4 className="text-sm font-medium text-studio-text-primary mb-3">
            {t('photoEditor.originalImage')}
          </h4>
          <div className="bg-studio-border rounded-lg p-3">
            <div className="w-full h-48 bg-studio-border rounded flex items-center justify-center">
              <span className="text-studio-text-secondary text-sm">
                {t('photoEditor.originalImagePreview')}
              </span>
            </div>
            {details.request.sourceImageKey && (
              <p className="text-xs text-studio-text-secondary mt-2 font-mono">
                Key: {details.request.sourceImageKey}
              </p>
            )}
          </div>
        </div>

        {/* Edited Result */}
        {details.result && (
          <div className="bg-studio-sidebar border border-studio-border rounded-xl p-4">
            <h4 className="text-sm font-medium text-studio-text-primary mb-3">
              {t('photoEditor.editedResult')}
            </h4>
            <div className="bg-studio-border rounded-lg p-3">
              <div className="w-full h-48 bg-studio-border rounded flex items-center justify-center border-2 border-studio-button-primary/30">
                <span className="text-studio-text-secondary text-sm">
                  {t('photoEditor.editedResult')}
                </span>
              </div>
              {details.result.editedImageKey && (
                <p className="text-xs text-studio-text-secondary mt-2 font-mono">
                  Key: {details.result.editedImageKey}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Edit Settings */}
      <InfoCard title={t('photoEditor.editSettings')}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Brightness */}
          <div className="bg-studio-border rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Sun className="h-4 w-4 text-studio-text-secondary" />
              <span className="text-sm font-medium text-studio-text-primary">
                {t('photoEditor.brightness')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-studio-border rounded-full h-2 relative">
                <div
                  className="bg-studio-button-primary h-2 rounded-full transition-all"
                  style={{
                    width: `${Math.max(0, Math.min(100, ((details.request.brightness + 100) / 200) * 100))}%`,
                  }}
                />
              </div>
              <span className="text-studio-text-primary text-sm w-12 text-right font-medium">
                {details.request.brightness > 0 ? '+' : ''}
                {details.request.brightness}
              </span>
            </div>
          </div>

          {/* Contrast */}
          <div className="bg-studio-border rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Contrast className="h-4 w-4 text-studio-text-secondary" />
              <span className="text-sm font-medium text-studio-text-primary">
                {t('photoEditor.contrast')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-studio-border rounded-full h-2 relative">
                <div
                  className="bg-studio-button-primary h-2 rounded-full transition-all"
                  style={{
                    width: `${Math.max(0, Math.min(100, ((details.request.contrast + 100) / 200) * 100))}%`,
                  }}
                />
              </div>
              <span className="text-studio-text-primary text-sm w-12 text-right font-medium">
                {details.request.contrast > 0 ? '+' : ''}
                {details.request.contrast}
              </span>
            </div>
          </div>

          {/* Saturation */}
          <div className="bg-studio-border rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Palette className="h-4 w-4 text-studio-text-secondary" />
              <span className="text-sm font-medium text-studio-text-primary">
                {t('photoEditor.saturation')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-studio-border rounded-full h-2 relative">
                <div
                  className="bg-studio-button-primary h-2 rounded-full transition-all"
                  style={{
                    width: `${Math.max(0, Math.min(100, ((details.request.saturation + 100) / 200) * 100))}%`,
                  }}
                />
              </div>
              <span className="text-studio-text-primary text-sm w-12 text-right font-medium">
                {details.request.saturation > 0 ? '+' : ''}
                {details.request.saturation}
              </span>
            </div>
          </div>
        </div>
      </InfoCard>

      {/* Processing Info */}
      <InfoCard title={t('photoEditor.processingInfo')}>
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-studio-border rounded-lg">
            <Sliders className="h-6 w-6 text-studio-text-secondary" />
          </div>
          <div className="flex-1">
            <h5 className="font-medium text-studio-text-primary mb-1">
              {details.request.editType || t('photoEditor.defaultEnhancement')}
            </h5>
            <p className="text-sm text-studio-text-secondary">
              {details.request.enhanceQuality
                ? t('photoEditor.qualityEnhancementApplied')
                : t('photoEditor.defaultEditApplied')}
            </p>
          </div>
        </div>

        {details.request.applyFilter &&
          details.request.applyFilter !== 'None' && (
            <div className="mt-4 p-3 bg-studio-button-primary/20 rounded-lg">
              <div className="flex items-center gap-2">
                <Image className="h-4 w-4 text-studio-header" />
                <span className="text-sm font-medium text-studio-header">
                  {t('photoEditor.appliedFilter', {
                    filter: details.request.applyFilter,
                  })}
                </span>
              </div>
            </div>
          )}
      </InfoCard>
    </div>
  );

  return onClose ? (
    <DetailsModal onClose={onClose}>{content}</DetailsModal>
  ) : (
    content
  );
}
