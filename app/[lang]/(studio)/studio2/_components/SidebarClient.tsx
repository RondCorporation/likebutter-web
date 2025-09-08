'use client';

import { useState } from 'react';
import Link from 'next/link';
import { X, Plus, Home, FolderOpen, HelpCircle } from 'lucide-react';
import Logo from '@/components/Logo';
import ModelSelectPopup from './ModelSelectPopup';
import { toast } from 'react-hot-toast';

export default function StudioSidebar({
  lang,
  onClose,
}: {
  lang: string;
  onClose: () => void;
}) {
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

  return (
    <aside className="flex h-full w-20 flex-col items-center gap-10 pt-6 pb-3 px-3 bg-[#323232] border-r border-[#4a4a4b]">
      {/* Logo */}
      <div className="flex items-center justify-center px-2 py-1">
        <Link href={`/${lang}`} className="md:hidden">
          <Logo className="text-2xl" />
        </Link>
        <button
          onClick={onClose}
          className="md:hidden text-slate-300 hover:text-white"
        >
          <X size={20} />
        </button>
      </div>

      {/* Main Navigation */}
      <div className="flex flex-col items-center gap-10 flex-1">
        <div className="flex flex-col w-14 items-center gap-6">
          {/* 만들기 버튼 */}
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={() => setShowModelPopup(true)}
              className="flex items-center justify-center w-[42px] h-[42px] bg-[#ffd93b] hover:bg-[#ffcc00] rounded-full p-3 transition-colors"
            >
              <Plus size={20} className="text-black" />
            </button>
            <span className="text-xs text-white text-center font-medium">
              만들기
            </span>
          </div>

          {/* 홈 버튼 */}
          <div className="flex flex-col items-center gap-1">
            <Link
              href={`/${lang}/studio2`}
              className="flex items-center justify-center w-[42px] h-[42px] rounded-lg p-3 hover:bg-white/10 transition-colors"
              onClick={onClose}
            >
              <Home size={20} className="text-[#89898b]" />
            </Link>
            <span className="text-xs text-[#a8a8aa] text-center font-medium">
              홈
            </span>
          </div>

          {/* 보관함 버튼 */}
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={handleComingSoon}
              className="flex items-center justify-center w-[42px] h-[42px] rounded-lg p-3 hover:bg-white/10 transition-colors"
            >
              <FolderOpen size={20} className="text-[#89898b]" />
            </button>
            <span className="text-xs text-[#a8a8aa] text-center font-medium">
              보관함
            </span>
          </div>

          {/* 도움말 버튼 */}
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={handleComingSoon}
              className="flex items-center justify-center w-[42px] h-[42px] rounded-lg p-3 hover:bg-white/10 transition-colors"
            >
              <HelpCircle size={20} className="text-[#89898b]" />
            </button>
            <span className="text-xs text-[#a8a8aa] text-center font-medium">
              도움말
            </span>
          </div>
        </div>
      </div>

      {/* Model Selection Popup */}
      {showModelPopup && (
        <ModelSelectPopup onClose={() => setShowModelPopup(false)} lang={lang} />
      )}
    </aside>
  );
}
