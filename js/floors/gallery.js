/* The Poster Gallery (cluster 7): a dark room and one flashlight.
   - Move the pointer (or drag a finger) to light the wall; it sweeps on its own when idle.
   - "Lights on" removes the dark for anyone who wants it (it is also on for reduced motion).
   - Focusing a poster with the keyboard points the beam at it. Open a poster for a big view
     with previous / next. Posters come from `staff.posters` in js/content.js (shared with the
     Staff page): { title, event, image, placeholder }. Words live under `gallery`. */
(function () {
  'use strict';

  var Hotel = window.Hotel;
  if (!Hotel) return;

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined && text !== null && text !== '') n.textContent = text;
    return n;
  }
  function safe(url) {
    url = String(url || '').trim();
    return /^(javascript|data|vbscript):/i.test(url) ? '' : url;
  }
  var TINTS = ['#E8798A', '#F2B84B', '#7FD1B9', '#9AA3E0', '#F5CF7A', '#E8A15F', '#B8E0A0'];
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  Hotel.register('gallery', function (section, floor, content) {
    var G = content.gallery || {};
    var list = (content.staff || {}).posters || [];

    var room = el('div', 'gl');
    room.appendChild(el('p', 'kicker', floor.kicker));
    var h = el('h2', 'floor-name', floor.name);
    h.id = 'title-' + floor.id;
    room.appendChild(h);
    room.appendChild(el('p', 'tagline', G.tagline || floor.tagline));

    /* ---- the wall ---- */
    var wall = el('div', 'gl-wall');
    var rail = el('ul', 'gl-rail');
    rail.setAttribute('data-scrollable', '');
    rail.setAttribute('aria-label', 'Academic posters');
    var cards = [];

    function art(p, i, big) {
      var image = safe(p.image);
      var box = el('span', 'gl-art');
      box.style.setProperty('--tint', TINTS[i % TINTS.length]);
      if (image) {
        var img = el('img');
        img.src = image;
        img.alt = '';
        img.loading = big ? 'eager' : 'lazy';
        box.appendChild(img);
      } else {
        box.classList.add('is-blank');
        box.appendChild(el('span', 'gl-art-n', String(i + 1)));
        box.appendChild(el('span', 'gl-art-t', p.title));
        box.appendChild(el('span', 'gl-art-s', G.noImage || 'Poster image goes here'));
      }
      return box;
    }

    list.forEach(function (p, i) {
      var li = el('li', 'gl-item');
      var b = el('button', 'gl-poster');
      b.type = 'button';
      b.setAttribute('aria-haspopup', 'dialog');
      b.setAttribute('aria-label', (G.open || 'Open poster') + ': ' + p.title + (p.event ? ', ' + p.event : ''));
      b.style.setProperty('--tilt', ((i % 3) - 1) * 1.1 + 'deg');
      var pin = el('span', 'gl-pin'); pin.setAttribute('aria-hidden', 'true');
      b.appendChild(pin);
      b.appendChild(art(p, i, false));
      li.appendChild(b);
      li.appendChild(el('span', 'gl-cap', p.title));
      rail.appendChild(li);
      b.addEventListener('click', function () { openAt(i, b); });
      b.addEventListener('focus', function () { beamTo(b); });
      cards.push(b);
    });
    if (!list.length) {
      var e = el('li', 'gl-item');
      e.appendChild(el('p', 'gl-empty', G.empty || 'No posters yet.'));
      rail.appendChild(e);
    }
    wall.appendChild(rail);

    /* arrows (all pointer types) and hover auto-scroll near the edges (mouse) */
    function arrow(dir, label, ch) {
      var b = el('button', 'gl-arrow gl-arrow-' + (dir < 0 ? 'prev' : 'next'), ch);
      b.type = 'button';
      b.setAttribute('aria-label', label);
      b.addEventListener('click', function () {
        rail.scrollBy({ left: Math.max(180, rail.clientWidth * 0.7) * dir, behavior: reduce ? 'auto' : 'smooth' });
      });
      return b;
    }
    var prev = arrow(-1, 'Previous posters', '\u2039');
    var next = arrow(1, 'Next posters', '\u203A');
    wall.appendChild(prev); wall.appendChild(next);
    function edges() {
      var max = rail.scrollWidth - rail.clientWidth - 2;
      prev.hidden = rail.scrollLeft <= 2;
      next.hidden = rail.scrollLeft >= max;
    }
    rail.addEventListener('scroll', edges, { passive: true });
    window.addEventListener('resize', edges);
    setTimeout(edges, 0);
    document.addEventListener('hotel:arrive', function () { setTimeout(edges, 50); });

    var edgeDir = 0, edgeRaf = 0;
    function edgeLoop() {
      edgeRaf = 0;
      if (!edgeDir) return;
      rail.scrollLeft += edgeDir * 12;
      edgeRaf = requestAnimationFrame(edgeLoop);
    }
    wall.addEventListener('pointermove', function (e) {
      if (e.pointerType === 'touch') return;
      var w = wall.getBoundingClientRect();
      var zone = Math.min(130, w.width * 0.2), x = e.clientX - w.left;
      edgeDir = x < zone ? -(1 - x / zone) : (x > w.width - zone ? 1 - (w.width - x) / zone : 0);
      if (edgeDir && !edgeRaf) edgeRaf = requestAnimationFrame(edgeLoop);
    });
    wall.addEventListener('pointerleave', function () { edgeDir = 0; });

    var dark = el('div', 'gl-dark');
    dark.setAttribute('aria-hidden', 'true');
    wall.appendChild(dark);
    room.appendChild(wall);

    /* ---- controls ---- */
    var bar = el('div', 'gl-bar');
    var lights = el('button', 'gl-lights');
    lights.type = 'button';
    lights.setAttribute('aria-pressed', 'false');
    var lightsText = el('span', null, G.lightsOn || 'Lights on');
    lights.appendChild(el('span', 'gl-bulb')).setAttribute('aria-hidden', 'true');
    lights.appendChild(lightsText);
    bar.appendChild(lights);
    bar.appendChild(el('p', 'gl-hint', G.hint || ''));
    room.appendChild(bar);
    section.appendChild(room);

    /* ---- the flashlight ---- */
    var lit = false;
    var pointerDown = false, idle = true, raf = 0, t0 = 0;
    function beamAt(x, y) {
      wall.style.setProperty('--bx', Math.round(x) + 'px');
      wall.style.setProperty('--by', Math.round(y) + 'px');
    }
    function beamTo(node) {
      var w = wall.getBoundingClientRect(), r = node.getBoundingClientRect();
      idle = false;
      beamAt(r.left - w.left + r.width / 2, r.top - w.top + r.height / 2);
    }
    wall.addEventListener('pointermove', function (e) {
      if (e.pointerType === 'touch' && !pointerDown) return;
      var w = wall.getBoundingClientRect();
      idle = false; beamAt(e.clientX - w.left, e.clientY - w.top);
    });
    wall.addEventListener('pointerdown', function (e) {
      pointerDown = true; idle = false;
      var w = wall.getBoundingClientRect(); beamAt(e.clientX - w.left, e.clientY - w.top);
    });
    window.addEventListener('pointerup', function () { pointerDown = false; });
    wall.addEventListener('pointerleave', function (e) { if (e.pointerType !== 'touch') idle = true; });

    function sweep(ts) {
      raf = 0;
      if (lit || reduce || !section.classList.contains('is-here')) return;
      if (!t0) t0 = ts;
      if (idle) {
        var w = wall.clientWidth, hh = wall.clientHeight, k = (ts - t0) / 1600;
        beamAt(w * (0.5 + 0.38 * Math.sin(k * 0.6)), hh * (0.5 + 0.18 * Math.sin(k * 0.9 + 1)));
      }
      raf = requestAnimationFrame(sweep);
    }
    function startSweep() { if (!raf && !lit && !reduce) { t0 = 0; raf = requestAnimationFrame(sweep); } }
    document.addEventListener('hotel:arrive', function (e) {
      var to = e.detail && (e.detail.id || (e.detail.floor && e.detail.floor.id) || e.detail.to);
      var here = (to === floor.id);
      section.classList.toggle('is-here', here);
      if (here) startSweep();
    });
    document.addEventListener('hotel:depart', function () { section.classList.remove('is-here'); });
    beamAt(200, 120);

    function setLights(on) {
      lit = on;
      section.classList.toggle('is-lit', on);
      lights.setAttribute('aria-pressed', String(on));
      lightsText.textContent = on ? (G.lightsOff || 'Lights off') : (G.lightsOn || 'Lights on');
      if (!on) { idle = true; startSweep(); }
    }
    lights.addEventListener('click', function () { setLights(!lit); });
    if (reduce) setLights(true);
    if (!reduce && location.hash === '#' + floor.id) { section.classList.add('is-here'); startSweep(); }

    /* ---- big view (native dialog, kept outside the elevator so wheel/keys do not move it) ---- */
    var dlg = el('dialog', 'gl-dialog');
    dlg.setAttribute('aria-labelledby', 'gl-d-title');
    var dIn = el('div', 'gl-d-in');
    var dArt = el('div', 'gl-d-art');
    var dText = el('div', 'gl-d-text');
    var dTitle = el('h3', 'gl-d-title'); dTitle.id = 'gl-d-title';
    var dEvent = el('p', 'gl-d-event');
    var dNote = el('p', 'gl-d-note');
    var nav = el('div', 'gl-d-nav');
    var bPrev = el('button', 'gl-btn', '‹ ' + (G.prev ? 'Prev' : 'Prev'));
    var bNext = el('button', 'gl-btn', 'Next ›');
    var bClose = el('button', 'gl-btn gl-close', G.close || 'Close');
    [bPrev, bNext, bClose].forEach(function (b) { b.type = 'button'; });
    bPrev.setAttribute('aria-label', G.prev || 'Previous poster');
    bNext.setAttribute('aria-label', G.next || 'Next poster');
    nav.appendChild(bPrev); nav.appendChild(bNext); nav.appendChild(bClose);
    dText.appendChild(dTitle); dText.appendChild(dEvent); dText.appendChild(dNote); dText.appendChild(nav);
    dIn.appendChild(dArt); dIn.appendChild(dText);
    dlg.appendChild(dIn);
    document.body.appendChild(dlg);

    var cur = 0, opener = null, keyed = false;
    function show(i) {
      cur = (i + list.length) % list.length;
      var p = list[cur];
      dArt.textContent = '';
      var a = art(p, cur, true);
      var img = a.querySelector('img');
      if (img) img.alt = 'Poster: ' + p.title;
      dArt.appendChild(a);
      dTitle.textContent = p.title;
      dEvent.textContent = p.event || '';
      dNote.textContent = p.placeholder ? 'Placeholder: add the real poster in js/content.js (staff.posters).' : '';
      bPrev.disabled = bNext.disabled = list.length < 2;
    }
    function openAt(i, from) {
      if (!list.length || typeof dlg.showModal !== 'function') return;
      opener = from; show(i);
      dlg.showModal();
      bClose.focus();
      if (!keyed && Hotel.keys && !Hotel.keys.has('gallery')) {
        keyed = true;
        Hotel.keys.add({ id: 'gallery', label: G.keyLabel || 'Gallery key', color: floor.accent });
      }
    }
    function close() { if (dlg.open) dlg.close(); }
    dlg.addEventListener('close', function () { if (opener) { try { opener.focus(); } catch (e) {} } });
    bPrev.addEventListener('click', function () { show(cur - 1); });
    bNext.addEventListener('click', function () { show(cur + 1); });
    bClose.addEventListener('click', close);
    dlg.addEventListener('click', function (e) { if (e.target === dlg) close(); });   // click the backdrop
    dlg.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { show(cur - 1); }
      else if (e.key === 'ArrowRight') { show(cur + 1); }
      e.stopPropagation();   // keep the elevator's keys out of the dialog
    });
    document.addEventListener('hotel:depart', close);
  });
})();
