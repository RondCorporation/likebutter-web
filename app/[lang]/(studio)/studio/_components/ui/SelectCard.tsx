'use client';

import { ReactNode } from 'react';

interface SelectCardProps {
  state: 'selected' | 'default';
  title: string;
  backgroundImage?: string;
  className?: string;
  children?: ReactNode;
  onClick?: () => void;
  onMouseEnter?: () => void;
}

export default function SelectCard({
  state,
  title,
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
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
      >
        {children}
      </div>
      <div className="font-medium text-white text-sm text-center leading-[19.6px] relative">
        {title}
      </div>
    </div>
  );
}
