/* ============================================================
   main.js — Portfolio V3
   Solar system carousel + all interactions
   ============================================================ */

/* ---- PROJECTS DATA — edit this to add/change projects ---- */
const PROJECTS = [
  {
    id: 1,
    title: 'B2E Inspection Tool',
    tags: 'UX/UI Design · Logistics',
    dest: 'project.html',
    locked: true,
    img: 'assets/images/project-1.jpg',
  },
  {
    id: 2,
    title: 'Openbank — New App',
    tags: 'UX/UI Design · Fintech',
    dest: 'project-openbank.html',
    locked: true,
    img: 'assets/images/project-2.jpg',
  },
  {
    id: 3,
    title: 'Openbank × Openpay Unification',
    tags: 'Product Strategy · Research',
    dest: 'project-unification.html',
    locked: true,
    img: 'assets/images/project-3.jpg',
  },
  {
    id: 4,
    title: 'Openbank Redesign',
    tags: 'UX/UI Design · Design Systems',
    dest: 'project-rebrand.html',
    locked: true,
    img: 'assets/images/project-4.jpg',
  },
  {
    id: 5,
    title: 'Garage Beer',
    tags: 'UX/UI Design · Branding',
    dest: 'project-garage.html',
    locked: false,
    img: 'assets/images/project-5.jpg',
  },
];

/* ---- Single password unlocks the whole carousel ---- */
const SITE_PASSWORD = 'Carlos';
const UNLOCK_KEY = 'portfolioUnlocked';

function isUnlocked() {
  try { return sessionStorage.getItem(UNLOCK_KEY) === 'true'; } catch (e) { return false; }
}
function markUnlocked() {
  try { sessionStorage.setItem(UNLOCK_KEY, 'true'); } catch (e) {}
}

/* Reference to the live SolarCarousel instance, so the password modal can
   refresh the on-screen title immediately after unlocking. */
let activeCarousel = null;

/* ============================================================
   SOLAR CAROUSEL
   ============================================================ */
class SolarCarousel {
  constructor() {
    this.track        = document.getElementById('solar-track');
    this.titleEl      = document.getElementById('carousel-title');
    this.prevBtn      = document.getElementById('carousel-prev');
    this.nextBtn      = document.getElementById('carousel-next');
    this.dotsEl       = document.getElementById('carousel-dots');
    this.a11yList     = document.getElementById('projects-a11y-list');

    this.total        = PROJECTS.length;
    this.current      = 0;
    this.isAnimating  = false;

    if (!this.track) return;

    this.buildCards();
    this.buildDots();
    this.buildA11yList();
    this.render(true);
    this.bindEvents();

    activeCarousel = this;
  }

