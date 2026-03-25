// ─── NAV SCROLL ───────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ─── MOBILE MENU ──────────────────────────────────────
const toggle = document.getElementById('navToggle');
const links  = document.getElementById('navLinks');
const overlay = document.getElementById('navOverlay');

function openMenu() {
  links.classList.add('open');
  overlay.classList.add('open');
  toggle.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  links.classList.remove('open');
  overlay.classList.remove('open');
  toggle.classList.remove('active');
  document.body.style.overflow = '';
}

toggle.addEventListener('click', () => {
  links.classList.contains('open') ? closeMenu() : openMenu();
});

overlay.addEventListener('click', closeMenu);

links.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', closeMenu);
});

// ─── SCROLL REVEAL ────────────────────────────────────
const revealEls = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // staggered delay for siblings
      const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
      const idx = siblings.indexOf(entry.target);
      entry.target.style.transitionDelay = `${idx * 0.08}s`;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => observer.observe(el));

// ─── CONTACT FORM ─────────────────────────────────────
const form = document.getElementById('kontaktForm');
if (form) {
  form.addEventListener('submit', (e) => {
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

// ─── SMOOTH HERO SCROLL ───────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
