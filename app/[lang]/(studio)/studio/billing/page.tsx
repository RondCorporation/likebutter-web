import { redirect, permanentRedirect } from 'next/navigation';

type Props = {
  params: Promise<{ lang: string }>;
};

export default async function StudioBillingPage({ params }: Props) {
  const { lang } = await params;
  
  // Permanent redirect to the main billing page to avoid confusion
  permanentRedirect(`/${lang}/billing`);
}