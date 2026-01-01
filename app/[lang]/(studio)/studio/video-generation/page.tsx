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
    title: t('videoGeneration.title'),
    description: t('videoGeneration.description'),
    keywords: t('videoGeneration.keywords'),
    path: '/studio?tool=video-generation',
  });
}

export default async function VideoGenerationPage({
  params,
  searchParams,
}: Props) {
  const { lang } = await params;

  redirect(`/${lang}/studio?tool=video-generation`);
}
