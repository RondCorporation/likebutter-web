'use client';

import { useState, ReactNode } from 'react';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

interface StudioButtonProps {
  text: string;
  onClick?: () => void;
  className?: string;
  textClassName?: string;
  disabled?: boolean;
  creditCost?: number;
  loading?: boolean;
  icon?: ReactNode;
}

export default function StudioButton({
  text,
  onClick,
  className = '',
  textClassName = '',
  disabled = false,
  creditCost,
  loading = false,
  icon,
}: StudioButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const isPC = className.includes('px-3') || className.includes('h-[38px]');
  const buttonClassName = isPC
    ? `inline-flex items-center overflow-hidden rounded-md relative transition-colors w-[160px] ${className}`
    : `inline-flex items-center px-5 py-3 h-12 overflow-hidden rounded-md justify-between relative transition-colors ${className}`;

  return (
    <button
      className={`${buttonClassName} ${
        isHovered ? 'bg-[#f7c80d]' : 'bg-[#ffd83b]'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      disabled={disabled}
    >
      {isPC ? (
        /* PC version: Adjust spacing to fit credits completely inside the button */
        <div className="flex items-center w-full px-2 justify-between">
          {/* Text area */}
          <div className="flex items-center justify-center flex-1">
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {!loading && icon && <div className="mr-2">{icon}</div>}
            <div
              className={`font-semibold text-black leading-4 whitespace-nowrap ${textClassName}`}
            >
              {text}
            </div>
          </div>

          {/* Credit info - PC version, right side, fully contained within the button */}
          {creditCost && !loading && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-[20px] bg-[rgba(232,250,7,0.62)] flex-shrink-0 ml-1">
              <Image
                src="/credit_black.svg"
                alt="Credit"
                width={12}
                height={12}
                className="flex-shrink-0"
              />
              <span className="text-xs font-medium text-black">
                -{creditCost}
              </span>
            </div>
          )}
        </div>
      ) : (
        /* Mobile/default version: Maintain original logic */
        <>
          {/* Left margin (only when credits are present) */}
          {creditCost && !loading && <div className="w-[60px]" />}

          <div className="flex items-center justify-center flex-1">
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {!loading && icon && <div className="mr-2">{icon}</div>}
            <div
              className={`font-semibold text-base text-black leading-4 whitespace-nowrap ${textClassName}`}
            >
              {text}
            </div>
          </div>

          {/* Credit info - Mobile version, fixed on the right */}
          {creditCost && !loading && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-[20px] bg-[rgba(232,250,7,0.62)] flex-shrink-0">
              <Image
                src="/credit_black.svg"
                alt="Credit"
                width={12}
                height={12}
                className="flex-shrink-0"
              />
              <span className="text-xs font-medium text-black">
                -{creditCost}
              </span>
            </div>
          )}
        </>
      )}
    </button>
  );
}
