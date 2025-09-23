'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import type PortOne from '@portone/browser-sdk/v2';
import { getPortonePerformanceTracker } from '@/lib/performance/portonePerformance';

type PortoneState = {
  instance: typeof PortOne | null;
  isLoading: boolean;
  isLoaded: boolean;
  error: Error | null;
  loadTime: number | null;
};

type PortoneContextType = PortoneState & {
  preloadPortone: () => Promise<typeof PortOne>;
  getPortone: () => typeof PortOne | null;
};

const PortoneContext = createContext<PortoneContextType | null>(null);

export function PreloadPortoneProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PortoneState>({
    instance: null,
    isLoading: false,
    isLoaded: false,
    error: null,
    loadTime: null,
  });

  const preloadPortone = async (): Promise<typeof PortOne> => {
    if (state.instance) {
      return state.instance;
    }

    if (state.isLoading) {
      return new Promise((resolve, reject) => {
        const checkLoaded = () => {
          if (state.instance) {
            resolve(state.instance);
          } else if (state.error) {
            reject(state.error);
          } else {
            setTimeout(checkLoaded, 50);
          }
        };
        checkLoaded();
      });
    }

    const performanceTracker = getPortonePerformanceTracker();
    performanceTracker.startTiming('sdkLoadTime');

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const module = await import('@portone/browser-sdk/v2');
      const instance = module.default;

      if (!instance) {
        throw new Error('PortOne SDK default export not found');
      }

      const loadTime = performanceTracker.endTiming('sdkLoadTime');

      setState({
        instance,
        isLoading: false,
        isLoaded: true,
        error: null,
        loadTime,
      });

      if (typeof window !== 'undefined' && window.console) {
        console.debug(`PortOne SDK preloaded in ${loadTime.toFixed(2)}ms`);
      }

      return instance;
    } catch (error) {
      const loadError =
        error instanceof Error
          ? error
          : new Error('Unknown PortOne loading error');

      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: loadError,
      }));

      performanceTracker.logMetrics();

      throw loadError;
    }
  };

  const getPortone = (): typeof PortOne | null => {
    return state.instance;
  };

  useEffect(() => {
    const shouldPreload =
      typeof window !== 'undefined' &&
      (window.location.pathname.includes('/billing') ||
        window.location.pathname.includes('/checkout') ||
        window.location.pathname.includes('/payment'));

    if (shouldPreload) {
      preloadPortone().catch((error) => {
        console.warn('PortOne SDK preload failed:', error);
      });
    }
  }, []);

  const contextValue: PortoneContextType = {
    ...state,
    preloadPortone,
    getPortone,
  };

  return (
    <PortoneContext.Provider value={contextValue}>
      {children}
    </PortoneContext.Provider>
  );
}

export function usePortonePreload(): PortoneContextType {
  const context = useContext(PortoneContext);

  if (!context) {
    throw new Error(
      'usePortonePreload must be used within PreloadPortoneProvider'
    );
  }

  return context;
}
