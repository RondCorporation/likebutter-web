import { Metadata } from 'next';
import initTranslations from '@/lib/i18n-server';
import HistoryClient from './_components/HistoryClient';

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { lang } = await params;
  const { t } = await initTranslations(lang, ['common']);
  return {
    title: t('studioTitleHistory'),
    description: t('historySubtitle'),
  };
}

export default async function HistoryPage({ params }: Props) {
  const { lang } = await params;
  const { t } = await initTranslations(lang, ['common']);

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <h2 className="mb-2 text-2xl font-bold">{t('studioTitleHistory')}</h2>
        <p className="text-slate-400">{t('historySubtitle')}</p>
      </div>
      <HistoryClient />
    </div>
  );
}
