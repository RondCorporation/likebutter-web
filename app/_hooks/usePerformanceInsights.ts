'use client';

import { useState, useEffect } from 'react';
import { WebVitalMetric, getPerformanceInsights } from '@/app/_lib/webVitals';

interface PerformanceInsights {
  metrics: WebVitalMetric[];
  overallScore: number;
  recommendations: string[];
}

/**
 * Hook to access collected performance insights and metrics
 * Useful for creating performance dashboards or monitoring
 */
export function usePerformanceInsights(): PerformanceInsights {
  const [insights, setInsights] = useState<PerformanceInsights>({
    metrics: [],
    overallScore: 0,
    recommendations: [],
  });

  useEffect(() => {
    const updateInsights = () => {
      const performanceData = getPerformanceInsights();
      setInsights(performanceData);
    };

    updateInsights();

    const interval = setInterval(updateInsights, 30000);

    return () => clearInterval(interval);
  }, []);

  return insights;
}

/**
 * Hook to get current performance status
 * Returns a simplified performance summary
 */
export function usePerformanceStatus() {
  const insights = usePerformanceInsights();

  const status = {
    isGood: insights.overallScore >= 80,
    isNeedsImprovement:
      insights.overallScore >= 50 && insights.overallScore < 80,
    isPoor: insights.overallScore < 50,
    score: insights.overallScore,
    hasMetrics: insights.metrics.length > 0,
  };

  return status;
}
