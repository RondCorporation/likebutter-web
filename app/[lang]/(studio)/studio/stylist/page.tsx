import { Suspense } from 'react';
import StylistWithSidebar from './_components/StylistWithSidebar';

export default function StylistPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-full">
        <div className="text-studio-text-secondary">Loading...</div>
      </div>
    }>
      <StylistWithSidebar />
    </Suspense>
  );
}