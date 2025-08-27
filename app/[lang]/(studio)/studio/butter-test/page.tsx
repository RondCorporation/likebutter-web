import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import initTranslations from '@/lib/i18n-server';
import StudioToolSkeleton from '@/components/shared/StudioToolSkeleton';

const ButterTestClient = dynamic(() => import('./_components/ButterTestClient'), {
  loading: () => <StudioToolSkeleton />,
});

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const { t } = await initTranslations(lang, ['common']);
  return {
    title: t('studioTitleButterTest'),
    description: t('butterTestSubtitle'),
  };
}

export default async function ButterTestPage({ params }: Props) {
  const { lang } = await params;
  const { t } = await initTranslations(lang, ['common']);

  return (
    <div className="mx-auto max-w-4xl">
      <h2 className="mb-2 text-xl font-semibold">{t('butterTestTitle')}</h2>
      <p className="mb-8 text-slate-400">{t('butterTestSubtitle')}</p>
      <ButterTestClient />
    </div>
  );
}
