import { Suspense } from 'react';
import VirtualCastingWithSidebar from './_components/VirtualCastingWithSidebar';

export default function VirtualCastingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-full">
          <div className="text-studio-text-secondary">Loading...</div>
        </div>
      }
    >
      <VirtualCastingWithSidebar />
    </Suspense>
  );
}
