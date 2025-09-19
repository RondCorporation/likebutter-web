'use client';

import { motion } from 'framer-motion';
import StudioOverlay from '@/components/studio/StudioOverlay';

interface BillingLoadingSkeletonProps {
  lang: string;
}

const SkeletonCard = () => (
  <div className="rounded-2xl bg-slate-800/50 border-2 border-slate-600 p-6 space-y-6">
    {/* Header */}
    <div className="text-center space-y-3">
      <div className="w-16 h-16 bg-slate-700 rounded-xl mx-auto animate-pulse" />
      <div className="space-y-2">
        <div className="h-6 bg-slate-700 rounded w-32 mx-auto animate-pulse" />
        <div className="h-4 bg-slate-700 rounded w-48 mx-auto animate-pulse" />
      </div>
    </div>

    {/* Pricing */}
    <div className="text-center space-y-2">
      <div className="h-10 bg-slate-700 rounded w-40 mx-auto animate-pulse" />
      <div className="h-4 bg-slate-700 rounded w-24 mx-auto animate-pulse" />
    </div>

    {/* Features */}
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="w-5 h-5 bg-slate-700 rounded-full animate-pulse" />
          <div className="h-4 bg-slate-700 rounded flex-1 animate-pulse" />
        </div>
      ))}
    </div>

    {/* Button */}
    <div className="h-12 bg-slate-700 rounded-xl animate-pulse" />
  </div>
);

const SkeletonStat = () => (
  <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 bg-slate-700 rounded-xl animate-pulse" />
      <div className="flex-1 space-y-3">
        <div className="h-4 bg-slate-700 rounded w-20 animate-pulse" />
        <div className="h-6 bg-slate-700 rounded w-24 animate-pulse" />
        <div className="h-3 bg-slate-700 rounded w-16 animate-pulse" />
      </div>
    </div>
  </div>
);

export default function BillingLoadingSkeleton({
  lang,
}: BillingLoadingSkeletonProps) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#202020' }}>
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="space-y-12">
          {/* Header Skeleton */}
          <div className="text-center relative">
            {/* Back button skeleton */}
            <div className="absolute top-0 left-0 flex items-center">
              <div className="w-4 h-4 bg-slate-700 rounded mr-2 animate-pulse" />
              <div className="h-4 bg-slate-700 rounded w-20 animate-pulse" />
            </div>
            <div className="h-10 bg-slate-700 rounded w-64 mx-auto mb-4 animate-pulse" />
            <div className="h-6 bg-slate-700 rounded w-96 mx-auto animate-pulse" />
          </div>

          {/* Toggle Skeleton */}
          <div className="flex justify-center">
            <div className="inline-flex bg-slate-800 rounded-lg p-1 border border-slate-700">
              <div className="h-10 w-24 bg-slate-700 rounded-md animate-pulse" />
              <div className="h-10 w-28 bg-slate-700 rounded-md ml-1 animate-pulse" />
            </div>
          </div>

          {/* Plan Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-slate-800/50 rounded-lg border-2 border-slate-700 p-6"
              >
                <div className="text-center mb-6">
                  <div className="h-6 bg-slate-600 rounded w-32 mx-auto mb-2 animate-pulse" />
                  <div className="h-4 bg-slate-600 rounded w-48 mx-auto animate-pulse" />
                </div>
                <div className="text-center mb-6">
                  <div className="h-12 bg-slate-600 rounded w-40 mx-auto animate-pulse" />
                </div>
                <div className="space-y-3 mb-6">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-slate-600 rounded-full animate-pulse" />
                      <div className="h-4 bg-slate-600 rounded flex-1 animate-pulse" />
                    </div>
                  ))}
                </div>
                <div className="h-12 bg-slate-600 rounded-lg animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
