'use client';

import { useState } from 'react';

interface PrimaryButtonProps {
  text: string;
  onClick?: () => void;
  className?: string;
  textClassName?: string;
  disabled?: boolean;
}

export default function PrimaryButton({
  text,
  onClick,
  className = '',
  textClassName = '',
  disabled = false,
}: PrimaryButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      className={`inline-flex items-center px-5 py-3 h-12 overflow-hidden rounded-md justify-center relative transition-colors ${
        isHovered ? 'bg-[#f7c80d]' : 'bg-[#ffd83b]'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      disabled={disabled}
    >
      <div
        className={`font-semibold text-base text-white leading-4 whitespace-nowrap relative ${textClassName}`}
      >
        {text}
      </div>
    </button>
  );
}
