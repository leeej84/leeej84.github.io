// Advanced Image Optimization for Desktop Performance
(function() {
    'use strict';
    
    // Check WebP support
    function checkWebPSupport() {
        return new Promise((resolve) => {
            const webP = new Image();
            webP.onload = webP.onerror = function () {
                resolve(webP.height === 2);
            };
            webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        });
    }
    
    // Lazy loading for images
    function initLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.remove('lazy');
                            img.removeAttribute('data-src');
                            observer.unobserve(img);
                        }
                    }
                });
            });
            
            // Observe all lazy images
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        } else {
            // Fallback for older browsers
            document.querySelectorAll('img[data-src]').forEach(img => {
                img.src = img.dataset.src;
                img.classList.remove('lazy');
            });
        }
    }
    
    // Responsive images for desktop
    function optimizeImagesForDesktop() {
        const images = document.querySelectorAll('img:not(.lazy)');
        
        images.forEach(img => {
            // Skip if already optimized
            if (img.dataset.optimized) return;
            
            const imgWidth = img.naturalWidth || img.offsetWidth;
            const containerWidth = img.parentElement.offsetWidth;
            
            // Only optimize if image is larger than container
            if (imgWidth > containerWidth) {
                img.style.maxWidth = '100%';
                img.style.height = 'auto';
                img.dataset.optimized = 'true';
            }
            
            // Add loading="lazy" for images below the fold
            if (!img.loading) {
                img.loading = 'lazy';
            }
        });
    }
    
    // Preload critical images
    function preloadCriticalImages() {
        const criticalImages = [
            '/assets/img/Leee.jpg',
            '/favicon_io/android-chrome-192x192.png'
        ];
        
        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }
    
    // Optimize image loading based on connection
    function optimizeForConnection() {
        if ('connection' in navigator) {
            const connection = navigator.connection;
            
            if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
                // Reduce image quality for slow connections
                document.querySelectorAll('img').forEach(img => {
                    if (img.src.includes('images/')) {
                        img.style.filter = 'contrast(1.1) brightness(1.05)';
                    }
                });
            }
            
            // Save data mode
            if (connection.saveData) {
                // Disable non-critical images
                document.querySelectorAll('img:not([data-critical])').forEach(img => {
                    img.style.display = 'none';
                });
            }
        }
    }
    
    // Progressive image loading
    function initProgressiveLoading() {
        const images = document.querySelectorAll('img[data-progressive]');
        
        images.forEach(img => {
            const lowResSrc = img.dataset.lowRes;
            const highResSrc = img.dataset.highRes;
            
            if (lowResSrc && highResSrc) {
                // Start with low resolution
                img.src = lowResSrc;
                
                // Load high resolution in background
                const highResImg = new Image();
                highResImg.onload = function() {
                    img.src = highResSrc;
                    img.classList.add('loaded');
                };
                highResImg.src = highResSrc;
            }
        });
    }
    
    // Initialize when DOM is ready
    function init() {
        // Wait for critical content to load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }
        
        // Initialize all optimizations
        initLazyLoading();
        optimizeImagesForDesktop();
        preloadCriticalImages();
        optimizeForConnection();
        initProgressiveLoading();
        
        // Re-optimize on resize (for responsive images)
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(optimizeImagesForDesktop, 250);
        });
        
        // Optimize images in dynamically loaded content
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) { // Element node
                            const images = node.querySelectorAll ? node.querySelectorAll('img') : [];
                            images.forEach(img => {
                                if (img.dataset.src) {
                                    // Re-initialize lazy loading for new images
                                    initLazyLoading();
                                }
                            });
                        }
                    });
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    // Start optimization
    init();
    
    // Export for external use
    window.imageOptimizer = {
        reoptimize: optimizeImagesForDesktop,
        checkWebP: checkWebPSupport,
        initLazyLoading: initLazyLoading
    };
    
})();
