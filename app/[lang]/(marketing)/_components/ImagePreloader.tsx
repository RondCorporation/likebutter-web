'use client';

import { useEffect, useState } from 'react';

interface ImagePreloaderProps {
  images: string[];
  onLoadComplete?: () => void;
}

export default function ImagePreloader({
  images,
  onLoadComplete,
}: ImagePreloaderProps) {
  const [loadedCount, setLoadedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (images.length === 0) {
      setIsLoading(false);
      onLoadComplete?.();
      return;
    }

    let completed = 0;
    const imageElements: HTMLImageElement[] = [];

    images.forEach((src) => {
      const img = new Image();

      img.onload = () => {
        completed++;
        setLoadedCount(completed);

        if (completed === images.length) {
          setIsLoading(false);
          onLoadComplete?.();
        }
      };

      img.onerror = () => {
        console.warn(`Failed to preload image: ${src}`);
        completed++;
        setLoadedCount(completed);

        if (completed === images.length) {
          setIsLoading(false);
          onLoadComplete?.();
        }
      };

      img.src = src;
      imageElements.push(img);
    });

    return () => {
      imageElements.forEach((img) => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, [images, onLoadComplete]);

  // This component doesn't render anything visible
  return null;
}

// Hook version for easy integration
export function useImagePreloader(images: string[]) {
  const [isLoading, setIsLoading] = useState(true);
  const [loadedCount, setLoadedCount] = useState(0);

  useEffect(() => {
    if (images.length === 0) {
      setIsLoading(false);
      return;
    }

    let completed = 0;
    const imageElements: HTMLImageElement[] = [];

    images.forEach((src) => {
      const img = new Image();

      img.onload = () => {
        completed++;
        setLoadedCount(completed);

        if (completed === images.length) {
          setIsLoading(false);
        }
      };

      img.onerror = () => {
        console.warn(`Failed to preload image: ${src}`);
        completed++;
        setLoadedCount(completed);

        if (completed === images.length) {
          setIsLoading(false);
        }
      };

      img.src = src;
      imageElements.push(img);
    });

    return () => {
      imageElements.forEach((img) => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, [images]);

  return { isLoading, loadedCount, total: images.length };
}
