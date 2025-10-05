import SuccessCelebration from '../_components/SuccessCelebration';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function PaymentSuccessPage({
  params,
  searchParams,
}: Props) {
  const { lang } = await params;
  const query = await searchParams;

  const planName =
    (typeof query.plan === 'string' ? query.plan : null) || 'creator';
  const subscriptionId =
    typeof query.subscription === 'string' ? query.subscription : undefined;

  return (
    <SuccessCelebration
      lang={lang}
      planName={planName}
      subscriptionId={subscriptionId}
    />
  );
}
