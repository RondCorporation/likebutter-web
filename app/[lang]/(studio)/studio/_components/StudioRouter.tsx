'use client';

import { usePathname } from 'next/navigation';
import { useStudioNavigation } from '../_hooks/useStudioNavigation';
import { useIsDesktop } from '@/hooks/useMediaQuery';
import BottomSheet from '@/components/BottomSheet';
import { Suspense } from 'react';

interface StudioRouterProps {
  lang: string;
}

function StudioToolSkeleton() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-butter-yellow"></div>
    </div>
  );
}

export default function StudioRouter({ lang }: StudioRouterProps) {
  const pathname = usePathname();
  const isDesktop = useIsDesktop();
  const {
    currentTool,
    isTransitioning,
    getToolComponent,
    getToolSidebarComponent,
  } = useStudioNavigation(lang);

  // Get components for current tool
  const ToolComponent = getToolComponent(currentTool);
  const SidebarComponent = getToolSidebarComponent(currentTool);

  // Show loading state during transitions
  if (isTransitioning) {
    return <StudioToolSkeleton />;
  }

  // Handle tools with sidebar (like digital-goods)
  if (SidebarComponent) {
    if (isDesktop) {
      return (
        <div className="flex h-full w-full bg-studio-main overflow-hidden">
          <Suspense
            fallback={
              <div className="w-[260px] h-full bg-studio-sidebar border-r border-solid border-studio-border animate-pulse"></div>
            }
          >
            <SidebarComponent />
          </Suspense>
          <Suspense fallback={<StudioToolSkeleton />}>
            {ToolComponent && <ToolComponent />}
          </Suspense>
        </div>
      );
    } else {
      return (
        <div className="relative h-full w-full bg-studio-main">
          <div className="h-full overflow-y-auto">
            <Suspense fallback={<StudioToolSkeleton />}>
              {ToolComponent && <ToolComponent />}
            </Suspense>
          </div>

          <BottomSheet
            initialHeight={40}
            maxHeight={85}
            minHeight={20}
            className="bg-studio-sidebar"
          >
            <Suspense
              fallback={
                <div className="h-20 bg-studio-sidebar animate-pulse"></div>
              }
            >
              <SidebarComponent />
            </Suspense>
          </BottomSheet>
        </div>
      );
    }
  }

  // Handle regular tools without sidebar
  return (
    <div className="h-full w-full bg-studio-main">
      <Suspense fallback={<StudioToolSkeleton />}>
        {ToolComponent && <ToolComponent />}
      </Suspense>
    </div>
  );
}
