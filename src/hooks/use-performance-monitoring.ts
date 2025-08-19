'use client';

import { useEffect, useCallback, useRef } from 'react';
import { config, isFeatureEnabled } from '@/config/environment';

interface PerformanceMetrics {
  fcp: number | null; // First Contentful Paint
  lcp: number | null; // Largest Contentful Paint
  fid: number | null; // First Input Delay
  cls: number | null; // Cumulative Layout Shift
  ttfb: number | null; // Time to First Byte
  fmp: number | null; // First Meaningful Paint
}

interface PerformanceObserverEntry {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

export function usePerformanceMonitoring() {
  const metrics = useRef<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
    fmp: null,
  });

  const observers = useRef<PerformanceObserver[]>([]);

  // Get rating for a metric
  const getRating = useCallback((metric: string, value: number): 'good' | 'needs-improvement' | 'poor' => {
    const thresholds: Record<string, { good: number; poor: number }> = {
      fcp: { good: 1800, poor: 3000 },
      lcp: { good: 2500, poor: 4000 },
      fid: { good: 100, poor: 300 },
      cls: { good: 0.1, poor: 0.25 },
      ttfb: { good: 800, poor: 1800 },
    };

    const threshold = thresholds[metric];
    if (!threshold) return 'good';

    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  }, []);

  // Measure First Contentful Paint
  const measureFCP = useCallback(() => {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          if (entries.length > 0) {
            const fcp = entries[0] as PerformanceEntry;
            metrics.current.fcp = fcp.startTime;
            reportMetric('fcp', fcp.startTime);
          }
        });

        observer.observe({ entryTypes: ['paint'] });
        observers.current.push(observer);
      } catch (error) {
        console.warn('FCP measurement failed:', error);
      }
    }
  }, []);

  // Measure Largest Contentful Paint
  const measureLCP = useCallback(() => {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          if (entries.length > 0) {
            const lcp = entries[entries.length - 1] as PerformanceEntry;
            metrics.current.lcp = lcp.startTime;
            reportMetric('lcp', lcp.startTime);
          }
        });

        observer.observe({ entryTypes: ['largest-contentful-paint'] });
        observers.current.push(observer);
      } catch (error) {
        console.warn('LCP measurement failed:', error);
      }
    }
  }, []);

  // Measure First Input Delay
  const measureFID = useCallback(() => {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          if (entries.length > 0) {
            const fid = entries[0] as PerformanceEntry;
            metrics.current.fid = fid.processingStart - fid.startTime;
            reportMetric('fid', metrics.current.fid);
          }
        });

        observer.observe({ entryTypes: ['first-input'] });
        observers.current.push(observer);
      } catch (error) {
        console.warn('FID measurement failed:', error);
      }
    }
  }, []);

  // Measure Cumulative Layout Shift
  const measureCLS = useCallback(() => {
    if ('PerformanceObserver' in window) {
      try {
        let clsValue = 0;
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          metrics.current.cls = clsValue;
          reportMetric('cls', clsValue);
        });

        observer.observe({ entryTypes: ['layout-shift'] });
        observers.current.push(observer);
      } catch (error) {
        console.warn('CLS measurement failed:', error);
      }
    }
  }, []);

  // Measure Time to First Byte
  const measureTTFB = useCallback(() => {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          if (entries.length > 0) {
            const ttfb = entries[0] as PerformanceEntry;
            metrics.current.ttfb = ttfb.responseStart - ttfb.requestStart;
            reportMetric('ttfb', metrics.current.ttfb);
          }
        });

        observer.observe({ entryTypes: ['navigation'] });
        observers.current.push(observer);
      } catch (error) {
        console.warn('TTFB measurement failed:', error);
      }
    }
  }, []);

  // Measure First Meaningful Paint (custom implementation)
  const measureFMP = useCallback(() => {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          if (entries.length > 0) {
            // FMP is typically measured as the first paint after DOM content is loaded
            const fmp = entries[0] as PerformanceEntry;
            metrics.current.fmp = fmp.startTime;
            reportMetric('fmp', fmp.startTime);
          }
        });

        observer.observe({ entryTypes: ['paint'] });
        observers.current.push(observer);
      } catch (error) {
        console.warn('FMP measurement failed:', error);
      }
    }
  }, []);

  // Report metric to analytics
  const reportMetric = useCallback((name: string, value: number) => {
    if (!isFeatureEnabled('analytics')) return;

    const rating = getRating(name, value);
    const metricData: PerformanceObserverEntry = {
      name,
      value,
      rating,
    };

    // Send to analytics service
    if (config.analytics.id) {
      // Example: Google Analytics 4
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'web_vitals', {
          event_category: 'Web Vitals',
          event_label: name,
          value: Math.round(value),
          custom_parameter: rating,
        });
      }

      // Example: Custom analytics endpoint
      fetch('/api/analytics/web-vitals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metricData),
      }).catch(console.error);
    }

    // Log in development
    if (config.development.debugMode) {
      console.log(`Web Vital: ${name}`, {
        value: Math.round(value * 100) / 100,
        rating,
        timestamp: new Date().toISOString(),
      });
    }
  }, [getRating]);

  // Get current metrics
  const getMetrics = useCallback((): PerformanceMetrics => {
    return { ...metrics.current };
  }, []);

  // Get overall performance score
  const getPerformanceScore = useCallback((): number => {
    const scores = {
      fcp: metrics.current.fcp ? (getRating('fcp', metrics.current.fcp) === 'good' ? 100 : 50) : 0,
      lcp: metrics.current.lcp ? (getRating('lcp', metrics.current.lcp) === 'good' ? 100 : 50) : 0,
      fid: metrics.current.fid ? (getRating('fid', metrics.current.fid) === 'good' ? 100 : 50) : 0,
      cls: metrics.current.cls ? (getRating('cls', metrics.current.cls) === 'good' ? 100 : 50) : 0,
      ttfb: metrics.current.ttfb ? (getRating('ttfb', metrics.current.ttfb) === 'good' ? 100 : 50) : 0,
    };

    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
    return Math.round(totalScore / Object.keys(scores).length);
  }, [getRating]);

  // Reset metrics
  const resetMetrics = useCallback(() => {
    metrics.current = {
      fcp: null,
      lcp: null,
      fid: null,
      cls: null,
      ttfb: null,
      fmp: null,
    };
  }, []);

  // Initialize performance monitoring
  useEffect(() => {
    if (!isFeatureEnabled('performance')) return;

    // Wait for page to load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        measureFCP();
        measureLCP();
        measureFID();
        measureCLS();
        measureTTFB();
        measureFMP();
      });
    } else {
      measureFCP();
      measureLCP();
      measureFID();
      measureCLS();
      measureTTFB();
      measureFMP();
    }

    // Cleanup observers on unmount
    return () => {
      observers.current.forEach(observer => observer.disconnect());
      observers.current = [];
    };
  }, [measureFCP, measureLCP, measureFID, measureCLS, measureTTFB, measureFMP]);

  // Monitor long tasks
  useEffect(() => {
    if (!isFeatureEnabled('performance')) return;

    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (entry.duration > 50) { // Tasks longer than 50ms
              console.warn('Long task detected:', {
                duration: entry.duration,
                startTime: entry.startTime,
                name: entry.name,
              });
            }
          });
        });

        observer.observe({ entryTypes: ['longtask'] });
        observers.current.push(observer);
      } catch (error) {
        console.warn('Long task monitoring failed:', error);
      }
    }
  }, []);

  return {
    metrics: getMetrics(),
    performanceScore: getPerformanceScore(),
    resetMetrics,
    getRating,
  };
}
