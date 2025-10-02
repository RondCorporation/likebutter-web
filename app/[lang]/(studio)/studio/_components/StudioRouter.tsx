'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
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
  const [currentTool, setCurrentTool] = useState('dashboard');
  const [isTransitioning, setIsTransitioning] = useState(false);

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

  const navigateToTool = useCallback(
    (toolName: string) => {
      if (toolName === currentTool) return;

      setIsTransitioning(true);

      if (!isToolPreloaded(toolName)) {
        preloadTool(toolName);
      }

      const newUrl =
        toolName === 'dashboard'
          ? `/${lang}/studio`
          : `/${lang}/studio?tool=${toolName}`;

      router.replace(newUrl, { scroll: false });

      setTimeout(() => {
        setCurrentTool(toolName);
        setIsTransitioning(false);
      }, 100);
    },
    [currentTool, isToolPreloaded, preloadTool, router, lang]
  );

  useEffect(() => {
    const toolFromUrl = getCurrentToolFromUrl();
    if (toolFromUrl !== currentTool) {
      setCurrentTool(toolFromUrl);

      if (!isToolPreloaded(toolFromUrl)) {
        preloadTool(toolFromUrl);
      }
    }
  }, [
    searchParams,
    currentTool,
    getCurrentToolFromUrl,
    isToolPreloaded,
    preloadTool,
  ]);

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

  if (isTransitioning) {
    return <StudioToolSkeleton />;
  }

  return (
    <div className="h-full w-full bg-studio-main overflow-y-auto">
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
