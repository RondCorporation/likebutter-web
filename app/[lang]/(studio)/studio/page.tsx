import StudioRouter from './_components/StudioRouter';
import { Metadata } from 'next';
import initTranslations from '@/app/_lib/i18n-server';
import { generateLocalizedMetadata } from '@/lib/seo/metadata';

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const { t } = await initTranslations(lang, ['seo']);

  return generateLocalizedMetadata({
    lang,
    title: t('studio.title'),
    description: t('studio.description'),
    keywords: t('studio.keywords'),
    path: '/studio',
  });
}

export default async function StudioPage({ params }: Props) {
  const { lang } = await params;

  return <StudioRouter lang={lang} />;
}
