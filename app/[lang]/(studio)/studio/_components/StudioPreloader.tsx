'use client';

import { useEffect } from 'react';
import { useStudioNavigation } from '../_hooks/useStudioNavigation';

interface StudioPreloaderProps {
  lang: string;
}

export default function StudioPreloader({ lang }: StudioPreloaderProps) {
  const { preloadTool, isToolPreloaded } = useStudioNavigation(lang);

  useEffect(() => {

    // Stage 1: Preload most popular tools immediately
    const criticalTools = ['digital-goods', 'archive'];
    criticalTools.forEach((tool) => {
      if (!isToolPreloaded(tool)) {
        preloadTool(tool);
      }
    });

    // Stage 2: Preload high-priority tools after a short delay
    const highPriorityTimer = setTimeout(() => {
      const highPriorityTools = ['stylist', 'virtual-casting'];
      highPriorityTools.forEach((tool) => {
        if (!isToolPreloaded(tool)) {
          preloadTool(tool);
        }
      });
    }, 500);

    // Stage 3: Preload remaining tools when browser is idle
    const lowPriorityTimer = setTimeout(() => {
      const remainingTools = ['butter-cover', 'fanmeeting-studio'];

      // Use requestIdleCallback if available, otherwise use setTimeout
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(() => {
          remainingTools.forEach((tool) => {
            if (!isToolPreloaded(tool)) {
              preloadTool(tool);
            }
          });
        });
      } else {
        setTimeout(() => {
          remainingTools.forEach((tool) => {
            if (!isToolPreloaded(tool)) {
              preloadTool(tool);
            }
          });
        }, 100);
      }
    }, 1500);

    // Stage 4: Prefetch component assets and images in background
    const assetPreloadTimer = setTimeout(() => {
      // Preload common images used in tools
      const imagesToPreload = [
        '/studio/model-select/digital-goods.png',
        '/studio/model-select/stylist.png',
        '/studio/model-select/virtual_casting.png',
        '/studio/model-select/fanmeeting-studio.png',
        '/studio/model-select/butter-cover.png'
      ];

      imagesToPreload.forEach((imageSrc) => {
        const img = new Image();
        img.src = imageSrc;
      });
    }, 3000);

    return () => {
      clearTimeout(highPriorityTimer);
      clearTimeout(lowPriorityTimer);
      clearTimeout(assetPreloadTimer);
    };
  }, [preloadTool, isToolPreloaded]);

  // This component doesn't render anything, it just handles preloading
  return null;
}
