/* The Minibar (cluster 8): skills, chilled and ready to serve.
   - "Open the fridge": the door swings open and the light comes on.
   - Each skill is a bottle on a shelf (one shelf per group). Pop one to taste it.
   - Pour every bottle to empty the fridge. Skills come from `staff.skills` in js/content.js
     (shared with the Staff page): { group, mood, items: [...] }. Words live under `minibar`. */
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
  var COLORS = ['#7FD1B9', '#F2B84B', '#E8798A', '#9AA3E0', '#F5CF7A', '#B8E0A0', '#E8A15F'];
  var SHAPES = [
    /* bottle */ '<path d="M16 2h8v8c0 4 6 6 6 14v34c0 3-2 5-5 5H15c-3 0-5-2-5-5V24c0-8 6-10 6-14z"/><rect class="cap" x="15" y="0" width="10" height="5" rx="1.5"/>',
    /* can */ '<rect x="8" y="10" width="24" height="52" rx="4"/><rect class="cap" x="11" y="6" width="18" height="6" rx="2"/>',
    /* jar */ '<rect x="6" y="18" width="28" height="44" rx="7"/><rect class="cap" x="9" y="8" width="22" height="12" rx="3"/>'
  ];
  function bottleSvg(i, color) {
    return '<svg viewBox="0 0 40 68" aria-hidden="true" focusable="false"><g fill="' + color + '">' +
      SHAPES[i % SHAPES.length] +
      '<rect x="12" y="34" width="16" height="14" rx="2" fill="#F4E9D3" opacity=".85"/></g></svg>';
  }

  Hotel.register('minibar', function (section, floor, content) {
    var M = content.minibar || {};
    var groups = ((content.staff || {}).skills || []).filter(function (g) { return g && g.items && g.items.length; });

    var room = el('div', 'mb');
    room.appendChild(el('p', 'kicker', floor.kicker));
    var h = el('h2', 'floor-name', floor.name);
    h.id = 'title-' + floor.id;
    room.appendChild(h);
    room.appendChild(el('p', 'tagline', M.tagline || floor.tagline));

    /* ---- the fridge ---- */
    var fridge = el('div', 'mb-fridge');
    var inside = el('div', 'mb-inside');
    inside.id = 'mb-inside';
    inside.setAttribute('data-scrollable', '');
    var all = [];
    var total = 0;
    groups.forEach(function (g) { total += g.items.length; });

    groups.forEach(function (g, gi) {
      var shelf = el('section', 'mb-shelf');
      var head = el('h3', 'mb-shelf-h', g.group);
      if (g.mood) head.appendChild(el('span', 'mb-mood', g.mood));
      shelf.appendChild(head);
      var row = el('ul', 'mb-row');
      g.items.forEach(function (name, ii) {
        var n = all.length;
        var li = el('li', 'mb-slot');
        var b = el('button', 'mb-bottle');
        b.type = 'button';
        b.setAttribute('aria-pressed', 'false');
        b.dataset.name = name;
        var color = COLORS[n % COLORS.length];
        b.style.setProperty('--k', color);
        b.innerHTML = '<span class="mb-glass">' + bottleSvg(n, color) +
          '<span class="mb-fizz" aria-hidden="true"><i></i><i></i><i></i></span></span>' +
          '<span class="mb-name"></span>';
        b.querySelector('.mb-name').textContent = name;
        b.addEventListener('click', function () { pour(b); });
        li.appendChild(b);
        row.appendChild(li);
        all.push(b);
      });
      shelf.appendChild(row);
      inside.appendChild(shelf);
    });
    if (!groups.length) inside.appendChild(el('p', 'mb-empty', M.empty || 'The fridge is empty.'));

    var door = el('div', 'mb-door');
    door.setAttribute('aria-hidden', 'true');   // the Open button below is the accessible way in
    door.appendChild(el('span', 'mb-handle'));
    door.appendChild(el('span', 'mb-door-t', floor.label + ' · MINIBAR'));

    fridge.appendChild(inside);
    fridge.appendChild(door);
    var light = el('span', 'mb-light'); light.setAttribute('aria-hidden', 'true');
    fridge.appendChild(light);
    room.appendChild(fridge);

    var bar = el('div', 'mb-bar');
    var toggle = el('button', 'mb-toggle', M.open || 'Open the fridge');
    toggle.type = 'button';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', inside.id);
    bar.appendChild(toggle);
    var tab = el('p', 'mb-tab');
    tab.setAttribute('aria-live', 'polite');
    bar.appendChild(tab);
    room.appendChild(bar);
    section.appendChild(room);

    /* ---- behaviour ---- */
    var opened = false, poured = 0, keyed = false;
    function setOpen(on) {
      opened = on;
      fridge.classList.toggle('is-open', on);
      toggle.setAttribute('aria-expanded', String(on));
      toggle.textContent = on ? (M.close || 'Close the fridge') : (M.open || 'Open the fridge');
      inside.inert = !on;
      updateTab();
    }
    function updateTab() {
      if (!total) { tab.textContent = ''; return; }
      if (poured === total && total > 0) tab.textContent = M.all || 'Fridge emptied.';
      else if (poured > 0) tab.textContent = poured + ' / ' + total + ' ' + (M.poured || 'poured');
      else tab.textContent = opened ? (M.hint || '') : '';
    }
    function pour(b) {
      var on = b.getAttribute('aria-pressed') !== 'true';
      b.setAttribute('aria-pressed', String(on));
      b.classList.toggle('is-open', on);
      if (on) { b.classList.remove('is-pop'); void b.offsetWidth; b.classList.add('is-pop'); }
      poured = all.filter(function (x) { return x.classList.contains('is-open'); }).length;
      updateTab();
      if (poured === total) section.classList.add('is-empty'); else section.classList.remove('is-empty');
      if (on && !keyed && Hotel.keys && !Hotel.keys.has('minibar')) {
        keyed = true;
        Hotel.keys.add({ id: 'minibar', label: M.keyLabel || 'Minibar key', color: floor.accent });
      }
    }
    toggle.addEventListener('click', function () { setOpen(!opened); });
    /* the door itself: tap it, or slide it sideways, to open (the button stays for keyboards) */
    var dragX = null;
    door.addEventListener('pointerdown', function (e) { dragX = e.clientX; });
    door.addEventListener('pointermove', function (e) {
      if (dragX !== null && !opened && Math.abs(e.clientX - dragX) > 24) { dragX = null; setOpen(true); }
    });
    door.addEventListener('pointerup', function () { dragX = null; });
    door.addEventListener('click', function () { if (!opened) setOpen(true); });
    document.addEventListener('hotel:depart', function () { if (opened) setOpen(false); });
    setOpen(false);
  });
})();
