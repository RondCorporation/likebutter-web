import { ReactNode } from 'react';
import { X, Edit } from 'lucide-react';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { useScrollLock } from '@/hooks/useScrollLock';

interface DetailsModalProps {
  children: ReactNode;
  title?: string;
  onClose: () => void;
  onEdit?: () => void;
  showEditButton?: boolean;
}

export default function DetailsModal({
  children,
  title,
  onClose,
  onEdit,
  showEditButton,
}: DetailsModalProps) {
  const isMobile = useIsMobile();
  useScrollLock(true);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className={`${
          isMobile
            ? 'w-full max-w-[calc(100vw-2rem)] max-h-[65vh]'
            : 'w-full max-w-4xl max-h-[85vh]'
        } bg-studio-sidebar border border-studio-border rounded-xl relative flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with title and close button */}
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-studio-border flex-shrink-0">
            <h2 className="text-lg font-semibold text-studio-text-primary">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="flex items-center justify-center w-8 h-8 hover:bg-studio-border text-studio-text-primary rounded-full transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Close button only (when no title) */}
        {!title && (
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={onClose}
              className="flex items-center justify-center w-10 h-10 bg-studio-border hover:bg-studio-border-light text-studio-text-primary rounded-full transition-colors shadow-lg"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Content */}
        <div
          className={`flex-1 overflow-y-auto ${isMobile ? 'p-4' : 'p-6'} ${title ? '' : 'pt-16'}`}
          style={{
            paddingBottom: showEditButton && onEdit ? (isMobile ? '6rem' : '5rem') : '1.5rem',
          }}
        >
          {children}
        </div>

        {/* Floating Edit Button - Fixed at bottom */}
        {showEditButton && onEdit && (
          <div className={`absolute bottom-0 left-0 right-0 flex justify-center ${isMobile ? 'p-3' : 'p-4'} bg-gradient-to-t from-studio-sidebar ${isMobile ? 'via-studio-sidebar/95' : 'via-studio-sidebar'} to-studio-sidebar/0 pointer-events-none`}>
            <button
              onClick={onEdit}
              className={`flex items-center gap-2 ${isMobile ? 'px-5 py-2.5' : 'px-6 py-3'} bg-studio-button-primary text-studio-header rounded-lg hover:opacity-90 transition-all shadow-2xl hover:shadow-studio-button-primary/50 hover:scale-105 active:scale-95 pointer-events-auto`}
            >
              <Edit className={`${isMobile ? 'h-3.5 w-3.5' : 'h-4 w-4'}`} />
              <span className={`font-semibold ${isMobile ? 'text-sm' : ''}`}>수정하기</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
