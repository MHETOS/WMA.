const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const header = document.getElementById('header');
const navLinks = document.querySelectorAll('.nav__link');
const contactForm = document.getElementById('contact-form');
const yearEl = document.getElementById('year');
const scrollProgress = document.getElementById('scroll-progress');
const heroCard = document.getElementById('hero-card');

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

yearEl.textContent = new Date().getFullYear();
document.body.classList.add('is-loaded');

navToggle.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  navToggle.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
  navToggle.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');
});

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  scrollProgress.style.width = `${progress}%`;
  header.classList.toggle('scrolled', scrollTop > 50);
}

window.addEventListener('scroll', updateScrollProgress, { passive: true });
updateScrollProgress();

const sections = document.querySelectorAll('section[id]');

function highlightNav() {
  const scrollY = window.scrollY + 120;

  sections.forEach(section => {
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav__link[href="#${id}"]`);
    if (!link) return;

    const top = section.offsetTop;
    const height = section.offsetHeight;

    if (scrollY >= top && scrollY < top + height) {
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', highlightNav, { passive: true });
highlightNav();

const fadeElements = document.querySelectorAll(
  '.section__header, .section__intro, .skill-card, .project-card, .about__text, .stat, .contact__info, .contact__form, .timeline__item, .languages, .qualities__tag'
);

document.querySelectorAll('.skill-card').forEach((el, i) => {
  el.classList.add('fade-in', 'fade-in--scale');
  el.style.setProperty('--delay', `${i * 0.1}s`);
});

document.querySelectorAll('.timeline__item').forEach((el, i) => {
  el.classList.add('fade-in', 'fade-in--left');
  el.style.setProperty('--delay', `${i * 0.12}s`);
});

document.querySelectorAll('.about__text').forEach((el, i) => {
  el.classList.add(i === 0 ? 'fade-in--left' : 'fade-in--right');
});

document.querySelectorAll('.project-card').forEach((card, i) => {
  card.classList.add('fade-in');
  card.style.setProperty('--delay', `${i * 0.1}s`);
});

document.querySelectorAll('.project-card__image img').forEach(img => {
  const hideBroken = () => img.classList.add('is-hidden');

  img.addEventListener('error', hideBroken);

  if (img.complete && img.naturalWidth === 0) {
    hideBroken();
  }
});

fadeElements.forEach(el => {
  if (!el.classList.contains('fade-in')) el.classList.add('fade-in');
});

const fadeObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        if (entry.target.querySelector('[data-count]')) {
          animateCounters(entry.target);
        }
      }
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
);

fadeElements.forEach(el => fadeObserver.observe(el));

function animateCounters(container) {
  if (prefersReducedMotion) return;

  container.querySelectorAll('[data-count]').forEach(el => {
    if (el.dataset.animated === 'true' || el.hasAttribute('data-static')) return;
    el.dataset.animated = 'true';

    const target = parseInt(el.dataset.count, 10);
    if (target > 100) {
      el.textContent = target + (el.dataset.suffix || '');
      return;
    }
    const suffix = el.dataset.suffix || '';
    const duration = 1500;
    const start = performance.now();

    el.classList.add('counting');

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      el.textContent = value + suffix;

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.classList.remove('counting');
      }
    }

    requestAnimationFrame(tick);
  });
}

if (heroCard && !prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
  const visual = heroCard.closest('.hero__visual');

  visual.addEventListener('mousemove', e => {
    const rect = visual.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    heroCard.style.transform = `perspective(800px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateZ(8px)`;
  });

  visual.addEventListener('mouseleave', () => {
    heroCard.style.transform = 'perspective(800px) rotateY(0) rotateX(0) translateZ(0)';
  });
}

document.querySelectorAll('.btn--magnetic').forEach(btn => {
  if (prefersReducedMotion) return;

  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.15}px, ${y * 0.2}px)`;
  });

  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

contactForm.addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;

  const subject = encodeURIComponent(`Contact portfolio — ${name}`);
  const body = encodeURIComponent(`Nom: ${name}\nEmail: ${email}\n\n${message}`);
  window.location.href = `mailto:mhetos444@gmail.com?subject=${subject}&body=${body}`;
});
