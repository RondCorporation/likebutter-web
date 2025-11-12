import { redirect } from 'next/navigation';
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
    title: t('stylist.title'),
    description: t('stylist.description'),
    keywords: t('stylist.keywords'),
    path: '/studio?tool=stylist',
  });
}

export default async function StylistPage({ params }: Props) {
  const { lang } = await params;

  redirect(`/${lang}/studio?tool=stylist`);
}
