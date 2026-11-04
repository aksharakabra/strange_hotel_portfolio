/* Hover tips (cluster 13): hover or focus a floor button to see what is on that floor.
   On touch screens a tap shows the tip for a moment as you travel. Text comes from each
   floor's `tip` in js/content.js. Screen readers get it through the button's label. */
(function () {
  'use strict';

  var Hotel = window.Hotel;
  if (!Hotel || !Hotel.content) return;
  var floors = Hotel.content.floors;
  function setup() {

  var tip = document.createElement('div');
  tip.className = 'tip';
  tip.setAttribute('role', 'presentation');
  tip.hidden = true;
  var strong = document.createElement('strong');
  var span = document.createElement('span');
  tip.appendChild(strong); tip.appendChild(span);
  document.body.appendChild(tip);

  var hideTimer = null;
  function show(btn, title, text) {
    clearTimeout(hideTimer);
    strong.textContent = title;
    span.textContent = text || '';
    tip.hidden = false;
    var r = btn.getBoundingClientRect();
    var w = tip.offsetWidth, h = tip.offsetHeight;
    var left = r.left - w - 12;
    if (left < 8) left = Math.min(window.innerWidth - w - 8, r.right + 12);
    var top = Math.max(8, Math.min(window.innerHeight - h - 8, r.top + r.height / 2 - h / 2));
    tip.style.left = left + 'px';
    tip.style.top = top + 'px';
  }
  function hide() { tip.hidden = true; }

  function attach(btn, title, text) {
    btn.addEventListener('mouseenter', function () { show(btn, title, text); });
    btn.addEventListener('mouseleave', hide);
    btn.addEventListener('focus', function () {
      if (btn.matches(':focus-visible')) show(btn, title, text);
    });
    btn.addEventListener('blur', hide);
    btn.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'touch') { show(btn, title, text); hideTimer = setTimeout(hide, 1800); }
    });
    btn.addEventListener('click', function () { if (document.activeElement !== btn) hide(); });
  }

  Array.prototype.forEach.call(document.querySelectorAll('.fbtn'), function (btn, i) {
    var f = floors[i];
    if (!f) return;
    var label = 'Floor ' + f.label + ': ' + f.name;
    attach(btn, label, f.tip || '');
    btn.setAttribute('aria-label', 'Go to ' + f.name + (f.tip ? ', ' + f.tip : ''));
  });
  var sound = document.getElementById('sound');
  if (sound) attach(sound, 'Sound', 'Switch the hotel’s sounds on or off');
  var staff = document.querySelector('.staff');
  if (staff) attach(staff, 'Staff entrance', 'A plain, quick page: CV and links');

  document.addEventListener('hotel:depart', function () { setTimeout(hide, 300); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') hide(); });
  }
  /* the elevator buttons are built when the page is ready: wait for them */
  if (document.querySelector('.fbtn')) setup();
  else document.addEventListener('DOMContentLoaded', setup);
})();
