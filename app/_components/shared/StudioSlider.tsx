'use client';

import { useState, useRef, useEffect } from 'react';

interface StudioSliderProps {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  className?: string;
}

export default function StudioSlider({
  min,
  max,
  step,
  value,
  onChange,
  disabled = false,
  className = '',
}: StudioSliderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const percentage = ((value - min) / (max - min)) * 100;

  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return;
    setIsDragging(true);
    updateValue(e.clientX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || disabled) return;
    updateValue(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const updateValue = (clientX: number) => {
    if (!sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = Math.min(
      Math.max((clientX - rect.left) / rect.width, 0),
      1
    );
    const newValue = min + percentage * (max - min);
    const steppedValue = Math.round(newValue / step) * step;
    const clampedValue = Math.min(Math.max(steppedValue, min), max);

    onChange(clampedValue);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  return (
    <div className={`relative ${className}`}>
      <div
        ref={sliderRef}
        className={`relative h-2 w-full rounded-full bg-slate-700 ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
        onClick={(e) => !disabled && updateValue(e.clientX)}
      >
        {/* Track fill */}
        <div
          className="absolute left-0 top-0 h-full rounded-full bg-butter-yellow transition-all"
          style={{ width: `${percentage}%` }}
        />

        {/* Handle */}
        <div
          className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-butter-yellow bg-white shadow-md transition-all ${
            disabled
              ? 'cursor-not-allowed opacity-50'
              : 'cursor-grab hover:scale-110'
          } ${isDragging ? 'cursor-grabbing scale-110' : ''}`}
          style={{ left: `calc(${percentage}% - 8px)` }}
          onMouseDown={handleMouseDown}
        />
      </div>
    </div>
  );
}
