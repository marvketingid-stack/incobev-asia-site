/* IncoBev Asia — shared behaviour: mobile nav drawer, sticky-shrink, scroll reveal. */
(function () {
  'use strict';

  /* ---- Mobile nav drawer ---- */
  var toggle = document.getElementById('nav-toggle');
  var closeBtn = document.getElementById('nav-close');
  var drawer = document.getElementById('mobile-drawer');
  var overlay = document.getElementById('nav-overlay');

  function openNav() {
    drawer.classList.add('is-open');
    overlay.classList.remove('hidden');
    document.body.classList.add('nav-open');
    toggle.setAttribute('aria-expanded', 'true');
  }
  function closeNav() {
    drawer.classList.remove('is-open');
    overlay.classList.add('hidden');
    document.body.classList.remove('nav-open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  if (toggle && drawer && overlay) {
    toggle.addEventListener('click', openNav);
    closeBtn.addEventListener('click', closeNav);
    overlay.addEventListener('click', closeNav);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) closeNav();
    });
    // Close drawer if resized up to desktop
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 1024 && drawer.classList.contains('is-open')) closeNav();
    });
  }

  /* ---- Sticky header shrink on scroll (80px -> 64px) ---- */
  var navBar = document.getElementById('nav-bar');
  if (navBar) {
    var onScroll = function () {
      if (window.scrollY > 40) {
        navBar.classList.remove('h-20');
        navBar.classList.add('h-16');
      } else {
        navBar.classList.add('h-20');
        navBar.classList.remove('h-16');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---- Scroll reveal (progressive enhancement; content never stays hidden) ---- */
  var revealEls = document.querySelectorAll('.reveal');
  function reveal(el) {
    el.classList.add('is-visible');
  }
  function inView(el) {
    var vh = window.innerHeight || document.documentElement.clientHeight;
    return el.getBoundingClientRect().top < vh - 40;
  }
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            reveal(entry.target);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach(function (el) {
      if (inView(el)) reveal(el); // show anything already on screen at load
      else io.observe(el);
    });
    // Failsafe: if the observer never fires (e.g. suspended tab), reveal all.
    window.setTimeout(function () {
      revealEls.forEach(reveal);
    }, 2500);
  } else {
    revealEls.forEach(reveal);
  }
})();
