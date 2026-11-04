/* Boots the hotel: builds the floors, starts the elevator, wires the sound toggle.

   HOW LATER CLUSTERS PLUG IN
   Each floor gets its own file in js/floors/, for example js/floors/lobby.js:
       Hotel.register('lobby', function (section, floor, content) {
         // build this floor's scene inside `section`
       });
   Add a <script> tag for it in index.html, below app.js. Floors without
   a file keep the placeholder door. */
(function () {
  'use strict';

  var content = window.HOTEL;
  var builders = {};

  var Hotel = {
    content: content,
    elevator: null,
    register: function (id, fn) { builders[id] = fn; },
    floorEl: function (id) { return document.getElementById('floor-' + id); },
    audio: window.HotelAudio || null,
    entrance: null,
    sound: null
  };
  window.Hotel = Hotel;

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;
    return n;
  }

  function buildPlaceholder(f) {
    var room = el('div', 'room');
    room.appendChild(el('p', 'kicker', f.kicker));
    var h = el('h2', 'floor-name', f.name);
    h.id = 'title-' + f.id;
    room.appendChild(h);
    room.appendChild(el('p', 'tagline', f.tagline));

    var door = el('div', 'door-prop');
    var plate = el('span', 'plate', f.label);
    plate.setAttribute('aria-hidden', 'true');
    door.appendChild(plate);
    door.appendChild(el('p', 'sign', f.sign));
    room.appendChild(door);
    return room;
  }

  function buildFloors(shaft) {
    content.floors.forEach(function (f) {
      var sec = el('section', 'floor');
      sec.id = 'floor-' + f.id;
      sec.dataset.floor = f.id;
      sec.style.setProperty('--accent', f.accent);
      sec.setAttribute('aria-labelledby', 'title-' + f.id);

      if (builders[f.id]) builders[f.id](sec, f, content);
      else sec.appendChild(buildPlaceholder(f));

      shaft.appendChild(sec);
    });
  }

  /* Sound is OFF by default. This stores the choice and announces it; js/sound.js plays the sounds. */
  function setupSound() {
    var btn = document.getElementById('sound');
    var label = document.getElementById('sound-state');
    var KEY = 'hotel.sound';
    var on = false;
    try { on = localStorage.getItem(KEY) === 'on'; } catch (e) { /* storage blocked */ }

    function apply(value, announce) {
      on = value;
      btn.setAttribute('aria-pressed', String(on));
      label.textContent = on ? 'on' : 'off';
      try { localStorage.setItem(KEY, on ? 'on' : 'off'); } catch (e) { /* ignore */ }
      if (announce) document.dispatchEvent(new CustomEvent('hotel:sound', { detail: { on: on } }));
    }

    btn.addEventListener('click', function () { apply(!on, true); });
    apply(on, false);

    Hotel.sound = { isOn: function () { return on; }, set: function (v) { apply(!!v, true); } };
  }

  /* First visit: the night street and the bell. The hotel waits underneath. */
  function setupEntrance() {
    var E = window.HotelEntrance;
    if (!E || !E.shouldShow(content)) return;

    var hotelEl = document.querySelector('.hotel');
    document.body.classList.add('is-entering');
    hotelEl.setAttribute('inert', '');

    Hotel.entrance = E.create({
      text: content.entrance,
      audio: Hotel.audio,
      onEnter: function () {
        document.body.classList.remove('is-entering');
        hotelEl.removeAttribute('inert');
        document.getElementById('announcer').textContent = content.entrance.welcome;
        var here = document.querySelector('.fbtn[aria-current="true"]');
        if (here) here.focus({ preventScroll: true });
        document.dispatchEvent(new CustomEvent('hotel:enter')); // cluster 3: the fox looks up
      }
    });
  }

  function hideLoader() {
    var loader = document.getElementById('loader');
    setTimeout(function () { loader.classList.add('is-done'); }, 700);
  }

  function boot() {
    var shaft = document.getElementById('shaft');
    buildFloors(shaft);

    var hashId = location.hash.slice(1);
    var known = content.floors.some(function (f) { return f.id === hashId; });

    Hotel.elevator = window.createElevator({
      floors: content.floors,
      shaft: shaft,
      stage: document.getElementById('stage'),
      buttonsEl: document.getElementById('buttons'),
      displayEl: document.getElementById('display'),
      arrowEl: document.getElementById('arrow'),
      announcer: document.getElementById('announcer'),
      startId: known ? hashId : content.startFloor
    });

    setupSound();
    setupEntrance();
    hideLoader();
  }

  document.addEventListener('DOMContentLoaded', boot);
})();
