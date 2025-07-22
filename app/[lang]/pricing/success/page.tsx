import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import initTranslations from '@/lib/i18n-server';
import { i18n } from '@/i18n.config.mjs';

type Props = {
  params: { lang: string };
};

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function PaymentSuccessPage({ params }: Props) {
  const { lang } = await params;
  const { t } = await initTranslations(lang, ['common']);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <div className="text-center">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
        <h1 className="mt-4 text-3xl font-bold text-accent">
          {t('paymentSuccessTitle')}
        </h1>
        <p className="mt-2 text-lg text-slate-300">
          {t('paymentSuccessMessage')}
        </p>
        <div className="mt-8">
          <Link
            href={`/${lang}/studio`}
            className="rounded-md bg-accent px-6 py-3 text-lg font-semibold text-black transition hover:brightness-90"
          >
            {t('goToStudio')}
          </Link>
        </div>
      </div>
    </div>
  );
}
