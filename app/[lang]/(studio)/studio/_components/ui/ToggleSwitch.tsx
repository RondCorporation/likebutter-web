'use client';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  size?: 'sm' | 'md';
  className?: string;
}

export default function ToggleSwitch({
  checked,
  onChange,
  size = 'md',
  className = '',
}: ToggleSwitchProps) {
  const sizeClasses = {
    sm: 'w-8 h-4',
    md: 'w-10 h-5',
  };

  const thumbSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
  };

  return (
    <button
      type="button"
      className={`relative inline-flex items-center rounded-full transition-colors duration-200 focus:outline-none ${sizeClasses[size]} ${
        checked ? 'bg-butter-yellow' : 'bg-studio-border'
      } ${className}`}
      onClick={() => onChange(!checked)}
    >
      <span
        className={`inline-block rounded-full bg-white transition-transform duration-200 ${thumbSizeClasses[size]} ${
          checked
            ? size === 'sm'
              ? 'translate-x-4'
              : 'translate-x-5'
            : 'translate-x-0.5'
        }`}
      />
    </button>
  );
}
