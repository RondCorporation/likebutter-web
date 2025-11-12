import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Fanmeeting Studio - LikeButter Studio',
  description:
    'Create magical fanmeeting moments with AI-powered studio experiences',
};

type Props = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

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
