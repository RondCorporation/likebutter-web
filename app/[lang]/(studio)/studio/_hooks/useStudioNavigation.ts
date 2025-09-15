'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import useStudioNavigationStore from '@/stores/studioNavigationStore';

// Dynamic imports for studio tools
const DigitalGoodsWithSidebar = dynamic(
  () => import('../digital-goods/_components/DigitalGoodsWithSidebar')
);
const ButterCoverClient = dynamic(
  () => import('../butter-cover/_components/ButterCoverClient')
);
const FanmeetingStudioWithSidebar = dynamic(
  () => import('../fanmeeting-studio/_components/FanmeetingStudioWithSidebar')
);
const StylistWithSidebar = dynamic(
  () => import('../stylist/_components/StylistWithSidebar')
);
const VirtualCastingWithSidebar = dynamic(
  () => import('../virtual-casting/_components/VirtualCastingWithSidebar')
);
const ArchiveClient = dynamic(
  () => import('../archive/_components/ArchiveClient')
);
const DashboardClient = dynamic(() => import('../_components/DashboardClient'));

interface StudioToolConfig {
  component: React.ComponentType<any>;
  preloaded: boolean;
  lastVisited?: Date;
}

interface StudioNavigationState {
  currentTool: string;
  isTransitioning: boolean;
  preloadedTools: Set<string>;
}

const STUDIO_TOOLS: Record<string, StudioToolConfig> = {
  dashboard: {
    component: DashboardClient,
    preloaded: false,
  },
  'digital-goods': {
    component: DigitalGoodsWithSidebar,
    preloaded: false,
  },
  stylist: {
    component: StylistWithSidebar,
    preloaded: false,
  },
  'virtual-casting': {
    component: VirtualCastingWithSidebar,
    preloaded: false,
  },
  'butter-cover': {
    component: ButterCoverClient,
    preloaded: false,
  },
  'fanmeeting-studio': {
    component: FanmeetingStudioWithSidebar,
    preloaded: false,
  },
  archive: {
    component: ArchiveClient,
    preloaded: false,
  },
};

export function useStudioNavigation(lang: string) {
  const router = useRouter();
  const pathname = usePathname();

  // Use Zustand store for persistence
  const {
    toolStates,
    lastUsedTool,
    preloadedTools: persistedPreloadedTools,
    setToolState,
    getToolState,
    setLastUsedTool,
    addPreloadedTool,
  } = useStudioNavigationStore();

  const [navigationState, setNavigationState] = useState<StudioNavigationState>(
    {
      currentTool: 'dashboard',
      isTransitioning: false,
      preloadedTools: new Set(persistedPreloadedTools),
    }
  );

  const componentCache = useRef<Map<string, React.ComponentType<any>>>(
    new Map()
  );

  // Extract current tool from pathname
  const getCurrentTool = useCallback(() => {
    const segments = pathname.split('/');
    const toolIndex = segments.findIndex((segment) => segment === 'studio');
    if (toolIndex >= 0 && segments[toolIndex + 1]) {
      return segments[toolIndex + 1];
    }
    return 'dashboard';
  }, [pathname]);

  // Preload components for better performance
  const preloadTool = useCallback(
    (toolName: string) => {
      if (
        !STUDIO_TOOLS[toolName] ||
        navigationState.preloadedTools.has(toolName)
      ) {
        return;
      }

      const toolConfig = STUDIO_TOOLS[toolName];

      // Cache the component
      componentCache.current.set(toolName, toolConfig.component);

      // Mark as preloaded in local state
      setNavigationState((prev) => ({
        ...prev,
        preloadedTools: new Set([...prev.preloadedTools, toolName]),
      }));

      // Persist to store
      addPreloadedTool(toolName);

      // Update tool config
      STUDIO_TOOLS[toolName].preloaded = true;
    },
    [navigationState.preloadedTools, addPreloadedTool]
  );

  // Navigate with client-side routing for better UX
  const navigateToTool = useCallback(
    (toolName: string, options?: { replace?: boolean }) => {
      // Save current state before navigating
      const currentTool = getCurrentTool();
      if (currentTool !== toolName) {
        setToolState(currentTool, {
          lastVisited: new Date().toISOString(),
          scrollPosition: window.scrollY,
        });
      }

      setNavigationState((prev) => ({
        ...prev,
        currentTool: toolName,
        isTransitioning: true,
      }));

      // Update last used tool
      setLastUsedTool(toolName);

      // Preload the target tool if not already preloaded
      preloadTool(toolName);

      // Use Next.js router for actual navigation
      const targetPath =
        toolName === 'dashboard'
          ? `/${lang}/studio`
          : `/${lang}/studio/${toolName}`;

      if (options?.replace) {
        router.replace(targetPath);
      } else {
        router.push(targetPath);
      }

      // Reset transition state after a short delay
      setTimeout(() => {
        setNavigationState((prev) => ({
          ...prev,
          isTransitioning: false,
        }));

        // Restore scroll position if available
        const toolState = getToolState(toolName);
        if (toolState?.scrollPosition) {
          window.scrollTo(0, toolState.scrollPosition);
        }
      }, 200);
    },
    [
      getCurrentTool,
      lang,
      preloadTool,
      router,
      setToolState,
      setLastUsedTool,
      getToolState,
    ]
  );

  // Check if tool is preloaded
  const isToolPreloaded = useCallback(
    (toolName: string) => navigationState.preloadedTools.has(toolName),
    [navigationState.preloadedTools]
  );

  // Preload critical tools immediately, others progressively
  useEffect(() => {
    // Preload dashboard component immediately since it's the default
    preloadTool('dashboard');

    // Progressive preloading with priority levels
    const preloadSchedule = [
      { tools: ['digital-goods'], delay: 0 },      // Critical: Load immediately
      { tools: ['archive'], delay: 200 },          // High: Load very quickly
      { tools: ['stylist'], delay: 500 },          // Medium: Load after initial paint
      { tools: ['virtual-casting'], delay: 1000 }, // Medium: Load after user settles
      { tools: ['butter-cover', 'fanmeeting-studio'], delay: 2000 } // Low: Load in background
    ];

    const timeouts: NodeJS.Timeout[] = [];

    preloadSchedule.forEach(({ tools, delay }) => {
      const timeout = setTimeout(() => {
        tools.forEach((tool) => {
          if (!isToolPreloaded(tool)) {
            preloadTool(tool);
          }
        });
      }, delay);
      timeouts.push(timeout);
    });

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [preloadTool, isToolPreloaded]);

  // Update current tool based on pathname changes
  useEffect(() => {
    const currentTool = getCurrentTool();
    setNavigationState((prev) => ({
      ...prev,
      currentTool,
    }));
  }, [getCurrentTool]);

  // Get cached component for a tool
  const getToolComponent = useCallback((toolName: string) => {
    const cached = componentCache.current.get(toolName);
    if (cached) return cached;

    const toolConfig = STUDIO_TOOLS[toolName];
    if (toolConfig) {
      componentCache.current.set(toolName, toolConfig.component);
      return toolConfig.component;
    }

    return null;
  }, []);

  return {
    currentTool: navigationState.currentTool,
    isTransitioning: navigationState.isTransitioning,
    preloadedTools: navigationState.preloadedTools,
    navigateToTool,
    preloadTool,
    getToolComponent,
    isToolPreloaded: (toolName: string) =>
      navigationState.preloadedTools.has(toolName),
  };
}
