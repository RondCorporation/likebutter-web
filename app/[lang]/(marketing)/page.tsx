import LandingPage from './_components/LandingPage';

type Props = {
  params: Promise<{ lang: string }>;
};

export default async function Home({ params }: Props) {
  const { lang } = await params;

  return <LandingPage lang={lang} />;
}
