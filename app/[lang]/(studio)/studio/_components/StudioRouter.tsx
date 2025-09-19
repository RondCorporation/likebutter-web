'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useStudioNavigation } from '../_hooks/useStudioNavigation';
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
  const searchParams = useSearchParams();
  const router = useRouter();
  const [currentTool, setCurrentTool] = useState('dashboard');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const { getToolComponent, preloadTool, isToolPreloaded } =
    useStudioNavigation(lang);

  // Get current tool from URL parameter
  const getCurrentToolFromUrl = useCallback(() => {
    return searchParams.get('tool') || 'dashboard';
  }, [searchParams]);

  // Navigate to tool with smooth transition
  const navigateToTool = useCallback(
    (toolName: string) => {
      if (toolName === currentTool) return;

      setIsTransitioning(true);

      // Preload the tool if not already preloaded
      if (!isToolPreloaded(toolName)) {
        preloadTool(toolName);
      }

      // Update URL without page reload
      const newUrl =
        toolName === 'dashboard'
          ? `/${lang}/studio`
          : `/${lang}/studio?tool=${toolName}`;

      router.replace(newUrl, { scroll: false });

      // Small delay for smooth transition
      setTimeout(() => {
        setCurrentTool(toolName);
        setIsTransitioning(false);
      }, 100);
    },
    [currentTool, isToolPreloaded, preloadTool, router, lang]
  );

  // Update current tool when URL changes
  useEffect(() => {
    const toolFromUrl = getCurrentToolFromUrl();
    if (toolFromUrl !== currentTool) {
      setCurrentTool(toolFromUrl);
      // Preload the tool when URL changes
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

  // Get component for current tool
  const ToolComponent = getToolComponent(currentTool);

  // Expose navigation function globally for other components to use
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).studioNavigateToTool = navigateToTool;
      return () => {
        delete (window as any).studioNavigateToTool;
      };
    }
  }, [navigateToTool]);

  // Show loading state during transitions
  if (isTransitioning) {
    return <StudioToolSkeleton />;
  }

  // Render the tool component (WithSidebar components handle their own layout)
  return (
    <div className="h-full w-full bg-studio-main">
      <Suspense fallback={<StudioToolSkeleton />}>
        {ToolComponent && <ToolComponent />}
      </Suspense>
    </div>
  );
}
