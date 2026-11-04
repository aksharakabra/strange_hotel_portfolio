/* The elevator: moves between floors by button, keyboard, wheel and swipe.
   It also fires two events that later clusters (fox, sound) can listen to:
     document 'hotel:depart'  detail: { from, to, duration }
     document 'hotel:arrive'  detail: { floor, index, from }            */
(function () {
  'use strict';

  function createElevator(cfg) {
    var floors = cfg.floors;
    var shaft = cfg.shaft;
    var stage = cfg.stage;
    var buttonsEl = cfg.buttonsEl;
    var displayEl = cfg.displayEl;
    var arrowEl = cfg.arrowEl;
    var announcer = cfg.announcer;

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    var sections = Array.prototype.slice.call(shaft.children);
    var buttons = [];
    var moving = false;
    var lockUntil = 0;

    var startIndex = floors.findIndex(function (f) { return f.id === cfg.startId; });
    var current = startIndex >= 0 ? startIndex : 0;

    /* ----- buttons ----- */
    floors.forEach(function (f, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'fbtn';
      b.textContent = f.label;
      b.setAttribute('aria-label', 'Go to ' + f.name);
      b.addEventListener('click', function () { goTo(i); });
      buttonsEl.appendChild(b);
      buttons.push(b);
    });

    /* ----- state ----- */
    function setState() {
      sections.forEach(function (s, i) {
        if (i === current) {
          s.removeAttribute('inert');
          s.removeAttribute('aria-hidden');
        } else {
          s.setAttribute('inert', '');
          s.setAttribute('aria-hidden', 'true');
        }
      });
      buttons.forEach(function (b, i) {
        if (i === current) b.setAttribute('aria-current', 'true');
        else b.removeAttribute('aria-current');
        b.classList.remove('is-target');
      });
      displayEl.textContent = floors[current].label;
      arrowEl.className = 'arrow';
    }

    function finish(from, i) {
      var f = floors[i];
      try { history.replaceState(null, '', '#' + f.id); } catch (e) { /* file:// in some browsers */ }
      displayEl.classList.remove('is-ding'); void displayEl.offsetWidth; displayEl.classList.add('is-ding');
      announcer.textContent = '';
      setTimeout(function () { announcer.textContent = f.name + '. ' + f.sign + '.'; }, 50);
      document.dispatchEvent(new CustomEvent('hotel:arrive', {
        detail: { floor: f, index: i, from: floors[from] }
      }));
    }

    /* ----- movement ----- */
    function goTo(i, opts) {
      opts = opts || {};
      i = Math.max(0, Math.min(floors.length - 1, i));
      if (i === current || moving) return false;

      var from = current;
      var dist = Math.abs(i - from);

      if (opts.instant || reduceMotion.matches) {
        current = i;
        shaft.style.transition = 'none';
        shaft.style.setProperty('--idx', i);
        setState();
        finish(from, i);
        return true;
      }

      moving = true;
      stage.classList.add('is-moving');
      var dur = Math.min(520 + dist * 240, 1700);
      arrowEl.className = 'arrow ' + (i < from ? 'up' : 'down');
      buttons[i].classList.add('is-target');

      document.dispatchEvent(new CustomEvent('hotel:depart', {
        detail: { from: floors[from], to: floors[i], duration: dur }
      }));

      shaft.style.transition = 'transform ' + dur + 'ms cubic-bezier(.65, 0, .25, 1)';
      void shaft.offsetHeight; // make the browser register the transition first
      shaft.style.setProperty('--idx', i);

      /* the display counts through the floors we pass */
      var dir = i > from ? 1 : -1;
      for (var s = 1; s <= dist; s++) {
        (function (step) {
          setTimeout(function () {
            displayEl.textContent = floors[from + dir * step].label;
          }, dur * (step / dist) * 0.88);
        })(s);
      }

      setTimeout(function () {
        current = i;
        moving = false;
        stage.classList.remove('is-moving');
        lockUntil = performance.now() + 420;
        setState();
        finish(from, i);
      }, dur + 30);

      return true;
    }

    function step(d) { return goTo(current + d); }
    function goToId(id, opts) {
      var i = floors.findIndex(function (f) { return f.id === id; });
      return i >= 0 ? goTo(i, opts) : false;
    }

    /* ----- keyboard ----- */
    document.addEventListener('keydown', function (e) {
      if (document.body.classList.contains('is-entering')) return; // the entrance owns the keys
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      var t = e.target;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;

      var k = e.key;
      var handled = true;
      if (k === 'ArrowUp' || k === 'PageUp') step(-1);
      else if (k === 'ArrowDown' || k === 'PageDown') step(1);
      else if (k === 'Home') goTo(0);
      else if (k === 'End') goTo(floors.length - 1);
      else if (k.length === 1) {
        var hit = floors.findIndex(function (f) { return f.label.toLowerCase() === k.toLowerCase(); });
        if (hit >= 0) goTo(hit); else handled = false;
      } else handled = false;
      if (handled) e.preventDefault();
    });

    /* ----- mouse wheel / trackpad ----- */
    var wheelAcc = 0;
    var innerUntil = 0;   // time until which a wheel at a panel's edge is still the same scroll gesture
    var wheelTimer = null;
    stage.addEventListener('wheel', function (e) {
      if (e.ctrlKey) return; // pinch-zoom
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return; // sideways scroll (e.g. the Workshop rail)
      /* a floor can opt out with data-scrollable (for long reading panels later) */
      var scroller = e.target.closest && e.target.closest('[data-scrollable]');
      if (scroller && scroller.scrollHeight > scroller.clientHeight + 1) {
        var atTop = scroller.scrollTop <= 0;
        var atBottom = scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 1;
        if ((e.deltaY < 0 && !atTop) || (e.deltaY > 0 && !atBottom)) {
          innerUntil = performance.now() + 700;   // the panel is scrolling: leave the wheel alone
          return;
        }
        if (performance.now() < innerUntil) {     // still the same flick (trackpad inertia): do not change floor
          e.preventDefault();
          innerUntil = performance.now() + 350;
          wheelAcc = 0;
          return;
        }
      }
      e.preventDefault();
      if (moving || performance.now() < lockUntil) return;
      wheelAcc += e.deltaY;
      clearTimeout(wheelTimer);
      wheelTimer = setTimeout(function () { wheelAcc = 0; }, 160);
      if (Math.abs(wheelAcc) >= 90) {
        step(wheelAcc > 0 ? 1 : -1);
        wheelAcc = 0;
      }
    }, { passive: false });

    /* ----- touch swipe (swipe up = next floor down, like scrolling) ----- */
    var startY = null;
    var startX = null;
    var ignoreSwipe = false;
    stage.addEventListener('touchstart', function (e) {
      if (e.touches.length !== 1) { startY = null; return; }
      startY = e.touches[0].clientY;
      startX = e.touches[0].clientX;
      /* a swipe that starts on a scrolling panel scrolls the panel, never the elevator */
      var sc = e.target.closest && e.target.closest('[data-scrollable]');
      ignoreSwipe = !!(sc && sc.scrollHeight > sc.clientHeight + 1);
    }, { passive: true });
    stage.addEventListener('touchend', function (e) {
      if (startY === null) return;
      var dy = startY - e.changedTouches[0].clientY;
      var dx = startX - e.changedTouches[0].clientX;
      startY = null;
      if (ignoreSwipe) { ignoreSwipe = false; return; }
      if (Math.abs(dy) > 64 && Math.abs(dy) > Math.abs(dx) * 1.6) step(dy > 0 ? 1 : -1);
    }, { passive: true });

    /* ----- address bar: index.html#workshop ----- */
    window.addEventListener('hashchange', function () {
      var id = location.hash.slice(1);
      var i = floors.findIndex(function (f) { return f.id === id; });
      if (i >= 0 && i !== current && !moving) goTo(i);
    });

    /* ----- start ----- */
    shaft.style.transition = 'none';
    shaft.style.setProperty('--idx', current);
    setState();

    return {
      goTo: goTo,
      goToId: goToId,
      step: step,
      current: function () { return floors[current]; },
      isMoving: function () { return moving; }
    };
  }

  window.createElevator = createElevator;
})();
