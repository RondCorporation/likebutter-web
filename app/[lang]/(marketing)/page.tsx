import initTranslations from '@/app/_lib/i18n-server';
import LandingPage from './_components/LandingPage';
import { getPlansOnServer } from '@/lib/apis/plan.api.server';

export const revalidate = 3600;

type Props = {
  params: Promise<{ lang: string }>;
};

const MarketingPage = async ({ params }: Props) => {
  const { lang } = await params;
  await initTranslations(lang, ['common']);

  const { data: plans } = await getPlansOnServer().catch(() => ({ data: [] }));

  return <LandingPage lang={lang} plans={plans || []} />;
};

export default MarketingPage;
