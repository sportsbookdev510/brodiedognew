// ===== Particle Canvas =====
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let sparks = [];
  let w, h, dpr = 1;
  let tick = 0;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function createParticle() {
    const isBright = Math.random() > 0.85;
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      size: isBright ? Math.random() * 2.8 + 1.2 : Math.random() * 2 + 0.4,
      speedX: (Math.random() - 0.5) * 0.55,
      speedY: (Math.random() - 0.5) * 0.55 - 0.08,
      opacity: Math.random() * 0.55 + 0.15,
      hue: Math.random() > 0.25 ? 115 + Math.random() * 20 : 160 + Math.random() * 15,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.015 + Math.random() * 0.025,
      glow: isBright,
    };
  }

  function createSpark() {
    return {
      x: Math.random() * w,
      y: h + 20,
      size: Math.random() * 1.5 + 0.5,
      speedY: -(1.2 + Math.random() * 2.2),
      speedX: (Math.random() - 0.5) * 0.6,
      life: 1,
      decay: 0.004 + Math.random() * 0.006,
      hue: 110 + Math.random() * 40,
    };
  }

  function init() {
    resize();
    const count = Math.min(110, Math.floor(w * h / 12000));
    particles = Array.from({ length: count }, createParticle);
    sparks = [];
  }

  function draw() {
    tick++;
    ctx.clearRect(0, 0, w, h);

    // Soft ambient haze
    const haze = ctx.createRadialGradient(w * 0.5, h * 0.35, 0, w * 0.5, h * 0.35, w * 0.55);
    haze.addColorStop(0, 'rgba(57, 255, 20, 0.03)');
    haze.addColorStop(1, 'transparent');
    ctx.fillStyle = haze;
    ctx.fillRect(0, 0, w, h);

    particles.forEach((p) => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.pulse += p.pulseSpeed;
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      if (p.y < -10) p.y = h + 10;
      if (p.y > h + 10) p.y = -10;

      const alpha = p.opacity * (0.65 + 0.35 * Math.sin(p.pulse));
      const r = p.size * (0.85 + 0.2 * Math.sin(p.pulse * 0.7));

      if (p.glow) {
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 6);
        g.addColorStop(0, `hsla(${p.hue}, 100%, 60%, ${alpha * 0.45})`);
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 6, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 100%, 58%, ${alpha})`;
      ctx.fill();
    });

    // Connection web
    for (let i = 0; i < particles.length; i++) {
      const a = particles[i];
      for (let j = i + 1; j < particles.length; j++) {
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          const strength = 1 - dist / 140;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(57, 255, 20, ${0.09 * strength})`;
          ctx.lineWidth = 0.6 * strength;
          ctx.stroke();
        }
      }
    }

    // Rising neon sparks
    if (tick % 8 === 0 && sparks.length < 28) {
      sparks.push(createSpark());
    }
    sparks = sparks.filter((s) => {
      s.x += s.speedX;
      s.y += s.speedY;
      s.life -= s.decay;
      if (s.life <= 0) return false;

      const a = s.life * 0.7;
      const trail = ctx.createLinearGradient(s.x, s.y + 18, s.x, s.y);
      trail.addColorStop(0, 'transparent');
      trail.addColorStop(1, `hsla(${s.hue}, 100%, 55%, ${a})`);
      ctx.strokeStyle = trail;
      ctx.lineWidth = s.size;
      ctx.beginPath();
      ctx.moveTo(s.x, s.y + 16);
      ctx.lineTo(s.x, s.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size * 1.2, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${s.hue}, 100%, 65%, ${a})`;
      ctx.fill();
      return true;
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => {
    resize();
    const count = Math.min(110, Math.floor(w * h / 12000));
    if (particles.length !== count) {
      particles = Array.from({ length: count }, createParticle);
    }
  });
  init();
  draw();
})();

// ===== Navbar scroll =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== Mobile nav =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

// ===== Scroll reveal =====
const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
);

revealEls.forEach((el) => revealObserver.observe(el));

// ===== Copy contract =====
const copyBtn = document.getElementById('copyBtn');
const contractAddr = document.getElementById('contractAddr');
const toast = document.getElementById('toast');

copyBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(contractAddr.textContent.trim());
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
  } catch {
    const range = document.createRange();
    range.selectNode(contractAddr);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand('copy');
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
  }
});

// ===== Smooth active nav highlight =====
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a:not(.nav-cta)');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach((section) => {
    const top = section.offsetTop - 100;
    if (window.scrollY >= top) {
      current = section.getAttribute('id');
    }
  });

  navItems.forEach((item) => {
    item.style.color = item.getAttribute('href') === `#${current}` ? '#39ff14' : '';
  });
});
