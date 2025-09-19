'use client';

import { ReactNode } from 'react';
import { cn } from '@/app/_lib/utils';

interface StudioToolCardProps {
  children: ReactNode;
  className?: string;
}

export default function StudioToolCard({
  children,
  className,
}: StudioToolCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-slate-700 bg-slate-800/50 p-6 shadow-lg backdrop-blur-sm transition-colors duration-300',
        className
      )}
    >
      {children}
    </div>
  );
}
