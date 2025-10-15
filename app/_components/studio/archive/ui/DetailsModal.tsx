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

export default function DetailsModal({ children, title, onClose, onEdit, showEditButton }: DetailsModalProps) {
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
            ? 'w-full max-w-[calc(100vw-2rem)] max-h-[80vh]'
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
          className={`flex-1 overflow-y-auto p-6 ${title ? '' : 'pt-16'}`}
          style={{
            paddingBottom: showEditButton && onEdit ? '5rem' : '1.5rem',
          }}
        >
          {children}
        </div>

        {/* Floating Edit Button - Fixed at bottom */}
        {showEditButton && onEdit && (
          <div className="absolute bottom-0 left-0 right-0 flex justify-center p-4 bg-gradient-to-t from-studio-sidebar via-studio-sidebar to-transparent pointer-events-none">
            <button
              onClick={onEdit}
              className="flex items-center gap-2 px-6 py-3 bg-studio-button-primary text-studio-header rounded-lg hover:opacity-90 transition-all shadow-2xl hover:shadow-studio-button-primary/50 hover:scale-105 active:scale-95 pointer-events-auto"
            >
              <Edit className="h-4 w-4" />
              <span className="font-semibold">수정하기</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
