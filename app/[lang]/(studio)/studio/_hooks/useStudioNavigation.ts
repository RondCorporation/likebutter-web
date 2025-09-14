'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import useStudioNavigationStore from '@/stores/studioNavigationStore';

// Dynamic imports for studio tools
const DigitalGoodsClient = dynamic(() => import('../digital-goods/_components/DigitalGoodsClient'));
const DigitalGoodsStyleSidebar = dynamic(() => import('../digital-goods/_components/DigitalGoodsStyleSidebar'));
const ButterCoverClient = dynamic(() => import('../butter-cover/_components/ButterCoverClient'));
const FanmeetingStudioClient = dynamic(() => import('../fanmeeting-studio/_components/FanmeetingStudioClient'));
const StylistClient = dynamic(() => import('../stylist/_components/StylistClient'));
const VirtualCastingClient = dynamic(() => import('../virtual-casting/_components/VirtualCastingClient'));
const HistoryClient = dynamic(() => import('../history/_components/HistoryClient'));
const DashboardClient = dynamic(() => import('../_components/DashboardClient'));

interface StudioToolConfig {
  component: React.ComponentType<any>;
  sidebarComponent?: React.ComponentType<any>;
  preloaded: boolean;
  lastVisited?: Date;
}

interface StudioNavigationState {
  currentTool: string;
  isTransitioning: boolean;
  preloadedTools: Set<string>;
}

const STUDIO_TOOLS: Record<string, StudioToolConfig> = {
  'dashboard': {
    component: DashboardClient,
    preloaded: false
  },
  'digital-goods': {
    component: DigitalGoodsClient,
    sidebarComponent: DigitalGoodsStyleSidebar,
    preloaded: false
  },
  'stylist': {
    component: StylistClient,
    preloaded: false
  },
  'virtual-casting': {
    component: VirtualCastingClient,
    preloaded: false
  },
  'butter-cover': {
    component: ButterCoverClient,
    preloaded: false
  },
  'fanmeeting-studio': {
    component: FanmeetingStudioClient,
    preloaded: false
  },
  'history': {
    component: HistoryClient,
    preloaded: false
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
    addPreloadedTool
  } = useStudioNavigationStore();
  
  const [navigationState, setNavigationState] = useState<StudioNavigationState>({
    currentTool: 'dashboard',
    isTransitioning: false,
    preloadedTools: new Set(persistedPreloadedTools)
  });
  
  const componentCache = useRef<Map<string, React.ComponentType<any>>>(new Map());

  // Extract current tool from pathname
  const getCurrentTool = useCallback(() => {
    const segments = pathname.split('/');
    const toolIndex = segments.findIndex(segment => segment === 'studio');
    if (toolIndex >= 0 && segments[toolIndex + 1]) {
      return segments[toolIndex + 1];
    }
    return 'dashboard';
  }, [pathname]);

  // Preload components for better performance
  const preloadTool = useCallback((toolName: string) => {
    if (!STUDIO_TOOLS[toolName] || navigationState.preloadedTools.has(toolName)) {
      return;
    }

    const toolConfig = STUDIO_TOOLS[toolName];
    
    // Cache the component
    componentCache.current.set(toolName, toolConfig.component);
    if (toolConfig.sidebarComponent) {
      componentCache.current.set(`${toolName}-sidebar`, toolConfig.sidebarComponent);
    }

    // Mark as preloaded in local state
    setNavigationState(prev => ({
      ...prev,
      preloadedTools: new Set([...prev.preloadedTools, toolName])
    }));

    // Persist to store
    addPreloadedTool(toolName);

    // Update tool config
    STUDIO_TOOLS[toolName].preloaded = true;
  }, [navigationState.preloadedTools, addPreloadedTool]);

  // Navigate with client-side routing for better UX
  const navigateToTool = useCallback((toolName: string, options?: { replace?: boolean }) => {
    // Save current state before navigating
    const currentTool = getCurrentTool();
    if (currentTool !== toolName) {
      setToolState(currentTool, {
        lastVisited: new Date().toISOString(),
        scrollPosition: window.scrollY,
      });
    }

    setNavigationState(prev => ({
      ...prev,
      currentTool: toolName,
      isTransitioning: true
    }));

    // Update last used tool
    setLastUsedTool(toolName);

    // Preload the target tool if not already preloaded
    preloadTool(toolName);

    // Use Next.js router for actual navigation
    const targetPath = toolName === 'dashboard' ? `/${lang}/studio` : `/${lang}/studio/${toolName}`;
    
    if (options?.replace) {
      router.replace(targetPath);
    } else {
      router.push(targetPath);
    }

    // Reset transition state after a short delay
    setTimeout(() => {
      setNavigationState(prev => ({
        ...prev,
        isTransitioning: false
      }));
      
      // Restore scroll position if available
      const toolState = getToolState(toolName);
      if (toolState?.scrollPosition) {
        window.scrollTo(0, toolState.scrollPosition);
      }
    }, 200);
  }, [getCurrentTool, lang, preloadTool, router, setToolState, setLastUsedTool, getToolState]);

  // Preload popular tools on initial load
  useEffect(() => {
    const popularTools = ['digital-goods', 'stylist', 'history'];

    // Preload after a short delay to not block initial render
    const preloadTimeout = setTimeout(() => {
      popularTools.forEach(tool => preloadTool(tool));
    }, 1000);

    return () => clearTimeout(preloadTimeout);
  }, [preloadTool]);

  // Update current tool based on pathname changes
  useEffect(() => {
    const currentTool = getCurrentTool();
    setNavigationState(prev => ({
      ...prev,
      currentTool
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

  // Get cached sidebar component for a tool
  const getToolSidebarComponent = useCallback((toolName: string) => {
    const cached = componentCache.current.get(`${toolName}-sidebar`);
    if (cached) return cached;

    const toolConfig = STUDIO_TOOLS[toolName];
    if (toolConfig?.sidebarComponent) {
      componentCache.current.set(`${toolName}-sidebar`, toolConfig.sidebarComponent);
      return toolConfig.sidebarComponent;
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
    getToolSidebarComponent,
    isToolPreloaded: (toolName: string) => navigationState.preloadedTools.has(toolName)
  };
}