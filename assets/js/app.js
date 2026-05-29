/* ==========================================
   MOBILE MENU TOGGLE
   ========================================== */
const menuToggle = document.getElementById('menu-toggle');
const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
const mobileLinks = document.querySelectorAll('.mobile-nav-link');

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    mobileMenuOverlay.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
});

mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
        document.body.classList.remove('no-scroll');
    });
});

/* ==========================================
   SCROLLSPY ACTIVE LINK SWITCHER
   ========================================== */
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - 150)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

/* ==========================================
   TYPING TEXT ANIMATION
   ========================================== */
const words = ["(hover to reveal)", "(webinars)", "(workshops)", "(quizzes)"];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingText = document.getElementById('typing-text');

function type() {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
        typingText.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingText.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === currentWord.length) {
        typeSpeed = 1500; // Pause at end of word
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 500; // Pause before typing next word
    }

    setTimeout(type, typeSpeed);
}

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(type, 1000);
});

/* ==========================================
   COSMIC PARTICLES BACKGROUND
   ========================================== */
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
const particleCount = 75;
const mouse = {
    x: null,
    y: null,
    radius: 120
};

// Set Canvas Size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Track Mouse Movement
window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

// Reset Mouse when it leaves screen
window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
});

// Particle Class
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.baseX = this.x;
        this.baseY = this.y;
        
        // Colors range between cyan and purple
        this.color = Math.random() > 0.5 ? 'rgba(0, 229, 255, 0.4)' : 'rgba(157, 78, 221, 0.4)';
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        // Move particle normally
        this.x += this.speedX;
        this.y += this.speedY;

        // Bounce off canvas edges
        if (this.x < 0 || this.x > canvas.width) this.speedX = -this.speedX;
        if (this.y < 0 || this.y > canvas.height) this.speedY = -this.speedY;

        // Interaction with mouse pointer (push effect)
        if (mouse.x != null && mouse.y != null) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mouse.radius) {
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const maxForce = (mouse.radius - distance) / mouse.radius;
                const force = maxForce * 1.5; // push strength
                
                this.x -= forceDirectionX * force;
                this.y -= forceDirectionY * force;
            }
        }
        
        this.draw();
    }
}

// Initialize Particle Array
function init() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}
init();

// Re-initialize particles on resize to fill screen properly
window.addEventListener('resize', init);

// Animation Loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw star connections if close
    drawLines();
    
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
    }
    
    requestAnimationFrame(animate);
}

function drawLines() {
    for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
            let dx = particles[a].x - particles[b].x;
            let dy = particles[a].y - particles[b].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                let opacity = (100 - distance) / 1000;
                ctx.strokeStyle = `rgba(0, 229, 255, ${opacity})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(particles[a].x, particles[a].y);
                ctx.lineTo(particles[b].x, particles[b].y);
                ctx.stroke();
            }
        }
    }
}

animate();
