import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Digital Goods Creator - LikeButter Studio',
  description:
    'Create stunning digital merchandise and product designs with AI',
};

type Props = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

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
