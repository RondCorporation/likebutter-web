'use client';

import { ReactNode } from 'react';
import { X } from 'lucide-react';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { useScrollLock } from '@/hooks/useScrollLock';

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
  useScrollLock(isOpen);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className={`${
          isMobile
            ? 'w-full max-w-[calc(100vw-2rem)] max-h-[80vh]'
            : 'w-[678px] max-h-[85vh]'
        } bg-studio-sidebar border border-solid border-studio-border rounded-xl ${
          isMobile ? 'p-6' : 'p-8'
        } flex flex-col gap-6 md:gap-8 ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between w-full flex-shrink-0">
          <div className="flex-1 text-center font-bold text-studio-text-primary text-lg">
            {title}
          </div>
          <button
            onClick={onClose}
            className="text-studio-text-primary hover:text-studio-text-secondary transition-colors"
          >
            <X size={isMobile ? 24 : 20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
