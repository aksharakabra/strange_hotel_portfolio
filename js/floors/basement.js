/* The Basement (cluster 11): "the part of me that isn't on the resume".
   Pull the light string, then open the cardboard boxes. Boxes come from `basement.boxes`
   in js/content.js: { label, text, placeholder }. */
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

  Hotel.register('basement', function (section, floor, content) {
    var B = content.basement || {};
    var boxes = B.boxes || [];

    var room = el('div', 'bs');
    room.appendChild(el('p', 'kicker', floor.kicker));
    var h = el('h2', 'floor-name', floor.name);
    h.id = 'title-' + floor.id;
    room.appendChild(h);
    room.appendChild(el('p', 'tagline', B.tagline || floor.tagline));

    var scene = el('div', 'bs-scene');
    var lamp = el('button', 'bs-lamp');
    lamp.type = 'button';
    lamp.setAttribute('aria-pressed', 'false');
    lamp.setAttribute('aria-label', B.pull || 'Pull the light string');
    lamp.innerHTML = '<span class="bs-cord" aria-hidden="true"></span><span class="bs-bulb" aria-hidden="true"></span><span class="bs-pull" aria-hidden="true"></span>';
    scene.appendChild(lamp);

    var grid = el('ul', 'bs-boxes');
    var items = [];
    boxes.forEach(function (b, i) {
      var li = el('li', 'bs-slot');
      var btn = el('button', 'bs-box');
      btn.type = 'button';
      btn.setAttribute('aria-pressed', 'false');
      btn.style.setProperty('--tilt', (((i * 7) % 5) - 2) * 0.9 + 'deg');
      btn.innerHTML = '<span class="bs-lid" aria-hidden="true"></span><span class="bs-label"></span>';
      btn.querySelector('.bs-label').textContent = b.label;
      li.appendChild(btn); grid.appendChild(li);
      var it = { btn: btn, b: b };
      btn.addEventListener('click', function () { pick(it); });
      items.push(it);
    });
    scene.appendChild(grid);
    room.appendChild(scene);

    var note = el('div', 'bs-note');
    note.setAttribute('aria-live', 'polite');
    var nt = el('h3', 'bs-note-t', B.hint || '');
    var nx = el('p', 'bs-note-x');
    var ph = el('span', 'bs-ph', 'Placeholder'); ph.hidden = true;
    note.appendChild(nt); note.appendChild(nx); note.appendChild(ph);
    room.appendChild(note);
    section.appendChild(room);

    var lit = false, keyed = false;
    function setLit(on) {
      lit = on;
      section.classList.toggle('is-lit', on);
      lamp.setAttribute('aria-pressed', String(on));
    }
    lamp.addEventListener('click', function () { setLit(!lit); });
    function pick(it) {
      if (!lit) setLit(true);
      items.forEach(function (o) {
        var on = o === it && o.btn.getAttribute('aria-pressed') !== 'true';
        o.btn.setAttribute('aria-pressed', String(on));
        o.btn.classList.toggle('is-open', on);
      });
      var open = it.btn.classList.contains('is-open');
      nt.textContent = open ? it.b.label : (B.hint || '');
      nx.textContent = open ? it.b.text : '';
      ph.hidden = !(open && it.b.placeholder);
      if (open && !keyed && Hotel.keys && !Hotel.keys.has('basement')) {
        keyed = true;
        Hotel.keys.add({ id: 'basement', label: B.keyLabel || 'Basement key', color: floor.accent });
      }
    }
    document.addEventListener('hotel:depart', function () { setLit(false); });
  });
})();
