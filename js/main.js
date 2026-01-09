/**
 * Next Level Prospects - Main JavaScript
 * Professional interactions and animations
 */

document.addEventListener('DOMContentLoaded', function() {
    // ================================
    // Mobile Navigation
    // ================================
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav__link');

    function openMenu() {
        navMenu.classList.add('show-menu');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        navMenu.classList.remove('show-menu');
        document.body.style.overflow = '';
    }

    if (navToggle) {
        navToggle.addEventListener('click', openMenu);
    }

    if (navClose) {
        navClose.addEventListener('click', closeMenu);
    }

    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // ================================
    // Header Scroll Effect
    // ================================
    const header = document.getElementById('header');
    let lastScroll = 0;

    function handleScroll() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    // ================================
    // Active Navigation Link
    // ================================
    const sections = document.querySelectorAll('section[id]');

    function highlightNavLink() {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 150;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);

            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLink.classList.add('active');
                } else {
                    navLink.classList.remove('active');
                }
            }
        });
    }

    window.addEventListener('scroll', highlightNavLink, { passive: true });

    // ================================
    // Smooth Scroll for Anchor Links
    // ================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ================================
    // Animated Counter
    // ================================
    const statNumbers = document.querySelectorAll('.stat-card__number');
    let countersStarted = false;

    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        function updateCounter() {
            current += step;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        }

        updateCounter();
    }

    function checkCounters() {
        if (countersStarted) return;

        const statsSection = document.querySelector('.stats');
        if (!statsSection) return;

        const rect = statsSection.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;

        if (isVisible) {
            countersStarted = true;
            statNumbers.forEach(counter => animateCounter(counter));
        }
    }

    window.addEventListener('scroll', checkCounters, { passive: true });
    checkCounters(); // Check on load

    // ================================
    // Testimonials Slider
    // ================================
    const testimonialTrack = document.querySelector('.testimonials__track');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.testimonials__btn--prev');
    const nextBtn = document.querySelector('.testimonials__btn--next');
    const dotsContainer = document.querySelector('.testimonials__dots');

    if (testimonialTrack && testimonialCards.length > 0) {
        let currentSlide = 0;
        const totalSlides = testimonialCards.length;

        // Create dots
        testimonialCards.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('.dot');

        function updateSlider() {
            testimonialTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
        }

        function goToSlide(index) {
            currentSlide = index;
            updateSlider();
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateSlider();
        }

        function prevSlide() {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateSlider();
        }

        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);

        // Auto-play
        let autoplayInterval = setInterval(nextSlide, 5000);

        // Pause on hover
        testimonialTrack.addEventListener('mouseenter', () => {
            clearInterval(autoplayInterval);
        });

        testimonialTrack.addEventListener('mouseleave', () => {
            autoplayInterval = setInterval(nextSlide, 5000);
        });

        // Touch support
        let touchStartX = 0;
        let touchEndX = 0;

        testimonialTrack.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        testimonialTrack.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
        }
    }

    // ================================
    // Mobile Commits Slider - Infinite Loop
    // ================================
    const commitsTrack = document.querySelector('.commits-slider__track');

    if (commitsTrack && window.innerWidth <= 768) {
        const commitCards = commitsTrack.querySelectorAll('.commit-card');
        const cardCount = commitCards.length;

        // When user scrolls to near the end, jump back to start seamlessly
        commitsTrack.addEventListener('scroll', function() {
            const scrollLeft = commitsTrack.scrollLeft;
            const scrollWidth = commitsTrack.scrollWidth;
            const clientWidth = commitsTrack.clientWidth;

            // If scrolled to near the end (last 10%), jump to 1/3 position
            if (scrollLeft + clientWidth >= scrollWidth - 50) {
                commitsTrack.scrollLeft = scrollWidth / 3;
            }
            // If scrolled to very beginning, jump to 2/3 position
            if (scrollLeft <= 10) {
                commitsTrack.scrollLeft = scrollWidth / 3;
            }
        });

        // Start at 1/3 position so user can scroll both directions
        setTimeout(() => {
            commitsTrack.scrollLeft = commitsTrack.scrollWidth / 3;
        }, 100);
    }

    // ================================
    // Form Handling
    // ================================
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());

            // Simple validation
            const requiredFields = ['playerName', 'parentName', 'email', 'phone', 'gradYear', 'position', 'state'];
            let isValid = true;

            requiredFields.forEach(field => {
                const input = this.querySelector(`[name="${field}"]`);
                if (!input.value.trim()) {
                    input.style.borderColor = '#e74c3c';
                    isValid = false;
                } else {
                    input.style.borderColor = '';
                }
            });

            if (!isValid) {
                alert('Please fill in all required fields.');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const emailInput = this.querySelector('[name="email"]');
            if (!emailRegex.test(emailInput.value)) {
                emailInput.style.borderColor = '#e74c3c';
                alert('Please enter a valid email address.');
                return;
            }

            // Here you would typically send the data to a server
            // For now, we'll show a success message
            console.log('Form data:', data);

            // Show success message
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Request Submitted!';
            submitBtn.style.background = '#27ae60';
            submitBtn.disabled = true;

            // Reset form
            setTimeout(() => {
                this.reset();
                submitBtn.textContent = originalText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
            }, 3000);
        });

        // Clear error styling on input
        contactForm.querySelectorAll('input, select, textarea').forEach(input => {
            input.addEventListener('input', function() {
                this.style.borderColor = '';
            });
        });
    }

    // ================================
    // Intersection Observer for Animations
    // ================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll(
        '.service-card, .team-card, .commit-card, .feature, .stat-card'
    );

    animateElements.forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });

    // ================================
    // Video Play Button
    // ================================
    const videoPlayBtn = document.querySelector('.video-play-btn');

    if (videoPlayBtn) {
        videoPlayBtn.addEventListener('click', function() {
            // Replace this with your video logic
            // For example, opening a modal with an embedded YouTube video
            // or replacing the placeholder with an iframe

            const videoPlaceholder = this.closest('.video-placeholder');
            const videoId = 'YOUR_VIDEO_ID'; // Replace with actual video ID

            // Example: Replace with YouTube embed
            // videoPlaceholder.innerHTML = `
            //     <iframe
            //         width="100%"
            //         height="100%"
            //         src="https://www.youtube.com/embed/${videoId}?autoplay=1"
            //         frameborder="0"
            //         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            //         allowfullscreen>
            //     </iframe>
            // `;

            alert('Add your video URL in the JavaScript file to enable video playback.');
        });
    }

    // ================================
    // Lazy Loading Images
    // ================================
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // ================================
    // Keyboard Navigation
    // ================================
    document.addEventListener('keydown', function(e) {
        // Close mobile menu with Escape key
        if (e.key === 'Escape' && navMenu.classList.contains('show-menu')) {
            closeMenu();
        }
    });

    // ================================
    // US Map Tooltip
    // ================================
    const mapStates = document.querySelectorAll('.us-map__state');
    const mapTooltip = document.getElementById('map-tooltip');

    if (mapStates.length > 0 && mapTooltip) {
        mapStates.forEach(state => {
            state.addEventListener('mouseenter', function(e) {
                const stateName = this.getAttribute('data-name');
                if (stateName) {
                    mapTooltip.textContent = stateName;
                    mapTooltip.classList.add('visible');
                }
            });

            state.addEventListener('mousemove', function(e) {
                const container = this.closest('.commits-map__container');
                const rect = container.getBoundingClientRect();
                const x = e.clientX - rect.left + 10;
                const y = e.clientY - rect.top - 30;
                mapTooltip.style.left = x + 'px';
                mapTooltip.style.top = y + 'px';
            });

            state.addEventListener('mouseleave', function() {
                mapTooltip.classList.remove('visible');
            });
        });
    }
});

// ================================
// Preloader (Optional)
// ================================
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});
