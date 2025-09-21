import { ReactNode } from 'react';
import { X } from 'lucide-react';
import { useIsMobile } from '@/hooks/useMediaQuery';

interface DetailsModalProps {
  children: ReactNode;
  onClose: () => void;
}

export default function DetailsModal({ children, onClose }: DetailsModalProps) {
  const isMobile = useIsMobile();

  return (
    <div
      className={`fixed inset-0 z-50 flex ${
        isMobile ? 'items-end' : 'items-center justify-center'
      } bg-black/70 backdrop-blur-sm`}
      onClick={onClose}
      style={{
        paddingBottom: isMobile ? 'env(safe-area-inset-bottom)' : '0',
      }}
    >
      <div
        className={`${
          isMobile
            ? 'w-full max-h-[90vh] rounded-t-xl'
            : 'w-full max-w-4xl max-h-[85vh] rounded-xl mx-4'
        } bg-studio-sidebar border border-studio-border relative flex flex-col ${isMobile ? 'animate-slide-up' : ''}`}
        onClick={(e) => e.stopPropagation()}
        style={{
          maxHeight: isMobile
            ? 'calc(90vh - env(safe-area-inset-bottom))'
            : '85vh',
        }}
      >
        {/* 닫기 버튼 */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 bg-studio-border hover:bg-studio-border-light text-studio-text-primary rounded-full transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* 컨텐츠 */}
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}
