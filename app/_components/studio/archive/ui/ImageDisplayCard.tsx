import { Download, X } from 'lucide-react';
import { downloadFile } from '@/app/_utils/download';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface ImageDisplayCardProps {
  title: string;
  imageUrl: string;
  alt: string;
  subtitle?: string;
  className?: string;
  imageClassName?: string;
  downloadFilename?: string;
  showDownload?: boolean;
}

export default function ImageDisplayCard({
  title,
  imageUrl,
  alt,
  subtitle,
  className = '',
  imageClassName = '',
  downloadFilename,
  showDownload = true,
}: ImageDisplayCardProps) {
  const { t } = useTranslation('common');
  const [isDownloading, setIsDownloading] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  const handleDownload = async () => {
    if (isDownloading) return;

    setIsDownloading(true);
    try {
      const filename = downloadFilename || `image-${Date.now()}.png`;
      await downloadFile(imageUrl, filename);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleImageClick = () => {
    setIsZoomed(true);
  };

  const handleCloseZoom = () => {
    setIsZoomed(false);
  };

  return (
    <>
      <div
        className={`bg-studio-sidebar border border-studio-border rounded-xl p-4 ${className}`}
      >
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-studio-text-primary">
              {title}
            </h4>
            {subtitle && (
              <p className="text-xs text-studio-text-secondary mt-1">
                {subtitle}
              </p>
            )}
          </div>
          {showDownload && (
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="p-2 bg-studio-button-primary hover:bg-studio-button-primary/80 disabled:opacity-50 rounded-lg transition-colors"
              title={t('download')}
            >
              <Download className="h-4 w-4 text-studio-header" />
            </button>
          )}
        </div>
        <div
          className="bg-studio-border rounded-lg p-3 cursor-pointer"
          onClick={handleImageClick}
        >
          <img
            src={imageUrl}
            alt={alt}
            className={`w-full h-auto max-h-[300px] object-contain rounded-md ${imageClassName}`}
          />
        </div>
      </div>

      {/* Zoomed Image Modal */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={handleCloseZoom}
        >
          <button
            onClick={handleCloseZoom}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <img
            src={imageUrl}
            alt={alt}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
