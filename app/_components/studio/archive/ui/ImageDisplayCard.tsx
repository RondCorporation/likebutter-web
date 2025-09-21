interface ImageDisplayCardProps {
  title: string;
  imageUrl: string;
  alt: string;
  subtitle?: string;
  className?: string;
  imageClassName?: string;
}

export default function ImageDisplayCard({
  title,
  imageUrl,
  alt,
  subtitle,
  className = '',
  imageClassName = '',
}: ImageDisplayCardProps) {
  return (
    <div
      className={`bg-studio-sidebar border border-studio-border rounded-xl p-4 ${className}`}
    >
      <div className="mb-3">
        <h4 className="text-sm font-medium text-studio-text-primary">
          {title}
        </h4>
        {subtitle && (
          <p className="text-xs text-studio-text-secondary mt-1">{subtitle}</p>
        )}
      </div>
      <div className="bg-studio-border rounded-lg p-3">
        <img
          src={imageUrl}
          alt={alt}
          className={`w-full h-auto max-h-[300px] object-contain rounded-md ${imageClassName}`}
        />
      </div>
    </div>
  );
}
