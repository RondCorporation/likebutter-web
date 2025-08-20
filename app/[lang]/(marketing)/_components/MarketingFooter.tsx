'use client';

import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import Logo from '@/app/_components/Logo';
import { usePathname } from 'next/navigation';
import { forwardRef } from 'react';

interface MarketingFooterProps {
  isSnapSection?: boolean;
  'data-section-index'?: number;
}

const MarketingFooter = forwardRef<HTMLElement, MarketingFooterProps>(
  ({ isSnapSection = false, ...props }, ref) => {
    const { t } = useTranslation();
    const pathname = usePathname();
    const lang = pathname.split('/')[1];

    const companyContactEmail = 'info@rondcorp.com';
    const businessInquiryEmail = 'biz@likebutter.ai';

    const footerClasses = `relative ${
      isSnapSection ? 'h-screen snap-start' : 'pt-24'
    }`;

    return (
      <footer className={footerClasses} ref={ref} {...props}>
        <div
          className={`w-full ${isSnapSection ? 'h-full flex flex-col justify-end' : ''}`}
        >
          <div
            className={`w-full bg-[#0A192F] flex flex-col justify-center items-center ${isSnapSection ? 'h-[calc(100%-6rem)] rounded-t-3xl' : 'py-16'}`}
          >
            <div className="container mx-auto px-4 sm:px-6">
              <div className="w-48 mx-auto mb-12">
                <Logo />
              </div>
              <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-4 md:text-left text-sm text-slate-400">
                <div className="space-y-3 md:col-span-2">
                  <h3 className="font-semibold text-base text-accent">
                    LIKEBUTTER
                  </h3>
                  <p className="text-slate-300">
                    © {new Date().getFullYear()} {t('companyName')}.{' '}
                    {t('footerRights')}
                  </p>
                  <p>{t('companyAddress')}</p>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-base text-white">
                    {t('footerNavigate')}
                  </h3>
                  <nav className="flex flex-col space-y-2 items-center md:items-start">
                    <Link
                      href={`/${lang}/pricing`}
                      className="w-fit transition-colors hover:text-accent"
                    >
                      {t('navPricing')}
                    </Link>
                    <Link
                      href={`/${lang}/studio`}
                      className="w-fit transition-colors hover:text-accent"
                    >
                      {t('footerStudioAccess')}
                    </Link>
                  </nav>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-base text-white">
                    {t('footerContactLegal')}
                  </h3>
                  <nav className="flex flex-col space-y-2 items-center md:items-start">
                    <a
                      href={`mailto:${businessInquiryEmail}`}
                      className="w-fit transition-colors hover:text-accent"
                    >
                      {t('footerBusinessInquiries')}
                    </a>
                    <a
                      href={`mailto:${companyContactEmail}`}
                      className="w-fit transition-colors hover:text-accent"
                    >
                      {t('footerGeneralSupport')}
                    </a>
                    <Link
                      href={`/${lang}/privacy`}
                      className="w-fit transition-colors hover:text-accent"
                    >
                      {t('footerPrivacyPolicy')}
                    </Link>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  }
);

MarketingFooter.displayName = 'MarketingFooter';

export default MarketingFooter;
