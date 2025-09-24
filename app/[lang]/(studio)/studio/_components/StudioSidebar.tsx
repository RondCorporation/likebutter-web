'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'next/navigation';
import { Plus, Home, FolderOpen, Users } from 'lucide-react';
import { toast } from 'react-hot-toast';
import ModelSelectPopup from './ModelSelectPopup';

interface StudioSidebarProps {
  lang: string;
}

export default function StudioSidebar({ lang }: StudioSidebarProps) {
  const { t } = useTranslation(['studio', 'common']);
  const searchParams = useSearchParams();
  const [showModelPopup, setShowModelPopup] = useState(false);

  const handleComingSoon = () => {
    toast(t('studio:messages.comingSoon'), {
      icon: '🚧',
      style: {
        background: '#333',
        color: '#fff',
      },
    });
  };

  const navigateToTool = (toolName: string) => {
    if (typeof window !== 'undefined' && (window as any).studioNavigateToTool) {
      (window as any).studioNavigateToTool(toolName);
    }
  };

  const getCurrentTool = () => {
    return searchParams.get('tool') || 'dashboard';
  };

  const getSelectedMenu = () => {
    const currentTool = getCurrentTool();
    if (currentTool === 'dashboard') return 'home';
    if (currentTool === 'archive') return 'vault';
    if (currentTool === 'help') return 'help';
    return '';
  };

  const selectedMenu = getSelectedMenu();

  return (
    <>
      {/* Full-height sidebar */}
      <div className="flex flex-col w-20 items-center gap-6 pt-6 pb-3 px-3 bg-[#202020] border-r border-solid border-[#4a4a4b]">
        {/* Create button */}
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={() => setShowModelPopup(true)}
            className="inline-flex items-center justify-center h-[42px] w-[42px] rounded-full bg-[#e9ba00] hover:bg-[#d4a600] transition-colors"
          >
            <Plus className="w-5 h-5 text-white" />
          </button>
          <div
            className="text-white text-xs text-center font-medium"
            style={{ fontFamily: 'Pretendard, Helvetica' }}
          >
            {t('studio:navigation.create')}
          </div>
        </div>

        {/* Home button */}
        <div className="flex flex-col items-center gap-1">
          <button onClick={() => navigateToTool('dashboard')}>
            <div
              className={`inline-flex items-center justify-center w-14 h-10 px-3 py-2.5 rounded-md transition-colors ${selectedMenu === 'home' ? 'bg-[#323232]' : 'hover:bg-[#323232]'}`}
            >
              <Home className="w-5 h-5" color="#89898B" />
            </div>
          </button>
          <div
            className="text-[#a8a8aa] text-xs text-center font-medium"
            style={{ fontFamily: 'Pretendard, Helvetica' }}
          >
            {t('studio:navigation.home')}
          </div>
        </div>

        {/* Archive button */}
        <div className="flex flex-col items-center gap-1">
          <button onClick={() => navigateToTool('archive')}>
            <div
              className={`inline-flex items-center justify-center w-14 h-10 px-3 py-2.5 rounded-[10px] transition-colors ${selectedMenu === 'vault' ? 'bg-[#323232]' : 'hover:bg-[#323232]'}`}
            >
              <FolderOpen className="w-5 h-5" color="#C3C3C5" />
            </div>
          </button>
          <div
            className="text-[#a8a8aa] text-xs text-center font-medium"
            style={{ fontFamily: 'Pretendard, Helvetica' }}
          >
            {t('studio:navigation.archive')}
          </div>
        </div>

        {/* Help button */}
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={() => {
              handleComingSoon();
            }}
            className={`inline-flex items-center justify-center w-14 h-10 px-3 py-2.5 rounded-[10px] transition-colors ${selectedMenu === 'help' ? 'bg-[#323232]' : 'hover:bg-[#323232]'}`}
          >
            <Users className="w-5 h-5" color="#A8A8AA" />
          </button>
          <div
            className="text-[#a8a8aa] text-xs text-center font-medium"
            style={{ fontFamily: 'Pretendard, Helvetica' }}
          >
            {t('studio:navigation.help')}
          </div>
        </div>
      </div>

      {/* Model Selection Popup */}
      {showModelPopup && (
        <ModelSelectPopup
          onClose={() => setShowModelPopup(false)}
          lang={lang}
        />
      )}
    </>
  );
}
