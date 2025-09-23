'use client';

import { useEffect } from 'react';
import { initWebVitals } from '@/app/_lib/webVitals';

export default function PerformanceMonitor() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      initWebVitals();
    }
  }, []);

  return null;
}
