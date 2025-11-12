import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import initTranslations from '@/app/_lib/i18n-server';
import { generateLocalizedMetadata } from '@/lib/seo/metadata';

type Props = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const { t } = await initTranslations(lang, ['seo']);

  return generateLocalizedMetadata({
    lang,
    title: t('fanmeetingStudio.title'),
    description: t('fanmeetingStudio.description'),
    keywords: t('fanmeetingStudio.keywords'),
    path: '/studio?tool=fanmeeting-studio',
  });
}

export default async function FanmeetingStudioPage({
  params,
  searchParams,
}: Props) {
  const { lang } = await params;
  const search = await searchParams;

  const queryString = new URLSearchParams();
  queryString.set('tool', 'fanmeeting-studio');

  if (search.style && typeof search.style === 'string') {
    queryString.set('style', search.style);
  }

  redirect(`/${lang}/studio?${queryString.toString()}`);
}
