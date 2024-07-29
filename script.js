// Register GSAP ScrollTrigger plugin and ScrollToPlugin
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Initialize Lenis for smooth scrolling
let lenis;

// Loader functionality
const loaderContainer = document.querySelector('.loader-container');
const mainContent = document.querySelector('.main-content');

window.addEventListener('load', () => {
    setTimeout(() => {
        gsap.to(loaderContainer, {
            opacity: 0,
            duration: 1,
            onComplete: () => {
                loaderContainer.style.display = 'none';
                mainContent.classList.add('loaded');
                initializeAllComponents();
            }
        });
    }, 2000);
});

function initLenis() {
    lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    lenis.on('scroll', ScrollTrigger.update);

    ScrollTrigger.scrollerProxy(document.body, {
        scrollTop(value) {
            if (arguments.length) {
                lenis.scrollTo(value);
            }
            return lenis.scroll;
        },
        getBoundingClientRect() {
            return {top: 0, left: 0, width: window.innerWidth, height: window.innerHeight};
        },
        pinType: document.body.style.transform ? "transform" : "fixed"
    });
}

function initializeAllComponents() {
    initLenis();
    initMobileNav();
    initHeroSection();
    animateFeaturedCollections();
    initTestimonials();
    initVirtualTryOn();
    initVideoShowcase();
    initWhatsNewSection();
    initSmoothScroll();
    initNavbarScrollEffect();
    animateAtelierSection();
    initMobileOptimizations();
    lazyLoadImages();
}

// Mobile-friendly navigation
function initMobileNav() {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    burger.addEventListener('click', () => {
        nav.classList.toggle('nav-active');
        
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });

        burger.classList.toggle('toggle');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('nav-active');
            burger.classList.remove('toggle');
        });
    });
}

// Hero section initialization
function initHeroSection() {
    const heroSwiper = new Swiper('.hero-carousel', {
        loop: true,
        effect: 'fade',
        speed: 1000,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.carousel-nav',
            clickable: true,
            renderBullet: function (index, className) {
                return '<div class="' + className + ' carousel-nav-item"></div>';
            },
        },
    });

    const heroImages = document.querySelectorAll('.hero-image');
    heroImages.forEach(img => {
        img.style.height = '100vh';
        img.style.backgroundSize = 'cover';
        img.style.backgroundPosition = 'center';
    });

    if (!isMobile()) {
        initHeroParallax();
    }
}

function initHeroParallax() {
    const heroImages = document.querySelectorAll('.hero-image');
    heroImages.forEach(img => {
        gsap.to(img, {
            yPercent: 20,
            ease: "none",
            scrollTrigger: {
                trigger: img.parentElement,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
                invalidateOnRefresh: true
            }
        });
    });
}

// Featured Collections animations
function animateFeaturedCollections() {
    gsap.from('.featured-collections .section-title', {
        opacity: 0,
        y: 50,
        duration: 1,
        scrollTrigger: {
            trigger: '.featured-collections',
            start: 'top 80%',
        }
    });

    gsap.from('.collection-item', {
        opacity: 0,
        y: 50,
        duration: 1,
        stagger: 0.2,
        scrollTrigger: {
            trigger: '.collections-grid',
            start: 'top 80%',
        }
    });
}

// Testimonials
function initTestimonials() {
    const testimonialCards = document.querySelectorAll('.testimonial-card');

    if (!isMobile()) {
        testimonialCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const xPercent = (x / rect.width - 0.5) * 20;
                const yPercent = (y / rect.height - 0.5) * 20;

                gsap.to(card, {
                    rotationY: xPercent,
                    rotationX: -yPercent,
                    transformPerspective: 500,
                    ease: 'power1.out',
                    duration: 0.5
                });
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    rotationY: 0,
                    rotationX: 0,
                    ease: 'power3.out',
                    duration: 0.5
                });
            });
        });
    }

    gsap.from(testimonialCards, {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.testimonial-grid',
            start: 'top 80%'
        }
    });
}

