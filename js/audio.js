/* Sound, generated in the browser. There are no audio files to download.
   Browsers only allow sound after a tap or key press, so the context is
   created lazily the first time something asks to play.
   Cluster 10 added the rest: click, thunk (switches), pop, page flip, elevator whirr and chime,
   key jingle. Only the BELL always plays (it answers an explicit tap). Every other sound
   plays only when the visitor has switched sound on (the toggle in the elevator panel). */
(function () {
  'use strict';

  var ac = null;

  function ctx() {
    if (!ac) {
      var C = window.AudioContext || window.webkitAudioContext;
      if (!C) return null;
      try { ac = new C(); } catch (e) { return null; }
    }
    if (ac.state === 'suspended' && ac.resume) ac.resume();
    return ac;
  }

  /* a small brass bell is a few inharmonic partials that fade at different speeds:
     [frequency ratio, loudness, seconds to fade] */
  var PARTIALS = [[1, 0.5, 2.6], [2.32, 0.3, 1.6], [4.17, 0.18, 1.0], [6.43, 0.1, 0.55]];

  function strike(c, out, when, f0, vol) {
    PARTIALS.forEach(function (p) {
      var o = c.createOscillator();
      var g = c.createGain();
      o.type = 'sine';
      o.frequency.value = f0 * p[0];
      g.gain.setValueAtTime(0.0001, when);
      g.gain.exponentialRampToValueAtTime(vol * p[1], when + 0.004);
      g.gain.exponentialRampToValueAtTime(0.0001, when + p[2]);
      o.connect(g);
      g.connect(out);
      o.start(when);
      o.stop(when + p[2] + 0.05);
    });

    /* the tiny metallic "tick" of the hammer */
    var len = Math.floor(c.sampleRate * 0.02);
    var buf = c.createBuffer(1, len, c.sampleRate);
    var data = buf.getChannelData(0);
    for (var i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
    var n = c.createBufferSource();
    n.buffer = buf;
    var hp = c.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 3000;
    var ng = c.createGain();
    ng.gain.value = vol * 0.35;
    n.connect(hp);
    hp.connect(ng);
    ng.connect(out);
    n.start(when);
  }

  /* ding-ding, like a desk bell tapped twice */
  function bell() {
    var c = ctx();
    if (!c) return;
    var out = c.createGain();
    out.gain.value = 0.55;
    out.connect(c.destination);
    var t = c.currentTime + 0.02;
    strike(c, out, t, 1480, 1);
    strike(c, out, t + 0.21, 1480, 0.6);
  }

  /* ---------- the optional, gated sounds ---------- */
  var enabled = false;
  var master = null;

  function out(c) {
    if (!master) {
      master = c.createGain();
      master.gain.value = 0.5;
      master.connect(c.destination);
    }
    return master;
  }
  function tone(c, o, when, f, dur, vol, type, fEnd) {
    var osc = c.createOscillator();
    var g = c.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(f, when);
    if (fEnd) osc.frequency.exponentialRampToValueAtTime(fEnd, when + dur);
    g.gain.setValueAtTime(0.0001, when);
    g.gain.exponentialRampToValueAtTime(vol, when + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
    osc.connect(g); g.connect(o);
    osc.start(when); osc.stop(when + dur + 0.03);
  }
  function noise(c, o, when, dur, vol, type, freq, q) {
    var len = Math.max(1, Math.floor(c.sampleRate * dur));
    var buf = c.createBuffer(1, len, c.sampleRate);
    var d = buf.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    var src = c.createBufferSource();
    src.buffer = buf;
    var f = c.createBiquadFilter();
    f.type = type; f.frequency.value = freq; if (q) f.Q.value = q;
    var g = c.createGain();
    g.gain.value = vol;
    src.connect(f); f.connect(g); g.connect(o);
    src.start(when);
  }
  function play(fn) {
    if (!enabled) return;
    var c = ctx();
    if (!c) return;
    try { fn(c, out(c), c.currentTime + 0.01); } catch (e) { /* sound is optional */ }
  }

  var PENTA = [523.25, 587.33, 659.25, 783.99, 880, 987.77, 1174.66, 1318.51];

  var api = {
    bell: bell,
    unlock: ctx,
    isEnabled: function () { return enabled; },
    setEnabled: function (v) {
      enabled = !!v;
      if (enabled) api.click();
      else if (ac && ac.state === 'running' && master) master.gain.cancelScheduledValues(0);
    },
    click: function () { play(function (c, o, t) { tone(c, o, t, 1500, 0.04, 0.25, 'square', 900); noise(c, o, t, 0.02, 0.12, 'highpass', 3500); }); },
    thunk: function () { play(function (c, o, t) { tone(c, o, t, 190, 0.14, 0.7, 'sine', 70); noise(c, o, t, 0.03, 0.2, 'lowpass', 1500); }); },
    pop: function () { play(function (c, o, t) { tone(c, o, t, 320, 0.1, 0.5, 'sine', 980); noise(c, o, t + 0.07, 0.05, 0.1, 'highpass', 5000); }); },
    flip: function () { play(function (c, o, t) { noise(c, o, t, 0.16, 0.5, 'bandpass', 2600, 0.8); }); },
    jingle: function () {
      play(function (c, o, t) {
        [1568, 2093, 2637].forEach(function (f, i) { tone(c, o, t + i * 0.07, f, 0.5, 0.22, 'sine'); tone(c, o, t + i * 0.07, f * 2.76, 0.18, 0.06, 'sine'); });
      });
    },
    /* the elevator: a soft whirr while it travels (ms), then a ding that rises with the floor */
    whirr: function (ms) {
      play(function (c, o, t) {
        var dur = Math.max(0.4, (ms || 800) / 1000);
        var osc = c.createOscillator(), g = c.createGain(), f = c.createBiquadFilter();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(52, t);
        osc.frequency.linearRampToValueAtTime(74, t + dur * 0.5);
        osc.frequency.linearRampToValueAtTime(48, t + dur);
        f.type = 'lowpass'; f.frequency.value = 260;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.linearRampToValueAtTime(0.16, t + dur * 0.3);
        g.gain.linearRampToValueAtTime(0.0001, t + dur);
        osc.connect(f); f.connect(g); g.connect(o);
        osc.start(t); osc.stop(t + dur + 0.05);
      });
    },
    chime: function (index) {
      play(function (c, o, t) {
        var f = PENTA[Math.max(0, Math.min(PENTA.length - 1, index | 0))];
        tone(c, o, t, f, 1.1, 0.3, 'sine');
        tone(c, o, t, f * 2.01, 0.5, 0.08, 'sine');
        tone(c, o, t + 0.16, f * 1.5, 1.0, 0.2, 'sine');
      });
    }
  };

  /* pause everything when the tab is hidden */
  document.addEventListener('visibilitychange', function () {
    if (!ac) return;
    if (document.hidden) { if (ac.suspend) ac.suspend(); }
    else if (ac.resume) ac.resume();
  });

  window.HotelAudio = api;
})();
