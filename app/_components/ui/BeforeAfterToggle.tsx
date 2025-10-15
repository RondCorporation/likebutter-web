'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Edit, RotateCcw } from 'lucide-react';
import { useIsDesktop } from '@/hooks/useMediaQuery';

interface BeforeAfterToggleProps {
  beforeImage: string;
  afterImage: string;
  onDownload?: () => void;
  onEdit?: () => void;
  onReset?: () => void;
  showEditButton?: boolean;
  editButtonText?: string;
  isEditLoading?: boolean;
}

export default function BeforeAfterToggle({
  beforeImage,
  afterImage,
  onDownload,
  onEdit,
  onReset,
  showEditButton = false,
  editButtonText,
  isEditLoading = false,
}: BeforeAfterToggleProps) {
  const { t } = useTranslation('studio');
  const isDesktop = useIsDesktop();
  const [currentView, setCurrentView] = useState<'before' | 'after'>('after');

  const finalEditButtonText = editButtonText || t('beforeAfter.edit');

  return (
    <div className="flex flex-col h-full bg-studio-content overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-4 md:px-12 pb-0 pt-6 sticky top-0 bg-studio-content z-10 border-b border-studio-border/50 backdrop-blur-sm">
        <div className="flex-1 text-xl font-bold leading-7 font-pretendard bg-gradient-to-r from-[#FFCC00] to-[#E8FA07] bg-clip-text text-transparent">
          {t('beforeAfter.result')}
        </div>

        {/* Before/After Toggle - Top right */}
        <div className="flex bg-studio-sidebar rounded-full p-1">
          <button
            onClick={() => setCurrentView('before')}
            className={`px-3 py-1.5 rounded-full text-xs font-pretendard-medium transition-all duration-200 ${
              currentView === 'before'
                ? 'bg-studio-text-muted text-studio-header'
                : 'text-studio-text-secondary hover:text-studio-text-primary'
            }`}
          >
            before
          </button>
          <button
            onClick={() => setCurrentView('after')}
            className={`px-3 py-1.5 rounded-full text-xs font-pretendard-medium transition-all duration-200 ${
              currentView === 'after'
                ? 'bg-studio-button-primary text-studio-header'
                : 'text-studio-text-secondary hover:text-studio-text-primary'
            }`}
          >
            after
          </button>
        </div>
      </div>

      {/* Image Display */}
      <div
        className="flex items-center justify-center p-4"
        style={{
          // 모바일: 하단 버튼(72px) + 안전 영역 + 여유 공간(16px)
          // 데스크탑: 기본 패딩
          paddingBottom: isDesktop
            ? '16px'
            : 'calc(72px + env(safe-area-inset-bottom, 0px) + 16px)',
        }}
      >
        <img
          src={currentView === 'before' ? beforeImage : afterImage}
          alt={currentView === 'before' ? 'Before image' : 'After image'}
          className="max-w-full w-full object-contain rounded-[20px]"
        />
      </div>

      {/* Action Buttons - Desktop only */}
      {isDesktop && (
        <div
          className="px-4 pb-8 flex flex-col gap-3"
          style={{
            paddingBottom:
              'max(32px, calc(32px + env(safe-area-inset-bottom)))',
          }}
        >
          {showEditButton && (
            <div className="flex gap-2">
              <button
                onClick={onEdit}
                disabled={isEditLoading}
                className="flex-1 h-12 bg-studio-button-primary hover:bg-studio-button-hover active:scale-[0.98] rounded-xl flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Edit className="w-4 h-4 text-studio-header" />
                <div className="text-studio-header text-sm font-bold font-pretendard-bold">
                  {isEditLoading
                    ? t('beforeAfter.editing')
                    : finalEditButtonText}
                </div>
              </button>
              {onReset && (
                <button
                  onClick={onReset}
                  className="h-12 w-12 border border-studio-button-primary hover:bg-studio-button-primary/10 active:scale-[0.98] rounded-xl flex items-center justify-center transition-all duration-200"
                >
                  <RotateCcw className="w-5 h-5 text-studio-button-primary" />
                </button>
              )}
            </div>
          )}

          <button
            onClick={onDownload}
            className="w-full h-12 border border-studio-button-primary hover:bg-studio-button-primary/10 active:scale-[0.98] rounded-xl flex items-center justify-center transition-all duration-200"
          >
            <div className="text-studio-button-primary text-sm font-bold font-pretendard-bold">
              {t('beforeAfter.savePhoto')}
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
