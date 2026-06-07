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

    // Panels
    const panels = document.querySelectorAll('.panel');
    let current = 0;

    function goTo(index) {
        panels.forEach(p => p.classList.remove('active'));
        panels[index].classList.add('active');
        current = index;
    }

    // click to expand
    panels.forEach((panel, i) => {
        panel.addEventListener('click', () => goTo(i));
    });

    // buttons
    document.getElementById('nextBtn').addEventListener('click', () => {
        goTo((current + 1) % panels.length);
    });

    document.getElementById('prevBtn').addEventListener('click', () => {
        goTo((current - 1 + panels.length) % panels.length);
    });

});