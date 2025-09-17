'use client';

import { ReactNode } from 'react';

interface StudioSidebarBaseProps {
  children: ReactNode;
  className?: string;
}

export default function StudioSidebarBase({
  children,
  className = '',
}: StudioSidebarBaseProps) {
  return (
    <div
      className={`flex flex-col w-full md:w-[260px] h-full items-start gap-6 md:gap-10 pt-3 md:pt-6 pb-3 px-3 relative bg-studio-sidebar md:border-r border-solid border-studio-border-light overflow-y-auto ${className}`}
      style={{
        WebkitOverflowScrolling: 'touch',
        overscrollBehavior: 'contain',
        paddingBottom: 'max(12px, env(safe-area-inset-bottom))'
      }}
    >
      <div className="flex flex-col items-start gap-8 relative self-stretch w-full flex-[0_0_auto]">
        {children}
      </div>
    </div>
  );
}
