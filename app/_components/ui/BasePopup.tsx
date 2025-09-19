'use client';

import { ReactNode } from 'react';
import { X } from 'lucide-react';
import { useIsMobile } from '@/hooks/useMediaQuery';

interface BasePopupProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}

export default function BasePopup({
  isOpen,
  onClose,
  title,
  children,
  className = '',
}: BasePopupProps) {
  const isMobile = useIsMobile();

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex ${
        isMobile ? 'items-end' : 'items-center justify-center'
      } bg-black/70 backdrop-blur-sm`}
      onClick={onClose}
    >
      <div
        className={`${
          isMobile ? 'w-full h-[85vh] rounded-t-xl' : 'w-[678px] rounded-xl'
        } bg-studio-sidebar border border-solid border-studio-border ${
          isMobile ? 'p-4' : 'p-8'
        } flex flex-col gap-6 md:gap-8 ${
          isMobile ? 'animate-slide-up' : ''
        } ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex-1 text-center font-bold text-studio-text-primary text-lg">
            {title}
          </div>
          <button
            onClick={onClose}
            className="text-studio-text-primary hover:text-studio-text-secondary"
          >
            <X size={isMobile ? 24 : 20} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
