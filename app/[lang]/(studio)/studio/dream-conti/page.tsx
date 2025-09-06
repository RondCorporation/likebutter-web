import { Metadata } from 'next';
import DreamContiClient from './_components/DreamContiClient';

export const metadata: Metadata = {
  title: 'Dream Continuation - Like Butter Studio',
  description: 'Continue your dreams with AI-powered narrative image generation',
};

export default function DreamContiPage() {
  return <DreamContiClient />;
}