'use client';

import { use } from 'react';
import { useTranslation } from 'react-i18next';
import { Crown } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import Logo from '@/components/Logo';
import StudioUserDropdown from '@/app/[lang]/(studio)/studio/_components/StudioUserDropdown';
import { useAuth } from '@/app/_hooks/useAuth';
import { useCredit } from '@/app/_hooks/useCredit';

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

  const handleUpgradeClick = () => {
    router.push(`/${lang}/billing`);
  };

  const showUpgradeButton = user?.planKey === 'FREE';

  if (variant === 'marketing') {
    return (
      <div className="flex h-16 items-center justify-between gap-2.5 px-4 md:px-8 py-5 w-full bg-studio-header border-b border-solid border-studio-border">
        <Logo className="relative flex-1 mt-[-3.00px] mb-[-1.00px] tracking-[0]" />

        <div className="inline-flex items-center justify-end gap-4 relative flex-[0_0_auto]">
          {isInitialized && isAuthenticated ? (
            <>
              {/* 스튜디오 이동 버튼 */}
              <Link
                href={`/${lang}/studio`}
                className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-md border-2 border-yellow-400 hover:bg-yellow-50 transition-colors"
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
    );
  }

  // Studio variant
  return (
    <div className="flex h-16 items-center justify-end gap-2.5 px-4 md:px-8 py-5 w-full bg-studio-header border-b border-solid border-studio-border md:fixed md:top-0 md:left-0 md:right-0 md:z-30">
      <Logo className="relative flex-1 mt-[-3.00px] mb-[-1.00px] tracking-[0]" />

      <div className="inline-flex items-center justify-end gap-4 relative flex-[0_0_auto]">
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
