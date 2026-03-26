/* ===========================
   SHAMILA NAZARI — main.js
   v2 · Enhanced Animations
   =========================== */

// ─── UTILS ─────────────────────────────────────────
const $ = (s, p = document) => p.querySelector(s);
const $$ = (s, p = document) => [...p.querySelectorAll(s)];
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);

// ─── PAGE LOADER ────────────────────────────────────
window.addEventListener('load', () => {
  setTimeout(() => {
    document.body.classList.add('loaded');
    setTimeout(() => {
      const loader = $('#loader');
      if (loader) loader.style.display = 'none';
      initAnimations();
    }, 1000);
  }, 800);
});

// ─── INIT ───────────────────────────────────────────
function initAnimations() {
  document.body.classList.add('cursor-ready');
  initHeroTitle();
  initReveal();
  initCounters();
}

// ─── HERO TITLE SPLIT ───────────────────────────────
function initHeroTitle() {
  $$('.split-text').forEach((el, i) => {
    const text = el.textContent.trim();
    el.innerHTML = text.split('').map((ch, j) => {
      const delay = (i * 0.3 + j * 0.04).toFixed(2);
      return ch === ' '
        ? `<span class="char" style="display:inline-block;width:0.3em;transition-delay:${delay}s">&nbsp;</span>`
        : `<span class="char" style="transition-delay:${delay}s">${ch}</span>`;
    }).join('');
    // Trigger after small delay
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        $$('.char', el).forEach(c => c.classList.add('visible'));
      });
    });
  });
  // Trigger hero sub and actions
  setTimeout(() => {
    $$('.hero-eyebrow, .hero-sub, .hero-actions').forEach(el => {
      el.classList.add('visible');
    });
  }, 400);
}

// ─── CUSTOM CURSOR ───────────────────────────────────
const cursor = $('#cursor');
const cursorDot = $('#cursorDot');
let mouseX = -100, mouseY = -100;
let curX = -100, curY = -100;

if (cursor && cursorDot) {
  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top  = mouseY + 'px';
  });

  // Smooth follow
  (function animCursor() {
    curX = lerp(curX, mouseX, 0.12);
    curY = lerp(curY, mouseY, 0.12);
    cursor.style.left = curX + 'px';
    cursor.style.top  = curY + 'px';
    requestAnimationFrame(animCursor);
  })();

  // Hover states
  const hoverEls = $$('a, button, .magnetic, .film-card, .pillar, .press-quote, .press-logo');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('is-hovered'));
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('is-hovered');
      cursor.classList.remove('is-video');
    });
  });

  $$('.film-thumb').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('is-video'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('is-video'));
  });

  document.addEventListener('mouseleave', () => cursor.style.opacity = '0');
  document.addEventListener('mouseenter', () => cursor.style.opacity = '1');
}

// ─── MAGNETIC BUTTONS ────────────────────────────────
$$('.magnetic').forEach(el => {
  el.addEventListener('mousemove', e => {
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top  + r.height / 2;
    const dx = (e.clientX - cx) * 0.25;
    const dy = (e.clientY - cy) * 0.25;
    el.style.transform = `translate(${dx}px, ${dy}px)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = '';
  });
});

// ─── SCROLL PROGRESS ─────────────────────────────────
const progressBar = $('#scrollProgress');
window.addEventListener('scroll', () => {
  if (!progressBar) return;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const pct = (window.scrollY / max) * 100;
  progressBar.style.width = pct + '%';
}, { passive: true });

// ─── NAV SCROLL ──────────────────────────────────────
const nav = $('#nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ─── MOBILE MENU ─────────────────────────────────────
const toggle  = $('#navToggle');
const links   = $('#navLinks');
const overlay = $('#navOverlay');

const openMenu  = () => { links.classList.add('open'); overlay.classList.add('open'); toggle.classList.add('active'); document.body.style.overflow='hidden'; };
const closeMenu = () => { links.classList.remove('open'); overlay.classList.remove('open'); toggle.classList.remove('active'); document.body.style.overflow=''; };

toggle.addEventListener('click', () => links.classList.contains('open') ? closeMenu() : openMenu());
overlay.addEventListener('click', closeMenu);
links.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

// ─── VIDEO HOVER PREVIEW ─────────────────────────────
$$('.film-card').forEach(card => {
  const video = $('video', card);
  if (!video) return;

  let playTimeout;

  card.addEventListener('mouseenter', () => {
    video.load(); // ensure loaded
    playTimeout = setTimeout(() => {
      video.play().catch(() => {});
    }, 80);
  });

  card.addEventListener('mouseleave', () => {
    clearTimeout(playTimeout);
    video.pause();
    video.currentTime = 0;
  });
});

// ─── HERO PARALLAX ───────────────────────────────────
const heroImg = $('#heroImg');
if (heroImg) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight * 1.2) {
      heroImg.style.transform = `translateY(${y * 0.3}px) scale(1.05)`;
    }
  }, { passive: true });
}

// ─── SCROLL REVEAL ───────────────────────────────────
function initReveal() {
  const revealEls = $$('.reveal-clip, .reveal-slide, .reveal-fade');

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;

      // Stagger siblings
      const parent = el.parentElement;
      const siblings = $$('.reveal-clip,.reveal-slide,.reveal-fade', parent)
        .filter(e => !e.classList.contains('visible'));
      const idx = siblings.indexOf(el);
      el.style.transitionDelay = (idx * 0.08) + 's';
      el.classList.add('visible');

      // Special: img line
      if (el.classList.contains('about-image')) {
        const frame = $('.about-img-frame', el);
        if (frame) frame.classList.add('visible');
      }
      obs.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => obs.observe(el));
}

// ─── COUNTER ANIMATION ───────────────────────────────
function initCounters() {
  const counters = $$('.counter');
  if (!counters.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => obs.observe(c));
}

function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 1800;
  const start = performance.now();

  function step(now) {
    const elapsed = now - start;
    const progress = clamp(elapsed / duration, 0, 1);
    // Ease out cubic
    const ease = 1 - Math.pow(1 - progress, 3);
    const val = Math.round(ease * target);
    el.textContent = val + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// ─── SMOOTH ANCHOR SCROLL ────────────────────────────
$$('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ─── CONTACT FORM ────────────────────────────────────
const form = $('#kontaktForm');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Gesendet ✓';
    btn.style.background = '#2d7a4f';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = 'Nachricht senden';
      btn.style.background = '';
      btn.disabled = false;
      form.reset();
    }, 3000);
  });
}

// ─── PILLAR TILT ─────────────────────────────────────
$$('.pillar').forEach(pillar => {
  pillar.addEventListener('mousemove', e => {
    const r = pillar.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  - 0.5) * 8;
    const y = ((e.clientY - r.top)  / r.height - 0.5) * 8;
    pillar.style.transform = `translateY(-6px) perspective(600px) rotateX(${-y}deg) rotateY(${x}deg)`;
  });
  pillar.addEventListener('mouseleave', () => {
    pillar.style.transform = '';
  });
});
