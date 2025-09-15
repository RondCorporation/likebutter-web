'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Plus, Home, FolderOpen, Users, MoreHorizontal } from 'lucide-react';
import { toast } from 'react-hot-toast';
import ModelSelectPopup from './ModelSelectPopup';

interface MobileBottomNavigationProps {
  lang: string;
}

export default function MobileBottomNavigation({
  lang,
}: MobileBottomNavigationProps) {
  const pathname = usePathname();
  const [showModelPopup, setShowModelPopup] = useState(false);

  const handleComingSoon = () => {
    toast('준비 중인 기능입니다.', {
      icon: '🚧',
      style: {
        background: '#333',
        color: '#fff',
      },
    });
  };

  // 현재 선택된 메뉴 확인
  const getSelectedMenu = () => {
    if (pathname === `/${lang}/studio`) return 'home';
    if (pathname === `/${lang}/studio/vault`) return 'vault';
    if (pathname === `/${lang}/studio/help`) return 'help';
    return '';
  };

  const selectedMenu = getSelectedMenu();

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-studio-header border-t border-studio-border">
        <div
          className="flex items-center justify-around px-4 py-2"
          style={{ paddingBottom: 'max(8px, env(safe-area-inset-bottom))' }}
        >
          {/* 홈 */}
          <Link
            href={`/${lang}/studio`}
            className="flex flex-col items-center py-2 px-3"
          >
            <div
              className={`p-2 rounded-lg transition-colors ${
                selectedMenu === 'home' ? 'bg-studio-main' : ''
              }`}
            >
              <Home
                className="w-6 h-6"
                color={selectedMenu === 'home' ? '#ffd93b' : '#89898B'}
              />
            </div>
            <span
              className={`text-xs mt-1 font-pretendard ${
                selectedMenu === 'home'
                  ? 'text-studio-button-primary'
                  : 'text-studio-text-secondary'
              }`}
            >
              홈
            </span>
          </Link>

          {/* 보관함 */}
          <button
            onClick={handleComingSoon}
            className="flex flex-col items-center py-2 px-3"
          >
            <div
              className={`p-2 rounded-lg transition-colors ${
                selectedMenu === 'vault' ? 'bg-studio-main' : ''
              }`}
            >
              <FolderOpen
                className="w-6 h-6"
                color={selectedMenu === 'vault' ? '#ffd93b' : '#C3C3C5'}
              />
            </div>
            <span
              className={`text-xs mt-1 font-pretendard ${
                selectedMenu === 'vault'
                  ? 'text-studio-button-primary'
                  : 'text-studio-text-secondary'
              }`}
            >
              보관함
            </span>
          </button>

          {/* 만들기 (중앙, 더 큰 버튼) */}
          <button
            onClick={() => setShowModelPopup(true)}
            className="flex flex-col items-center py-1 px-3"
          >
            <div className="p-3 rounded-full bg-studio-button-primary hover:bg-studio-button-hover transition-colors shadow-lg">
              <Plus className="w-7 h-7 text-studio-header" />
            </div>
            <span className="text-xs mt-1 font-pretendard text-studio-text-primary">
              만들기
            </span>
          </button>

          {/* 도움말 */}
          <button
            onClick={handleComingSoon}
            className="flex flex-col items-center py-2 px-3"
          >
            <div
              className={`p-2 rounded-lg transition-colors ${
                selectedMenu === 'help' ? 'bg-studio-main' : ''
              }`}
            >
              <Users
                className="w-6 h-6"
                color={selectedMenu === 'help' ? '#ffd93b' : '#A8A8AA'}
              />
            </div>
            <span
              className={`text-xs mt-1 font-pretendard ${
                selectedMenu === 'help'
                  ? 'text-studio-button-primary'
                  : 'text-studio-text-secondary'
              }`}
            >
              도움말
            </span>
          </button>

          {/* 더보기 */}
          <button
            onClick={handleComingSoon}
            className="flex flex-col items-center py-2 px-3"
          >
            <div className="p-2 rounded-lg transition-colors">
              <MoreHorizontal className="w-6 h-6" color="#A8A8AA" />
            </div>
            <span className="text-xs mt-1 font-pretendard text-studio-text-secondary">
              더보기
            </span>
          </button>
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
