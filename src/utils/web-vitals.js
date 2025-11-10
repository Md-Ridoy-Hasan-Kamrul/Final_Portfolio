/**
 * Web Vitals Performance Monitoring
 * Principal Frontend Architect Standard Implementation
 *
 * Core Web Vitals monitored:
 * - LCP (Largest Contentful Paint): Loading performance
 * - FID (First Input Delay): Interactivity
 * - CLS (Cumulative Layout Shift): Visual stability
 * - FCP (First Contentful Paint): Initial render
 * - TTFB (Time to First Byte): Server response time
 * - INP (Interaction to Next Paint): Responsiveness
 */

/**
 * Performance thresholds based on Google's recommendations
 */
export const PERFORMANCE_THRESHOLDS = {
  LCP: {
    good: 2500, // milliseconds
    needsImprovement: 4000,
  },
  FID: {
    good: 100,
    needsImprovement: 300,
  },
  CLS: {
    good: 0.1, // unitless score
    needsImprovement: 0.25,
  },
  FCP: {
    good: 1800,
    needsImprovement: 3000,
  },
  TTFB: {
    good: 800,
    needsImprovement: 1800,
  },
  INP: {
    good: 200,
    needsImprovement: 500,
  },
};

/**
 * Rating categories
 */
export const RATING = {
  GOOD: 'good',
  NEEDS_IMPROVEMENT: 'needs-improvement',
  POOR: 'poor',
};

/**
 * Get performance rating based on value and thresholds
 * @param {string} metric - Metric name
 * @param {number} value - Metric value
 * @returns {string} Rating (good, needs-improvement, poor)
 */
export const getRating = (metric, value) => {
  const threshold = PERFORMANCE_THRESHOLDS[metric];
  if (!threshold) return RATING.GOOD;

  if (value <= threshold.good) {
    return RATING.GOOD;
  } else if (value <= threshold.needsImprovement) {
    return RATING.NEEDS_IMPROVEMENT;
  } else {
    return RATING.POOR;
  }
};

/**
 * Send metrics to analytics endpoint
 * @param {Object} metric - Metric data
 */
export const sendToAnalytics = (metric) => {
  // Log to console in development
  if (import.meta.env.DEV) {
    console.log('[Web Vitals]', metric);
  }

  // Send to analytics service (Google Analytics, Vercel Analytics, etc.)
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(
        metric.name === 'CLS' ? metric.value * 1000 : metric.value
      ),
      non_interaction: true,
    });
  }

  // Send to custom analytics endpoint
  if (import.meta.env.VITE_ANALYTICS_ENDPOINT) {
    const body = JSON.stringify({
      metric: metric.name,
      value: metric.value,
      rating: metric.rating,
      id: metric.id,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    });

    // Use sendBeacon if available (doesn't block page unload)
    if (navigator.sendBeacon) {
      navigator.sendBeacon(import.meta.env.VITE_ANALYTICS_ENDPOINT, body);
    } else {
      fetch(import.meta.env.VITE_ANALYTICS_ENDPOINT, {
        method: 'POST',
        body,
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
      }).catch(console.error);
    }
  }
};

/**
 * Report a metric with rating
 * @param {Object} metric - Raw metric data
 */
const reportMetric = (metric) => {
  const rating = getRating(metric.name, metric.value);
  const enhancedMetric = {
    ...metric,
    rating,
  };

  sendToAnalytics(enhancedMetric);

  // Store in session for debugging
  if (typeof sessionStorage !== 'undefined') {
    const metrics = JSON.parse(sessionStorage.getItem('webVitals') || '[]');
    metrics.push(enhancedMetric);
    sessionStorage.setItem('webVitals', JSON.stringify(metrics));
  }
};

/**
 * Measure Largest Contentful Paint (LCP)
 * Measures loading performance
 */
const measureLCP = () => {
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];

        reportMetric({
          name: 'LCP',
          value: lastEntry.renderTime || lastEntry.loadTime,
          id: `lcp-${Date.now()}`,
          entries: [lastEntry],
        });
      });

      observer.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch (error) {
      console.error('Error measuring LCP:', error);
    }
  }
};

/**
 * Measure First Input Delay (FID)
 * Measures interactivity
 */
const measureFID = () => {
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const firstInput = entries[0];

        reportMetric({
          name: 'FID',
          value: firstInput.processingStart - firstInput.startTime,
          id: `fid-${Date.now()}`,
          entries: [firstInput],
        });
      });

      observer.observe({ type: 'first-input', buffered: true });
    } catch (error) {
      console.error('Error measuring FID:', error);
    }
  }
};

/**
 * Measure Cumulative Layout Shift (CLS)
 * Measures visual stability
 */
const measureCLS = () => {
  if ('PerformanceObserver' in window) {
    try {
      let clsValue = 0;
      let clsEntries = [];

      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          // Only count layout shifts without recent user input
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            clsEntries.push(entry);
          }
        }
      });

      observer.observe({ type: 'layout-shift', buffered: true });

      // Report CLS on page hide
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          reportMetric({
            name: 'CLS',
            value: clsValue,
            id: `cls-${Date.now()}`,
            entries: clsEntries,
          });
          observer.disconnect();
        }
      });
    } catch (error) {
      console.error('Error measuring CLS:', error);
    }
  }
};

/**
 * Measure First Contentful Paint (FCP)
 * Measures initial render
 */
