/* Secrets (cluster 11): small surprises for people who poke around.
   - Type "foxie", "japan" or "coffee" anywhere (these words avoid R, L, B and numbers,
     which are the elevator's floor shortcuts).
   - Click the HOTEL AKSHARA sign five times to meet the manager.
   Each secret adds a key the first time. Words live under `secrets` in js/content.js. */
(function () {
  'use strict';

  var Hotel = window.Hotel;
  if (!Hotel) return;
  var S = (Hotel.content && Hotel.content.secrets) || (window.HOTEL && window.HOTEL.secrets) || {};
  var found = {};
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  function toast(msg) {
    var old = document.querySelector('.sx-toast');
    if (old) old.remove();
    var t = document.createElement('div');
    t.className = 'sx-toast';
    t.setAttribute('role', 'status');
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 3500);
  }
  function reward(id) {
    if (found[id]) return;
    found[id] = true;
    if (Hotel.keys && !Hotel.keys.has('secret-' + id)) {
      Hotel.keys.add({ id: 'secret-' + id, label: (S.keyLabel || 'Secret key') + ': ' + id, color: '#7FD1B9' });
    }
  }
  function foxRun() {
    if (reduce) return;
    var d = document.createElement('div');
    d.className = 'sx-fox';
    d.setAttribute('aria-hidden', 'true');
    d.innerHTML = '<svg viewBox="0 0 64 50"><path d="M6 20L4 4L18 12Z" fill="#EF9A45"/><path d="M42 20L44 4L30 12Z" fill="#EF9A45"/><ellipse cx="24" cy="26" rx="20" ry="16" fill="#EF9A45"/><ellipse cx="24" cy="32" rx="9" ry="7" fill="#FFF1DC"/><circle cx="16" cy="24" r="5" fill="none" stroke="#2A1B2E" stroke-width="1.5"/><circle cx="32" cy="24" r="5" fill="none" stroke="#2A1B2E" stroke-width="1.5"/><circle cx="16" cy="24" r="2" fill="#2A1B2E"/><circle cx="32" cy="24" r="2" fill="#2A1B2E"/><path d="M4 24C2 2 46 2 44 24" fill="none" stroke="#F4E9D3" stroke-width="3" stroke-linecap="round"/><path d="M44 32c10-6 18-4 20 6-8-2-14 0-20-2z" fill="#EF9A45"/><rect x="48" y="36" width="8" height="8" rx="1" fill="#F4E9D3"/></svg>';
    document.body.appendChild(d);
    setTimeout(function () { d.remove(); }, 2800);
  }
  function petals() {
    if (reduce) return;
    for (var i = 0; i < 26; i++) {
      var p = document.createElement('span');
      p.className = 'sx-petal';
      p.setAttribute('aria-hidden', 'true');
      p.style.left = (Math.random() * 100) + 'vw';
      p.style.setProperty('--dx', (Math.random() * 160 - 80) + 'px');
      p.style.animationDuration = (3 + Math.random() * 3) + 's';
      p.style.animationDelay = (Math.random() * 1.2) + 's';
      document.body.appendChild(p);
      setTimeout((function (n) { return function () { n.remove(); }; })(p), 7000);
    }
  }
  var WORDS = {
    foxie: function () { foxRun(); toast(S.foxie || 'Foxie zooms by.'); },
    japan: function () { petals(); toast(S.japan || 'Sakura petals.'); },
    coffee: function () { toast(S.coffee || 'Refill?'); }
  };

  var buf = '';
  document.addEventListener('keydown', function (e) {
    if (document.body.classList.contains('is-entering')) return;
    if (e.altKey || e.ctrlKey || e.metaKey || e.key.length !== 1) return;
    var t = e.target;
    if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
    buf = (buf + e.key.toLowerCase()).slice(-8);
    Object.keys(WORDS).forEach(function (w) {
      if (buf.slice(-w.length) === w) { buf = ''; WORDS[w](); reward(w); }
    });
  });

  var sign = document.querySelector('.marquee');
  var clicks = 0, timer = null;
  if (sign) sign.addEventListener('click', function () {
    clicks++;
    clearTimeout(timer);
    timer = setTimeout(function () { clicks = 0; }, 1500);
    if (clicks >= 5) { clicks = 0; toast(S.manager || 'You found the manager.'); reward('manager'); }
  });
})();
