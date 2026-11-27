/**
 * Samadie Technology — Main Interaction Script
 * High-Performance Optimized Vanilla JS with Lenis
 */

let lenis = null;

document.addEventListener('DOMContentLoaded', () => {
  initLenis();
  initMobileNav();
  initContentProtection();
  initInteractiveMouse();
  initScrollReveal();
  initCardSpotlights();
  initActiveNavSpy();
});

/**
 * Initialize Lenis Smooth Scroll (Optimized for 0 lag and 120Hz/60Hz display response)
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

  // Tuned for immediate, crisp response without sluggish delay
  lenis = new window.Lenis({
    lerp: 0.1,             // Direct linear interpolation - zero input lag
    wheelMultiplier: 1.0,  // Natural 1:1 wheel scrolling ratio
    touchMultiplier: 1.0,  // Keep native responsive touch speed on mobile
    infinite: false,
    syncTouch: false,
  });

  // RAF loop
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // High-performance cached sticky header update
  const header = document.getElementById('header');
  let isHeaderScrolled = false;

  lenis.on('scroll', ({ scroll }) => {
    const shouldBeScrolled = scroll > 20;
    if (shouldBeScrolled !== isHeaderScrolled) {
      isHeaderScrolled = shouldBeScrolled;
      header?.classList.toggle('is-scrolled', isHeaderScrolled);
    }
  });

  // Fast anchor link navigation with Lenis
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;

    const href = anchor.getAttribute('href');
    if (!href || href === '#') return;

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();

    const headerHeight = header ? header.offsetHeight + 10 : 86;

    lenis.scrollTo(target, {
      offset: -headerHeight,
      lerp: 0.12,
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
  const header = document.getElementById('header');
  let isHeaderScrolled = false;

  window.addEventListener('scroll', () => {
    const shouldBeScrolled = window.scrollY > 20;
    if (shouldBeScrolled !== isHeaderScrolled) {
      isHeaderScrolled = shouldBeScrolled;
      header?.classList.toggle('is-scrolled', isHeaderScrolled);
    }
  }, { passive: true });

  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;

    const href = anchor.getAttribute('href');
    if (!href || href === '#') return;

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();

    const headerOffset = header ? header.offsetHeight + 10 : 86;
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
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

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

/**
 * Interactive Background Spotlight & 3D Workbench Parallax on Pointer Move
 */
function initInteractiveMouse() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const root = document.documentElement;
  const circuitFrame = document.querySelector('.circuit-frame');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let currentX = mouseX;
  let currentY = mouseY;
  let isMoving = false;
  let rafId = null;

  function update() {
    currentX += (mouseX - currentX) * 0.1;
    currentY += (mouseY - currentY) * 0.1;

    const normX = (currentX / window.innerWidth) * 2 - 1;
    const normY = (currentY / window.innerHeight) * 2 - 1;

    root.style.setProperty('--mouse-x', `${currentX.toFixed(1)}px`);
    root.style.setProperty('--mouse-y', `${currentY.toFixed(1)}px`);
    root.style.setProperty('--bg-dx', `${(-normX).toFixed(3)}`);
    root.style.setProperty('--bg-dy', `${(-normY).toFixed(3)}`);

    if (circuitFrame) {
      const rect = circuitFrame.getBoundingClientRect();
      const frameCenterX = rect.left + rect.width / 2;
      const frameCenterY = rect.top + rect.height / 2;
      const distFrameX = (currentX - frameCenterX) / (window.innerWidth / 2);
      const distFrameY = (currentY - frameCenterY) / (window.innerHeight / 2);
      const clampedX = Math.max(-1, Math.min(1, distFrameX));
      const clampedY = Math.max(-1, Math.min(1, distFrameY));

      root.style.setProperty('--tilt-x', clampedX.toFixed(3));
      root.style.setProperty('--tilt-y', clampedY.toFixed(3));
    }

    if (Math.abs(mouseX - currentX) > 0.15 || Math.abs(mouseY - currentY) > 0.15) {
      rafId = requestAnimationFrame(update);
    } else {
      isMoving = false;
    }
  }

  window.addEventListener('pointermove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    root.style.setProperty('--mouse-active', '1');

    if (!isMoving) {
      isMoving = true;
      rafId = requestAnimationFrame(update);
    }
  }, { passive: true });

  document.addEventListener('mouseleave', () => {
    root.style.setProperty('--mouse-active', '0');
  });

  window.addEventListener('resize', () => {
    mouseX = window.innerWidth / 2;
    mouseY = window.innerHeight / 2;
  }, { passive: true });
}

/**
 * Content & Inspection Protection (Anti-Select, Right Click, F12, Ctrl+U block)
 */
function initContentProtection() {
  // 1. Block Context Menu (Right Click)
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
  }, false);

  // 2. Block Text Selection & Dragging
  document.addEventListener('selectstart', (e) => {
    if (!['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
      e.preventDefault();
      return false;
    }
  }, false);

  document.addEventListener('dragstart', (e) => {
    e.preventDefault();
    return false;
  }, false);

  // 3. Block Inspection Shortcuts (F12, Ctrl+Shift+I/J/C, Ctrl+U, Ctrl+S)
  document.addEventListener('keydown', (e) => {
    const key = e.key ? e.key.toLowerCase() : '';
    const code = e.keyCode || e.which;

    // F12 (DevTools)
    if (key === 'f12' || code === 123) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C (Inspect / Console)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (key === 'i' || key === 'j' || key === 'c' || code === 73 || code === 74 || code === 67)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl+U (View Page Source)
    if ((e.ctrlKey || e.metaKey) && (key === 'u' || code === 85)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl+S (Save Page)
    if ((e.ctrlKey || e.metaKey) && (key === 's' || code === 83)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }, false);
}
