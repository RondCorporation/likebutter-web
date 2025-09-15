import { Metadata } from 'next';
import { Suspense } from 'react';
import FanmeetingStudioWithSidebar from './_components/FanmeetingStudioWithSidebar';

export const metadata: Metadata = {
  title: 'Fanmeeting Studio - Like Butter Studio',
  description:
    'Create magical fanmeeting moments with AI-powered studio experiences',
};

export default function FanmeetingStudioPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-full">
          <div className="text-studio-text-secondary">Loading...</div>
        </div>
      }
    >
      <FanmeetingStudioWithSidebar />
    </Suspense>
  );
}
