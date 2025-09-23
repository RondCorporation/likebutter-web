'use client';

import { useEffect } from 'react';
import { useStudioNavigation } from '../_hooks/useStudioNavigation';

interface StudioPreloaderProps {
  lang: string;
}

export default function StudioPreloader({ lang }: StudioPreloaderProps) {
  const { preloadTool, isToolPreloaded } = useStudioNavigation(lang);

  useEffect(() => {
    const criticalTools = ['digital-goods', 'archive'];
    criticalTools.forEach((tool) => {
      if (!isToolPreloaded(tool)) {
        preloadTool(tool);
      }
    });

    const highPriorityTimer = setTimeout(() => {
      const highPriorityTools = ['stylist', 'virtual-casting'];
      highPriorityTools.forEach((tool) => {
        if (!isToolPreloaded(tool)) {
          preloadTool(tool);
        }
      });
    }, 500);

    const lowPriorityTimer = setTimeout(() => {
      const remainingTools = ['butter-cover', 'fanmeeting-studio'];

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

    const assetPreloadTimer = setTimeout(() => {
      const imagesToPreload = [
        '/studio/model-select/digital-goods.png',
        '/studio/model-select/stylist.png',
        '/studio/model-select/virtual_casting.png',
        '/studio/model-select/fanmeeting-studio.png',
        '/studio/model-select/butter-cover.png',
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

  return null;
}
