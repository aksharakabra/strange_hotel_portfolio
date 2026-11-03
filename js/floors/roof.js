/* The Roof (cluster 11): locked until graduation.
   - Rattle the padlock for a different line each time.
   - Collect the Master key (Trophy Room) and the lock opens for a peek: stars, a telescope,
     a shooting star to catch, and a letter to your future self.
   Words live under `roof` in js/content.js. */
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

  Hotel.register('roof', function (section, floor, content) {
    var R = content.roof || {};
    var room = el('div', 'rf');
    room.appendChild(el('p', 'kicker', floor.kicker));
    var h = el('h2', 'floor-name', floor.name);
    h.id = 'title-' + floor.id;
    room.appendChild(h);
    room.appendChild(el('p', 'tagline', R.tagline || floor.tagline));

    /* ---- locked door ---- */
    var door = el('div', 'rf-door');
    var lock = el('button', 'rf-lock');
    lock.type = 'button';
    lock.setAttribute('aria-label', 'Padlock on the roof door');
    lock.innerHTML = '<svg viewBox="0 0 60 76" aria-hidden="true" focusable="false"><path d="M16 34V22a14 14 0 0 1 28 0v12" fill="none" stroke="#D9C7A5" stroke-width="7" stroke-linecap="round"/><rect x="6" y="32" width="48" height="38" rx="8" fill="#F2B84B"/><circle cx="30" cy="48" r="5" fill="#12162B"/><rect x="28" y="50" width="4" height="10" rx="2" fill="#12162B"/></svg>';
    door.appendChild(lock);
    door.appendChild(el('p', 'rf-sign', R.lockedSign || floor.sign));
    if (R.opensOn) door.appendChild(el('p', 'rf-date', R.opensOn));
    var say = el('p', 'rf-say');
    say.setAttribute('aria-live', 'polite');
    door.appendChild(say);
    room.appendChild(door);

    /* ---- the peek (after the Master key) ---- */
    var peek = el('div', 'rf-peek');
    peek.hidden = true;
    peek.appendChild(el('h3', 'rf-peek-t', R.peekTitle || 'A peek at the roof'));
    var sky = el('div', 'rf-sky');
    var stars = '';
    for (var s = 0; s < 34; s++) {
      stars += '<i style="left:' + ((s * 53) % 100) + '%;top:' + ((s * 37) % 78) + '%;animation-delay:' + ((s % 7) * 0.4) + 's"></i>';
    }
    sky.innerHTML = '<span class="rf-moon" aria-hidden="true"></span>' + stars +
      '<svg class="rf-city" viewBox="0 0 300 60" preserveAspectRatio="none" aria-hidden="true"><path d="M0 60V38h20V26h18v12h14V18h16v20h18V30h22v10h16V22h20v18h18V32h24v8h20V24h18v36z" fill="#0B0E1E"/></svg>';
    var shoot = el('button', 'rf-shoot');
    shoot.type = 'button';
    shoot.setAttribute('aria-label', 'Catch the shooting star');
    sky.appendChild(shoot);
    peek.appendChild(sky);
    var letter = el('div', 'rf-letter');
    letter.appendChild(el('h4', null, R.letterTitle || 'Dear future me,'));
    (R.letter || []).forEach(function (t) { letter.appendChild(el('p', null, t)); });
    letter.appendChild(el('p', 'rf-sig', R.sign || ''));
    peek.appendChild(letter);
    var wish = el('p', 'rf-wish'); wish.setAttribute('aria-live', 'polite');
    peek.appendChild(wish);
    room.appendChild(peek);
    section.appendChild(room);

    var n = 0, open = false, keyed = false;
    function unlocked() { return Hotel.keys && Hotel.keys.has('master'); }
    function openPeek() {
      open = true;
      section.classList.add('is-open');
      lock.classList.add('is-open');
      say.textContent = R.unlock || 'Click.';
      peek.hidden = false;
      if (!keyed && Hotel.keys && !Hotel.keys.has('roof')) {
        keyed = true;
        Hotel.keys.add({ id: 'roof', label: R.keyLabel || 'Roof key', color: floor.accent });
      }
    }
    lock.addEventListener('click', function () {
      if (open) return;
      if (unlocked()) { openPeek(); return; }
      lock.classList.remove('is-rattle'); void lock.offsetWidth; lock.classList.add('is-rattle');
      var lines = R.rattle || ['Locked.'];
      say.textContent = (n >= 3 && lines.length > 0 && n % 4 === 3) ? (R.needKey || '') : lines[n % lines.length];
      n++;
    });
    shoot.addEventListener('click', function () {
      shoot.classList.remove('is-go'); void shoot.offsetWidth; shoot.classList.add('is-go');
      wish.textContent = R.star || 'Make a wish.';
    });
    document.addEventListener('hotel:key', function () { if (!open && unlocked()) say.textContent = R.keyReady || 'The Master key is on your ring. Try the lock.'; });
  });
})();
