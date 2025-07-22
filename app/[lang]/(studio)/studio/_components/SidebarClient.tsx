'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
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
  UsersRound,
  TestTube,
} from 'lucide-react';
import { useAssets } from '@/hooks/useAssets';
import Logo from '@/components/Logo';

export default function StudioSidebar({ lang }: { lang: string }) {
  const pathname = usePathname();
  const { t } = useTranslation();

  const FIXED_LINKS = [
    { href: `/${lang}/studio`, label: t('studioNavHome'), icon: Home },
    {
      href: `/${lang}/studio/history`,
      label: t('studioNavHistory'),
      icon: Clock,
    },
  ];

  const BUTTER_TOOLS = [
    {
      href: `/${lang}/studio/butter-gen`,
      label: t('studioToolButterGen'),
      icon: UsersRound,
    },
    {
      href: `/${lang}/studio/butter-test`,
      label: t('studioToolButterTest'),
      icon: TestTube,
    },
    {
      href: `/${lang}/studio/butter-talks`,
      label: t('studioToolButterTalks'),
      icon: MessageCircle,
    },
    {
      href: `/${lang}/studio/butter-art`,
      label: t('studioToolButterBrush'),
      icon: Brush,
    },
    {
      href: `/${lang}/studio/butter-cover`,
      label: t('studioToolButterBeats'),
      icon: Music,
    },
    {
      href: `/${lang}/studio/butter-cuts`,
      label: t('studioToolButterCuts'),
      icon: Clapperboard,
    },
  ];

  const [showVault, setShowVault] = useState(false);
  const { data: vaultItems = ['Favorite', 'Private', 'Test'] } = useAssets();

  const displayedVaultItems = showVault ? vaultItems : vaultItems.slice(0, 2);

  return (
    <aside className="flex w-64 flex-col gap-1 overflow-y-auto border-r border-white/10 p-4 pt-6">
      <div className="mb-4 px-2 py-1">
        <Logo className="text-2xl" href={`/${lang}/studio`} />
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
        <span>{t('studioButterVault')}</span>
        <button className="rounded-full p-1 transition-colors hover:bg-white/10 hover:text-white">
          <Plus size={16} />
        </button>
      </div>
      {displayedVaultItems.map((item) => (
        <Link
          key={item}
          href={`/${lang}/studio/asset/${encodeURIComponent(item.toLowerCase())}`}
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
              <ChevronUp size={14} /> {t('studioShowLess')}
            </>
          ) : (
            <>
              <ChevronDown size={14} /> {t('studioShowMore')} (
              {vaultItems.length - 2})
            </>
          )}
        </button>
      )}

      <div className="mt-8 px-4 text-sm font-medium uppercase tracking-wider text-slate-400">
        {t('studioTools')}
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
  );
}
