'use client';

import { useEffect } from 'react';
import { useStudioNavigation } from '../_hooks/useStudioNavigation';
import { usePathname } from 'next/navigation';
import { useIsMobile } from '@/hooks/useMediaQuery';

interface StudioPreloaderProps {
  lang: string;
}

export default function StudioPreloader({ lang }: StudioPreloaderProps) {
  const { preloadTool, isToolPreloaded } = useStudioNavigation(lang);
  const pathname = usePathname();
  const isMobile = useIsMobile();

  useEffect(() => {
    // Only preload archive on desktop as it's frequently accessed
    // Mobile users should load on-demand to save bandwidth
    if (!isMobile && !isToolPreloaded('archive')) {
      // Use requestIdleCallback to avoid blocking main thread
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(() => {
          preloadTool('archive');
        });
      } else {
        setTimeout(() => {
          preloadTool('archive');
        }, 2000);
      }
    }
  }, [preloadTool, isToolPreloaded, isMobile]);

  return null;
}
