import { Metadata } from 'next';
import FanmeetingStudioClient from './_components/FanmeetingStudioClient';

export const metadata: Metadata = {
  title: 'Fanmeeting Studio - Like Butter Studio',
  description: 'Create magical fanmeeting moments with AI-powered studio experiences',
};

export default function FanmeetingStudioPage() {
  return <FanmeetingStudioClient />;
}