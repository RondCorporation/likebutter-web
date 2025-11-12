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
    title: t('digitalGoods.title'),
    description: t('digitalGoods.description'),
    keywords: t('digitalGoods.keywords'),
    path: '/studio?tool=digital-goods',
  });
}

export default async function DigitalGoodsPage({
  params,
  searchParams,
}: Props) {
  const { lang } = await params;
  const search = await searchParams;

  const queryString = new URLSearchParams();
  queryString.set('tool', 'digital-goods');

  if (search.style && typeof search.style === 'string') {
    queryString.set('style', search.style);
  }

  redirect(`/${lang}/studio?${queryString.toString()}`);
}
