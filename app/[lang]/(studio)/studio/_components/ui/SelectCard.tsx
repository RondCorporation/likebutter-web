'use client';

import { ReactNode } from 'react';

interface SelectCardProps {
  state: 'selected' | 'default';
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  className?: string;
  children?: ReactNode;
  onClick?: () => void;
  onMouseEnter?: () => void;
}

export default function SelectCard({
  state,
  title,
  subtitle,
  backgroundImage,
  className = '',
  children,
  onClick,
  onMouseEnter,
}: SelectCardProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 relative w-full">
      <div
        className={`border border-solid w-full h-[165px] flex flex-col items-center gap-2.5 p-6 rounded-md justify-center relative cursor-pointer transition-colors ${
          state === 'selected'
            ? 'border-[#ffd83b] border-2'
            : 'border-[#4a4a4b] hover:border-[#6a6a6b]'
        } ${className}`}
        style={{
          backgroundImage: backgroundImage
            ? `url(${backgroundImage})`
            : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
      >
        {children}
      </div>
      <div className="text-left w-full h-[52px] flex flex-col">
        <div className="font-medium text-white text-sm leading-[19.6px] relative">
          {title}
        </div>
        {subtitle && (
          <div className="font-normal text-studio-text-secondary text-xs mt-0.5 leading-[16.8px] flex-1">
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
}
