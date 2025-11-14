'use client';

import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useStudioNavigation } from '../_hooks/useStudioNavigation';
import { useAttendanceStore } from '@/app/_stores/attendanceStore';
import { Suspense } from 'react';
import DailyAttendanceModal from '@/app/_components/studio/DailyAttendanceModal';

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
  const searchParams = useSearchParams();
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { getToolComponent, preloadTool, isToolPreloaded } =
    useStudioNavigation(lang);

  const {
    shouldShowModal,
    checkAttendanceFromModal,
    closeModal,
    isLoading: isAttendanceLoading,
    checkAttendanceOnStudioMount,
  } = useAttendanceStore();

  const memoizedCheckAttendance = useCallback(() => {
    checkAttendanceOnStudioMount();
  }, [checkAttendanceOnStudioMount]);

  const getCurrentToolFromUrl = useCallback(() => {
    return searchParams.get('tool') || 'dashboard';
  }, [searchParams]);

  const currentTool = getCurrentToolFromUrl();

  const navigateToTool = useCallback(
    async (toolName: string) => {
      const isSameTool = toolName === currentTool;

      // Check if there's a navigation guard
      if (
        typeof window !== 'undefined' &&
        (window as any).studioNavigationGuard
      ) {
        const canNavigate = await (window as any).studioNavigationGuard(
          toolName
        );
        if (!canNavigate) {
          return; // Navigation blocked by guard
        }

        // If same tool and guard returned true, reset the current tool
        if (isSameTool && (window as any).studioResetCurrentTool) {
          (window as any).studioResetCurrentTool();
          return;
        }
      }

      // If same tool and no guard, do nothing
      if (isSameTool) return;

      if (!isToolPreloaded(toolName)) {
        preloadTool(toolName);
      }

      const newUrl =
        toolName === 'dashboard'
          ? `/${lang}/studio`
          : `/${lang}/studio?tool=${toolName}`;

      router.replace(newUrl, { scroll: false });

      // Always scroll to top when navigating to a different tool
      requestAnimationFrame(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = 0;
        }
        window.scrollTo(0, 0);
      });
    },
    [currentTool, isToolPreloaded, preloadTool, router, lang]
  );

  // Preload tool when URL changes
  useEffect(() => {
    if (!isToolPreloaded(currentTool)) {
      preloadTool(currentTool);
    }
  }, [currentTool, isToolPreloaded, preloadTool]);

  const ToolComponent = getToolComponent(currentTool);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).studioNavigateToTool = navigateToTool;
      return () => {
        delete (window as any).studioNavigateToTool;
      };
    }
  }, [navigateToTool]);

  useEffect(() => {
    memoizedCheckAttendance();
  }, [memoizedCheckAttendance]);

  return (
    <div
      ref={scrollContainerRef}
      className="h-full w-full bg-studio-main overflow-y-auto"
    >
      <Suspense fallback={<StudioToolSkeleton />}>
        {ToolComponent && <ToolComponent />}
      </Suspense>

      {/* Daily Attendance Modal */}
      <DailyAttendanceModal
        isOpen={shouldShowModal}
        onClose={closeModal}
        onClaimCredit={checkAttendanceFromModal}
        isLoading={isAttendanceLoading}
      />
    </div>
  );
}
