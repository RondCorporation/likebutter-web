'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Home, Clock, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { useAssets } from '@/hooks/useAssets';

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

export default function StudioLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [showMore, setShowMore] = useState(false);
  const { data: assets = ['Favorite', 'Private', 'Test'] } = useAssets();

  const displayed = showMore ? assets.slice(0, 5) : assets.slice(0, 2);

  return (
    <div className="flex h-screen bg-black text-white">
      {/* ───────────── Left panel ───────────── */}
      <aside className="flex w-60 flex-col gap-2 overflow-y-auto border-r border-white/10 p-4">
        {FIXED.map(({ href, label, icon: Icon }) => (
          <Link
            href={href}
            key={href}
            className={`flex items-center gap-2 rounded-md px-3 py-2 hover:bg-white/10 ${
              pathname === href ? 'bg-white/10' : ''
            }`}
          >
            <Icon size={16} />
            {label}
          </Link>
        ))}

        {/* Assets */}
        <div className="mt-6 flex items-center justify-between text-xs uppercase tracking-wide text-slate-400">
          <span>Assets</span>
          <button>
            <Plus size={14} />
          </button>
        </div>
        {displayed.map((a) => (
          <Link
            key={a}
            href={`/studio/asset/${encodeURIComponent(a.toLowerCase())}`}
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-white/10"
          >
            <Home size={14} />
            {a}
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
                <ChevronDown size={12} /> More
              </>
            )}
          </button>
        )}

        {/* Tools */}
        <div className="mt-6 text-xs uppercase tracking-wide text-slate-400">
          Tools
        </div>
        {TOOLS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-white/10 ${
              pathname === href ? 'bg-white/10' : ''
            }`}
          >
            {label}
          </Link>
        ))}
      </aside>

      {/* ───────────── Right panel ───────────── */}
      <section className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.15 }}
            className="h-full overflow-auto p-6"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </section>
    </div>
  );
}
