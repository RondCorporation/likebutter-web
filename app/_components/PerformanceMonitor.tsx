'use client';

import { useEffect } from 'react';
import { initWebVitals } from '@/app/_lib/webVitals';

/**
 * Performance monitoring component that initializes Web Vitals tracking
 * Should be rendered once at the root level of the application
 */
export default function PerformanceMonitor() {
  useEffect(() => {
    // Initialize Web Vitals monitoring on mount
    if (typeof window !== 'undefined') {
      initWebVitals();
    }
  }, []);

  // This component doesn't render anything visible
  return null;
}