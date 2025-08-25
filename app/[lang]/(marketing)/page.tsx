import initTranslations from '@/app/_lib/i18n-server';
import LandingPage from './_components/LandingPage';

type Props = {
  params: Promise<{ lang: string }>;
};

const MarketingPage = async ({ params }: Props) => {
  const { lang } = await params;
  await initTranslations(lang, ['common']);

  return <LandingPage />;
};

export default MarketingPage;