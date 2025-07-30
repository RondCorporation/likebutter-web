'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const lang = pathname.split('/')[1];

  const companyContactEmail = 'info@rondcorp.com';
  const businessInquiryEmail = 'biz@likebutter.ai';

  return (
    <footer className="snap-end flex-none bg-black/90 px-8 py-12 text-sm text-slate-400">
      <div className="container mx-auto grid grid-cols-1 gap-10 md:grid-cols-4">
        {/* Column 1: Company Info */}
        <div className="space-y-3 md:col-span-2">
          <h3 className="font-semibold text-base text-accent">LIKEBUTTER</h3>
          <p className="text-slate-300">
            © {new Date().getFullYear()} {t('companyName')}.{' '}
            {t('footerRights')}
          </p>
          <p>{t('companyAddress')}</p>
        </div>

        {/* Column 2: Links */}
        <div className="space-y-3">
          <h3 className="font-semibold text-base text-white">
            {t('footerNavigate')}
          </h3>
          <nav className="flex flex-col space-y-2">
            <Link
              href={`/${lang}/#features`}
              className="w-fit transition-colors hover:text-accent"
            >
              {t('navFeatures')}
            </Link>
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

        {/* Column 3: Contact & Legal */}
        <div className="space-y-3">
          <h3 className="font-semibold text-base text-white">
            {t('footerContactLegal')}
          </h3>
          <nav className="flex flex-col space-y-2">
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
    </footer>
  );
}
