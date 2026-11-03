/* The Workshop (cluster 5): every project is a little machine.
   - Flip a machine's switch to power it on: the lamp glows, the gear spins and the details open.
   - The big lever on the left powers everything on or off.
   - Projects come from `staff.projects` in js/content.js (one list for both the Workshop and
     the Staff entrance). Optional extras per project: status ('shipped' | 'half' | 'sketch')
     and progress (0 to 100). Words live under `workshop`. */
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
  function ext(href, text) {
    var a = el('a', null, text);
    a.href = href;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.appendChild(el('span', 'sr-only', ' (opens in a new tab)'));
    return a;
  }
  var GEAR = '<svg viewBox="0 0 40 40" aria-hidden="true" focusable="false"><g class="ws-gear-g">' +
    '<path d="M20 4l3 3.4 4.4-1 1.2 4.4 4.4 1.2-1 4.4L35 20l-3 3.4 1 4.4-4.4 1.2-1.2 4.4-4.4-1L20 36l-3-3.4-4.4 1-1.2-4.4-4.4-1.2 1-4.4L5 20l3-3.4-1-4.4 4.4-1.2 1.2-4.4 4.4 1z" fill="currentColor"/>' +
    '<circle cx="20" cy="20" r="6" fill="#12162B"/></g></svg>';

  Hotel.register('workshop', function (section, floor, content) {
    var W = content.workshop || {};
    var staff = content.staff || {};
    var list = staff.projects || [];
    var gh = safe(((content.owner || {}).links || {}).github);
    var status = W.status || { shipped: 'Shipped', half: 'Half-finished', sketch: 'Just a sketch' };

    var room = el('div', 'ws');
    var kick = el('p', 'kicker', floor.kicker);
    var h = el('h2', 'floor-name', floor.name);
    h.id = 'title-' + floor.id;
    var tag = el('p', 'tagline', W.tagline || floor.tagline);
    room.appendChild(kick); room.appendChild(h); room.appendChild(tag);

    /* ---- bench: lever + rail ---- */
    var bench = el('div', 'ws-bench');

    var lever = el('button', 'ws-lever');
    lever.type = 'button';
    lever.setAttribute('aria-pressed', 'false');
    lever.innerHTML = '<span class="ws-lever-slot" aria-hidden="true"><span class="ws-lever-knob"></span></span>' +
      '<span class="ws-lever-text"></span>';
    var leverText = lever.querySelector('.ws-lever-text');
    bench.appendChild(lever);

    var railWrap = el('div', 'ws-railwrap');
    var rail = el('ul', 'ws-rail');
    rail.setAttribute('data-scrollable', '');
    rail.setAttribute('aria-label', 'Projects');
    rail.tabIndex = -1;

    var machines = [];

    list.forEach(function (p, i) {
      var li = el('li', 'ws-item');
      var card = el('article', 'ws-machine');
      var st = status[p.status] ? p.status : 'half';
      card.dataset.status = st;

      var head = el('div', 'ws-head');
      var lamp = el('span', 'ws-lamp');
      lamp.setAttribute('aria-hidden', 'true');
      var gear = el('span', 'ws-gear');
      gear.innerHTML = GEAR;
      head.appendChild(lamp);
      head.appendChild(el('span', 'ws-stamp', status[st]));
      head.appendChild(gear);
      card.appendChild(head);

      var title = el('h3', 'ws-title', p.title);
      title.id = 'ws-t-' + i;
      card.appendChild(title);
      card.appendChild(el('p', 'ws-teaser', p.blurb || p.description));

      var pct = Math.max(0, Math.min(100, Number(p.progress)));
      if (!isNaN(pct) && p.progress !== undefined && p.progress !== '') {
        var meter = el('div', 'ws-meter');
        meter.setAttribute('role', 'img');
        meter.setAttribute('aria-label', pct + ' percent finished');
        var fill = el('span', 'ws-fill');
        fill.style.setProperty('--p', pct + '%');
        meter.appendChild(fill);
        card.appendChild(meter);
      }

      var det = el('div', 'ws-details');
      det.id = 'ws-d-' + i;
      det.inert = true;
      var inner = el('div', 'ws-details-in');
      inner.setAttribute('data-scrollable', '');
      if (p.blurb && p.description) inner.appendChild(el('p', null, p.description));
      if (p.tech && p.tech.length) {
        var chips = el('ul', 'ws-chips');
        p.tech.forEach(function (t) { chips.appendChild(el('li', null, t)); });
        inner.appendChild(chips);
      }
      var code = safe(p.code), live = safe(p.live);
      var links = el('p', 'ws-links');
      if (code) links.appendChild(ext(code, 'Code'));
      if (live) links.appendChild(ext(live, 'Live demo'));
      if (!code && !live) links.appendChild(el('span', 'ws-nolink', 'Links coming soon'));
      inner.appendChild(links);
      det.appendChild(inner);
      card.appendChild(det);

      var sw = el('button', 'ws-switch');
      sw.type = 'button';
      sw.setAttribute('aria-pressed', 'false');
      sw.setAttribute('aria-controls', det.id);
      sw.setAttribute('aria-label', 'Power ' + p.title);
      sw.innerHTML = '<span class="ws-track" aria-hidden="true"><span class="ws-thumb"></span></span>' +
        '<span class="ws-sw-text">Power on</span>';
      card.appendChild(sw);

      if (p.placeholder) card.appendChild(el('span', 'ws-ph', 'Placeholder'));

      li.appendChild(card);
      rail.appendChild(li);

      var m = { card: card, sw: sw, det: det, text: sw.querySelector('.ws-sw-text'), on: false };
      sw.addEventListener('click', function () { set(m, !m.on, true); });
      machines.push(m);
    });

    if (!list.length) {
      var empty = el('li', 'ws-item');
      empty.appendChild(el('p', 'ws-empty', W.empty || 'The workbench is empty. Add projects in js/content.js (staff.projects).'));
      rail.appendChild(empty);
      lever.disabled = true;
    }

    railWrap.appendChild(rail);

    function arrow(dir, label, ch) {
      var b = el('button', 'ws-arrow ws-arrow-' + (dir < 0 ? 'prev' : 'next'), ch);
      b.type = 'button';
      b.setAttribute('aria-label', label);
      b.addEventListener('click', function () {
        var step = Math.max(200, rail.clientWidth * 0.8) * dir;
        rail.scrollBy({ left: step, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      });
      return b;
    }
    var prev = arrow(-1, 'Previous projects', '‹');
    var next = arrow(1, 'Next projects', '›');
    railWrap.appendChild(prev); railWrap.appendChild(next);
    function edges() {
      var max = rail.scrollWidth - rail.clientWidth - 2;
      prev.hidden = rail.scrollLeft <= 2;
      next.hidden = rail.scrollLeft >= max;
    }
    rail.addEventListener('scroll', edges, { passive: true });
    window.addEventListener('resize', edges);
    setTimeout(edges, 0);
    section.addEventListener('transitionend', edges);

    bench.appendChild(railWrap);
    room.appendChild(bench);

    /* ---- footer line ---- */
    var foot = el('p', 'ws-foot');
    if (gh) {
      foot.appendChild(document.createTextNode((W.more || 'The rest of the mess lives on') + ' '));
      foot.appendChild(ext(gh, 'GitHub'));
    } else {
      foot.appendChild(el('span', 'ws-nolink', W.noGithub || 'GitHub link coming soon'));
    }
    room.appendChild(foot);
    section.appendChild(room);

    /* ---- behaviour ---- */
    var fanfare = false;
    function announce(msg) {
      var a = document.getElementById('announcer');
      if (a) { a.textContent = ''; setTimeout(function () { a.textContent = msg; }, 30); }
    }
    function set(m, on, user) {
      m.on = on;
      m.card.classList.toggle('is-on', on);
      m.sw.setAttribute('aria-pressed', String(on));
      m.text.textContent = on ? 'Power off' : 'Power on';
      m.det.inert = !on;
      if (on && user && Hotel.audio && Hotel.audio.click) Hotel.audio.click();
      sync();
      if (on && !fanfare && Hotel.keys && !Hotel.keys.has('workshop')) {
        fanfare = true;
        Hotel.keys.add({ id: 'workshop', label: W.keyLabel || 'Workshop key', color: floor.accent });
      }
    }
    function sync() {
      var all = machines.length && machines.every(function (m) { return m.on; });
      lever.setAttribute('aria-pressed', String(all));
      lever.classList.toggle('is-down', all);
      leverText.textContent = all ? (W.powerOff || 'Lights out') : (W.powerOn || 'Power everything');
      section.classList.toggle('is-lit', machines.some(function (m) { return m.on; }));
    }
    lever.addEventListener('click', function () {
      var want = !(machines.length && machines.every(function (m) { return m.on; }));
      machines.forEach(function (m) { set(m, want, false); });
      announce(want ? (W.allOn || 'Every machine is running.') : (W.allOff || 'The workshop is quiet.'));
    });
    sync();
  });
})();
