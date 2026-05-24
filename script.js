/* ============================================
   WEDDING INVITATION — script.js
   Animations | Butterflies | Scroll Effects
   ============================================ */

// ===== CONFIG (سهل التعديل) =====
const CONFIG = {
  date: '5 أغسطس 2026 ',
  dateRaw: '2026-08-05',
  venue: 'قاعة الجوهرة',
  city: 'مشتول السوق — محافظة الشرقية',
  mapsUrl: 'https://maps.google.com/?q=قاعة+الجوهرة+مشتول+السوق',
  introDuration: 3200, // ms
};

// ===== INTRO SPLASH =====
window.addEventListener('DOMContentLoaded', () => {
  updateConfigText();
  startIntroCanvas();

  setTimeout(() => {
    const intro = document.getElementById('intro');
    const main  = document.getElementById('main-content');
    intro.classList.add('fade-out');
    main.classList.remove('hidden');
    setTimeout(() => {
      intro.style.display = 'none';
      startHeroCanvas();
      spawnGoldLeaves();
      initScrollReveal();
    }, 800);
  }, CONFIG.introDuration);
});

function updateConfigText() {
  const heroDate    = document.getElementById('hero-date');
  const footerDate  = document.getElementById('footer-date');
  const locName     = document.getElementById('location-name');
  const locCity     = document.getElementById('location-city');
  const mapBtn      = document.querySelector('.map-btn');
  if (heroDate)   heroDate.textContent   = CONFIG.date;
  if (footerDate) footerDate.textContent = CONFIG.date;
  if (locName)    locName.textContent    = CONFIG.venue;
  if (locCity)    locCity.textContent    = CONFIG.city;
  if (mapBtn)     mapBtn.href            = CONFIG.mapsUrl;
}

// ===== INTRO CANVAS (particle stars) =====
function startIntroCanvas() {
  const canvas = document.getElementById('intro-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const stars = Array.from({ length: 120 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.5 + 0.3,
    a: Math.random(),
    speed: Math.random() * 0.008 + 0.003,
    dir: Math.random() > 0.5 ? 1 : -1,
  }));

  let running = true;

  function draw() {
    if (!running) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
      s.a += s.speed * s.dir;
      if (s.a > 1 || s.a < 0) s.dir *= -1;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201,168,76,${s.a * 0.7})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
  setTimeout(() => { running = false; }, CONFIG.introDuration + 1000);
}

// ===== HERO CANVAS (animated gold particles) =====
function startHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const particles = Array.from({ length: 60 }, () => createParticle(canvas));

  function createParticle(c) {
    return {
      x: Math.random() * c.width,
      y: Math.random() * c.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4 - 0.2,
      r: Math.random() * 2 + 0.5,
      a: Math.random() * 0.6 + 0.1,
      life: Math.random(),
    };
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // dark gradient background
    const grad = ctx.createRadialGradient(
      canvas.width / 2, canvas.height / 2, 0,
      canvas.width / 2, canvas.height / 2, canvas.width
    );
    grad.addColorStop(0, '#1a1000');
    grad.addColorStop(1, '#0d0800');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.x  += p.vx;
      p.y  += p.vy;
      p.life += 0.004;
      const fade = Math.sin(p.life * Math.PI);
      if (p.life >= 1) {
        Object.assign(p, createParticle(canvas));
        p.life = 0;
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201,168,76,${p.a * fade})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }
  draw();
}

// ===== GOLD LEAVES DYNAMIC GENERATION =====
const LEAF_PATHS = [
  // Leaf 1: Slender Willow/Eucalyptus Leaf
  `<svg viewBox="0 0 100 100" style="width: 100%; height: 100%;">
     <path fill="url(#goldLeafGrad)" d="M50,5 C65,25 65,65 50,95 C35,65 35,25 50,5 Z" />
     <path stroke="#1a1000" stroke-width="1" stroke-linecap="round" fill="none" opacity="0.35" d="M50,5 L50,95 M50,25 Q58,22 60,24 M50,38 Q58,35 60,37 M50,50 Q58,47 60,49 M50,62 Q57,59 58,61 M50,30 Q42,27 40,29 M50,43 Q42,40 40,42 M50,55 Q42,52 40,54 M50,67 Q43,64 42,66" />
   </svg>`,
  // Leaf 2: Curved Eucalyptus Leaf
  `<svg viewBox="0 0 100 100" style="width: 100%; height: 100%;">
     <path fill="url(#goldLeafGrad)" d="M50,5 C72,20 62,70 45,95 C33,70 28,20 50,5 Z" />
     <path stroke="#1a1000" stroke-width="1" stroke-linecap="round" fill="none" opacity="0.35" d="M50,5 C47,35 45,90 45,95 M48,28 Q58,23 59,25 M47,41 Q57,37 58,39 M46,55 Q55,51 56,53 M45,69 Q53,65 54,67 M48,32 Q39,29 37,31 M47,46 Q38,43 36,45 M46,60 Q38,57 37,59 M45,74 Q38,71 37,73" />
   </svg>`,
  // Leaf 3: Rounded Laurel Leaf
  `<svg viewBox="0 0 100 100" style="width: 100%; height: 100%;">
     <path fill="url(#goldLeafGrad)" d="M50,15 C72,25 72,65 50,85 C28,65 28,25 50,15 Z" />
     <path stroke="#1a1000" stroke-width="1" stroke-linecap="round" fill="none" opacity="0.35" d="M50,15 L50,85 M50,30 Q60,27 62,29 M50,42 Q60,39 62,41 M50,54 Q59,51 60,53 M50,66 Q58,63 59,65 M50,35 Q40,32 38,34 M50,47 Q40,44 38,46 M50,59 Q41,56 40,58 M50,71 Q42,68 41,70" />
   </svg>`
];

function spawnGoldLeaves() {
  const container = document.getElementById('gold-leaves-container');
  if (!container) return;

  function addLeaf(initial = false) {
    const el = document.createElement('div');
    el.className = 'gold-leaf';
    
    // Choose a random leaf path variant
    el.innerHTML = LEAF_PATHS[Math.floor(Math.random() * LEAF_PATHS.length)];

    const size = Math.random() * 25 + 20; // Size between 20px and 45px
    const startX = Math.random() * 100; // Left position 0% - 100%
    const startY = initial ? (Math.random() * window.innerHeight - 50) : -60; // Spread initially
    const duration = Math.random() * 8 + 8; // Duration 8s - 16s
    const delay = initial ? 0 : Math.random() * 4;
    const sway = (Math.random() - 0.5) * 120; // Sway -60px to 60px
    const rotX = Math.random() * 720 + 360; // 3D X rotation
    const rotY = Math.random() * 720 + 360; // 3D Y rotation
    const rotZ = Math.random() * 540 + 180; // 3D Z rotation

    el.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${startX}%;
      top: ${startY}px;
      --sway: ${sway}px;
      --rot-x: ${rotX}deg;
      --rot-y: ${rotY}deg;
      --rot-z: ${rotZ}deg;
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
    `;

    container.appendChild(el);

    // Remove element after animation completes to avoid memory bloat
    setTimeout(() => {
      el.remove();
    }, (duration + delay + 1) * 1000);
  }

  // Spawn initial set of leaves spread across the screen for immediate effect
  for (let i = 0; i < 12; i++) {
    addLeaf(true);
  }

  // Keep spawning leaves periodically
  setInterval(() => addLeaf(false), 1500);
}

// ===== SCROLL REVEAL =====
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => observer.observe(el));
}
