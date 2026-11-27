/**
 * Samadie Technology — Main Interaction Script
 * Powered by Lenis Smooth Scroll & Vanilla ES Module
 */

let lenis = null;

document.addEventListener('DOMContentLoaded', () => {
  initLenis();
  initStickyHeader();
  initMobileNav();
  initScrollReveal();
  initCardSpotlights();
  initActiveNavSpy();
});

/**
 * Initialize Lenis Smooth Scroll
 */
function initLenis() {
  if (typeof window.Lenis === 'undefined') {
    initFallbackSmoothScroll();
    return;
  }

  // Respect reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    initFallbackSmoothScroll();
    return;
  }

  // Create Lenis instance with tuned physics
  lenis = new window.Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential deceleration
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    smoothTouch: false, // Maintain native responsive touch on mobile screens
    touchMultiplier: 1.5,
  });

  // RAF loop
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Sync sticky header with Lenis scroll events
  lenis.on('scroll', ({ scroll }) => {
    const header = document.getElementById('header');
    if (header) {
      if (scroll > 20) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    }
  });

  // Anchor link navigation with Lenis
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;

    const href = anchor.getAttribute('href');
    if (!href || href === '#') return;

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();

    const header = document.getElementById('header');
    const headerOffset = header ? header.offsetHeight + 12 : 88;

    lenis.scrollTo(target, {
      offset: -headerOffset,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      onComplete: () => {
        if (history.pushState) {
          history.pushState(null, '', href);
        }
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
    });
  });
}

/**
 * Fallback smooth scroll for reduced motion or when Lenis is unavailable
 */
function initFallbackSmoothScroll() {
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;

    const href = anchor.getAttribute('href');
    if (!href || href === '#') return;

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();

    const header = document.getElementById('header');
    const headerOffset = header ? header.offsetHeight + 12 : 88;
    const targetY = target.getBoundingClientRect().top + window.scrollY - headerOffset;

    window.scrollTo({
      top: Math.max(0, targetY),
      behavior: 'smooth'
    });

    if (history.pushState) {
      history.pushState(null, '', href);
    }
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  });
}

/**
 * Sticky Header Glassmorphism (fallback native listener)
 */
function initStickyHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/**
 * Mobile Navigation Toggle and Accessibility Controls
 */
function initMobileNav() {
  const navToggle = document.getElementById('navToggle');
  const primaryNav = document.getElementById('primaryNav');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!navToggle || !primaryNav) return;

  const openNav = () => {
    navToggle.setAttribute('aria-expanded', 'true');
    primaryNav.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    lenis?.stop();
  };

  const closeNav = () => {
    navToggle.setAttribute('aria-expanded', 'false');
    primaryNav.classList.remove('is-open');
    document.body.style.overflow = '';
    lenis?.start();
  };

  navToggle.addEventListener('click', () => {
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    if (isExpanded) {
      closeNav();
    } else {
      openNav();
    }
  });

  // Close when clicking nav links
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (primaryNav.classList.contains('is-open')) {
        closeNav();
      }
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && primaryNav.classList.contains('is-open')) {
      closeNav();
      navToggle.focus();
    }
  });

  // Close on window resize past mobile breakpoint
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && primaryNav.classList.contains('is-open')) {
      closeNav();
    }
  }, { passive: true });
}

/**
 * Scroll Reveal Animation using IntersectionObserver
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('[data-reveal]');
  if (!revealElements.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1
    });

    revealElements.forEach(el => observer.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('is-visible'));
  }
}

/**
 * Cursor Spotlight effect for Cards (Desktop / Hover capable)
 */
function initCardSpotlights() {
  if (!window.matchMedia('(hover: hover)').matches) return;

  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mx', `${x}px`);
      card.style.setProperty('--my', `${y}px`);
    }, { passive: true });
  });
}

/**
 * Active Navigation Spy based on scroll position
 */
function initActiveNavSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${id}`) {
              link.classList.add('active');
              link.setAttribute('aria-current', 'true');
            } else {
              link.classList.remove('active');
              link.removeAttribute('aria-current');
            }
          });
        }
      });
    }, {
      rootMargin: '-30% 0px -60% 0px',
      threshold: 0
    });

    sections.forEach(section => observer.observe(section));
  }
}
