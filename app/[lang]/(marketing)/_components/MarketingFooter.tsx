'use client';

import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import Logo from '@/app/_components/Logo';
import { usePathname } from 'next/navigation';
import { forwardRef, useState } from 'react';
import { COMPANY_INFO } from '@/app/_lib/companyInfo';
import FeedbackPopup from '@/app/_components/ui/FeedbackPopup';

interface MarketingFooterProps {
  isSnapSection?: boolean;
  'data-section-index'?: number;
}

const MarketingFooter = forwardRef<HTMLElement, MarketingFooterProps>(
  ({ isSnapSection = false, ...props }, ref) => {
    const { t } = useTranslation(['marketing', 'common']);
    const pathname = usePathname();
    const lang = pathname.split('/')[1];
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

    const footerClasses = `relative ${isSnapSection ? 'h-screen snap-start flex flex-col justify-end' : 'pt-12'}`;

    const footerContentClasses = isSnapSection
      ? 'rounded-t-[3rem] pt-20 pb-8'
      : 'pt-20 pb-8';

    return (
      <footer className={footerClasses} ref={ref} {...props}>
        <div className="w-full">
          <div
            className={`w-full ${footerContentClasses}`}
            style={{ backgroundColor: '#131313' }}
          >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
              {/* Logo Section */}
              <div className="text-center mb-8">
                <div className="w-56 mx-auto mb-6">
                  <Logo />
                </div>
                <p className="text-lg text-slate-300 font-light max-w-2xl mx-auto">
                  {t('fandomParadigm')}
                </p>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 lg:gap-8 mb-8">
                {/* Services Section */}
                <div className="space-y-4">
                  <h3 className="font-bold text-lg text-white mb-6">
                    {t('footerServices')}
                  </h3>
                  <nav className="flex flex-col space-y-3 text-sm">
                    <Link
                      href={`/${lang}/billing`}
                      className="text-slate-400 hover:text-accent transition-colors duration-200 w-fit"
                    >
                      {t('navPricing')}
                    </Link>
                    <Link
                      href={`/${lang}/studio`}
                      className="text-slate-400 hover:text-accent transition-colors duration-200 w-fit"
                    >
                      {t('footerStudioAccess')}
                    </Link>
                  </nav>
                </div>

                {/* Support Section */}
                <div className="space-y-4">
                  <h3 className="font-bold text-lg text-white mb-6">
                    {t('customerCenter')}
                  </h3>
                  <nav className="flex flex-col space-y-3 text-sm">
                    <button
                      onClick={() => setIsFeedbackOpen(true)}
                      className="text-slate-400 hover:text-accent transition-colors duration-200 w-fit text-left"
                    >
                      {t('marketing:footer.feedback')}
                    </button>
                    <a
                      href={`mailto:${COMPANY_INFO.contact.business}`}
                      className="text-slate-400 hover:text-accent transition-colors duration-200 w-fit"
                    >
                      {t('marketing:footer.businessInquiries')}
                    </a>
                  </nav>
                </div>

                {/* Legal Section */}
                <div className="space-y-4">
                  <h3 className="font-bold text-lg text-white mb-6">
                    {t('footerContactLegal')}
                  </h3>
                  <nav className="flex flex-col space-y-3 text-sm">
                    <Link
                      href={`/${lang}/privacy`}
                      className="text-slate-400 hover:text-accent transition-colors duration-200 w-fit"
                    >
                      {t('footerPrivacyPolicy')}
                    </Link>
                    <Link
                      href={`/${lang}/terms`}
                      className="text-slate-400 hover:text-accent transition-colors duration-200 w-fit"
                    >
                      {t('termsOfService')}
                    </Link>
                  </nav>
                </div>

                {/* Business Info Section - PG Compliance */}
                <div className="space-y-4">
                  <h3 className="font-bold text-lg text-white mb-6">
                    {t('footerBusinessInfo')}
                  </h3>
                  <div className="flex flex-col space-y-3 text-xs text-slate-400">
                    <div>
                      <span className="text-slate-500 block mb-1">{t('marketing:footer.companyName')}</span>
                      <span>{t('companyName')}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block mb-1">{t('marketing:footer.ceo')}</span>
                      <span>{t('companyCEO')}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block mb-1">
                        {t('marketing:footer.businessNumber')}
                      </span>
                      <span>{t('companyBusinessNumber')}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block mb-1">
                        {t('marketing:footer.businessAddress')}
                      </span>
                      <span>{t('companyFullAddress')}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block mb-1">
                        {t('marketing:footer.customerCenter')}
                      </span>
                      <div className="space-y-1">
                        <div>
                          <span className="text-slate-400">{t('marketing:footer.phone')} </span>
                          <a
                            href={`tel:${COMPANY_INFO.contact.phone}`}
                            className="hover:text-accent transition-colors duration-200"
                          >
                            {COMPANY_INFO.contact.phone}
                          </a>
                        </div>
                        <div>
                          <span className="text-slate-400">{t('marketing:footer.email')} </span>
                          <a
                            href={`mailto:${COMPANY_INFO.contact.support}`}
                            className="hover:text-accent transition-colors duration-200"
                          >
                            {COMPANY_INFO.contact.support}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Section */}
              <div className="border-t border-slate-700 pt-4">
                <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
                  <div className="text-sm text-slate-500 text-center lg:text-left">
                    <p>
                      © {new Date().getFullYear()} {t('companyName')}.{' '}
                      {t('footerRights')}
                    </p>
                  </div>
                  <div className="text-sm text-slate-500 text-center lg:text-right">
                    <p>{t('companyBusinessSector')}</p>
                    <p>{t('companyBusinessDescription')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* {t('marketing:footer.feedbackPopup')} */}
        <FeedbackPopup
          isOpen={isFeedbackOpen}
          onClose={() => setIsFeedbackOpen(false)}
        />
      </footer>
    );
  }
);

MarketingFooter.displayName = 'MarketingFooter';

export default MarketingFooter;