// Virtual Try-On Experience
function initVirtualTryOn() {
    const designOptions = document.querySelectorAll('.design-option');
    const colorOptions = document.querySelectorAll('.color-option');
    const garmentOverlay = document.querySelector('.garment-overlay');

    const designs = {
        design1: './img/1.jpg',
        design2: './img/upscale.jpg',
        design3: './img/5.jpg'
    };

    let currentDesign = null;
    let currentColor = null;

    function updateGarment() {
        garmentOverlay.style.opacity = 0;

        setTimeout(() => {
            if (currentDesign) {
                garmentOverlay.style.backgroundImage = `url(${currentDesign})`;
                garmentOverlay.style.opacity = 1;

                if (currentColor) {
                    garmentOverlay.style.backgroundColor = currentColor;
                    garmentOverlay.style.mixBlendMode = 'multiply';
                } else {
                    garmentOverlay.style.backgroundColor = 'transparent';
                    garmentOverlay.style.mixBlendMode = 'normal';
                }
            }
        }, 300);
    }

    designOptions.forEach(option => {
        option.addEventListener('click', () => {
            const design = option.getAttribute('data-design');
            currentDesign = designs[design];
            updateGarment();

            designOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
        });
    });

    colorOptions.forEach(option => {
        const color = option.getAttribute('data-color');
        option.style.backgroundColor = color;

        option.addEventListener('click', () => {
            currentColor = color;
            updateGarment();

            colorOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
        });
    });

    // Initialize with the first design
    designOptions[0].click();
}

// Video Showcase Functionality
function initVideoShowcase() {
    const mainVideo = document.getElementById('main-video');
    const playPauseBtn = document.querySelector('.play-pause-btn');
    const videoTitle = document.getElementById('video-title');
    const videoDescription = document.getElementById('video-description');
    const timelineItems = document.querySelectorAll('.timeline-item');

    function updateMainVideo(item) {
        const videoSrc = item.getAttribute('data-video');
        const title = item.getAttribute('data-title');
        const description = item.getAttribute('data-description');
        
        gsap.to(mainVideo, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                mainVideo.src = videoSrc;
                mainVideo.play();
                videoTitle.textContent = title;
                videoDescription.textContent = description;
                gsap.to(mainVideo, {
                    opacity: 1,
                    duration: 0.5
                });
            }
        });

        timelineItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
    }

    timelineItems.forEach(item => {
        item.addEventListener('click', () => updateMainVideo(item));
    });

    playPauseBtn.addEventListener('click', () => {
        if (mainVideo.paused) {
            mainVideo.play();
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            mainVideo.pause();
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
    });

    mainVideo.addEventListener('play', () => {
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    });

    mainVideo.addEventListener('pause', () => {
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    });

    // Initialize with the first video
    updateMainVideo(timelineItems[0]);

    // Animate timeline on scroll
    gsap.from('.timeline-item', {
        opacity: 0,
        y: 50,
        stagger: 0.2,
        duration: 1,
        scrollTrigger: {
            trigger: '.video-timeline',
            start: 'top 80%',
        }
    });
}

// What's New Section
function initWhatsNewSection() {
    const whatsNewSwiper = new Swiper('.whats-new-carousel', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.whats-new-nav',
            clickable: true,
            renderBullet: function (index, className) {
                return '<div class="' + className + ' whats-new-nav-item"></div>';
            },
        },
        breakpoints: {
            768: {
                slidesPerView: 2,
            },
            1024: {
                slidesPerView: 3,
            },
        },
    });

    gsap.from('.whats-new .section-title', {
        opacity: 0,
        y: 50,
        duration: 1,
        scrollTrigger: {
            trigger: '.whats-new',
            start: 'top 80%',
        }
    });

    gsap.from('.whats-new-slide', {
        opacity: 0,
        y: 50,
        duration: 1,
        stagger: 0.2,
        scrollTrigger: {
            trigger: '.whats-new-carousel',
            start: 'top 80%',
        }
    });
}

