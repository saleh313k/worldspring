/* ============================================
   WORLD SPRING INVESTMENT — app.js
   Vanilla JS: Navigation, Language, Reveals, Form
============================================ */

(function () {
  'use strict';

  /* ---- STATE ---- */
  let currentLang = localStorage.getItem('wsi_lang') || 'en';

  /* ---- DOM REFS ---- */
  const nav = document.getElementById('nav');
  const navBurger = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('mobileMenu');
  const langToggle = document.getElementById('langToggle');
  const langToggleMobile = document.getElementById('langToggleMobile');
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const formMessage = document.getElementById('formMessage');
  const htmlEl = document.documentElement;
  const bodyEl = document.body;

  /* ============================================
     NAVIGATION — SCROLL
  ============================================ */
  function handleNavScroll() {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  /* ============================================
     MOBILE MENU
  ============================================ */
  function openMobileMenu() {
    mobileMenu.classList.add('open');
    navBurger.setAttribute('aria-expanded', 'true');
    bodyEl.style.overflow = 'hidden';
  }
  function closeMobileMenu() {
    mobileMenu.classList.remove('open');
    navBurger.setAttribute('aria-expanded', 'false');
    bodyEl.style.overflow = '';
  }

  navBurger.addEventListener('click', function () {
    if (mobileMenu.classList.contains('open')) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  // Close on mobile link click
  document.querySelectorAll('.mobile-link').forEach(function (link) {
    link.addEventListener('click', function () {
      closeMobileMenu();
    });
  });

  // Close on outside click
  document.addEventListener('click', function (e) {
    if (
      mobileMenu.classList.contains('open') &&
      !mobileMenu.contains(e.target) &&
      !navBurger.contains(e.target)
    ) {
      closeMobileMenu();
    }
  });

  // Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      closeMobileMenu();
    }
  });

  /* ============================================
     SMOOTH SCROLL (for nav links)
  ============================================ */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
        closeMobileMenu();
      }
    });
  });

  /* ============================================
     LANGUAGE SWITCH
  ============================================ */
  function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('wsi_lang', lang);

    if (lang === 'ar') {
      bodyEl.classList.add('lang-ar');
      htmlEl.setAttribute('lang', 'ar');
      htmlEl.setAttribute('dir', 'rtl');
    } else {
      bodyEl.classList.remove('lang-ar');
      htmlEl.setAttribute('lang', 'en');
      htmlEl.setAttribute('dir', 'ltr');
    }

    // Update all translated elements
    document.querySelectorAll('[data-en]').forEach(function (el) {
      const text = el.getAttribute('data-' + lang);
      if (text) el.textContent = text;
    });

    // Update button display text
    document.querySelectorAll('.lang-en, .lang-ar').forEach(function (el) {
      if (el.classList.contains('lang-en')) {
        el.style.display = lang === 'en' ? 'inline' : 'none';
      }
      if (el.classList.contains('lang-ar')) {
        el.style.display = lang === 'ar' ? 'inline' : 'none';
      }
    });

    // Update font for Arabic labels on form
    document.querySelectorAll('.form-group label').forEach(function (label) {
      label.style.fontFamily = lang === 'ar' ? 'Cairo, sans-serif' : '';
    });

    // Update page title
    document.title = lang === 'ar'
      ? 'ربیع العالم للاستثمار — تصميم مواقع الويب في سلطنة عمان'
      : 'World Spring Investment — Web Design Oman';
  }

  function toggleLanguage() {
    applyLanguage(currentLang === 'en' ? 'ar' : 'en');
  }

  if (langToggle) langToggle.addEventListener('click', toggleLanguage);
  if (langToggleMobile) langToggleMobile.addEventListener('click', toggleLanguage);

  // Apply saved language on load
  applyLanguage(currentLang);

  /* ============================================
     SCROLL REVEAL
  ============================================ */
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: show all
    revealElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ============================================
     CONTACT FORM (Formspree)
  ============================================ */
  if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const successMsg = currentLang === 'ar'
        ? 'تم إرسال رسالتك بنجاح. سنتواصل معك قريباً.'
        : 'Message sent successfully. We\'ll be in touch shortly.';
      const errorMsg = currentLang === 'ar'
        ? 'حدث خطأ. يرجى المحاولة مرة أخرى أو مراسلتنا مباشرة.'
        : 'Something went wrong. Please try again or contact us directly.';
      const sendingMsg = currentLang === 'ar' ? 'جارٍ الإرسال...' : 'Sending...';

      // Disable button
      submitBtn.disabled = true;
      const btnSpan = submitBtn.querySelector('span');
      const originalText = btnSpan ? btnSpan.textContent : '';
      if (btnSpan) btnSpan.textContent = sendingMsg;
      submitBtn.style.opacity = '0.7';

      formMessage.textContent = '';
      formMessage.className = 'form-message';

      try {
        const data = new FormData(contactForm);
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: data,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          formMessage.textContent = successMsg;
          formMessage.className = 'form-message success';
          contactForm.reset();
        } else {
          formMessage.textContent = errorMsg;
          formMessage.className = 'form-message error';
        }
      } catch (err) {
        formMessage.textContent = errorMsg;
        formMessage.className = 'form-message error';
      } finally {
        submitBtn.disabled = false;
        if (btnSpan) btnSpan.textContent = originalText;
        submitBtn.style.opacity = '';
      }
    });
  }

  /* ============================================
     ACTIVE NAV LINK (on scroll)
  ============================================ */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveNav() {
    let current = '';
    sections.forEach(function (section) {
      const top = section.getBoundingClientRect().top;
      if (top <= 120) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(function (link) {
      const href = link.getAttribute('href').replace('#', '');
      if (href === current) {
        link.style.color = '#FAFAFA';
      } else {
        link.style.color = '';
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  /* ============================================
     HERO PARALLAX (subtle)
  ============================================ */
  const heroOrb1 = document.querySelector('.hero-orb-1');
  const heroOrb2 = document.querySelector('.hero-orb-2');

  if (heroOrb1 && heroOrb2 && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    window.addEventListener('scroll', function () {
      const scrollY = window.scrollY;
      heroOrb1.style.transform = 'translateY(' + scrollY * 0.15 + 'px)';
      heroOrb2.style.transform = 'translateY(' + scrollY * -0.1 + 'px)';
    }, { passive: true });
  }

  /* ============================================
     CARD TILT (subtle — desktop only)
  ============================================ */
  if (window.matchMedia('(min-width: 1024px) and (prefers-reduced-motion: no-preference)').matches) {
    document.querySelectorAll('.service-card, .why-card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = 'perspective(600px) rotateY(' + (x * 4) + 'deg) rotateX(' + (-y * 4) + 'deg) translateZ(4px)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    });
  }

  /* ============================================
     INIT
  ============================================ */
  // Trigger initial reveal for above-fold elements
  setTimeout(function () {
    document.querySelectorAll('.hero .reveal').forEach(function (el) {
      el.classList.add('visible');
    });
  }, 100);

})();
