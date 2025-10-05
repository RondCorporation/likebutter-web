import BillingDashboard from './_components/BillingDashboard';
import nextI18NextConfig from '../../../next-i18next.config.mjs';
import { getPlansOnServer } from '@/lib/apis/plan.api.server';

export const dynamic = 'force-dynamic';

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

  return (
    <BillingDashboard lang={lang} plans={apiPlans || []} currency={currency} />
  );
}
