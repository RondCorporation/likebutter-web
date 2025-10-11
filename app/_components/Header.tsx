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
  const { user, isAuthenticated, isInitialized } = useAuth();
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
      <>
        <div className="relative flex h-16 items-center px-4 md:px-8 py-5 w-full bg-studio-header border-b border-solid border-studio-border z-50">
          {/* Mobile: Hamburger (Left) */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-1.5 text-white hover:text-[#FFD93B] transition-colors relative z-10"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Logo - Absolute center on mobile, normal flow on desktop */}
          <div className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 md:flex-1">
            <Logo className="mt-[-3.00px] mb-[-1.00px] tracking-[0] scale-110 md:scale-100" />
          </div>

          {/* Mobile: Profile Icon (Right) */}
          <div className="md:hidden ml-auto relative z-10">
            <StudioUserDropdown variant="mobile-marketing" />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:inline-flex items-center justify-end gap-4 relative flex-[0_0_auto]">
            {isInitialized && isAuthenticated ? (
              <>
                {/* 스튜디오 이동 버튼 */}
                <Link
                  href={`/${lang}/studio`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md border-2 border-yellow-400 hover:bg-yellow-50 transition-colors"
                >
                  <span className="font-semibold text-sm text-yellow-400 whitespace-nowrap">
                    {t('common:goToStudio')}
                  </span>
                </Link>

                <div className="inline-flex items-center justify-center gap-4 relative flex-[0_0_auto]">
                  <StudioUserDropdown />
                </div>
              </>
            ) : (
              <>
                {/* 회원가입 (회색 글자) */}
                <Link
                  href={`/${lang}/signup`}
                  className="text-studio-text-secondary hover:text-studio-text-primary text-sm transition-colors"
                >
                  {t('common:signUp')}
                </Link>

                {/* 로그인 (노란색 테두리 버튼) */}
                <Link
                  href={`/${lang}/login`}
                  className="rounded-[16px] bg-transparent border border-[#FFD93B] px-5 py-2 text-sm font-bold text-[#FFD93B] transition-all duration-300 hover:bg-[#FFD93B] hover:text-black"
                >
                  {t('common:login')}
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Hamburger Menu - Extended Header Style */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="md:hidden bg-studio-header border-b border-studio-border overflow-hidden"
            >
              <div className="px-4 py-6">
                {isInitialized && isAuthenticated ? (
                  <>
                    {/* Navigation Links */}
                    <nav className="space-y-1 mb-6">
                      <a
                        href="#about"
                        onClick={(e) => {
                          e.preventDefault();
                          closeMobileMenu();
                          setTimeout(() => {
                            document.getElementById('about')?.scrollIntoView({
                              behavior: 'smooth',
                              block: 'start',
                            });
                          }, 100);
                        }}
                        className="flex items-center justify-between px-4 py-3 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-all text-base"
                      >
                        <span>라이크버터 소개</span>
                        <span className="text-white/40">→</span>
                      </a>
                      <a
                        href="#pricing"
                        onClick={(e) => {
                          e.preventDefault();
                          closeMobileMenu();
                          setTimeout(() => {
                            document.getElementById('pricing')?.scrollIntoView({
                              behavior: 'smooth',
                              block: 'start',
                            });
                          }, 100);
                        }}
                        className="flex items-center justify-between px-4 py-3 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-all text-base"
                      >
                        <span>요금제</span>
                        <span className="text-white/40">→</span>
                      </a>
                    </nav>
                  </>
                ) : (
                  <>
                    {/* Navigation Links */}
                    <nav className="space-y-1 mb-6">
                      <a
                        href="#about"
                        onClick={(e) => {
                          e.preventDefault();
                          closeMobileMenu();
                          setTimeout(() => {
                            document.getElementById('about')?.scrollIntoView({
                              behavior: 'smooth',
                              block: 'start',
                            });
                          }, 100);
                        }}
                        className="flex items-center justify-between px-4 py-3 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-all text-base"
                      >
                        <span>라이크버터 소개</span>
                        <span className="text-white/40">→</span>
                      </a>
                      <a
                        href="#pricing"
                        onClick={(e) => {
                          e.preventDefault();
                          closeMobileMenu();
                          setTimeout(() => {
                            document.getElementById('pricing')?.scrollIntoView({
                              behavior: 'smooth',
                              block: 'start',
                            });
                          }, 100);
                        }}
                        className="flex items-center justify-between px-4 py-3 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-all text-base"
                      >
                        <span>요금제</span>
                        <span className="text-white/40">→</span>
                      </a>
                    </nav>

                    {/* Bottom Auth Buttons */}
                    <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                      <Link
                        href={`/${lang}/signup`}
                        onClick={closeMobileMenu}
                        className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-lg border border-white/20 text-white/80 hover:text-white hover:border-white/40 font-medium text-sm transition-all active:scale-95"
                      >
                        {t('common:signUp')}
                      </Link>
                      <Link
                        href={`/${lang}/login`}
                        onClick={closeMobileMenu}
                        className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-[#FFD93B] text-black font-semibold text-sm transition-all duration-200 hover:bg-[#FFC93B] active:scale-95"
                      >
                        {t('common:login')}
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Studio variant
  return (
    <div className="relative flex h-16 items-center px-4 md:px-8 py-5 w-full bg-studio-header border-b border-solid border-studio-border md:fixed md:top-0 md:left-0 md:right-0 z-50">
      {/* Logo - Absolute center on mobile, normal flow on desktop */}
      <div className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 md:flex-1">
        <Logo className="mt-[-3.00px] mb-[-1.00px] tracking-[0] scale-110 md:scale-100" />
      </div>

      <div className="ml-auto inline-flex items-center justify-end gap-4 relative z-10">
        {/* Credit Information */}
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

        {/* Upgrade Button - Only for FREE plan users */}
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

        <div className="inline-flex items-center justify-center gap-4 relative flex-[0_0_auto]">
          <StudioUserDropdown />
        </div>
      </div>
    </div>
  );
}
