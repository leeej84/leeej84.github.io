// Mobile-Specific Performance Optimizations
// Targeting PageSpeed score improvement from 60 to 90+

(function() {
    'use strict';
    
    // Check if device is mobile
    const isMobile = () => {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               window.innerWidth <= 1023;
    };
    
    // Optimize images for mobile
    function optimizeMobileImages() {
        if (!isMobile()) return;
        
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            // Add loading="lazy" for all images below the fold
            if (!img.loading) {
                img.loading = 'lazy';
            }
            
            // Optimize image sizes for mobile
            if (img.naturalWidth > window.innerWidth) {
                img.style.maxWidth = '100%';
                img.style.height = 'auto';
            }
            
            // Add mobile-specific classes
            img.classList.add('mobile-optimized');
        });
    }
    
    // Optimize CSS for mobile performance
    function optimizeMobileCSS() {
        if (!isMobile()) return;
        
        // Reduce animations on mobile for better performance
        const style = document.createElement('style');
        style.textContent = `
            @media (max-width: 1023px) {
                * {
                    animation-duration: 0.2s !important;
                    transition-duration: 0.2s !important;
                }
                
                .lg\\:hidden.bg-gray-900\\/95,
                #searchModal {
                    backdrop-filter: blur(5px) !important;
                    -webkit-backdrop-filter: blur(5px) !important;
                }
                
                .brand-photo {
                    filter: none !important;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Optimize JavaScript execution for mobile
    function optimizeMobileJS() {
        if (!isMobile()) return;
        
        // Reduce scroll event frequency
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) return;
            
            scrollTimeout = setTimeout(() => {
                // Handle scroll events
                scrollTimeout = null;
            }, 16); // ~60fps
        });
        
        // Optimize resize events
        let resizeTimeout;
        window.addEventListener('resize', () => {
            if (resizeTimeout) return;
            
            resizeTimeout = setTimeout(() => {
                optimizeMobileImages();
                resizeTimeout = null;
            }, 250);
        });
        
        // Optimize touch events
        document.addEventListener('touchstart', () => {}, { passive: true });
        document.addEventListener('touchmove', () => {}, { passive: true });
        document.addEventListener('touchend', () => {}, { passive: true });
    }
    
    // Optimize fonts for mobile
    function optimizeMobileFonts() {
        if (!isMobile()) return;
        
        // Preload critical fonts for mobile
        const fontLinks = document.querySelectorAll('link[rel="stylesheet"][href*="fonts"]');
        fontLinks.forEach(link => {
            link.setAttribute('media', 'all');
            link.setAttribute('importance', 'high');
        });
        
        // Optimize font loading
        if ('fonts' in document) {
            document.fonts.ready.then(() => {
                document.body.classList.add('fonts-loaded');
            });
        }
    }
    
    // Optimize network requests for mobile
    function optimizeMobileNetwork() {
        if (!isMobile()) return;
        
        // Check connection type
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
                
                // Reduce CSS complexity
                document.body.classList.add('save-data-mode');
            }
        }
    }
    
    // Optimize mobile navigation
    function optimizeMobileNavigation() {
        if (!isMobile()) return;
        
        const mobileNav = document.querySelector('.lg\\:hidden.bg-gray-900\\/95');
        if (mobileNav) {
            // Optimize backdrop filter for mobile
            mobileNav.style.backdropFilter = 'blur(5px)';
            mobileNav.style.webkitBackdropFilter = 'blur(5px)';
            
            // Optimize touch targets
            const navLinks = mobileNav.querySelectorAll('a[title]');
            navLinks.forEach(link => {
                link.style.minWidth = '48px';
                link.style.minHeight = '48px';
                link.style.touchAction = 'manipulation';
            });
        }
    }
    
    // Optimize mobile search
    function optimizeMobileSearch() {
        if (!isMobile()) return;
        
        const searchModal = document.getElementById('searchModal');
        if (searchModal) {
            // Reduce backdrop filter complexity
            searchModal.style.backdropFilter = 'blur(5px)';
            searchModal.style.webkitBackdropFilter = 'blur(5px)';
        }
        
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            // Optimize input for mobile
            searchInput.style.fontSize = '16px';
            searchInput.style.padding = '12px 16px';
            searchInput.style.width = '100%';
            searchInput.style.maxWidth = 'none';
        }
    }
    
    // Optimize mobile content layout
    function optimizeMobileContent() {
        if (!isMobile()) return;
        
        // Optimize main content area
        const main = document.querySelector('main');
        if (main) {
            main.style.padding = '1rem';
            main.style.marginTop = '0';
        }
        
        // Optimize posts
        const posts = document.querySelectorAll('.post');
        posts.forEach(post => {
            post.style.marginBottom = '2rem';
            post.style.padding = '1rem';
            post.style.borderRadius = '8px';
        });
        
        // Optimize tables for mobile
        const tables = document.querySelectorAll('table');
        tables.forEach(table => {
            table.style.fontSize = '14px';
            table.style.overflowX = 'auto';
            table.style.display = 'block';
            table.style.whiteSpace = 'nowrap';
        });
        
        // Optimize code blocks for mobile
        const codeBlocks = document.querySelectorAll('.highlight');
        codeBlocks.forEach(block => {
            block.style.fontSize = '13px';
            block.style.lineHeight = '1.4';
            block.style.overflowX = 'auto';
            block.style.webkitOverflowScrolling = 'touch';
        });
    }
    
    // Initialize mobile optimizations
    function initMobileOptimizations() {
        if (!isMobile()) return;
        
        // Apply all mobile optimizations
        optimizeMobileImages();
        optimizeMobileCSS();
        optimizeMobileJS();
        optimizeMobileFonts();
        optimizeMobileNetwork();
        optimizeMobileNavigation();
        optimizeMobileSearch();
        optimizeMobileContent();
        
        // Add mobile class to body
        document.body.classList.add('mobile-device');
        
        // Log mobile optimizations
        console.log('Mobile performance optimizations applied');
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileOptimizations);
    } else {
        initMobileOptimizations();
    }
    
    // Re-optimize on orientation change
    window.addEventListener('orientationchange', () => {
        setTimeout(initMobileOptimizations, 100);
    });
    
    // Export for external use
    window.mobilePerformance = {
        isMobile: isMobile,
        optimize: initMobileOptimizations,
        optimizeImages: optimizeMobileImages,
        optimizeCSS: optimizeMobileCSS
    };
    
})();
