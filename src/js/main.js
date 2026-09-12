/* IncoBev Asia — shared behaviour: nav overlay, sticky-shrink, scroll reveal, count-up. */
(function () {
  'use strict';

  /* ---- Full-screen nav overlay ---- */
  var toggle = document.getElementById('nav-toggle');
  var closeBtn = document.getElementById('nav-close');
  var panel = document.getElementById('nav-panel');

  function openNav() {
    panel.classList.remove('hidden');
    panel.classList.add('flex');
    document.body.classList.add('nav-open');
    toggle.setAttribute('aria-expanded', 'true');
  }
  function closeNav() {
    panel.classList.add('hidden');
    panel.classList.remove('flex');
    document.body.classList.remove('nav-open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  if (toggle && panel && closeBtn) {
    toggle.addEventListener('click', openNav);
    closeBtn.addEventListener('click', closeNav);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !panel.classList.contains('hidden')) closeNav();
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

  /* ---- Count-up for stat numbers ([data-count-to], optional -prefix/-suffix/-decimals) ---- */
  var counters = document.querySelectorAll('[data-count-to]');
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function fmt(el, n) {
    var dec = parseInt(el.getAttribute('data-decimals') || '0', 10);
    var body = Number(n).toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec });
    return (el.getAttribute('data-prefix') || '') + body + (el.getAttribute('data-suffix') || '');
  }
  function animateCount(el) {
    var to = parseFloat(el.getAttribute('data-count-to'));
    if (reduceMotion) { el.textContent = fmt(el, to); return; }
    var dur = 1500, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(el, to * eased);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = fmt(el, to);
    }
    requestAnimationFrame(step);
  }
  if (counters.length && 'IntersectionObserver' in window) {
    var cio = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { animateCount(e.target); cio.unobserve(e.target); }
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach(function (c) { cio.observe(c); });
  } else {
    counters.forEach(function (c) { c.textContent = fmt(c, parseFloat(c.getAttribute('data-count-to'))); });
  }

  /* ---- Generic tab groups ([data-tabs] with .pillar-tab buttons + .pillar-panel panels) ---- */
  document.querySelectorAll('[data-tabs]').forEach(function (group) {
    var tabs = [].slice.call(group.querySelectorAll('[role="tab"]'));
    var panels = group.querySelectorAll('.pillar-panel');
    var nextBtn = group.querySelector('.tab-next');
    function currentIndex() {
      for (var i = 0; i < tabs.length; i++) if (tabs[i].getAttribute('aria-selected') === 'true') return i;
      return 0;
    }
    function activate(tab) {
      var id = tab.getAttribute('data-tab');
      tabs.forEach(function (t) {
        t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
        t.setAttribute('tabindex', t === tab ? '0' : '-1');
      });
      panels.forEach(function (p) {
        p.classList.toggle('hidden', p.getAttribute('data-panel') !== id);
      });
      if (nextBtn) nextBtn.disabled = currentIndex() >= tabs.length - 1;
    }
    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { activate(tab); });
      tab.addEventListener('keydown', function (e) {
        var next = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = tabs[(i + 1) % tabs.length];
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = tabs[(i - 1 + tabs.length) % tabs.length];
        if (next) { e.preventDefault(); next.focus(); activate(next); }
      });
    });
    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        var idx = currentIndex();
        if (idx < tabs.length - 1) {
          activate(tabs[idx + 1]);
          tabs[idx + 1].scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
        }
      });
      nextBtn.disabled = currentIndex() >= tabs.length - 1;
    }
  });
})();
