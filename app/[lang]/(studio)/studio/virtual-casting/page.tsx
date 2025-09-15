import { redirect } from 'next/navigation';

type Props = {
  params: Promise<{ lang: string }>;
};

export default async function VirtualCastingPage({ params }: Props) {
  const { lang } = await params;

  // Redirect to main studio page with tool parameter
  redirect(`/${lang}/studio?tool=virtual-casting`);
}
