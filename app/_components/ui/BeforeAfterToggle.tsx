'use client';

import { useState } from 'react';

interface BeforeAfterToggleProps {
  beforeImage: string;
  afterImage: string;
  onDownload?: () => void;
  onEdit?: () => void;
  showEditButton?: boolean;
  editButtonText?: string;
  isEditLoading?: boolean;
}

export default function BeforeAfterToggle({
  beforeImage,
  afterImage,
  onDownload,
  onEdit,
  showEditButton = false,
  editButtonText = '수정하기',
  isEditLoading = false,
}: BeforeAfterToggleProps) {
  const [currentView, setCurrentView] = useState<'before' | 'after'>('after');

  return (
    <div className="flex flex-col flex-1 h-full bg-studio-content">
      {/* Header */}
      <div className="flex items-center justify-between px-4 md:px-12 pb-0 pt-6 sticky top-0 bg-studio-content z-10 border-b border-studio-border/50 backdrop-blur-sm">
        <div className="flex-1 text-xl font-bold leading-7 font-pretendard bg-gradient-to-r from-[#FFCC00] to-[#E8FA07] bg-clip-text text-transparent">
          결과
        </div>

        {/* Before/After Toggle - 우측 상단 */}
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
      <div className="flex items-center justify-center flex-1 p-4">
        <img
          src={currentView === 'before' ? beforeImage : afterImage}
          alt={currentView === 'before' ? 'Before image' : 'After image'}
          className="max-w-full max-h-full object-contain rounded-[20px]"
        />
      </div>

      {/* Action Buttons */}
      <div
        className="px-4 pb-8 flex flex-col gap-3"
        style={{
          paddingBottom: 'max(32px, calc(32px + env(safe-area-inset-bottom)))',
        }}
      >
        {showEditButton && (
          <button
            onClick={onEdit}
            disabled={isEditLoading}
            className="w-full h-12 bg-studio-button-primary hover:bg-studio-button-hover active:scale-[0.98] rounded-xl flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="text-studio-header text-sm font-bold font-pretendard-bold">
              {isEditLoading ? '수정중...' : editButtonText}
            </div>
          </button>
        )}

        <button
          onClick={onDownload}
          className="w-full h-12 border border-studio-button-primary hover:bg-studio-button-primary/10 active:scale-[0.98] rounded-xl flex items-center justify-center transition-all duration-200"
        >
          <div className="text-studio-button-primary text-sm font-bold font-pretendard-bold">
            사진 저장
          </div>
        </button>
      </div>
    </div>
  );
}
