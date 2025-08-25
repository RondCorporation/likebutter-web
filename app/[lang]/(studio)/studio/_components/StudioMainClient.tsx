'use client';

import { ReactNode, memo, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import UserDropdown from '@/components/UserDropdown';

export default memo(function StudioMainClient({
  children,
  lang,
}: {
  children: ReactNode;
  lang: string;
}) {
  const pathname = usePathname();
  const { t } = useTranslation();

  const currentPageTitle = useMemo(() => {
    const PAGE_TITLES: { [key: string]: string } = {
      [`/${lang}/studio`]: t('studioTitleHome'),
      [`/${lang}/studio/history`]: t('studioTitleHistory'),
      [`/${lang}/studio/butter-gen`]: t('studioTitleButterGen'),
      [`/${lang}/studio/butter-test`]: t('studioTitleButterTest'),
      [`/${lang}/studio/butter-cover`]: t('studioTitleButterCover'),
      [`/${lang}/studio/butter-art`]: t('studioTitleButterBrush'),
      [`/${lang}/studio/butter-cuts`]: t('studioTitleButterCuts'),
      [`/${lang}/studio/butter-talks`]: t('studioTitleButterTalks'),
    };

    let title = PAGE_TITLES[pathname] || 'Studio';
    if (pathname.startsWith(`/${lang}/studio/asset/`)) {
      const assetName = pathname.split('/').pop();
      title = t('studioVaultTitle', {
        assetName: assetName
          ? assetName.charAt(0).toUpperCase() + assetName.slice(1)
          : 'View',
      });
    }
    return title;
  }, [pathname, lang, t]);

  return (
    <section className="flex flex-1 flex-col overflow-hidden">
      {/* This header is for desktop view */}
      <header className="hidden h-[73px] flex-shrink-0 items-center justify-between border-b border-white/10 p-6 md:flex">
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
  );
});
