import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Fanmeeting Studio - Like Butter Studio',
  description:
    'Create magical fanmeeting moments with AI-powered studio experiences',
};

type Props = {
  params: Promise<{ lang: string }>;
};

export default async function FanmeetingStudioPage({ params }: Props) {
  const { lang } = await params;

  redirect(`/${lang}/studio?tool=fanmeeting-studio`);
}
