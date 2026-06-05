document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Background Particle Canvas Animation ---
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    
    let width, height;
    let particles = [];
    const connectionDistance = 150;
    
    function initCanvas() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
            this.color = Math.random() > 0.5 ? 'rgba(0, 240, 255, 0.3)' : 'rgba(112, 0, 255, 0.3)';
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.x > width) this.x = 0;
            else if (this.x < 0) this.x = width;
            if (this.y > height) this.y = 0;
            else if (this.y < 0) this.y = height;
        }
        
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    function createParticles() {
        particles = [];
        let numParticles = (width * height) / 15000;
        for (let i = 0; i < numParticles; i++) {
            particles.push(new Particle());
        }
    }
    
    function animateParticles() {
        ctx.clearRect(0, 0, width, height);
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            
            for (let j = i; j < particles.length; j++) {
                let dx = particles[i].x - particles[j].x;
                let dy = particles[i].y - particles[j].y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < connectionDistance) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(255, 255, 255, ${0.05 - distance/connectionDistance * 0.05})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animateParticles);
    }
    
    window.addEventListener('resize', () => {
        initCanvas();
        createParticles();
    });
    
    initCanvas();
    createParticles();
    animateParticles();
    
    // --- 2. GSAP Animations ---
    gsap.registerPlugin(ScrollTrigger);
    
    // Hero Section Animations
    const heroTl = gsap.timeline();
    heroTl.fromTo(".greeting", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.2 })
          .fromTo(".glitch", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.6")
          .fromTo(".subtitle", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.6")
          .fromTo(".hero-hook", { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.6")
          .fromTo(".hero-cta .btn", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.2, ease: "power3.out" }, "-=0.4")
          .fromTo(".social-links a", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "back.out(1.7)" }, "-=0.2");
          
    // Scroll Reveal for Sections
    const sections = document.querySelectorAll("section:not(#hero)");
    sections.forEach(sec => {
        gsap.fromTo(sec.querySelector(".section-title"), 
            { y: 30, opacity: 0 },
            {
                scrollTrigger: {
                    trigger: sec,
                    start: "top 80%",
                },
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: "power3.out"
            }
        );
    });
    
    // About Section
    gsap.fromTo(".about-text", 
        { x: -50, opacity: 0 },
        { scrollTrigger: { trigger: "#about", start: "top 75%" }, x: 0, opacity: 1, duration: 1, ease: "power3.out" }
    );
    gsap.fromTo(".info-card", 
        { x: 50, opacity: 0 },
        { scrollTrigger: { trigger: "#about", start: "top 75%" }, x: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power3.out" }
    );
    
    // Timeline Section
    gsap.fromTo(".timeline-item", 
        { y: 50, opacity: 0 },
        { scrollTrigger: { trigger: "#timeline", start: "top 80%" }, y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power3.out" }
    );
    
    // Skills Section
    gsap.fromTo(".skill-category", 
        { y: 40, opacity: 0 },
        { scrollTrigger: { trigger: "#skills", start: "top 80%" }, y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power3.out" }
    );
    gsap.fromTo(".skill-tag", 
        { scale: 0.8, opacity: 0 },
        { scrollTrigger: { trigger: "#skills", start: "top 70%" }, scale: 1, opacity: 1, duration: 0.5, stagger: 0.02, ease: "back.out(1.5)" }
    );
    
    // Projects Section
    gsap.fromTo(".project-card", 
        { y: 50, opacity: 0 },
        { scrollTrigger: { trigger: "#projects", start: "top 80%" }, y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power3.out", clearProps: "transform" }
    );
    
    // --- 3. Active Nav Links on Scroll ---
    const navLinks = document.querySelectorAll('.nav-links a');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        document.querySelectorAll('section').forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
    
    // --- 4. Mobile Menu Toggle ---
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinksContainer = document.querySelector('.nav-links');
    
    mobileMenu.addEventListener('click', () => {
        navLinksContainer.classList.toggle('active');
        const icon = mobileMenu.querySelector('i');
        if (navLinksContainer.classList.contains('active')) {
            icon.classList.replace('fa-bars', 'fa-xmark');
        } else {
            icon.classList.replace('fa-xmark', 'fa-bars');
        }
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinksContainer.classList.remove('active');
            const icon = mobileMenu.querySelector('i');
            if(icon.classList.contains('fa-xmark')) {
                icon.classList.replace('fa-xmark', 'fa-bars');
            }
        });
    });
    
});
