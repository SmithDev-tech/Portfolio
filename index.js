window.addEventListener('DOMContentLoaded', () => {

    // Lenis smooth scroll - tuned for immediate responsiveness without lag
    const lenis = new Lenis({
        duration: 1.0,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1.1,
        touchMultiplier: 1.5,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Handle anchor links for Lenis
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    lenis.scrollTo(targetElement, { offset: -50 });
                }
            }
        });
    });

    // Mobile Navigation Drawer Toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    function toggleMobileMenu(forceClose = false) {
        if (!mobileMenuToggle || !navMenu) return;
        const isOpen = forceClose ? false : !navMenu.classList.contains('is-open');
        
        mobileMenuToggle.classList.toggle('active', isOpen);
        navMenu.classList.toggle('is-open', isOpen);
        mobileMenuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    }

    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMobileMenu();
        });

        // Close when clicking any nav link
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                toggleMobileMenu(true);
            });
        });

        // Close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
                toggleMobileMenu(true);
            }
        });

        // Close when clicking outside navbar
        document.addEventListener('click', (e) => {
            const navbar = document.getElementById('navbar');
            if (navbar && !navbar.contains(e.target) && navMenu.classList.contains('is-open')) {
                toggleMobileMenu(true);
            }
        });
    }

    // Nav Hide/Show on Scroll (desktop only - permanently persistent on mobile/responsive view)
    const nav = document.querySelector('nav');
    let lastScrollY = 0;

    lenis.on('scroll', ({ scroll }) => {
        // Do not hide navbar on mobile/responsive view
        if (window.innerWidth <= 768) {
            if (nav) nav.classList.remove('nav-hidden');
            return;
        }

        if (navMenu && navMenu.classList.contains('is-open')) {
            return; // keep visible while mobile menu is open
        }
        if (scroll > lastScrollY && scroll > 60) {
            // Scrolling down
            nav.classList.add('nav-hidden');
        } else {
            // Scrolling up
            nav.classList.remove('nav-hidden');
        }
        lastScrollY = scroll;
    });

    // Panels
    const panels = document.querySelectorAll('.panel');
    const panelsContainer = document.querySelector('.panels-container');
    let current = 0;
    let autoPlayInterval;

    function goTo(index, isUserInteraction = false) {
        panels.forEach(p => p.classList.remove('active'));
        if (panels[index]) {
            panels[index].classList.add('active');
            current = index;
            // Only scroll the horizontal container if user manually clicked on mobile
            if (isUserInteraction && panelsContainer && window.innerWidth <= 850) {
                const targetLeft = panels[index].offsetLeft - (panelsContainer.offsetWidth / 2) + (panels[index].offsetWidth / 2);
                panelsContainer.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' });
            }
        }
    }

    function startAutoPlay() {
        autoPlayInterval = setInterval(() => {
            goTo((current + 1) % panels.length, false); // automated advance (no scroll jump)
        }, 3500); // changes every 3.5 seconds
    }

    function resetAutoPlay() {
        clearInterval(autoPlayInterval);
        startAutoPlay();
    }

    // click to expand
    panels.forEach((panel, i) => {
        panel.addEventListener('click', () => {
            goTo(i, true);
            resetAutoPlay();
        });
    });

    // Start automatic rotation
    startAutoPlay();

    // optional buttons (if added later)
    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            goTo((current + 1) % panels.length);
            resetAutoPlay();
        });
    }

    const prevBtn = document.getElementById('prevBtn');
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            goTo((current - 1 + panels.length) % panels.length);
            resetAutoPlay();
        });
    }

    // Scroll reveal observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    document.querySelectorAll('.reveal-up').forEach(el => observer.observe(el));

    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    
    const darkIconHTML = `
        <circle cx="12" cy="12" r="5" fill="#111" />
        <ellipse cx="12" cy="12" rx="11" ry="3" transform="rotate(-20 12 12)" />
    `;
    const lightIconHTML = `
        <circle cx="12" cy="12" r="5" fill="#111" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    `;

    if (themeToggle) {
        themeToggle.addEventListener('click', (e) => {
            e.preventDefault();
            document.body.classList.toggle('light-theme');
            
            if (document.body.classList.contains('light-theme')) {
                themeIcon.innerHTML = lightIconHTML;
            } else {
                themeIcon.innerHTML = darkIconHTML;
            }
        });
    }

    // Contact Form Submission to ekowsmith090@gmail.com
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('contact-submit');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nameInput = document.getElementById('contact-name');
            const emailInput = document.getElementById('contact-email');
            const messageInput = document.getElementById('contact-message');

            const name = nameInput ? nameInput.value.trim() : '';
            const email = emailInput ? emailInput.value.trim() : '';
            const message = messageInput ? messageInput.value.trim() : '';

            if (!name || !email || !message) {
                if (formStatus) {
                    formStatus.textContent = 'Please fill out all fields.';
                    formStatus.className = 'form-status error';
                }
                return;
            }

            // Set loading state
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending...';
            }
            if (formStatus) {
                formStatus.textContent = '';
                formStatus.className = 'form-status';
            }

            try {
                const response = await fetch('https://formsubmit.co/ajax/ekowsmith090@gmail.com', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        message: message,
                        _subject: `New Portfolio Message from ${name}`
                    })
                });

                if (response.ok) {
                    contactForm.reset();
                    if (submitBtn) {
                        submitBtn.textContent = 'Message Sent ✓';
                        setTimeout(() => {
                            submitBtn.textContent = 'Submit';
                            submitBtn.disabled = false;
                        }, 4000);
                    }
                    if (formStatus) {
                        formStatus.textContent = 'Thank you! Your message has been sent to ekowsmith090@gmail.com.';
                        formStatus.className = 'form-status success';
                        setTimeout(() => {
                            formStatus.textContent = '';
                            formStatus.className = 'form-status';
                        }, 6000);
                    }
                } else {
                    throw new Error('Server returned an error status.');
                }
            } catch (error) {
                console.error('Contact form error:', error);
                if (submitBtn) {
                    submitBtn.textContent = 'Submit';
                    submitBtn.disabled = false;
                }
                if (formStatus) {
                    formStatus.innerHTML = 'Oops! Failed to send. Please email directly at <a href="mailto:ekowsmith090@gmail.com">ekowsmith090@gmail.com</a>';
                    formStatus.className = 'form-status error';
                }
            }
        });
    }
});