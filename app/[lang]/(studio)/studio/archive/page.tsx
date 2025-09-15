import { Metadata } from 'next';
import initTranslations from '@/lib/i18n-server';
import ArchiveClient from './_components/ArchiveClient';

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
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

  return <ArchiveClient />;
}
