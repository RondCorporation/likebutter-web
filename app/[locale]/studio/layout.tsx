'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Home,
  Clock,
  Plus,
  ChevronDown,
  ChevronUp,
  Music,
  Brush,
  Clapperboard,
  MessageCircle,
} from 'lucide-react';
import { useAssets } from '@/hooks/useAssets';
import AuthGuard from '@/components/AuthGuard';
import UserDropdown from '@/components/UserDropdown';
import Logo from '@/components/Logo';

const FIXED_LINKS = [
  { href: '/studio', label: 'Home', icon: Home },
  { href: '/studio/history', label: 'History', icon: Clock },
];

const BUTTER_TOOLS = [
  { href: '/studio/butter-talks', label: 'ButterTalks', icon: MessageCircle },
  { href: '/studio/butter-art', label: 'ButterBrush', icon: Brush },
  { href: '/studio/butter-cover', label: 'ButterBeats', icon: Music },
  { href: '/studio/butter-cuts', label: 'ButterCuts', icon: Clapperboard },
];

const PAGE_TITLES: { [key: string]: string } = {
  '/studio': 'Studio Home',
  '/studio/history': 'My History',
  '/studio/butter-cover': 'ButterBeats',
  '/studio/butter-art': 'ButterBrush',
  '/studio/butter-cuts': 'ButterCuts',
  '/studio/butter-talks': 'ButterTalks',
};

export default function StudioLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const [showVault, setShowVault] = useState(false);
  const { data: vaultItems = ['Favorite', 'Private', 'Test'] } = useAssets();

  const displayedVaultItems = showVault ? vaultItems : vaultItems.slice(0, 2);

  let currentPageTitle = PAGE_TITLES[pathname] || 'Studio';
  if (pathname.startsWith('/studio/asset/')) {
    const assetName = pathname.split('/').pop();
    currentPageTitle = `Vault: ${assetName ? assetName.charAt(0).toUpperCase() + assetName.slice(1) : 'View'}`;
  }

  return (
    <AuthGuard>
      <div className="flex h-screen bg-black text-white">
        <aside className="flex w-64 flex-col gap-1 overflow-y-auto border-r border-white/10 p-4 pt-6">
          <div className="mb-4 px-2 py-1">
            <Logo className="text-2xl" href="/studio" />
          </div>

          {FIXED_LINKS.map(({ href, label, icon: Icon }) => (
            <Link
              href={href}
              key={href}
              className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm transition-colors hover:bg-white/10 ${
                pathname === href
                  ? 'bg-white/10 font-semibold text-white'
                  : 'text-slate-300'
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}

          <div className="mt-8 flex items-center justify-between px-4 text-sm font-medium uppercase tracking-wider text-slate-400">
            <span>ButterVault</span>
            <button className="rounded-full p-1 transition-colors hover:bg-white/10 hover:text-white">
              <Plus size={16} />
            </button>
          </div>
          {displayedVaultItems.map((item) => (
            <Link
              key={item}
              href={`/studio/asset/${encodeURIComponent(item.toLowerCase())}`}
              className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
            >
              <div className="h-2 w-2 rounded-full bg-slate-500" /> {item}
            </Link>
          ))}
          {vaultItems.length > 2 && (
            <button
              className="flex items-center gap-2 px-4 py-1.5 text-xs text-slate-400 transition-colors hover:text-white"
              onClick={() => setShowVault((p) => !p)}
            >
              {showVault ? (
                <>
                  <ChevronUp size={14} /> Show Less
                </>
              ) : (
                <>
                  <ChevronDown size={14} /> Show More ({vaultItems.length - 2})
                </>
              )}
            </button>
          )}

          <div className="mt-8 px-4 text-sm font-medium uppercase tracking-wider text-slate-400">
            Tools
          </div>
          {BUTTER_TOOLS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm transition-colors hover:bg-white/10 ${
                pathname === href
                  ? 'bg-white/10 font-semibold text-white'
                  : 'text-slate-300'
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </aside>

        <section className="flex flex-1 flex-col overflow-hidden">
          <header className="flex h-[73px] flex-shrink-0 items-center justify-between border-b border-white/10 p-6">
            <h2 className="text-2xl font-semibold">{currentPageTitle}</h2>
            <UserDropdown />
          </header>

          <main className="flex-1 overflow-hidden">
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
          </main>
        </section>
      </div>
    </AuthGuard>
  );
}
