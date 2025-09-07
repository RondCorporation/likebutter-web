import { Metadata } from 'next';
import dynamic from 'next/dynamic';

const DigitalGoodsClient = dynamic(
  () => import('./_components/DigitalGoodsClient'),
  {
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-butter-yellow"></div>
      </div>
    ),
  }
);

export const metadata: Metadata = {
  title: 'Digital Goods Creator - Like Butter Studio',
  description:
    'Create stunning digital merchandise and product designs with AI',
};

export default function DigitalGoodsPage() {
  return <DigitalGoodsClient />;
}
