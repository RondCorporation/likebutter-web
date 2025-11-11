'use client';

import { use, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Crown, Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import Logo from '@/components/Logo';
import StudioUserDropdown from '@/app/[lang]/(studio)/studio/_components/StudioUserDropdown';
import { useAuth } from '@/app/_hooks/useAuth';
import { useCredit } from '@/app/_hooks/useCredit';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  variant: 'marketing' | 'studio';
  params?: Promise<{ lang: string }>;
}

export default function Header({ variant, params }: HeaderProps) {
  const pathname = usePathname();
  const lang = pathname.split('/')[1];
  const { t } = useTranslation(['studio', 'common']);
  const router = useRouter();
  const { user, isAuthenticated, isInitialized, hasTokenFromServer } =
    useAuth();
  const { currentBalance, isLoading: isCreditLoading } = useCredit();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleUpgradeClick = () => {
    router.push(`/${lang}/billing`);
  };

  const showUpgradeButton = user?.planKey === 'FREE';

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  if (variant === 'marketing') {
    return (
      <div className="fixed top-0 left-0 right-0 flex h-16 items-center justify-between px-4 md:px-8 py-5 w-full bg-studio-header border-b border-solid border-studio-border z-50">
        <div className="flex-shrink-0">
          <Logo className="mt-[-3.00px] mb-[-1.00px] tracking-[0] scale-90 sm:scale-100" />
        </div>

        <div className="inline-flex items-center justify-end gap-3 sm:gap-4 relative flex-[0_0_auto]">
          {isInitialized && isAuthenticated ? (
            <>
              <Link
                href={`/${lang}/studio`}
                className="inline-flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-[6px] border border-yellow-400 hover:bg-yellow-50 transition-colors min-h-[32px] sm:min-h-[36px]"
              >
                <span className="font-semibold text-[13px] sm:text-[15px] text-yellow-400 whitespace-nowrap">
                  {t('common:goToStudio')}
                </span>
              </Link>

              <div className="inline-flex items-center justify-center relative flex-[0_0_auto]">
                <StudioUserDropdown />
              </div>
            </>
          ) : !isInitialized && hasTokenFromServer ? (
            <div className="w-[200px] sm:w-[240px] h-[36px]" />
          ) : (
            <>
              <Link
                href={`/${lang}/signup`}
                className="text-studio-text-secondary hover:text-studio-text-primary text-[13px] sm:text-[15px] transition-colors font-semibold"
              >
                {t('common:signUp')}
              </Link>

              <Link
                href={`/${lang}/login`}
                className="inline-flex items-center justify-center rounded-[6px] bg-transparent border border-[#FFD93B] px-3 sm:px-4 py-1.5 sm:py-2 text-[13px] sm:text-[15px] font-semibold text-[#FFD93B] transition-all duration-300 hover:bg-[#FFD93B] hover:text-black min-h-[32px] sm:min-h-[36px]"
              >
                {t('common:login')}
              </Link>
            </>
          )}
        </div>
      </div>
    );
  }

  // Studio variant
  return (
    <div className="relative flex h-16 items-center justify-between px-4 md:px-8 py-5 w-full bg-studio-header border-b border-solid border-studio-border md:fixed md:top-0 md:left-0 md:right-0 z-50">
      {/* Logo - Left */}
      <div className="flex-shrink-0">
        <Logo className="mt-[-3.00px] mb-[-1.00px] tracking-[0] scale-90 sm:scale-100" />
      </div>

      <div className="inline-flex items-center justify-end gap-2 md:gap-4 relative">
        {/* Credit Information - Desktop only */}
        <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-md bg-studio-sidebar border border-studio-border">
          <Image
            src="/credit.svg"
            alt="credit"
            width={16}
            height={16}
            className="flex-shrink-0"
          />
          <span className="text-studio-text-primary text-sm font-semibold">
            {isCreditLoading ? '...' : currentBalance.toLocaleString()}
          </span>
          <span className="text-studio-text-secondary text-xs">
            {t('studio:userDropdown.credits')}
          </span>
        </div>

        {/* Upgrade Button - Desktop only, FREE plan users only */}
        {showUpgradeButton && (
          <button
            onClick={handleUpgradeClick}
            className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-md border-2 border-yellow-400 hover:bg-yellow-50 transition-colors"
          >
            <Crown className="w-4 h-4 text-yellow-400" />
            <span className="font-semibold text-sm text-yellow-400 whitespace-nowrap">
              {t('studio:userDropdown.upgradePlan')}
            </span>
          </button>
        )}

        {/* User Dropdown - Mobile & Desktop */}
        <div className="inline-flex items-center justify-center relative flex-[0_0_auto]">
          <StudioUserDropdown />
        </div>
      </div>
    </div>
  );
}
