import { Metadata } from 'next';
import initTranslations from '@/lib/i18n-server';
import ButterGenClient from './_components/ButterGenClient';

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const { t } = await initTranslations(lang, ['common']);
  return {
    title: t('studioTitleButterGen'),
    description: t('butterGenSubtitle'),
  };
}

export default async function ButterGenPage({ params }: Props) {
  const { lang } = await params;
  const { t } = await initTranslations(lang, ['common']);

  return (
    <div className="mx-auto max-w-4xl">
      <h2 className="mb-2 text-xl font-semibold">{t('butterGenTitle')}</h2>
      <p className="mb-8 text-slate-400">{t('butterGenSubtitle')}</p>
      <ButterGenClient />
    </div>
  );
}
