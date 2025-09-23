'use client';

import { onCLS, onINP, onFCP, onLCP, onTTFB } from 'web-vitals';

export interface WebVitalMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
}

/**
 * Web Vitals 성능 지표 수집 및 분석
 */
export function initWebVitals() {
  onCLS(onPerfEntry);
  onINP(onPerfEntry);
  onLCP(onPerfEntry);

  onFCP(onPerfEntry);
  onTTFB(onPerfEntry);
}

function onPerfEntry(metric: any) {
  const webVitalMetric: WebVitalMetric = {
    name: metric.name,
    value: Math.round(metric.value),
    rating: metric.rating,
    delta: Math.round(metric.delta),
    id: metric.id,
  };

  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 Web Vital:', webVitalMetric);
  }

  if (process.env.NODE_ENV === 'production') {
    sendToAnalytics(webVitalMetric);
  }

  showPerformanceWarnings(webVitalMetric);
}

/**
 * 분석 서비스로 메트릭 전송
 */
function sendToAnalytics(metric: WebVitalMetric) {
  if (typeof window !== 'undefined' && 'gtag' in window) {
    const gtag = (window as any).gtag;
    gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: metric.value,
      custom_map: {
        metric_rating: metric.rating,
        metric_delta: metric.delta,
      },
    });
  }
}

/**
 * 성능 이슈 경고 표시
 */
function showPerformanceWarnings(metric: WebVitalMetric) {
  if (metric.rating === 'poor') {
    console.warn(`⚠️ Poor ${metric.name}: ${metric.value}ms`);

    const suggestions = getPerformanceSuggestions(metric.name, metric.value);
    if (suggestions.length > 0) {
      console.warn('💡 Suggestions:', suggestions);
    }
  }
}

/**
 * 성능 개선 제안 생성
 */
function getPerformanceSuggestions(
  metricName: string,
  value: number
): string[] {
  const suggestions: string[] = [];

  switch (metricName) {
    case 'LCP':
      if (value > 2500) {
        suggestions.push('Optimize images with next/image');
        suggestions.push('Use CDN for static assets');
        suggestions.push('Consider server-side rendering');
      }
      break;

    case 'INP':
      if (value > 200) {
        suggestions.push('Reduce JavaScript bundle size');
        suggestions.push('Use React.memo for heavy components');
        suggestions.push('Defer non-critical JavaScript');
        suggestions.push('Optimize event handlers');
      }
      break;

    case 'CLS':
      if (value > 0.1) {
        suggestions.push('Set dimensions for images and videos');
        suggestions.push('Reserve space for dynamic content');
        suggestions.push('Avoid inserting content above existing content');
      }
      break;

    case 'FCP':
      if (value > 1800) {
        suggestions.push('Optimize critical rendering path');
        suggestions.push('Inline critical CSS');
        suggestions.push('Preload important resources');
      }
      break;

    case 'TTFB':
      if (value > 800) {
        suggestions.push('Optimize server response time');
        suggestions.push('Use caching strategies');
        suggestions.push('Consider using a CDN');
      }
      break;
  }

  return suggestions;
}

/**
 * 성능 대시보드 데이터 생성
 */
export function getPerformanceInsights(): {
  metrics: WebVitalMetric[];
  overallScore: number;
  recommendations: string[];
} {
  const metrics: WebVitalMetric[] = [];
  const recommendations: string[] = [];

  const overallScore = calculateOverallScore(metrics);

  return {
    metrics,
    overallScore,
    recommendations,
  };
}

function calculateOverallScore(metrics: WebVitalMetric[]): number {
  if (metrics.length === 0) return 0;

  const weights = {
    LCP: 0.25,
    INP: 0.25,
    CLS: 0.25,
    FCP: 0.125,
    TTFB: 0.125,
  };

  let totalScore = 0;
  let totalWeight = 0;

  metrics.forEach((metric) => {
    const weight = weights[metric.name as keyof typeof weights] || 0;
    if (weight > 0) {
      const score =
        metric.rating === 'good'
          ? 100
          : metric.rating === 'needs-improvement'
            ? 60
            : 30;
      totalScore += score * weight;
      totalWeight += weight;
    }
  });

  return totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;
}
