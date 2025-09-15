import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Digital Goods Creator - Like Butter Studio',
  description:
    'Create stunning digital merchandise and product designs with AI',
};

type Props = {
  params: Promise<{ lang: string }>;
};

export default async function DigitalGoodsPage({ params }: Props) {
  const { lang } = await params;

  // Redirect to main studio page with tool parameter
  redirect(`/${lang}/studio?tool=digital-goods`);
}
