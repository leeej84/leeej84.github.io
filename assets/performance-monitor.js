// Performance Monitoring Script for Lee Jeffries Blog
// Tracks Core Web Vitals and other performance metrics

(function() {
    'use strict';
    
    // Performance monitoring
    function monitorPerformance() {
        // Core Web Vitals
        if ('PerformanceObserver' in window) {
            // Largest Contentful Paint (LCP)
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                console.log('LCP:', lastEntry.startTime);
                
                // Send to analytics if available
                if (window.gtag) {
                    window.gtag('event', 'LCP', {
                        'event_category': 'Web Vitals',
                        'event_label': lastEntry.startTime,
                        'value': Math.round(lastEntry.startTime)
                    });
                }
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
            
            // First Input Delay (FID)
            const fidObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    console.log('FID:', entry.processingStart - entry.startTime);
                    
                    if (window.gtag) {
                        window.gtag('event', 'FID', {
                            'event_category': 'Web Vitals',
                            'event_label': entry.name,
                            'value': Math.round(entry.processingStart - entry.startTime)
                        });
                    }
                });
            });
            fidObserver.observe({ entryTypes: ['first-input'] });
            
            // Cumulative Layout Shift (CLS)
            let clsValue = 0;
            const clsObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                        console.log('CLS:', clsValue);
                        
                        if (window.gtag) {
                            window.gtag('event', 'CLS', {
                                'event_category': 'Web Vitals',
                                'event_label': entry.sources[0]?.node?.className || 'unknown',
                                'value': Math.round(clsValue * 1000) / 1000
                            });
                        }
                    }
                });
            });
            clsObserver.observe({ entryTypes: ['layout-shift'] });
        }
        
        // Navigation Timing API
        if ('performance' in window && 'timing' in window.performance) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const timing = window.performance.timing;
                    const loadTime = timing.loadEventEnd - timing.navigationStart;
                    const domReady = timing.domContentLoadedEventEnd - timing.navigationStart;
                    
                    console.log('Page Load Time:', loadTime + 'ms');
                    console.log('DOM Ready Time:', domReady + 'ms');
                    
                    // Send to analytics
                    if (window.gtag) {
                        window.gtag('event', 'page_load_time', {
                            'event_category': 'Performance',
                            'event_label': 'Total Load',
                            'value': Math.round(loadTime)
                        });
                        
                        window.gtag('event', 'dom_ready_time', {
                            'event_category': 'Performance',
                            'event_label': 'DOM Ready',
                            'value': Math.round(domReady)
                        });
                    }
                }, 0);
            });
        }
        
        // Resource Timing
        if ('PerformanceObserver' in window) {
            const resourceObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (entry.initiatorType === 'img' || entry.initiatorType === 'css' || entry.initiatorType === 'script') {
                        console.log(`${entry.initiatorType} load time:`, entry.duration + 'ms');
                        
                        if (window.gtag) {
                            window.gtag('event', 'resource_load_time', {
                                'event_category': 'Performance',
                                'event_label': entry.initiatorType,
                                'value': Math.round(entry.duration)
                            });
                        }
                    }
                });
            });
            resourceObserver.observe({ entryTypes: ['resource'] });
        }
    }
    
    // Service Worker performance monitoring
    function monitorServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener('message', (event) => {
                if (event.data && event.data.type === 'PERFORMANCE_METRIC') {
                    console.log('SW Performance:', event.data.metric);
                    
                    if (window.gtag) {
                        window.gtag('event', 'sw_performance', {
                            'event_category': 'Service Worker',
                            'event_label': event.data.metric.name,
                            'value': Math.round(event.data.metric.value)
                        });
                    }
                }
            });
        }
    }
    
    // Memory usage monitoring
    function monitorMemory() {
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024);
                const totalMB = Math.round(memory.totalJSHeapSize / 1024 / 1024);
                
                console.log(`Memory: ${usedMB}MB / ${totalMB}MB`);
                
                if (window.gtag && usedMB > 100) { // Alert if using more than 100MB
                    window.gtag('event', 'high_memory_usage', {
                        'event_category': 'Performance',
                        'event_label': 'Memory Usage',
                        'value': usedMB
                    });
                }
            }, 30000); // Check every 30 seconds
        }
    }
    
    // Initialize monitoring when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', monitorPerformance);
    } else {
        monitorPerformance();
    }
    
    // Monitor service worker and memory
    monitorServiceWorker();
    monitorMemory();
    
    // Export for external use
    window.performanceMonitor = {
        getMetrics: function() {
            return {
                navigation: performance.getEntriesByType('navigation')[0],
                resources: performance.getEntriesByType('resource'),
                paint: performance.getEntriesByType('paint')
            };
        }
    };
    
})();
