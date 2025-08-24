import { Metadata } from 'next';
import initTranslations from '@/lib/i18n-server';
import PricingClient from './_components/PricingClient';
import TranslationsProvider from '@/app/_components/TranslationsProvider';

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const { t } = await initTranslations(lang, ['common']);
  return {
    title: t('pricingTitle'),
    description: t('pricingSubtitle'),
  };
}

export default async function PricingPage({ params }: Props) {
  const { lang } = await params;
  const { resources } = await initTranslations(lang, ['common']);

  return (
    <TranslationsProvider
      namespaces={['common']}
      locale={lang}
      resources={resources}
    >
      <PricingClient lang={lang} />
    </TranslationsProvider>
  );
}
