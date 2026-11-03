/* The entrance: a night street, a brass bell and a door that opens into the lobby.
   Ring the bell by tapping it, pressing any key, or swiping up.

   Shows on the first visit only. Replay it with  index.html?intro
   Skip it for good with  index.html?skip  (or by opening a floor link like #workshop). */
(function () {
  'use strict';

  var VISITED = 'hotel.visited';

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function shouldShow(content) {
    var q = location.search;
    if (/[?&]skip\b/.test(q)) return false;
    if (/[?&]intro\b/.test(q)) return true;
    var id = location.hash.slice(1);
    if (id && content.floors.some(function (f) { return f.id === id; })) return false;
    try { if (localStorage.getItem(VISITED)) return false; } catch (e) { /* storage blocked: show it */ }
    return true;
  }

  function markup(t) {
    var l1 = esc(t.signLines[0]);
    var l2 = esc(t.signLines[1]);
    return '' +
      '<div class="entrance-sky" aria-hidden="true"></div>' +
      '<div class="entrance-moon" aria-hidden="true"></div>' +
      '<div class="entrance-world" id="e-world" aria-hidden="true">' +
        '<div class="entrance-scene">' +
          '<svg id="e-svg" viewBox="0 0 480 560" preserveAspectRatio="xMidYMax meet" focusable="false">' +
            '<defs>' +
              '<linearGradient id="e-glow" x1="0" y1="0" x2="0" y2="1">' +
                '<stop offset="0" stop-color="#FFE3A0"/><stop offset="1" stop-color="#F2B84B"/>' +
              '</linearGradient>' +
              '<clipPath id="e-clip"><path d="M194 560V430a46 46 0 0 1 92 0V560Z"/></clipPath>' +
            '</defs>' +

            /* neighbours */
            '<rect x="0" y="300" width="96" height="260" fill="#171B38"/>' +
            '<rect x="384" y="250" width="96" height="310" fill="#171B38"/>' +
            '<rect x="82" y="352" width="34" height="208" fill="#141935"/>' +
            '<rect x="364" y="330" width="34" height="230" fill="#141935"/>' +
            '<rect x="16" y="330" width="14" height="18" fill="#F2B84B" opacity=".55"/>' +
            '<rect x="54" y="372" width="14" height="18" fill="#F2B84B" opacity=".3"/>' +
            '<rect x="16" y="410" width="14" height="18" fill="#12162B"/>' +
            '<rect x="54" y="330" width="14" height="18" fill="#12162B"/>' +
            '<rect x="404" y="290" width="14" height="18" fill="#12162B"/>' +
            '<rect x="446" y="290" width="14" height="18" fill="#F2B84B" opacity=".5"/>' +
            '<rect x="404" y="350" width="14" height="18" fill="#F2B84B" opacity=".3"/>' +
            '<rect x="446" y="410" width="14" height="18" fill="#12162B"/>' +

            /* the hotel */
            '<rect x="110" y="150" width="260" height="410" fill="#232850"/>' +
            '<rect x="100" y="138" width="280" height="16" rx="3" fill="#2B3160"/>' +
            '<rect x="100" y="150" width="280" height="3" fill="#F2B84B" opacity=".6"/>' +

            /* the sign */
            '<rect x="138" y="168" width="204" height="56" rx="8" fill="#12162B" stroke="#F2B84B" stroke-width="3"/>' +
            '<g class="e-sign-lit">' +
              '<text x="240" y="205" text-anchor="middle" textLength="176" lengthAdjust="spacingAndGlyphs" ' +
                'font-family="Fraunces, Georgia, serif" font-weight="700" font-size="24" fill="none" ' +
                'stroke="#F2B84B" stroke-width="7" stroke-linejoin="round" opacity=".3">HOTEL AKSHARA</text>' +
              '<text x="240" y="205" text-anchor="middle" textLength="176" lengthAdjust="spacingAndGlyphs" ' +
                'font-family="Fraunces, Georgia, serif" font-weight="700" font-size="24" fill="#F2B84B">HOTEL AKSHARA</text>' +
            '</g>' +

            /* windows */
            '<g stroke="#2B3160" stroke-width="3">' +
              '<rect x="134" y="240" width="52" height="46" rx="3" fill="#F2B84B" fill-opacity=".8"/>' +
              '<rect x="214" y="240" width="52" height="46" rx="3" fill="#12162B"/>' +
              '<rect x="294" y="240" width="52" height="46" rx="3" fill="#F2B84B" fill-opacity=".8"/>' +
              '<rect x="134" y="302" width="52" height="46" rx="3" fill="#12162B"/>' +
              '<rect x="214" y="302" width="52" height="46" rx="3" fill="#F2B84B" fill-opacity=".8"/>' +
              '<rect x="294" y="302" width="52" height="46" rx="3" fill="#12162B"/>' +
            '</g>' +
            '<path stroke="#2B3160" stroke-width="2" d="M160 240v46M134 263h52M240 240v46M214 263h52M320 240v46M294 263h52' +
              'M160 302v46M134 325h52M240 302v46M214 325h52M320 302v46M294 325h52"/>' +

            /* lanterns */
            '<circle cx="168" cy="404" r="16" fill="#F2B84B" opacity=".22"/>' +
            '<circle cx="168" cy="404" r="6" fill="#FFE3A0"/>' +
            '<circle cx="312" cy="404" r="16" fill="#F2B84B" opacity=".22"/>' +
            '<circle cx="312" cy="404" r="6" fill="#FFE3A0"/>' +

            /* doorway: warm light, a tiny fox behind the desk, then the two door leaves */
            '<path d="M184 560V430a56 56 0 0 1 112 0V560Z" fill="#F2B84B"/>' +
            '<g clip-path="url(#e-clip)">' +
              '<path id="e-opening" d="M194 560V430a46 46 0 0 1 92 0V560Z" fill="url(#e-glow)"/>' +
              '<ellipse cx="240" cy="508" rx="17" ry="14" fill="#3A2233"/>' +
              '<path d="M226 500L229 478L238 494ZM254 500L251 478L242 494Z" fill="#3A2233"/>' +
              '<path d="M224 506a16 16 0 0 1 32 0" fill="none" stroke="#F4E9D3" stroke-width="2.5" stroke-linecap="round"/>' +
              '<circle cx="223" cy="510" r="4.5" fill="#F4E9D3"/>' +
              '<circle cx="257" cy="510" r="4.5" fill="#F4E9D3"/>' +
              '<rect x="204" y="522" width="72" height="38" fill="#5A3446"/>' +
              '<rect x="198" y="518" width="84" height="8" rx="2" fill="#8A4B70"/>' +
            '</g>' +
            '<g class="e-leaf" id="e-leaf-l">' +
              '<path d="M194 560V430a46 46 0 0 1 46-46V560Z" fill="#2B3160"/>' +
              '<path d="M202 552V432a38 38 0 0 1 30-37V552Z" fill="none" stroke="#232850" stroke-width="4"/>' +
              '<circle cx="232" cy="486" r="3.5" fill="#F2B84B"/>' +
            '</g>' +
            '<g class="e-leaf" id="e-leaf-r">' +
              '<path d="M240 384a46 46 0 0 1 46 46V560H240Z" fill="#2B3160"/>' +
              '<path d="M248 395a38 38 0 0 1 30 37V552H248Z" fill="none" stroke="#232850" stroke-width="4"/>' +
              '<circle cx="248" cy="486" r="3.5" fill="#F2B84B"/>' +
            '</g>' +

            /* the plaque and the bell */
            '<rect x="308" y="418" width="70" height="36" rx="4" fill="#F4E9D3"/>' +
            '<text x="343" y="433" text-anchor="middle" font-family="Caveat, \'Comic Sans MS\', cursive" font-size="14" fill="#12162B">' + l1 + '</text>' +
            '<text x="343" y="448" text-anchor="middle" font-family="Caveat, \'Comic Sans MS\', cursive" font-size="14" fill="#12162B">' + l2 + '</text>' +
            '<rect x="322" y="508" width="46" height="52" rx="3" fill="#3A2233"/>' +
            '<rect x="316" y="500" width="58" height="10" rx="3" fill="#5A3446"/>' +
            '<g id="e-bell-dome">' +
              '<path d="M327 500a18 18 0 0 1 36 0Z" fill="#F2B84B"/>' +
              '<rect x="325" y="498" width="40" height="4" rx="2" fill="#F2B84B"/>' +
              '<path d="M333 494a11 11 0 0 1 6-8" fill="none" stroke="#FFE3A0" stroke-width="2" stroke-linecap="round"/>' +
              '<rect x="343" y="480" width="4" height="4" fill="#F2B84B"/>' +
              '<circle class="e-btn" cx="345" cy="477" r="4.5" fill="#B3263E"/>' +
            '</g>' +
            '<path class="e-ding" d="M312 490q-8 -10 0 -20M306 496q-14 -16 0 -32"/>' +
            '<path class="e-ding" d="M378 490q8 -10 0 -20M384 496q14 -16 0 -32"/>' +
            '<rect id="e-bell-target" x="318" y="472" width="54" height="40" fill="none"/>' +
          '</svg>' +
        '</div>' +
        '<div class="entrance-ground"></div>' +
      '</div>' +

      '<button type="button" class="entrance-bell entrance-ui" id="e-bell" aria-label="' + esc(t.bellLabel) + '"></button>' +
      '<p class="entrance-hint entrance-ui" id="e-hint">' + esc(t.hint) + '<small>' + esc(t.hintSmall) + '</small></p>' +
      '<button type="button" class="entrance-skip entrance-ui" id="e-skip">' + esc(t.skip) + '</button>' +
      '<a class="entrance-staff entrance-ui" href="staff.html">' + esc(t.staff) + '</a>';
  }

  function create(opts) {
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var audio = opts.audio;
    var state = 'idle';
    var timers = [];

    var root = document.createElement('div');
    root.className = 'entrance';
    root.setAttribute('role', 'region');
    root.setAttribute('aria-label', 'Hotel entrance');
    root.innerHTML = markup(opts.text);
    document.body.appendChild(root);

    var world = root.querySelector('#e-world');
    var svg = root.querySelector('#e-svg');
    var bellBtn = root.querySelector('#e-bell');
    var hint = root.querySelector('#e-hint');
    var skipBtn = root.querySelector('#e-skip');

    function later(fn, ms) { timers.push(setTimeout(fn, ms)); }

    /* put the real <button> exactly over the drawn bell, and the hint under the building */
    function place() {
      var r = root.querySelector('#e-bell-target').getBoundingClientRect();
      var size = Math.max(60, r.width * 1.15);
      var cx = r.left + r.width / 2;
      var cy = r.top + r.height / 2;
      bellBtn.style.width = size + 'px';
      bellBtn.style.height = size + 'px';
      bellBtn.style.left = (cx - size / 2) + 'px';
      bellBtn.style.top = (cy - size / 2) + 'px';

      var hw = hint.offsetWidth / 2;
      var hx = Math.min(Math.max(cx, hw + 10), window.innerWidth - hw - 10);
      hint.style.left = hx + 'px';
      hint.style.top = (svg.getBoundingClientRect().bottom + 12) + 'px';
    }

    /* aim the camera at the doorway */
    function aim() {
      var r = root.querySelector('#e-opening').getBoundingClientRect();
      var cx = r.left + r.width / 2;
      var cy = r.top + r.height * 0.55;
      var z = Math.max(window.innerWidth / r.width, window.innerHeight / r.height) * 1.25;
      world.style.transformOrigin = cx + 'px ' + cy + 'px';
      root.style.setProperty('--zoom', z.toFixed(2));
    }

    function fade() { root.classList.add('is-fading'); }

    function finish() {
      if (state === 'done') return;
      state = 'done';
      teardown();
      if (opts.onEnter) opts.onEnter();
    }

    function ring() {
      if (state !== 'idle') return;
      state = 'ringing';
      root.classList.add('is-ringing');
      try { if (audio) audio.bell(); } catch (e) { /* sound is optional */ }

      if (reduce) {
        later(function () { root.classList.add('is-opening'); }, 150);
        later(fade, 600);
        later(finish, 1250);
        return;
      }
      aim();
      later(function () { root.classList.add('is-opening'); }, 550);
      later(function () { root.classList.add('is-zooming'); }, 1250);
      later(fade, 2350);
      later(finish, 3000);
    }

    function skip() {
      if (state === 'done' || state === 'skipping') return;
      state = 'skipping';
      timers.forEach(clearTimeout);
      timers = [];
      fade();
      later(function () { state = 'ringing'; finish(); }, 650);
    }

    /* ----- input ----- */
    function onKey(e) {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.key === 'Escape') { skip(); return; }
      var tg = e.target;
      if (tg && tg.closest && tg.closest('.entrance-skip, .entrance-staff')) return;
      var arrowish = /^(Enter|Arrow|Page)/.test(e.key) || e.key === ' ';
      if (arrowish || e.key.length === 1) {
        if (arrowish) e.preventDefault();
        ring();
      }
    }
    var startY = null;
    function onTouchStart(e) { startY = e.touches.length === 1 ? e.touches[0].clientY : null; }
    function onTouchEnd(e) {
      if (startY === null) return;
      var dy = startY - e.changedTouches[0].clientY;
      startY = null;
      if (dy > 40) ring();
    }

    bellBtn.addEventListener('click', ring);
    skipBtn.addEventListener('click', skip);
    document.addEventListener('keydown', onKey);
    root.addEventListener('touchstart', onTouchStart, { passive: true });
    root.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('resize', place);

    function teardown() {
      timers.forEach(clearTimeout);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', place);
      if (root.parentNode) root.parentNode.removeChild(root);
    }

    place();
    requestAnimationFrame(place);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(place);
    try { bellBtn.focus({ preventScroll: true }); } catch (e) { /* ignore */ }

    return { ring: ring, skip: skip };
  }

  window.HotelEntrance = { shouldShow: shouldShow, create: create };
})();
