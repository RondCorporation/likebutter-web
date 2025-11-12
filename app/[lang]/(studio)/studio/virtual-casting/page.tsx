import { redirect } from 'next/navigation';

type Props = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function VirtualCastingPage({
  params,
  searchParams,
}: Props) {
  const { lang } = await params;
  const search = await searchParams;

  const queryString = new URLSearchParams();
  queryString.set('tool', 'virtual-casting');

  if (search.style && typeof search.style === 'string') {
    queryString.set('style', search.style);
  }

  redirect(`/${lang}/studio?${queryString.toString()}`);
}
