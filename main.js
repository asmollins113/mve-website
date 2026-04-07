// ============================================
// MVE — Most Valuable Entertainment
// ============================================

// --- Navbar scroll ---
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// --- Mobile menu ---
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
document.querySelectorAll('.mobile-link:not(.mobile-drop-trigger)').forEach(l =>
  l.addEventListener('click', () => mobileMenu.classList.remove('open'))
);

// Mobile events dropdown toggle handled via inline onclick in HTML
document.querySelectorAll('.mobile-sub-link').forEach(l =>
  l.addEventListener('click', () => mobileMenu.classList.remove('open'))
);

// --- Hero canvas: animated gold particles ---
const canvas = document.getElementById('heroCanvas');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize, { passive: true });

const GOLD = [212, 168, 67];
const particles = Array.from({ length: 80 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  r: Math.random() * 1.5 + 0.3,
  vx: (Math.random() - 0.5) * 0.3,
  vy: -Math.random() * 0.5 - 0.1,
  alpha: Math.random() * 0.5 + 0.1,
  fade: Math.random() * 0.005 + 0.001
}));

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${GOLD[0]},${GOLD[1]},${GOLD[2]},${p.alpha})`;
    ctx.fill();
    p.x += p.vx;
    p.y += p.vy;
    p.alpha -= p.fade;
    if (p.alpha <= 0 || p.y < -10) {
      p.x = Math.random() * canvas.width;
      p.y = canvas.height + 10;
      p.alpha = Math.random() * 0.5 + 0.2;
      p.r = Math.random() * 1.5 + 0.3;
    }
  });
  requestAnimationFrame(drawParticles);
}
drawParticles();

// --- Fireflies ---
function addFlares() {
  const sections = [
    { el: document.getElementById('home'),    orbs: 3, fireflies: 18 },
    { el: document.getElementById('about'),   orbs: 2, fireflies: 10 },
    { el: document.getElementById('events'),  orbs: 2, fireflies: 7  },
    { el: document.getElementById('past'),    orbs: 2, fireflies: 10 },
    { el: document.getElementById('contact'), orbs: 1, fireflies: 6  },
    { el: document.querySelector('.cta-band'),orbs: 1, fireflies: 5  },
  ];

  const allFireflies = [];

  sections.forEach(({ el, orbs, fireflies }) => {
    if (!el) return;
    el.style.position = 'relative';
    el.style.overflow = 'hidden';

    // Soft ambient orbs
    for (let i = 0; i < orbs; i++) {
      const orb = document.createElement('div');
      const size = 100 + Math.random() * 140;
      orb.style.cssText = `
        position: absolute; pointer-events: none; z-index: 0;
        width: ${size}px; height: ${size}px; border-radius: 50%;
        background: radial-gradient(circle, rgba(212,168,67,0.10) 0%, transparent 70%);
        filter: blur(50px);
        top: ${10 + Math.random() * 75}%;
        left: ${5 + Math.random() * 85}%;
        animation: orb-float ${7 + Math.random() * 6}s ease-in-out ${Math.random() * 4}s infinite;
      `;
      el.appendChild(orb);
    }

    // Firefly dots
    for (let i = 0; i < fireflies; i++) {
      const ff = document.createElement('div');
      const size = 2.5 + Math.random() * 2.5;
      ff.style.cssText = `
        position: absolute; pointer-events: none; z-index: 1;
        width: ${size}px; height: ${size}px; border-radius: 50%;
        background: rgba(212,168,67,1);
        box-shadow: 0 0 ${size * 3}px ${size * 1.5}px rgba(212,168,67,0.5),
                    0 0 ${size * 6}px ${size * 3}px rgba(212,168,67,0.2);
        opacity: 0; top: 0; left: 0;
        will-change: transform, opacity;
      `;
      el.appendChild(ff);

      const w = el.offsetWidth || 600;
      const h = el.offsetHeight || 400;
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.3 + Math.random() * 0.5;

      allFireflies.push({
        el: ff,
        parent: el,
        x: Math.random() * w,
        y: Math.random() * h,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        glowPhase: Math.random() * Math.PI * 2,
        glowSpeed: 0.008 + Math.random() * 0.018,
        turnTimer: 60 + Math.random() * 180,
        turnCountdown: Math.random() * 180,
      });
    }
  });

  function animateFireflies() {
    allFireflies.forEach(ff => {
      const w = ff.parent.offsetWidth;
      const h = ff.parent.offsetHeight;

      // Move
      ff.x += ff.vx;
      ff.y += ff.vy;

      // Soft bounce off edges
      if (ff.x < 5)     { ff.vx =  Math.abs(ff.vx); }
      if (ff.x > w - 5) { ff.vx = -Math.abs(ff.vx); }
      if (ff.y < 5)     { ff.vy =  Math.abs(ff.vy); }
      if (ff.y > h - 5) { ff.vy = -Math.abs(ff.vy); }

      // Gradual random steering
      ff.turnCountdown--;
      if (ff.turnCountdown <= 0) {
        ff.vx += (Math.random() - 0.5) * 0.3;
        ff.vy += (Math.random() - 0.5) * 0.3;
        const spd = Math.hypot(ff.vx, ff.vy);
        const targetSpd = 0.35 + Math.random() * 0.45;
        if (spd > 0.05) { ff.vx = (ff.vx / spd) * targetSpd; ff.vy = (ff.vy / spd) * targetSpd; }
        ff.turnCountdown = ff.turnTimer + Math.random() * 120;
      }

      // Glow pulse (firefly blink)
      ff.glowPhase += ff.glowSpeed;
      const blink = Math.pow(Math.max(0, Math.sin(ff.glowPhase)), 2.5);
      const opacity = blink * 0.95;

      ff.el.style.transform = `translate(${ff.x}px, ${ff.y}px)`;
      ff.el.style.opacity = opacity;
    });

    requestAnimationFrame(animateFireflies);
  }

  animateFireflies();
}
addFlares();

// --- Event filter ---
const filterBtns = document.querySelectorAll('.filt');
const eventCards = document.querySelectorAll('.ecard');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    eventCards.forEach(card => {
      const show = filter === 'all' || card.dataset.type === filter;
      card.classList.toggle('hidden', !show);
    });
  });
});


// --- Scroll reveal ---
const revealTargets = document.querySelectorAll(
  '.ecard, .feature-card, .social-row, .h-stat, .about-left, .about-right, .contact-left, .contact-right'
);

const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0) translateX(0)';
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealTargets.forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(28px)';
  el.style.transition = `opacity 0.7s ${i * 0.06}s cubic-bezier(0.22,1,0.36,1), transform 0.7s ${i * 0.06}s cubic-bezier(0.22,1,0.36,1)`;
  io.observe(el);
});
