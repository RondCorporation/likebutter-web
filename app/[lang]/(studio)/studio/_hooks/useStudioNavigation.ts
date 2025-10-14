'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import useStudioNavigationStore from '@/stores/studioNavigationStore';

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
const CreditsClient = dynamic(
  () => import('../credits/_components/CreditsClient')
);
const HelpClient = dynamic(() => import('../help/_components/HelpClient'));
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
  credits: {
    component: CreditsClient,
    preloaded: false,
  },
  help: {
    component: HelpClient,
    preloaded: false,
  },
};

export function useStudioNavigation(lang: string) {
  const router = useRouter();
  const pathname = usePathname();

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

  const getCurrentTool = useCallback(() => {
    const segments = pathname.split('/');
    const toolIndex = segments.findIndex((segment) => segment === 'studio');
    if (toolIndex >= 0 && segments[toolIndex + 1]) {
      return segments[toolIndex + 1];
    }
    return 'dashboard';
  }, [pathname]);

  const preloadTool = useCallback(
    (toolName: string) => {
      if (
        !STUDIO_TOOLS[toolName] ||
        navigationState.preloadedTools.has(toolName)
      ) {
        return;
      }

      const toolConfig = STUDIO_TOOLS[toolName];

      componentCache.current.set(toolName, toolConfig.component);

      setNavigationState((prev) => ({
        ...prev,
        preloadedTools: new Set([...prev.preloadedTools, toolName]),
      }));

      addPreloadedTool(toolName);

      STUDIO_TOOLS[toolName].preloaded = true;
    },
    [navigationState.preloadedTools, addPreloadedTool]
  );

  const navigateToTool = useCallback(
    (toolName: string, options?: { replace?: boolean }) => {
      const currentTool = getCurrentTool();
      if (currentTool !== toolName) {
        setToolState(currentTool, {
          lastVisited: new Date().toISOString(),
          scrollPosition: window.scrollY,
        });
      }

      setLastUsedTool(toolName);
      preloadTool(toolName);

      const targetPath =
        toolName === 'dashboard'
          ? `/${lang}/studio`
          : `/${lang}/studio/${toolName}`;

      if (options?.replace) {
        router.replace(targetPath);
      } else {
        router.push(targetPath);
      }

      // Restore scroll position after navigation (use requestAnimationFrame for smoother transition)
      requestAnimationFrame(() => {
        const toolState = getToolState(toolName);
        if (toolState?.scrollPosition) {
          window.scrollTo(0, toolState.scrollPosition);
        }
      });
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

  const isToolPreloaded = useCallback(
    (toolName: string) => navigationState.preloadedTools.has(toolName),
    [navigationState.preloadedTools]
  );

  useEffect(() => {
    preloadTool('dashboard');

    const preloadSchedule = [
      { tools: ['digital-goods'], delay: 0 },
      { tools: ['archive'], delay: 200 },
      { tools: ['stylist'], delay: 500 },
      { tools: ['virtual-casting'], delay: 1000 },
      { tools: ['butter-cover', 'fanmeeting-studio'], delay: 2000 },
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

  useEffect(() => {
    const currentTool = getCurrentTool();
    setNavigationState((prev) => ({
      ...prev,
      currentTool,
    }));
  }, [getCurrentTool]);

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
