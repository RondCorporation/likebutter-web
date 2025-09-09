'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Plus, Home, FolderOpen, Users } from 'lucide-react';
import { toast } from 'react-hot-toast';
import ModelSelectPopup from './ModelSelectPopup';

interface StudioSidebarProps {
  lang: string;
}

export default function StudioSidebar({ lang }: StudioSidebarProps) {
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

  // 현재 선택된 메뉴 확인 - Digital Goods 페이지에서는 아무것도 선택되지 않음
  const getSelectedMenu = () => {
    if (pathname === `/${lang}/studio`) return 'home';
    if (pathname === `/${lang}/studio/vault`) return 'vault';
    if (pathname === `/${lang}/studio/help`) return 'help';
    // digital-goods 페이지에서는 아무것도 선택되지 않음
    return '';
  };

  const selectedMenu = getSelectedMenu();

  return (
    <>
      {/* 화면 전체 높이를 사용하는 사이드바 */}
      <div className="flex flex-col w-20 items-center gap-6 pt-6 pb-3 px-3 bg-[#202020] border-r border-solid border-[#4a4a4b]">
        {/* 만들기 버튼 */}
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
            만들기
          </div>
        </div>

        {/* 홈 버튼 */}
        <div className="flex flex-col items-center gap-1">
          <Link href={`/${lang}/studio`}>
            <div
              className={`inline-flex items-center justify-center w-14 h-10 px-3 py-2.5 rounded-md transition-colors ${selectedMenu === 'home' ? 'bg-[#323232]' : 'hover:bg-[#323232]'}`}
            >
              <Home className="w-5 h-5" color="#89898B" />
            </div>
          </Link>
          <div
            className="text-[#a8a8aa] text-xs text-center font-medium"
            style={{ fontFamily: 'Pretendard, Helvetica' }}
          >
            홈
          </div>
        </div>

        {/* 보관함 버튼 */}
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={() => {
              // 실제 보관함 페이지가 구현되면 라우팅하고, 지금은 준비중 메시지
              handleComingSoon();
            }}
            className={`inline-flex items-center justify-center w-14 h-10 px-3 py-2.5 rounded-[10px] transition-colors ${selectedMenu === 'vault' ? 'bg-[#323232]' : 'hover:bg-[#323232]'}`}
          >
            <FolderOpen className="w-5 h-5" color="#C3C3C5" />
          </button>
          <div
            className="text-[#a8a8aa] text-xs text-center font-medium"
            style={{ fontFamily: 'Pretendard, Helvetica' }}
          >
            보관함
          </div>
        </div>

        {/* 도움말 버튼 */}
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={() => {
              // 실제 도움말 페이지가 구현되면 라우팅하고, 지금은 준비중 메시지
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
            도움말
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
