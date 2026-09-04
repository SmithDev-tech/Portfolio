window.addEventListener('DOMContentLoaded', () => {

    // Lenis smooth scroll
    const lenis = new Lenis({
        duration: 1.8,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Handle anchor links for Lenis
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            lenis.scrollTo(this.getAttribute('href'));
        });
    });

    // Nav Hide/Show on Scroll
    const nav = document.querySelector('nav');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        if (window.scrollY > lastScrollY && window.scrollY > 50) {
            // Scrolling down
            nav.classList.add('nav-hidden');
        } else {
            // Scrolling up
            nav.classList.remove('nav-hidden');
        }
        lastScrollY = window.scrollY;
    });

    // Panels
    const panels = document.querySelectorAll('.panel');
    let current = 0;
    let autoPlayInterval;

    function goTo(index) {
        panels.forEach(p => p.classList.remove('active'));
        panels[index].classList.add('active');
        current = index;
    }

    function startAutoPlay() {
        autoPlayInterval = setInterval(() => {
            goTo((current + 1) % panels.length);
        }, 3500); // changes every 3.5 seconds
    }

    function resetAutoPlay() {
        clearInterval(autoPlayInterval);
        startAutoPlay();
    }

    // click to expand
    panels.forEach((panel, i) => {
        panel.addEventListener('click', () => {
            goTo(i);
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