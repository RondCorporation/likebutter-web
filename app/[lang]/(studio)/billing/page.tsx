import BillingDashboard from './_components/BillingDashboard';
import nextI18NextConfig from '../../../../next-i18next.config.mjs';
import { getPlansOnServer } from '@/app/_lib/apis/subscription.api.server';

export const revalidate = 3600;

type Props = {
  params: Promise<{ lang: string }>;
};

export function generateStaticParams() {
  return nextI18NextConfig.i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function BillingPage({ params }: Props) {
  const { lang } = await params;

  const { data: apiPlans } = (await getPlansOnServer().catch(() => ({
    data: [],
  }))) || { data: [] };

  const isKorean = lang === 'ko';
  const currency = isKorean ? '₩' : '$';

  // 새로운 BillingDashboard 사용 (쿼리파라미터 처리는 클라이언트에서)
  return (
    <BillingDashboard lang={lang} plans={apiPlans || []} currency={currency} />
  );
}
