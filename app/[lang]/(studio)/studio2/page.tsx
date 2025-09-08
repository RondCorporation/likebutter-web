import DashboardClient from './_components/DashboardClient';

type Props = {
  params: Promise<{ lang: string }>;
};

export default async function StudioPage({ params }: Props) {
  const { lang } = await params;
  
  return <DashboardClient />;
}