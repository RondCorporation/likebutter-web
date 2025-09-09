import { redirect } from 'next/navigation';

type Props = {
  params: Promise<{ lang: string }>;
};

export default async function StudioPage({ params }: Props) {
  const { lang } = await params;
  redirect(`/${lang}/studio/history`);
}
