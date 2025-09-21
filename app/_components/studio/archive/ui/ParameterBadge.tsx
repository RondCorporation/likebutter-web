interface ParameterBadgeProps {
  label: string;
  value: string;
  variant?: 'default' | 'accent';
}

export default function ParameterBadge({
  label,
  value,
  variant = 'default',
}: ParameterBadgeProps) {
  const baseClasses =
    'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium';
  const variantClasses =
    variant === 'accent'
      ? 'bg-studio-button-primary text-studio-header'
      : 'bg-studio-border text-studio-text-secondary';

  return (
    <div className={`${baseClasses} ${variantClasses}`}>
      <span className="opacity-80">{label}:</span>
      <span>{value}</span>
    </div>
  );
}
