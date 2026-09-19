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
    var prevBtn = group.querySelector('.tab-prev');
    function currentIndex() {
      for (var i = 0; i < tabs.length; i++) if (tabs[i].getAttribute('aria-selected') === 'true') return i;
      return 0;
    }
    function syncArrows() {
      var idx = currentIndex();
      if (prevBtn) prevBtn.disabled = idx <= 0;
      if (nextBtn) nextBtn.disabled = idx >= tabs.length - 1;
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
      syncArrows();
    }
    function step(delta) {
      var idx = currentIndex() + delta;
      if (idx < 0 || idx > tabs.length - 1) return;
      activate(tabs[idx]);
      tabs[idx].scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
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
    if (prevBtn) prevBtn.addEventListener('click', function () { step(-1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { step(1); });
    syncArrows();
  });

  /* ---- Interactive regional map (Contact): click a country / pill to reveal one market ---- */
  var mapWrap = document.getElementById('sea-map-wrap');
  if (mapWrap) {
    var mkGroups = [].slice.call(mapWrap.querySelectorAll('.sea-market'));
    var mkPills = [].slice.call(mapWrap.querySelectorAll('.market-pill'));
    var mkCards = [].slice.call(mapWrap.querySelectorAll('.market-card'));
    var selectMarket = function (market) {
      mapWrap.setAttribute('data-active', market);
      mkGroups.forEach(function (g) { g.classList.toggle('is-active', g.getAttribute('data-market') === market); });
      mkPills.forEach(function (p) { p.setAttribute('aria-selected', p.getAttribute('data-market') === market ? 'true' : 'false'); });
      mkCards.forEach(function (c) { c.classList.toggle('hidden', c.getAttribute('data-market') !== market); });
    };
    mkGroups.forEach(function (g) {
      var m = g.getAttribute('data-market');
      g.addEventListener('click', function () { selectMarket(m); });
      g.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectMarket(m); }
      });
    });
    mkPills.forEach(function (p) {
      p.addEventListener('click', function () { selectMarket(p.getAttribute('data-market')); });
    });
    selectMarket(mapWrap.getAttribute('data-active') || 'singapore');
  }

  /* ---- Homepage regional footprint: tap a country / office to highlight one market ---- */
  var fp = document.getElementById('footprint');
  if (fp) {
    var fpGroups = [].slice.call(fp.querySelectorAll('.sea-market'));
    var fpCards = [].slice.call(fp.querySelectorAll('.fp-card'));
    var fpActive = null;
    var fpSet = function (m) {
      fpActive = (fpActive === m) ? null : m; // tapping the active market again clears it
      fpGroups.forEach(function (g) { g.classList.toggle('is-active', !!fpActive && g.getAttribute('data-market') === fpActive); });
      fpCards.forEach(function (c) {
        var match = c.getAttribute('data-market') === fpActive;
        c.classList.toggle('is-focus', !!fpActive && match);
        c.classList.toggle('is-dim', !!fpActive && !match);
      });
    };
    var wire = function (el) {
      var m = el.getAttribute('data-market');
      el.addEventListener('click', function () { fpSet(m); });
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fpSet(m); }
      });
    };
    fpGroups.forEach(wire);
    fpCards.forEach(wire);
  }

  /* ---- History year carousels (About Us): prev/next + year pills + swipe ---- */
  document.querySelectorAll('[data-carousel]').forEach(function (car) {
    var track = car.querySelector('.car-track');
    var viewport = car.querySelector('.car-viewport');
    var slides = [].slice.call(car.querySelectorAll('.hist-slide'));
    var dots = [].slice.call(car.querySelectorAll('.year-pill'));
    var prevBtn = car.querySelector('.car-prev');
    var nextBtn = car.querySelector('.car-next');
    if (!track || !viewport || slides.length === 0) return;
    var idx = 0;
    function render() {
      // Percentage transform (relative to the track box = one viewport width),
      // so it needs no width measurement and works even before layout/compositing.
      track.style.transform = 'translateX(' + (-idx * 100) + '%)';
      dots.forEach(function (d, i) { d.setAttribute('aria-current', i === idx ? 'true' : 'false'); });
      if (prevBtn) prevBtn.disabled = idx <= 0;
      if (nextBtn) nextBtn.disabled = idx >= slides.length - 1;
      if (dots[idx]) dots[idx].scrollIntoView({ inline: 'center', block: 'nearest' });
    }
    function go(i) {
      var n = Math.max(0, Math.min(slides.length - 1, i));
      if (n === idx) return;
      idx = n;
      render();
    }
    dots.forEach(function (d, i) {
      d.addEventListener('click', function () { go(i); });
      d.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') { e.preventDefault(); go(idx + 1); if (dots[idx]) dots[idx].focus(); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); go(idx - 1); if (dots[idx]) dots[idx].focus(); }
      });
    });
    if (prevBtn) prevBtn.addEventListener('click', function () { go(idx - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { go(idx + 1); });
    // Touch swipe (threshold based; no live-follow to stay smooth).
    var startX = 0, startY = 0, dx = 0, dragging = false;
    viewport.addEventListener('touchstart', function (e) {
      startX = e.touches[0].clientX; startY = e.touches[0].clientY; dx = 0; dragging = true;
    }, { passive: true });
    viewport.addEventListener('touchmove', function (e) {
      if (!dragging) return;
      dx = e.touches[0].clientX - startX;
    }, { passive: true });
    viewport.addEventListener('touchend', function () {
      if (!dragging) return;
      dragging = false;
      if (Math.abs(dx) > 45) { go(dx < 0 ? idx + 1 : idx - 1); }
    });
    var rt;
    window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(render, 120); });
    render();
  });
})();
