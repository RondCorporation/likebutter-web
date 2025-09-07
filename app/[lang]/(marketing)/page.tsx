import initTranslations from '@/app/_lib/i18n-server';
import LandingPage from './_components/LandingPage';
import { getPlansOnServer } from '@/app/_lib/apis/subscription.api.server';

export const revalidate = 3600; // 1시간 캐싱

type Props = {
  params: Promise<{ lang: string }>;
};

const MarketingPage = async ({ params }: Props) => {
  const { lang } = await params;
  await initTranslations(lang, ['common']);

  // 서버에서 Plans 데이터 로드
  const { data: plans } = await getPlansOnServer().catch(() => ({ data: [] }));

  return <LandingPage lang={lang} plans={plans || []} />;
};

export default MarketingPage;
