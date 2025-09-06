import { Metadata } from 'next';
import DigitalGoodsClient from './_components/DigitalGoodsClient';

export const metadata: Metadata = {
  title: 'Digital Goods Creator - Like Butter Studio',
  description: 'Create stunning digital merchandise and product designs with AI',
};

export default function DigitalGoodsPage() {
  return <DigitalGoodsClient />;
}