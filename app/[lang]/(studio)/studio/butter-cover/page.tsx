import dynamic from 'next/dynamic';
import initTranslations from '@/app/_lib/i18n-server';

const ButterCoverClient = dynamic(
  () => import('./_components/ButterCoverClient'),
  {
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-butter-yellow"></div>
      </div>
    ),
  }
);

export default async function ButterCoverPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const { t } = await initTranslations(lang, ['common']);
  const dictionary = {
    studioTitleButterCover: t('studioTitleButterCover'),
    butterCoverSubtitle: t('butterCoverSubtitle'),
    butterCoverStep1: t('butterCoverStep1'),
    butterCoverStep2: t('butterCoverStep2'),
    butterCoverUploadPlaceholder: t('butterCoverUploadPlaceholder'),
    butterCoverButton: t('butterCoverButton'),
    butterGenButtonLoading: t('butterGenButtonLoading'),
    butterGenSuccessTitle: t('butterGenSuccessTitle'),
    butterGenSuccessTaskId: t('butterGenSuccessTaskId'),
    butterGenSuccessStatus: t('butterGenSuccessStatus'),
    butterGenSuccessLink: t('butterGenSuccessLink'),
    voiceModel: t('voiceModel', { returnObjects: true }),
  };

  return (
    <div className="container mx-auto h-full px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">
          {dictionary.studioTitleButterCover}
        </h1>
        <p className="text-slate-400">{dictionary.butterCoverSubtitle}</p>
      </div>
      <ButterCoverClient dictionary={dictionary} />
    </div>
  );
}
