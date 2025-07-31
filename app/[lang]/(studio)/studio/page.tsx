import { redirect } from 'next/navigation';

type Props = {
  params: Promise<{ lang: string }>;
};

// This page needs to be async to await the params promise.
export default async function StudioPage({ params }: Props) {
  const { lang } = await params;
  // redirect can be used in an async component. It throws an error to stop rendering.
  redirect(`/${lang}/studio/history`);
}