  buildCards() {
    const locked = !isUnlocked();
    PROJECTS.forEach((p, i) => {
      const card = document.createElement('div');
      card.className = 'solar-card' + (locked ? ' is-locked' : '');
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '-1');
      card.dataset.index = i;

      card.innerHTML = `
        <div class="solar-card-inner">
          <img src="${p.img}" alt="${p.title}" loading="lazy"
               onerror="this.parentElement.style.background='#e0e0e0';this.style.display='none'" />
          <div class="card-lock-overlay">
            <span>Confidential</span>
          </div>
          <div class="card-label">
            <div class="card-label-tags">${p.tags}</div>
            <div class="card-label-title">${p.title}</div>
          </div>
        </div>
      `;

      // Click: only active card navigates/opens modal
      card.addEventListener('click', () => this.onCardClick(i));
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.onCardClick(i); }
      });

      this.track.appendChild(card);
    });

    this.cards = Array.from(this.track.querySelectorAll('.solar-card'));
  }

  buildDots() {
    if (!this.dotsEl) return;
    PROJECTS.forEach((p, i) => {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Go to project: ${p.title}`);
      dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      dot.addEventListener('click', () => this.goTo(i));
      this.dotsEl.appendChild(dot);
    });
    this.dots = Array.from(this.dotsEl.querySelectorAll('.carousel-dot'));
  }

  updateDots() {
    if (!this.dots) return;
    this.dots.forEach((dot, i) => {
      const active = i === this.current;
      dot.classList.toggle('active', active);
      dot.setAttribute('aria-selected', active ? 'true' : 'false');
    });
  }

  goTo(index) {
    if (index === this.current || this.isAnimating) return;
    const dir = index > this.current ? 1 : -1;
    this.isAnimating = true;
    this.current = index;
    this.render();
    setTimeout(() => { this.isAnimating = false; }, 680);
  }

  buildA11yList() {
    if (!this.a11yList) return;
    PROJECTS.forEach(p => {
      const a = document.createElement('a');
      a.textContent = !isUnlocked()
        ? 'Confidential project — password protected'
        : `${p.title} — ${p.tags}`;
      a.href = p.dest;
      a.addEventListener('click', e => {
        if (!isUnlocked()) {
          e.preventDefault();
          openModal();
        }
      });
      this.a11yList.appendChild(a);
    });
  }

  /* Compute layout for N cards around a flattened ellipse (solar system feel) */
  getCardState(relIndex) {
    // relIndex: 0 = active/center, ±1 = adjacent, ±2 = further, etc.
    const n      = this.total;
    // angle for this position in a circle, then project onto ellipse
    const angle  = (relIndex / n) * Math.PI * 2;

    // Ellipse radii (visual "orbit")
    const rx = 280;  // horizontal spread
    const ry = 40;   // vertical squash (perspective feel)

    const x  = Math.sin(angle) * rx;
    const y  = Math.cos(angle) * ry;

    // Depth: cos(angle) → 1 at center front, -1 at back
    const depth = Math.cos(angle); // 1 = front, -1 = back

    // Scale: front bigger, back smaller
    const scale  = 0.45 + 0.55 * ((depth + 1) / 2);

    // Opacity: back cards fade
    const opacity = 0.3 + 0.7 * ((depth + 1) / 2);

    // Z index: front on top
    const zIndex = Math.round(10 + depth * 10);

    // Blur: back cards slightly blurred
    const blur = Math.max(0, (1 - (depth + 1) / 2) * 3);

    return { x, y, scale, opacity, zIndex, blur, depth };
  }

  render(instant = false) {
    const n = this.total;
    this.cards.forEach((card, i) => {
      const relIndex = ((i - this.current) % n + n) % n;
      const wrapped  = relIndex > n / 2 ? relIndex - n : relIndex;
      const state    = this.getCardState(wrapped);

      const isActive = wrapped === 0;
      card.classList.toggle('is-active', isActive);
      card.setAttribute('tabindex', isActive ? '0' : '-1');
      card.setAttribute('aria-current', isActive ? 'true' : 'false');

      // Ensure cards always originate from the true center of .solar-track
      // left:50% top:50% anchors to center; translate(-50%,-50%) removes own size;
      // then orbital offset x/y moves outward; scale applied last.
      card.style.left = '50%';
      card.style.top  = '39%';

      const dur = instant ? 0 : 650;
      card.style.transition = instant
        ? 'none'
        : `transform ${dur}ms cubic-bezier(0.16,1,0.3,1),
           opacity   ${dur}ms ease,
           filter    ${dur}ms ease`;

      card.style.transform = `translate(calc(-50% + ${state.x}px), calc(-50% + ${state.y}px)) scale(${state.scale})`;
      card.style.opacity   = state.opacity;
      card.style.zIndex    = state.zIndex;
      card.style.filter    = state.blur > 0 ? `blur(${state.blur}px)` : '';
    });

    this.updateTitle();
    this.updateDots();
  }

  updateTitle() {
    const p = PROJECTS[this.current];
    if (!this.titleEl) return;

    const locked = p.locked && !isUnlocked();
    const label  = locked ? 'Confidential' : p.title;

    // Animate title change
    this.titleEl.classList.add('changing');
    setTimeout(() => {
      this.titleEl.textContent = label;
      this.titleEl.classList.remove('changing');
    }, 200);
  }

  advance(dir) {
    if (this.isAnimating) return;
    this.isAnimating = true;
    this.current = ((this.current + dir) + this.total) % this.total;
    this.render();
    setTimeout(() => { this.isAnimating = false; }, 680);
  }

  onCardClick(i) {
    if (i !== this.current) {
      // Clicking a side card rotates to it
      const n = this.total;
      const fwd = ((i - this.current) + n) % n;
      const bwd = ((this.current - i) + n) % n;
      this.advance(fwd <= bwd ? fwd : -bwd);
      return;
    }
    // Active card: navigate or open modal
    const p = PROJECTS[i];
    if (!isUnlocked()) {
      openModal();
    } else {
      navigateTo(p.dest);
    }
  }

  bindEvents() {
    this.prevBtn?.addEventListener('click', () => this.advance(-1));
    this.nextBtn?.addEventListener('click', () => this.advance(1));

    // Keyboard arrows
    document.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') this.advance(1);
      if (e.key === 'ArrowLeft')  this.advance(-1);
    });

    // ── Touch swipe (mobile) ────────────────────────────────────
    let touchStartX = 0;
    let touchStartY = 0;
    this.track.addEventListener('touchstart', e => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });
    this.track.addEventListener('touchend', e => {
      const dx = touchStartX - e.changedTouches[0].clientX;
      const dy = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 36) {
        this.advance(dx > 0 ? 1 : -1);
      }
    });

    // ── Horizontal scroll / trackpad swipe (desktop) ─────────────
    // Accumulate deltaX; fire once a threshold is crossed, then
    // cooldown so one flick = one step.
    let wheelAccum = 0;
    let wheelCooldown = false;

    const onWheel = e => {
      // Only intercept if there's a meaningful horizontal component
      // (trackpad two-finger swipe gives deltaX; vertical scroll gives deltaY)
      if (Math.abs(e.deltaX) < Math.abs(e.deltaY) * 0.4) return;

      e.preventDefault();  // stop page scroll while swiping horizontally

      if (wheelCooldown) return;

      wheelAccum += e.deltaX;

      if (Math.abs(wheelAccum) > 60) {
        this.advance(wheelAccum > 0 ? 1 : -1);
        wheelAccum = 0;
        wheelCooldown = true;
        setTimeout(() => { wheelCooldown = false; }, 700);
      }
    };

    // Must be non-passive to call preventDefault
    const section = this.track.closest('.work-section') || this.track;
    section.addEventListener('wheel', onWheel, { passive: false });
  }
}

/* ============================================================
   NAV
   ============================================================ */
function initNav() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 20), { passive: true });
}

/* ============================================================
   MOBILE MENU
   ============================================================ */
function initMobileMenu() {
  const toggle = document.querySelector('.nav-toggle');
  const menu   = document.querySelector('.mobile-menu');
  if (!toggle || !menu) return;
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    menu.setAttribute('aria-hidden', String(open));
    menu.classList.toggle('open', !open);
  });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    toggle.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
    menu.classList.remove('open');
  }));
}

/* ============================================================
   PASSWORD MODAL
   ============================================================ */
function openModal() {
  const modal     = document.getElementById('password-modal');
  const errorEl   = document.getElementById('modal-error');
  const input     = document.getElementById('modal-password');
  if (!modal) return;

  errorEl.textContent = '';
  input.value         = '';
  modal.setAttribute('aria-hidden', 'false');
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  setTimeout(() => input.focus(), 100);
}

function closeModal() {
  const modal = document.getElementById('password-modal');
  if (!modal) return;
  modal.setAttribute('aria-hidden', 'true');
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

function unlockAllCards() {
  document.querySelectorAll('.solar-card.is-locked').forEach(card => {
    card.classList.remove('is-locked');
  });
  activeCarousel?.updateTitle();
}

function checkPassword() {
  const input   = document.getElementById('modal-password');
  const errorEl = document.getElementById('modal-error');
  const val     = input?.value.trim().toLowerCase() ?? '';
  const correct = SITE_PASSWORD.toLowerCase();

  if (val === correct) {
    markUnlocked();
    unlockAllCards();
    closeModal();
  } else {
    errorEl.textContent = 'Incorrect password. Please try again.';
    input.value = '';
    input.focus();
    input.style.animation = 'none';
    requestAnimationFrame(() => {
      input.style.animation = 'shake 0.35s ease';
    });
  }
}

function initPasswordModal() {
  document.getElementById('modal-close')?.addEventListener('click', closeModal);
  document.getElementById('modal-submit')?.addEventListener('click', checkPassword);
  document.getElementById('modal-password')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') checkPassword();
  });
  document.getElementById('password-modal')?.addEventListener('click', e => {
    if (e.target.id === 'password-modal') closeModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && document.getElementById('password-modal')?.classList.contains('open')) closeModal();
  });
}

/* ============================================================
   PAGE TRANSITIONS
   ============================================================ */
let pageOverlay;

function initPageTransitions() {
  pageOverlay = document.createElement('div');
  Object.assign(pageOverlay.style, {
    position: 'fixed', inset: '0', zIndex: '9998',
    background: '#111',
    transformOrigin: 'top',
    transform: 'scaleY(1)',
    transition: 'none',
    pointerEvents: 'none',
  });
  document.body.appendChild(pageOverlay);

  requestAnimationFrame(() => requestAnimationFrame(() => {
    pageOverlay.style.transition = 'transform 0.55s cubic-bezier(0.16,1,0.3,1)';
    pageOverlay.style.transform  = 'scaleY(0)';
  }));

  document.addEventListener('click', e => {
    const link = e.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') ||
        href.startsWith('tel:') || href.startsWith('http') || link.target === '_blank') return;
    e.preventDefault();
    navigateTo(href);
  });
}

function navigateTo(href) {
  if (!pageOverlay) { window.location.href = href; return; }
  pageOverlay.style.transition  = 'transform 0.45s cubic-bezier(0.65,0,0.35,1)';
  pageOverlay.style.transformOrigin = 'bottom';
  pageOverlay.style.transform   = 'scaleY(1)';
  setTimeout(() => { window.location.href = href; }, 450);
}

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
function initScrollReveal() {
  const targets = document.querySelectorAll(
    '.about-headline, .about-intro-photo, .project-text-block, .g-img, .about-bio p, .skills-pills'
  );
  if (!targets.length) return;
  targets.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 4) * 55}ms`;
  });
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  targets.forEach(el => obs.observe(el));
}

/* ============================================================
   SHAKE KEYFRAME (injected)
   ============================================================ */
const shakeCSS = document.createElement('style');
shakeCSS.textContent = `
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20%      { transform: translateX(-6px); }
    40%      { transform: translateX(6px); }
    60%      { transform: translateX(-4px); }
    80%      { transform: translateX(4px); }
  }
`;
document.head.appendChild(shakeCSS);

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const inits = [
    ['initNav', initNav],
    ['initMobileMenu', initMobileMenu],
    ['SolarCarousel', () => new SolarCarousel()],
    ['initPasswordModal', initPasswordModal],
    ['initPageTransitions', initPageTransitions],
    ['initScrollReveal', initScrollReveal],
  ];
  inits.forEach(([name, fn]) => {
    try { fn(); }
    catch (err) { console.error(`[init] ${name} failed:`, err); }
  });
});
