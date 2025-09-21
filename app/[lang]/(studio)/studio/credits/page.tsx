import { redirect } from 'next/navigation';

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function CreditsPage({ params }: Props) {
  const { lang } = await params;

  // Redirect to main studio page with tool parameter
  redirect(`/${lang}/studio?tool=credits`);
}
