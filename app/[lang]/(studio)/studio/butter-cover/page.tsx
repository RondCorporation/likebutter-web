import { redirect } from 'next/navigation';

export default async function ButterCoverPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  redirect(`/${lang}/studio?tool=butter-cover`);
}
