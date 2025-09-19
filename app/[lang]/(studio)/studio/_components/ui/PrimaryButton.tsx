'use client';

import { useState } from 'react';
import Image from 'next/image';

interface PrimaryButtonProps {
  text: string;
  onClick?: () => void;
  className?: string;
  textClassName?: string;
  disabled?: boolean;
  creditCost?: number; // 소비될 크레딧 양
}

export default function PrimaryButton({
  text,
  onClick,
  className = '',
  textClassName = '',
  disabled = false,
  creditCost,
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

      {/* 크레딧 정보 - 버튼 내부 우측 */}
      {creditCost && (
        <div className="flex items-center gap-1 ml-2 px-2 py-1 rounded-[20px] bg-[rgba(232,250,7,0.62)]">
          <Image
            src="/credit.svg"
            alt="Credit"
            width={12}
            height={12}
            className="flex-shrink-0"
          />
          <span className="text-xs font-medium text-black">-{creditCost}</span>
        </div>
      )}
    </button>
  );
}
