'use client';

import { useState, useEffect } from 'react';

interface SquareToggleButtonProps {
  leftLabel: string;
  rightLabel: string;
  onToggle: (value: 'left' | 'right') => void;
  initialValue?: 'left' | 'right';
  value?: 'left' | 'right';
  className?: string;
}

export default function SquareToggleButton({
  leftLabel,
  rightLabel,
  onToggle,
  initialValue = 'left',
  value,
  className = '',
}: SquareToggleButtonProps) {
  const [selected, setSelected] = useState<'left' | 'right'>(initialValue);

  useEffect(() => {
    if (value !== undefined) {
      setSelected(value);
    }
  }, [value]);

  const handleToggle = (value: 'left' | 'right') => {
    setSelected(value);
    onToggle(value);
  };

  return (
    <div
      className={`relative w-full h-10 bg-studio-border rounded-lg overflow-hidden ${className}`}
    >
      {/* Background slider */}
      <div
        className={`absolute top-1 bottom-1 w-1/2 bg-butter-yellow rounded-md transition-transform duration-300 ease-in-out ${
          selected === 'right' ? 'translate-x-full' : 'translate-x-0'
        }`}
        style={{ left: '2px', right: '2px', width: 'calc(50% - 2px)' }}
      />

      {/* Button labels */}
      <div className="relative z-10 flex h-full">
        <button
          onClick={() => handleToggle('left')}
          className={`flex-1 flex items-center justify-center text-sm font-pretendard-medium transition-colors duration-300 ${
            selected === 'left'
              ? 'text-studio-main'
              : 'text-studio-text-secondary'
          }`}
        >
          {leftLabel}
        </button>
        <button
          onClick={() => handleToggle('right')}
          className={`flex-1 flex items-center justify-center text-sm font-pretendard-medium transition-colors duration-300 ${
            selected === 'right'
              ? 'text-studio-main'
              : 'text-studio-text-secondary'
          }`}
        >
          {rightLabel}
        </button>
      </div>
    </div>
  );
}
