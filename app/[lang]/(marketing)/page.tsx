import initTranslations from '@/app/_lib/i18n-server';
import LandingPage from './_components/LandingPage';
import { getPlansOnServer } from '@/lib/apis/plan.api.server';
import { Metadata } from 'next';
import { generateLocalizedMetadata } from '@/lib/seo/metadata';

export const revalidate = 3600;

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const { t } = await initTranslations(lang, ['seo']);

  return generateLocalizedMetadata({
    lang,
    title: t('home.title'),
    description: t('home.description'),
    keywords: t('home.keywords'),
    path: '',
  });
}

const MarketingPage = async ({ params }: Props) => {
  const { lang } = await params;
  await initTranslations(lang, ['common']);

  const { data: plans } = await getPlansOnServer().catch(() => ({ data: [] }));

  return <LandingPage lang={lang} plans={plans || []} />;
};

export default MarketingPage;
