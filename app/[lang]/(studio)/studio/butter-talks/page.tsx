import { Metadata } from 'next';
import initTranslations from '@/lib/i18n-server';
import ButterTalksClient from './_components/ButterTalksClient';

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const { t } = await initTranslations(lang, ['common']);
  return {
    title: t('studioTitleButterTalks'),
    description: t('butterTalksSubtitle'),
  };
}

export default async function ButterTalksPage({ params }: Props) {
  const { lang } = await params;
  const { t } = await initTranslations(lang, ['common']);

  return (
    <div className="mx-auto max-w-xl text-center">
      <h2 className="mb-2 text-xl font-semibold">{t('butterTalksTitle')}</h2>
      <p className="mb-8 text-slate-400">{t('butterTalksSubtitle')}</p>
      <ButterTalksClient />
    </div>
  );
}
