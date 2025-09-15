import StudioRouter from './_components/StudioRouter';

type Props = {
  params: Promise<{ lang: string }>;
};

export default async function StudioPage({ params }: Props) {
  const { lang } = await params;

  return <StudioRouter lang={lang} />;
}