// Smooth scroll for nav links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                lenis.scrollTo(targetElement, {
                    offset: -100,
                    duration: 1.5,
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                });
            }
        });
    });
}

// Navbar scroll effect
function initNavbarScrollEffect() {
    ScrollTrigger.create({
        start: 'top -80',
        end: 99999,
        toggleClass: {className: 'navbar--scrolled', targets: '.navbar'}
    });
}

// Atelier section background animation
function animateAtelierSection() {
    const atelierSection = document.querySelector('.atelier-insights');

    ScrollTrigger.create({
        trigger: atelierSection,
        start: 'top center',
        onEnter: () => {
            gsap.to(atelierSection, {
                backgroundColor: "white",
                duration: 1,
                ease: 'power2.inOut'
            });
        },
        onLeaveBack: () => {
            gsap.to(atelierSection, {
                backgroundColor: "#f0ebe1",
                duration: 1,
                ease: 'power2.inOut'
            });
        }
    });
}

// Helper function to check if the device is mobile
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Optimize animations for mobile
function optimizeAnimationsForMobile() {
    if (isMobile()) {
        // Reduce animation durations
        gsap.globalTimeline.timeScale(1.5);
        
        // Disable or simplify heavy animations
        const heroParallax = ScrollTrigger.getAll().find(st => st.vars.trigger === '.hero-image');
        if (heroParallax) {
            heroParallax.kill();
        }
    }
}

// Defer non-critical scripts
function deferScripts() {
    const deferScripts = document.querySelectorAll('script[defer]');
    deferScripts.forEach(script => {
        script.setAttribute('src', script.getAttribute('data-src'));
    });
}

// Function to handle lazy loading of images
function lazyLoadImages() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const image = entry.target;
                    image.src = image.dataset.src;
                    image.classList.remove("lazy");
                    imageObserver.unobserve(image);
                }
            });
        });

        document.querySelectorAll('img.lazy').forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        const lazyImages = [].slice.call(document.querySelectorAll("img.lazy"));
        let active = false;

        const lazyLoad = function() {
            if (active === false) {
                active = true;

                setTimeout(function() {
                    lazyImages.forEach(function(lazyImage) {
                        if ((lazyImage.getBoundingClientRect().top <= window.innerHeight && lazyImage.getBoundingClientRect().bottom >= 0) && getComputedStyle(lazyImage).display !== "none") {
                            lazyImage.src = lazyImage.dataset.src;
                            lazyImage.classList.remove("lazy");

                            lazyImages = lazyImages.filter(function(image) {
                                return image !== lazyImage;
                            });

                            if (lazyImages.length === 0) {
                                document.removeEventListener("scroll", lazyLoad);
                                window.removeEventListener("resize", lazyLoad);
                                window.removeEventListener("orientationchange", lazyLoad);
                            }
                        }
                    });

                    active = false;
                }, 200);
            }
        };

        document.addEventListener("scroll", lazyLoad);
        window.addEventListener("resize", lazyLoad);
        window.addEventListener("orientationchange", lazyLoad);
    }
}

// Initialize mobile optimizations
function initMobileOptimizations() {
    optimizeAnimationsForMobile();
    deferScripts();
    
    // Add touch events for mobile interactivity
    document.querySelectorAll('.collection-item, .testimonial-card').forEach(item => {
        item.addEventListener('touchstart', function() {
            this.classList.add('touch-active');
        }, {passive: true});
        
        item.addEventListener('touchend', function() {
            this.classList.remove('touch-active');
        }, {passive: true});
    });
}

// Kill ScrollTrigger on page unload to prevent memory leaks
window.addEventListener('beforeunload', () => {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
});

// Initialize everything when the page is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // The loader will handle calling initializeAllComponents()
});