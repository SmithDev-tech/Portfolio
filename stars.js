const canvas = document.createElement('canvas');
canvas.id = 'stars-canvas';
// Ensure canvas is placed inside .page3 but behind everything
const page3 = document.querySelector('.page3');
page3.insertBefore(canvas, page3.firstChild);

const ctx = canvas.getContext('2d');
let width, height;

function resize() {
    const rect = page3.getBoundingClientRect();
    width = canvas.width = rect.width;
    height = canvas.height = rect.height;
}

window.addEventListener('resize', resize);
// Allow time for CSS to apply
setTimeout(resize, 100);

// Subtle space dust particles from the video
const particles = [];
for (let i = 0; i < 200; i++) {
    particles.push({
        x: Math.random() * 2000,
        y: Math.random() * 2000,
        size: Math.random() * 1.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3
    });
}

function animate() {
    ctx.clearRect(0, 0, width, height);
    
    // Draw background particles
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    for (let p of particles) {
        p.x += p.speedX;
        p.y += p.speedY;
        
        // Wrap around screen
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    }
    
    requestAnimationFrame(animate);
}

// Start sequence
setTimeout(() => {
    resize();
    animate();
}, 200);
