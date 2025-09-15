import { redirect } from 'next/navigation';

type Props = {
  params: Promise<{ lang: string }>;
};

export default async function StylistPage({ params }: Props) {
  const { lang } = await params;

  // Redirect to main studio page with tool parameter
  redirect(`/${lang}/studio?tool=stylist`);
}
