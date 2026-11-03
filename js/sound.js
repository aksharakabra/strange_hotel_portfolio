/* Sound wiring (cluster 10): listens to what happens in the hotel and asks HotelAudio to play.
   All of these are silent unless sound is switched on (see the toggle in the elevator panel).
   Add a selector to ON_CLICK to give another button a sound. */
(function () {
  'use strict';

  var A = window.HotelAudio;
  var Hotel = window.Hotel;
  if (!A || !Hotel) return;

  document.addEventListener('hotel:sound', function (e) { A.setEnabled(!!(e.detail && e.detail.on)); });
  if (Hotel.sound && Hotel.sound.isOn()) A.setEnabled(true);   // remembered choice (no sound until first tap)

  document.addEventListener('hotel:depart', function (e) { A.whirr(e.detail && e.detail.duration); });
  document.addEventListener('hotel:arrive', function (e) {
    A.chime(e.detail && e.detail.index);
  });
  document.addEventListener('hotel:key', function () { A.jingle(); });

  /* [selector, which sound]. 'pop' and 'flip' are chosen below. */
  var ON_CLICK = [
    ['.fbtn', 'click'],
    ['.ws-switch, .ws-lever, .mb-toggle, .gl-lights', 'thunk'],
    ['.mb-bottle', 'bottle'],
    ['.ar-book, .gl-poster', 'flip'],
    ['.tr-key, .gl-btn, .ws-arrow, .lb-chip', 'click']
  ];
  document.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target : null;
    if (!t) return;
    for (var i = 0; i < ON_CLICK.length; i++) {
      var hit = t.closest(ON_CLICK[i][0]);
      if (!hit) continue;
      var kind = ON_CLICK[i][1];
      if (kind === 'bottle') kind = hit.getAttribute('aria-pressed') === 'true' ? 'pop' : 'click';
      A[kind]();
      return;
    }
  });
})();
