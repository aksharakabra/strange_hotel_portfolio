/* The Trophy Room (cluster 6, reworked in cluster 13): every certificate is a key.
   - Pick a key off its hook: it swings out and a little door opens to show that certificate
     (a picture if you add one), what it opens, what you took from it, and its skills.
   - Each key you pick is added to your key ring. Collect them all for the MASTER key,
     which unlocks the peek on the Roof.
   Keys come from `staff.certificates` in js/content.js (shared with the Staff page). Per certificate:
   name, issuer, year, type, opens, learned, skills[], image, url. Words live under `trophy`. */
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
  var COLORS = ['#F2B84B', '#E8798A', '#7FD1B9', '#F5CF7A', '#9AA3E0', '#F4E9D3', '#E8A15F', '#B8E0A0'];

  function keySvg(color) {
    return '<svg viewBox="0 0 40 120" aria-hidden="true" focusable="false">' +
      '<g fill="' + color + '">' +
      '<path fill-rule="evenodd" d="M20 2a14 14 0 1 1 0 28 14 14 0 0 1 0-28zm0 8a6 6 0 1 0 0 12 6 6 0 0 0 0-12z"/>' +
      '<rect x="17" y="29" width="6" height="84" rx="2"/>' +
      '<rect x="23" y="84" width="11" height="6" rx="1"/><rect x="23" y="97" width="8" height="6" rx="1"/>' +
      '</g></svg>';
  }

  Hotel.register('trophy', function (section, floor, content) {
    var T = content.trophy || {};
    var list = (content.staff || {}).certificates || [];

    var room = el('div', 'tr');
    room.appendChild(el('p', 'kicker', floor.kicker));
    var h = el('h2', 'floor-name', floor.name);
    h.id = 'title-' + floor.id;
    room.appendChild(h);
    room.appendChild(el('p', 'tagline', T.tagline || floor.tagline));

    /* ---- key board ---- */
    var board = el('div', 'tr-board');
    var ul = el('ul', 'tr-keys');
    ul.setAttribute('aria-label', 'Certificate keys');
    var items = [];

    list.forEach(function (c, i) {
      var color = COLORS[i % COLORS.length];
      var li = el('li', 'tr-hook');
      var b = el('button', 'tr-key');
      b.type = 'button';
      b.setAttribute('aria-pressed', 'false');
      b.setAttribute('aria-label', c.name + (c.issuer ? ', ' + c.issuer : ''));
      b.style.setProperty('--k', color);
      b.innerHTML = '<span class="tr-nail" aria-hidden="true"></span>' +
        '<span class="tr-swing" aria-hidden="true">' + keySvg(color) + '</span>' +
        '<span class="tr-num" aria-hidden="true">' + (i + 1) + '</span>';
      li.appendChild(b);
      ul.appendChild(li);
      var it = { c: c, b: b, color: color, id: 'cert-' + (i + 1) };
      b.addEventListener('click', function () { pick(it); });
      items.push(it);
    });
    board.appendChild(ul);
    room.appendChild(board);

    /* ---- the opened door + certificate tag ---- */
    var tag = el('div', 'tr-tag');
    tag.setAttribute('aria-live', 'polite');
    var door = el('div', 'tr-door');
    door.setAttribute('aria-hidden', 'true');
    var thumb = el('div', 'tr-thumb');
    var leaf = el('div', 'tr-leaf');
    leaf.appendChild(el('span', 'tr-leaf-n'));
    door.appendChild(thumb); door.appendChild(leaf);
    var info = el('div', 'tr-info');
    var tagTitle = el('h3', 'tr-tag-title');
    var tagMeta = el('p', 'tr-tag-meta');
    var tagOpens = el('p', 'tr-tag-opens');
    var tagLearned = el('p', 'tr-tag-learned');
    var tagSkills = el('ul', 'tr-skills');
    var tagLink = el('p', 'tr-tag-link');
    [tagTitle, tagMeta, tagOpens, tagLearned, tagSkills, tagLink].forEach(function (n) { info.appendChild(n); });
    var ph = el('span', 'tr-ph', 'Placeholder');
    ph.hidden = true;
    tag.appendChild(door); tag.appendChild(info); tag.appendChild(ph);
    room.appendChild(tag);

    var count = el('p', 'tr-count');
    room.appendChild(count);
    section.appendChild(room);

    var total = list.length;
    var picked = {};
    function have() { return Object.keys(picked).length; }
    function goal() { return (T.goal || 'Collect all {n} keys for the Master key.').replace('{n}', total); }
    function updateCount() {
      if (!total) { count.textContent = ''; return; }
      if (have() === total) count.textContent = T.master || 'Master key unlocked.';
      else count.textContent = have() + ' / ' + total + ' ' + (T.count || 'keys collected') + '. ' + goal();
    }

    if (!list.length) {
      tagTitle.textContent = T.empty || 'No keys yet.';
    } else {
      tagTitle.textContent = T.hint || 'Pick a key.';
      tagMeta.textContent = goal();
      thumb.appendChild(el('span', 'tr-thumb-ph', '?'));
    }
    updateCount();

    function announce(msg) {
      var a = document.getElementById('announcer');
      if (a) { a.textContent = ''; setTimeout(function () { a.textContent = msg; }, 30); }
    }

    function pick(it) {
      items.forEach(function (o) {
        var on = o === it;
        o.b.setAttribute('aria-pressed', String(on));
        o.b.classList.toggle('is-out', on);
      });
      var c = it.c;
      tagTitle.textContent = c.name;
      tagMeta.textContent = [c.issuer, c.year, c.type].filter(Boolean).join(' · ');
      tagOpens.textContent = c.opens || '';
      tagLearned.textContent = '';
      if (c.learned) {
        tagLearned.appendChild(el('b', null, (T.learned || 'What I took from it') + ': '));
        tagLearned.appendChild(document.createTextNode(c.learned));
      }
      tagSkills.textContent = '';
      (c.skills || []).forEach(function (s) { tagSkills.appendChild(el('li', null, s)); });
      tagLink.textContent = '';
      var url = safe(c.url);
      if (url) {
        var a = el('a', null, T.view || 'View certificate');
        a.href = url;
        if (/^https?:/i.test(url)) {
          a.target = '_blank'; a.rel = 'noopener noreferrer';
          a.appendChild(el('span', 'sr-only', ' (opens in a new tab)'));
        }
        tagLink.appendChild(a);
      } else {
        tagLink.appendChild(el('span', 'tr-nolink', T.noLink || 'Certificate link coming soon'));
      }
      ph.hidden = !c.placeholder;

      /* the door behind the key: picture or a frame, and the door swings open */
      thumb.textContent = '';
      var image = safe(c.image);
      if (image) {
        var img = el('img');
        img.src = image; img.alt = '';
        thumb.appendChild(img);
      } else {
        thumb.appendChild(el('span', 'tr-thumb-ph', T.noImage || 'Certificate picture goes here'));
      }
      leaf.firstChild.textContent = String(items.indexOf(it) + 1);
      door.classList.remove('is-open'); void door.offsetWidth;
      setTimeout(function () { door.classList.add('is-open'); }, 40);
      tag.classList.remove('is-pop'); void tag.offsetWidth; tag.classList.add('is-pop');

      if (!picked[it.id]) {
        picked[it.id] = true;
        it.b.classList.add('is-collected');
        if (Hotel.keys && !Hotel.keys.has(it.id)) Hotel.keys.add({ id: it.id, label: c.name, color: it.color });
        updateCount();
        if (have() === total && total > 1) {
          if (Hotel.keys && !Hotel.keys.has('master')) Hotel.keys.add({ id: 'master', label: T.masterLabel || 'Master key', color: '#F2B84B' });
          section.classList.add('is-master');
          announce(T.master || 'Master key unlocked.');
        }
      }
    }
  });
})();
