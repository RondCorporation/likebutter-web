'use client';

import { useEffect } from 'react';
import { useStudioNavigation } from '../_hooks/useStudioNavigation';

interface StudioPreloaderProps {
  lang: string;
}

export default function StudioPreloader({ lang }: StudioPreloaderProps) {
  const { preloadTool, isToolPreloaded } = useStudioNavigation(lang);

  useEffect(() => {
    // Preload essential tools immediately
    const essentialTools = ['digital-goods', 'history'];
    essentialTools.forEach(tool => {
      if (!isToolPreloaded(tool)) {
        preloadTool(tool);
      }
    });

    // Preload secondary tools after a delay
    const secondaryTools = ['photo-editor', 'butter-cover', 'fanmeeting-studio', 'dream-conti'];
    const delayedPreload = setTimeout(() => {
      secondaryTools.forEach(tool => {
        if (!isToolPreloaded(tool)) {
          preloadTool(tool);
        }
      });
    }, 2000);

    return () => clearTimeout(delayedPreload);
  }, [preloadTool, isToolPreloaded]);

  // This component doesn't render anything, it just handles preloading
  return null;
}