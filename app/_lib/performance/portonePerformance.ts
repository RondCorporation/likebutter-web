'use client';

export interface PortonePerformanceMetrics {
  sdkLoadTime?: number;
  billingKeyRequestTime?: number;
  totalPaymentTime?: number;
  userAgent?: string;
  connectionType?: string;
  timestamp?: number;
}

class PortonePerformanceTracker {
  private metrics: Record<string, number | string | undefined> = {};
  private startTimes: Record<string, number> = {};

  startTiming(operation: keyof PortonePerformanceMetrics): void {
    this.startTimes[operation] = performance.now();
  }

  endTiming(operation: keyof PortonePerformanceMetrics): number {
    const startTime = this.startTimes[operation];
    if (!startTime) {
      return 0;
    }

    const duration = performance.now() - startTime;
    this.metrics[operation] = duration;
    delete this.startTimes[operation];

    return duration;
  }

  getMetrics(): Partial<PortonePerformanceMetrics> {
    return { ...this.metrics };
  }

  getCompleteMetrics(): Partial<PortonePerformanceMetrics> {
    return {
      ...this.metrics,
      userAgent:
        typeof window !== 'undefined' ? window.navigator.userAgent : '',
      connectionType: this.getConnectionType(),
      timestamp: Date.now(),
    };
  }

  private getConnectionType(): string | undefined {
    if (typeof window === 'undefined') return undefined;

    const nav = navigator as any;
    const connection =
      nav.connection || nav.mozConnection || nav.webkitConnection;

    return connection?.effectiveType || connection?.type;
  }

  logMetrics(): void {
    const metrics = this.getCompleteMetrics();

    if (process.env.NODE_ENV === 'development') {
      console.group('🚀 PortOne Performance Metrics');

      if (typeof metrics.sdkLoadTime === 'number') {
        console.log(`⏱️  SDK Load Time: ${metrics.sdkLoadTime.toFixed(2)}ms`);
      }

      if (typeof metrics.billingKeyRequestTime === 'number') {
        console.log(
          `🔑 Billing Key Request: ${metrics.billingKeyRequestTime.toFixed(2)}ms`
        );
      }

      if (typeof metrics.totalPaymentTime === 'number') {
        console.log(
          `💳 Total Payment Time: ${metrics.totalPaymentTime.toFixed(2)}ms`
        );
      }

      if (metrics.connectionType) {
        console.log(`🌐 Connection Type: ${metrics.connectionType}`);
      }

      console.log(
        `🕐 Timestamp: ${new Date(metrics.timestamp || 0).toISOString()}`
      );
      console.groupEnd();
    }

    this.sendToAnalytics(metrics);
  }

  private sendToAnalytics(metrics: Partial<PortonePerformanceMetrics>): void {}

  reset(): void {
    this.metrics = {};
    this.startTimes = {};
  }

  isPerformancePoor(): boolean {
    const { sdkLoadTime, billingKeyRequestTime, totalPaymentTime } =
      this.metrics;

    const thresholds = {
      sdkLoadTime: 3000,
      billingKeyRequest: 5000,
      totalPayment: 10000,
    };

    return (
      (typeof sdkLoadTime === 'number' &&
        sdkLoadTime > thresholds.sdkLoadTime) ||
      (typeof billingKeyRequestTime === 'number' &&
        billingKeyRequestTime > thresholds.billingKeyRequest) ||
      (typeof totalPaymentTime === 'number' &&
        totalPaymentTime > thresholds.totalPayment)
    );
  }
}

let performanceTracker: PortonePerformanceTracker | null = null;

export function getPortonePerformanceTracker(): PortonePerformanceTracker {
  if (!performanceTracker) {
    performanceTracker = new PortonePerformanceTracker();
  }
  return performanceTracker;
}

export function usePortonePerformanceTracking() {
  const tracker = getPortonePerformanceTracker();

  return {
    startTiming: (operation: keyof PortonePerformanceMetrics) =>
      tracker.startTiming(operation),
    endTiming: (operation: keyof PortonePerformanceMetrics) =>
      tracker.endTiming(operation),
    getMetrics: () => tracker.getMetrics(),
    logMetrics: () => tracker.logMetrics(),
    isPerformancePoor: () => tracker.isPerformancePoor(),
    reset: () => tracker.reset(),
  };
}