const measureFCP = () => {
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fcpEntry = entries.find(
          (entry) => entry.name === 'first-contentful-paint'
        );

        if (fcpEntry) {
          reportMetric({
            name: 'FCP',
            value: fcpEntry.startTime,
            id: `fcp-${Date.now()}`,
            entries: [fcpEntry],
          });
          observer.disconnect();
        }
      });

      observer.observe({ type: 'paint', buffered: true });
    } catch (error) {
      console.error('Error measuring FCP:', error);
    }
  }
};

/**
 * Measure Time to First Byte (TTFB)
 * Measures server response time
 */
const measureTTFB = () => {
  if ('performance' in window && 'timing' in window.performance) {
    try {
      window.addEventListener('load', () => {
        const navigation = performance.getEntriesByType('navigation')[0];
        if (navigation) {
          const ttfb = navigation.responseStart - navigation.requestStart;

          reportMetric({
            name: 'TTFB',
            value: ttfb,
            id: `ttfb-${Date.now()}`,
            entries: [navigation],
          });
        }
      });
    } catch (error) {
      console.error('Error measuring TTFB:', error);
    }
  }
};

/**
 * Measure Interaction to Next Paint (INP)
 * Measures responsiveness (replaces FID in Chrome 96+)
 */
const measureINP = () => {
  if ('PerformanceObserver' in window) {
    try {
      let maxInteractionDelay = 0;
      let maxEntry = null;

      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const interactionDelay = entry.processingEnd - entry.startTime;

          if (interactionDelay > maxInteractionDelay) {
            maxInteractionDelay = interactionDelay;
            maxEntry = entry;
          }
        }
      });

      observer.observe({
        type: 'event',
        buffered: true,
        durationThreshold: 16,
      });

      // Report INP on page hide
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden' && maxEntry) {
          reportMetric({
            name: 'INP',
            value: maxInteractionDelay,
            id: `inp-${Date.now()}`,
            entries: [maxEntry],
          });
          observer.disconnect();
        }
      });
    } catch (error) {
      // INP might not be supported in all browsers
      console.debug('INP measurement not available');
    }
  }
};

/**
 * Initialize Web Vitals monitoring
 * @param {Object} options - Configuration options
 */
export const initWebVitals = (options = {}) => {
  const { reportAllChanges = false, enableLogging = import.meta.env.DEV } =
    options;

  if (typeof window === 'undefined') return;

  if (enableLogging) {
    console.log('[Web Vitals] Monitoring initialized');
  }

  // Measure all Core Web Vitals
  measureLCP();
  measureFID();
  measureCLS();
  measureFCP();
  measureTTFB();
  measureINP();

  // Report performance budget warnings
  if (enableLogging) {
    setTimeout(() => {
      checkPerformanceBudget();
    }, 5000);
  }
};

/**
 * Check if metrics exceed performance budget
 */
const checkPerformanceBudget = () => {
  const metrics = JSON.parse(sessionStorage.getItem('webVitals') || '[]');

  metrics.forEach((metric) => {
    if (metric.rating === RATING.POOR) {
      console.warn(
        `[Performance Budget] ${metric.name} is POOR: ${metric.value.toFixed(
          2
        )} (threshold: ${PERFORMANCE_THRESHOLDS[metric.name].needsImprovement})`
      );
    } else if (metric.rating === RATING.NEEDS_IMPROVEMENT) {
      console.warn(
        `[Performance Budget] ${
          metric.name
        } needs improvement: ${metric.value.toFixed(2)} (threshold: ${
          PERFORMANCE_THRESHOLDS[metric.name].good
        })`
      );
    } else {
      console.log(
        `[Performance Budget] ${metric.name} is GOOD: ${metric.value.toFixed(
          2
        )}`
      );
    }
  });
};

/**
 * Get all stored metrics
 * @returns {Array} Array of metrics
 */
export const getStoredMetrics = () => {
  if (typeof sessionStorage === 'undefined') return [];
  return JSON.parse(sessionStorage.getItem('webVitals') || '[]');
};

/**
 * Clear stored metrics
 */
export const clearStoredMetrics = () => {
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.removeItem('webVitals');
  }
};

/**
 * Get performance summary
 * @returns {Object} Performance summary with averages and ratings
 */
export const getPerformanceSummary = () => {
  const metrics = getStoredMetrics();

  const summary = {
    LCP: null,
    FID: null,
    CLS: null,
    FCP: null,
    TTFB: null,
    INP: null,
  };

  metrics.forEach((metric) => {
    summary[metric.name] = {
      value: metric.value,
      rating: metric.rating,
    };
  });

  return summary;
};

/**
 * Export performance report as JSON
 * @returns {string} JSON string of performance report
 */
export const exportPerformanceReport = () => {
  const metrics = getStoredMetrics();
  const summary = getPerformanceSummary();

  const report = {
    timestamp: new Date().toISOString(),
    url: window.location.href,
    userAgent: navigator.userAgent,
    summary,
    details: metrics,
  };

  return JSON.stringify(report, null, 2);
};

export default {
  PERFORMANCE_THRESHOLDS,
  RATING,
  getRating,
  sendToAnalytics,
  initWebVitals,
  getStoredMetrics,
  clearStoredMetrics,
  getPerformanceSummary,
  exportPerformanceReport,
};
