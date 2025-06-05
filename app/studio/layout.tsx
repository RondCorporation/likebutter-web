'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Home, Clock, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { useAssets } from '@/hooks/useAssets';
import AuthGuard from '@/components/AuthGuard';
import UserDropdown from '@/components/UserDropdown';
import Logo from '@/components/Logo';

const FIXED = [
  { href: '/studio', label: 'Home', icon: Home },
  { href: '/studio/history', label: 'History', icon: Clock },
];

const TOOLS = [
  { href: '/studio/ai-cover', label: 'AI Cover' },
  { href: '/studio/fan-art', label: 'AI Fan Art' },
  { href: '/studio/video', label: 'AI Video' },
  { href: '/studio/virtual-talk', label: 'Virtual Talk' },
];

const PAGE_TITLES: { [key: string]: string } = {
  '/studio': 'Studio Home',
  '/studio/history': 'History',
  '/studio/ai-cover': 'AI Cover',
  '/studio/fan-art': 'AI Fan Art',
  '/studio/video': 'AI Video',
  '/studio/virtual-talk': 'Virtual Talk',
};

export default function StudioLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [showMore, setShowMore] = useState(false);
  const { data: assets = ['Favorite', 'Private', 'Test'] } = useAssets();

  const displayed = showMore ? assets.slice(0, 5) : assets.slice(0, 2);

  let currentPageTitle = PAGE_TITLES[pathname] || 'Studio';
  if (pathname.startsWith('/studio/asset/')) {
    const assetName = pathname.split('/').pop();
    currentPageTitle = `Asset: ${assetName ? assetName.charAt(0).toUpperCase() + assetName.slice(1) : 'View'}`;
  }

  return (
    <AuthGuard>
      <div className="flex h-screen bg-black text-white">
        {/* ───────────── Left panel ───────────── */}
        <aside className="flex w-60 flex-col gap-1 overflow-y-auto border-r border-white/10 p-4 pt-6">
          {/* 루트 경로로 돌아가는 로고 버튼 */}
          <div className="mb-4 px-1 py-1">
            <Logo className="text-xl" />
          </div>

          {/* Fixed Links */}
          {FIXED.map(({ href, label, icon: Icon }) => (
            <Link
              href={href}
              key={href}
              className={`flex items-center gap-2 rounded-md px-3 py-2 hover:bg-white/10 ${
                pathname === href ? 'bg-white/10 font-medium' : ''
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
          {/* Assets */}
          <div className="mt-6 flex items-center justify-between text-xs uppercase tracking-wide text-slate-400 px-3">
            <span>Assets</span>
            <button className="hover:text-white">
              <Plus size={14} />
            </button>
          </div>
          {displayed.map((a) => (
            <Link
              key={a}
              href={`/studio/asset/${encodeURIComponent(a.toLowerCase())}`}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-white/10 text-slate-300"
            >
              <div className="w-4 h-4 rounded bg-slate-600" /> {a}
            </Link>
          ))}
          {assets.length > 2 && (
            <button
              className="flex items-center gap-1 px-3 py-1 text-xs text-slate-400 hover:text-white"
              onClick={() => setShowMore((p) => !p)}
            >
              {showMore ? (
                <>
                  <ChevronUp size={12} /> Less
                </>
              ) : (
                <>
                  <ChevronDown size={12} /> More ({assets.length - 2})
                </>
              )}
            </button>
          )}
          {/* Tools */}
          <div className="mt-6 text-xs uppercase tracking-wide text-slate-400 px-3">
            Tools
          </div>
          {TOOLS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-white/10 ${
                pathname === href
                  ? 'bg-white/10 font-medium text-white'
                  : 'text-slate-300'
              }`}
            >
              {label}
            </Link>
          ))}
        </aside>

        {/* ───────────── Right panel ───────────── */}
        <section className="flex-1 overflow-hidden flex flex-col">
          {/* Header */}
          <header className="p-6 border-b border-white/10 flex justify-between items-center flex-shrink-0 h-[73px]">
            <h2 className="text-2xl font-semibold">{currentPageTitle}</h2>
            <UserDropdown />
          </header>
          {/* Content Area */}
          <div className="flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15, ease: 'easeInOut' }}
                className="h-full overflow-y-auto p-6"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>
      </div>
    </AuthGuard>
  );
}
