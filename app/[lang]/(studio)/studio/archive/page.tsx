import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import initTranslations from '@/lib/i18n-server';

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

  redirect(`/${lang}/studio?tool=archive`);
}
