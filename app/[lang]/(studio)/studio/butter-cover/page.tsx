import { redirect } from 'next/navigation';

export default async function ButterCoverPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  // Redirect to main studio page with tool parameter
  redirect(`/${lang}/studio?tool=butter-cover`);
}
