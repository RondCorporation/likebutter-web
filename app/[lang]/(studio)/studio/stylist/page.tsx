import { redirect } from 'next/navigation';

type Props = {
  params: Promise<{ lang: string }>;
};

export default async function StylistPage({ params }: Props) {
  const { lang } = await params;

  redirect(`/${lang}/studio?tool=stylist`);
}
