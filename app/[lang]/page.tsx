import initTranslations from '@/lib/i18n-server';
import LandingClient from './landing-client';

type Props = {
  params: Promise<{ lang: string }>;
};

export default async function Home({ params }: Props) {
  const { lang } = await params;
  const { t } = await initTranslations(lang, ['common']);

  const translations = {
    welcomeMessage: t('welcome'),
    startStudio: t('startStudio'),
    featuresTitle: t('featuresTitle'),
    featuresSubtitle: t('featuresSubtitle'),
    feature1Title: t('feature1Title'),
    feature1Desc: t('feature1Desc'),
    feature2Title: t('feature2Title'),
    feature2Desc: t('feature2Desc'),
    feature3Title: t('feature3Title'),
    feature3Desc: t('feature3Desc'),
    feature4Title: t('feature4Title'),
    feature4Desc: t('feature4Desc'),
    demoTitle: t('demoTitle'),
    demoSubtitle: t('demoSubtitle'),
    demoComingSoon: t('demoComingSoon'),
    pricingSectionTitle: t('pricingSectionTitle'),
    pricingSectionSubtitle: t('pricingSectionSubtitle'),
    viewPricing: t('viewPricing'),
    contactTitle: t('contactTitle'),
    contactEmail: t('contactEmail'),
    contactMessage: t('contactMessage'),
    contactSend: t('contactSend'),
    landingPlanFreeDesc: t('landingPlanFreeDesc'),
    landingPlanCreatorDesc: t('landingPlanCreatorDesc'),
    landingTitle: t('landingTitle'),
    landingScroll: t('landingScroll'),
    landingPlanFreeName: t('landingPlanFreeName'),
    landingPlanCreatorName: t('landingPlanCreatorName'),
    landingFeatureCreditsFree: t('landingFeatureCreditsFree'),
    landingFeatureSpeedFree: t('landingFeatureSpeedFree'),
    landingFeatureWatermarkFree: t('landingFeatureWatermarkFree'),
    landingFeatureCreditsCreator: t('landingFeatureCreditsCreator'),
    landingFeatureSpeedCreator: t('landingFeatureSpeedCreator'),
    landingFeatureWatermarkCreator: t('landingFeatureWatermarkCreator'),
  };

  return <LandingClient lang={lang} translations={translations} />;
}
