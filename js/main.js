/* ===========================
   SHAMILA NAZARI — main.js
   v3 · Lengsfeld-Inspired
   =========================== */

const $ = (s, p=document) => p.querySelector(s);
const $$ = (s, p=document) => [...p.querySelectorAll(s)];
const lerp = (a,b,t) => a+(b-a)*t;

// ─── CURSOR ─────────────────────────────
const cursor = $('#cursor');
const cursorDot = $('#cursorDot');
let mx=-100, my=-100, cx=-100, cy=-100;

if (cursor && cursorDot) {
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursorDot.style.left = mx+'px';
    cursorDot.style.top  = my+'px';
  });
  (function anim() {
    cx = lerp(cx,mx,0.1); cy = lerp(cy,my,0.1);
    cursor.style.left = cx+'px';
    cursor.style.top  = cy+'px';
    requestAnimationFrame(anim);
  })();
  $$('a,button,.film-card,.pillar,.press-quote,.laurel').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('is-hovered'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('is-hovered'));
  });
  document.body.classList.add('cursor-ready');
}

// ─── SCROLL PROGRESS ────────────────────
const progressBar = $('#scrollProgress');
window.addEventListener('scroll', () => {
  if (!progressBar) return;
  const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
  progressBar.style.width = pct + '%';
}, {passive:true});

// ─── NAV ────────────────────────────────
const nav = $('#nav');
const navLinks = $$('.nav-link');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);

  // Active section tracking
  const sections = ['home','about','films','vision','presse','kontakt'];
  let current = 'home';
  sections.forEach(id => {
    const s = document.getElementById(id);
    if (s && s.getBoundingClientRect().top <= 100) current = id;
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#'+current);
  });
}, {passive:true});

// ─── MOBILE MENU ────────────────────────
const toggle  = $('#navToggle');
const linksEl = $('#navLinks');
const overlay = $('#navOverlay');
const openMenu  = () => { linksEl.classList.add('open'); overlay.classList.add('open'); toggle.classList.add('active'); document.body.style.overflow='hidden'; };
const closeMenu = () => { linksEl.classList.remove('open'); overlay.classList.remove('open'); toggle.classList.remove('active'); document.body.style.overflow=''; };
toggle.addEventListener('click', () => linksEl.classList.contains('open') ? closeMenu() : openMenu());
overlay.addEventListener('click', closeMenu);
$$('#navLinks .nav-link').forEach(a => a.addEventListener('click', closeMenu));

// ─── TYPEWRITER ──────────────────────────
const words = ['REGISSIERE','ERSCHAFFE','ERZÄHLE','TRÄUME','INSZENIERE'];
const twWordEl = $('#twWord');
let twIdx = 0;

function typeWord(word) {
  if (!twWordEl) return;
  twWordEl.textContent = '';
  let i = 0;
  function type() {
    if (i < word.length) {
      twWordEl.textContent += word[i++];
      setTimeout(type, 80);
    } else {
      setTimeout(eraseWord, 2200);
    }
  }
  type();
}
function eraseWord() {
  if (!twWordEl) return;
  let text = twWordEl.textContent;
  function erase() {
    if (text.length > 0) {
      text = text.slice(0,-1);
      twWordEl.textContent = text;
      setTimeout(erase, 50);
    } else {
      twIdx = (twIdx+1) % words.length;
      setTimeout(() => typeWord(words[twIdx]), 300);
    }
  }
  erase();
}
setTimeout(() => typeWord(words[0]), 600);

// ─── SCROLL REVEAL ───────────────────────
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    // Stagger siblings
    const siblings = $$('.reveal-up', e.target.parentElement).filter(el => !el.classList.contains('visible'));
    const idx = siblings.indexOf(e.target);
    e.target.style.transitionDelay = (idx * 0.1) + 's';
    e.target.classList.add('visible');
    obs.unobserve(e.target);
  });
}, { threshold: 0.1, rootMargin:'0px 0px -30px 0px' });
$$('.reveal-up').forEach(el => obs.observe(el));

// ─── VIDEO HOVER ─────────────────────────
$$('.film-card').forEach(card => {
  const video = $('video', card);
  if (!video) return;
  let t;
  card.addEventListener('mouseenter', () => {
    video.load();
    t = setTimeout(() => video.play().catch(()=>{}), 60);
  });
  card.addEventListener('mouseleave', () => {
    clearTimeout(t);
    video.pause();
    video.currentTime = 0;
  });
});

// ─── HERO PARALLAX ───────────────────────
const heroImg = $('#heroImg');
if (heroImg) {
  window.addEventListener('scroll', () => {
    if (window.scrollY < window.innerHeight * 1.5) {
      heroImg.style.transform = `translateY(${window.scrollY * 0.25}px) scale(1.08)`;
    }
  }, {passive:true});
}

// ─── SMOOTH ANCHOR ───────────────────────
$$('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (!t) return;
    e.preventDefault();
    window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 70, behavior:'smooth' });
  });
});

// ─── FORM ────────────────────────────────
const form = $('#kontaktForm');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'GESENDET ✓';
    btn.style.background = '#2d7a4f';
    btn.disabled = true;
    setTimeout(() => { btn.textContent = 'SENDEN'; btn.style.background = ''; btn.disabled = false; form.reset(); }, 3200);
  });
}
