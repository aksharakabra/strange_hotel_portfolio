/* The lobby (cluster 3): Foxie at the front desk.
   - Foxie nods to her music, blinks, sips coffee, and talks in a speech bubble.
   - The window shows the visitor's real time of day.
   - The bell hands over a guest key (see js/keys.js) and offers a quick way to any floor.
   - Click Foxie, or the sleeping baby fox, for something to say.
   All of the words live in js/content.js under `lobby`. */
(function () {
  'use strict';

  var Hotel = window.Hotel;
  if (!Hotel) return;

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function period(h) {
    if (h >= 5 && h < 12) return 'morning';
    if (h >= 12 && h < 17) return 'afternoon';
    if (h >= 17 && h < 21) return 'evening';
    return 'night';
  }

  function pick(list) { return list[Math.floor(Math.random() * list.length)]; }

  function shuffled(list) {
    var a = list.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  /* ---------- the drawing (viewBox 640 x 520; everything is flat shapes) ---------- */
  function svgMarkup(L, clerk) {
    var banner = L.banner.map(function (t, i) {
      return '<text x="466" y="' + (88 + i * 18) + '">' + esc(t) + '</text>';
    }).join('');

    var bookColors = ['#3A4285', '#2F7D74', '#8A4B70', '#C9A27A', '#B3263E'];
    var bookText = ['#F4E9D3', '#F4E9D3', '#F4E9D3', '#12162B', '#F4E9D3'];
    var bookX = [133, 136, 131, 134, 130];
    var bookW = [70, 66, 72, 70, 74];
    var books = L.books.slice(0, 5).map(function (t, i) {
      var y = 241 + i * 15;
      return '<rect x="' + bookX[i] + '" y="' + y + '" width="' + bookW[i] + '" height="15" rx="1.5" fill="' + bookColors[i] + '"/>' +
        '<text x="' + (bookX[i] + bookW[i] / 2) + '" y="' + (y + 10.4) + '" text-anchor="middle" font-family="DM Mono, monospace" font-size="8.5" font-weight="500" fill="' + bookText[i] + '">' + esc(t) + '</text>';
    }).join('');

    return `
<svg class="lb-svg" viewBox="0 0 640 520" preserveAspectRatio="xMidYMax meet" role="group"
     aria-label="The hotel lobby. ${esc(clerk)} the fox sits at the front desk in white headphones and a navy hoodie, with a coffee mug, a laptop, a stack of books and a brass bell.">
<defs>
  <linearGradient id="lb-sky" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" style="stop-color:var(--sky-a)"/><stop offset="1" style="stop-color:var(--sky-b)"/>
  </linearGradient>
  <clipPath id="lb-win"><path d="M156 214V130a40 40 0 0 1 80 0V214Z"/></clipPath>
  <pattern id="lb-chk" width="40" height="40" patternUnits="userSpaceOnUse">
    <rect width="40" height="40" fill="#1B2040"/><rect width="20" height="20" fill="#232850"/><rect x="20" y="20" width="20" height="20" fill="#232850"/>
  </pattern>
  <radialGradient id="lb-warm" cx="50%" cy="50%" r="50%">
    <stop offset="0" stop-color="#F2B84B" stop-opacity=".28"/><stop offset="1" stop-color="#F2B84B" stop-opacity="0"/>
  </radialGradient>
</defs>

<!-- room -->
<rect x="-3000" y="-3000" width="6640" height="3400" fill="#1B2040"/>
<rect x="-3000" y="296" width="6640" height="104" fill="#161B38"/>
<rect x="-3000" y="294" width="6640" height="5" fill="#F2B84B" opacity=".5"/>
<rect x="-3000" y="400" width="6640" height="3200" fill="url(#lb-chk)"/>
<rect x="-3000" y="398" width="6640" height="6" fill="#F2B84B" opacity=".3"/>
<ellipse cx="320" cy="250" rx="260" ry="190" fill="url(#lb-warm)"/>

<!-- window: shows the visitor's time of day, with Mt. Fuji for the dream -->
<path d="M148 222V130a48 48 0 0 1 96 0V222Z" fill="#F2B84B"/>
<g clip-path="url(#lb-win)">
  <rect x="150" y="70" width="92" height="150" fill="url(#lb-sky)"/>
  <g style="opacity:var(--stars)" fill="#F4E9D3">
    <circle cx="172" cy="104" r="1.6"/><circle cx="204" cy="94" r="1.3"/><circle cx="222" cy="124" r="1.6"/>
    <circle cx="182" cy="136" r="1.2"/><circle cx="214" cy="150" r="1.2"/>
  </g>
  <circle cx="214" cy="112" r="9" fill="#F4E9D3" style="opacity:var(--moon)"/>
  <circle cx="196" cy="150" r="11" fill="#FFE3A0" style="opacity:var(--sun);transform:translateY(var(--sun-y))"/>
  <path d="M156 214L196 160L236 214Z" style="fill:var(--fuji)"/>
  <path d="M187 172L196 160L205 172L199 169L196 173L193 169Z" fill="#F4E9D3"/>
</g>
<path d="M196 90V214M156 160H236" stroke="#F2B84B" stroke-width="3"/>
<rect x="138" y="214" width="116" height="9" rx="3" fill="#F2B84B"/>

<!-- wall clock: shows the visitor's real time (tap it) -->
<g class="hit" data-act="clock" role="button" tabindex="0" aria-label="Wall clock">
  <rect class="focus-ring" x="170" y="22" width="52" height="52" rx="10"/>
  <rect x="170" y="22" width="52" height="52" fill="transparent"/>
  <circle cx="196" cy="48" r="19" fill="#F4E9D3" stroke="#F2B84B" stroke-width="3.5"/>
  <g stroke="#12162B" stroke-width="1.6" stroke-linecap="round"><path d="M196 32.5v3M196 60.5v3M180.5 48h3M208.5 48h3"/></g>
  <line class="lb-hand-h" x1="196" y1="48" x2="196" y2="40" stroke="#12162B" stroke-width="2.8" stroke-linecap="round"/>
  <line class="lb-hand-m" x1="196" y1="48" x2="196" y2="35" stroke="#B3263E" stroke-width="1.8" stroke-linecap="round"/>
  <circle cx="196" cy="48" r="2.2" fill="#12162B"/>
</g>

<!-- the to-do board (tap it: the front desk's list) -->
<g class="hit" data-act="board" role="button" tabindex="0" aria-label="${esc((L.board && L.board.aria) || 'Read the to-do list on the wall')}">
  <rect class="focus-ring" x="16" y="80" width="108" height="134" rx="10"/>
  <rect x="16" y="80" width="108" height="134" fill="transparent"/>
  <rect x="26" y="92" width="88" height="116" rx="6" fill="#C9A27A"/>
  <rect x="33" y="108" width="74" height="93" rx="2" fill="#F4E9D3"/>
  <rect x="54" y="86" width="32" height="14" rx="4" fill="#B3263E"/><rect x="62" y="82" width="16" height="8" rx="3" fill="#F2B84B"/>
  <text x="70" y="123" text-anchor="middle" font-family="Caveat, cursive" font-size="15" font-weight="500" fill="#12162B">TO DO</text>
  <g fill="none" stroke="#12162B" stroke-width="1.2">
    <rect x="39" y="132" width="7" height="7"/><rect x="39" y="148" width="7" height="7"/><rect x="39" y="164" width="7" height="7"/><rect x="39" y="180" width="7" height="7"/>
  </g>
  <g fill="#12162B" opacity=".55">
    <rect x="51" y="134" width="46" height="2.4" rx="1"/><rect x="51" y="150" width="38" height="2.4" rx="1"/><rect x="51" y="166" width="50" height="2.4" rx="1"/><rect x="51" y="182" width="32" height="2.4" rx="1"/>
  </g>
  <path d="M40 135l2 2.4l4.5-6M40 151l2 2.4l4.5-6" fill="none" stroke="#B3263E" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
</g>

<!-- hanging banner -->
<path d="M442 62L466 34L490 62" fill="none" stroke="#D9C7A5" stroke-width="2"/>
<circle cx="466" cy="34" r="3" fill="#F2B84B"/>
<rect x="424" y="60" width="84" height="7" rx="3.5" fill="#F2B84B"/>
<rect x="432" y="67" width="68" height="132" fill="#F4E9D3"/>
<rect x="426" y="197" width="80" height="7" rx="3.5" fill="#F2B84B"/>
<g font-family="DM Mono, monospace" font-size="10.5" font-weight="500" letter-spacing="1" fill="#12162B" text-anchor="middle">${banner}</g>
<path d="M456 192L466 174L476 192Z" fill="#3A4285"/><circle cx="478" cy="180" r="3.4" fill="#E58BAA"/>

<!-- pendant lamp (tap it: it flickers and swings) -->
<g class="hit" data-act="lamp" role="button" tabindex="0" aria-label="Flick the lamp">
  <rect class="focus-ring" x="538" y="60" width="60" height="86" rx="10"/>
  <rect x="538" y="60" width="60" height="86" fill="transparent"/>
  <g class="lb-lamp">
    <path d="M568 -3000V78" stroke="#F2B84B" stroke-width="2"/>
    <path d="M548 98a20 20 0 0 1 40 0Z" fill="#F2B84B"/>
    <circle class="lb-bulb" cx="568" cy="100" r="5" fill="#FFE3A0"/>
    <polygon class="lb-cone" points="556,100 580,100 616,230 520,230" fill="#F2B84B" opacity=".08"/>
  </g>
</g>

<!-- plants -->
<g id="lb-plant">
  <path d="M44 394H88L83 430H49Z" fill="#8A1B2E"/><rect x="40" y="388" width="52" height="9" rx="3" fill="#B3263E"/>
  <path d="M66 390C40 362 32 330 46 304C62 330 70 362 66 390Z" fill="#7FD1B9"/>
  <path d="M66 390C90 360 108 346 118 322C98 326 76 350 66 390Z" fill="#7FD1B9"/>
  <path d="M66 390C60 354 62 322 72 298C82 326 76 360 66 390Z" fill="#4FA88F"/>
</g>
<g transform="translate(656 0) scale(-1 1)">
  <path d="M44 394H88L83 430H49Z" fill="#8A1B2E"/><rect x="40" y="388" width="52" height="9" rx="3" fill="#B3263E"/>
  <path d="M66 390C40 362 32 330 46 304C62 330 70 362 66 390Z" fill="#7FD1B9"/>
  <path d="M66 390C90 360 108 346 118 322C98 326 76 350 66 390Z" fill="#7FD1B9"/>
  <path d="M66 390C60 354 62 322 72 298C82 326 76 360 66 390Z" fill="#4FA88F"/>
</g>

<!-- carpet -->
<polygon points="240,436 400,436 440,520 200,520" fill="#B3263E"/>
<line x1="240" y1="436" x2="200" y2="520" stroke="#F2B84B" stroke-width="4"/>
<line x1="400" y1="436" x2="440" y2="520" stroke="#F2B84B" stroke-width="4"/>

<!-- Foxie: tail, then hoodie, then head -->
<g class="fx-tail">
  <path d="M372 318C436 316 452 256 420 222C412 250 398 272 370 286Z" fill="#EF9A45"/>
  <ellipse cx="424" cy="237" rx="9" ry="16" transform="rotate(18 424 237)" fill="#FFF1DC"/>
</g>
<path d="M252 332C250 290 270 264 320 260C370 264 390 290 388 332Z" fill="#3A4285"/>
<ellipse cx="320" cy="262" rx="52" ry="16" fill="#2B3160"/>
<path d="M268 280L300 300M372 280L340 300" stroke="#343B7A" stroke-width="28" stroke-linecap="round"/>
<path d="M352 280L344 275V285ZM352 280L360 275V285Z" fill="#F4E9D3"/><circle cx="352" cy="280" r="2.2" fill="#F4E9D3"/>

<g class="fx-head">
  <path d="M270 206C268 146 372 146 370 206" fill="none" stroke="#F4E9D3" stroke-width="7" stroke-linecap="round"/>
  <g class="fx-ear-l">
    <path d="M280 196L270 138L318 172Z" fill="#EF9A45"/><path d="M284 190L278 156L306 176Z" fill="#FFF1DC"/><path d="M270 138L271 150L281 144Z" fill="#7A3B1D"/>
  </g>
  <g class="fx-ear-r">
    <path d="M360 196L370 138L322 172Z" fill="#EF9A45"/><path d="M356 190L362 156L334 176Z" fill="#FFF1DC"/><path d="M370 138L369 150L359 144Z" fill="#7A3B1D"/>
  </g>
  <ellipse cx="320" cy="214" rx="47" ry="38" fill="#EF9A45"/>
  <path d="M276 222C280 250 360 250 364 222C350 238 290 238 276 222Z" fill="#FFF1DC"/>
  <ellipse cx="320" cy="233" rx="22" ry="15" fill="#FFF1DC"/>
  <circle cx="290" cy="226" r="6" fill="#F28B9B" opacity=".5"/><circle cx="350" cy="226" r="6" fill="#F28B9B" opacity=".5"/>
  <path d="M315 226h10l-5 6Z" fill="#3A2233"/>
  <path d="M320 232v2M312 236q4 4 8 0q4 4 8 0" fill="none" stroke="#3A2233" stroke-width="1.8" stroke-linecap="round"/>
  <ellipse class="mouth-open" cx="320" cy="240" rx="5" ry="4" fill="#3A2233"/>
  <g class="eyes-open">
    <ellipse cx="302" cy="213" rx="4.5" ry="6" fill="#2A1B2E"/><ellipse cx="338" cy="213" rx="4.5" ry="6" fill="#2A1B2E"/>
    <circle cx="303.6" cy="210.4" r="1.6" fill="#fff"/><circle cx="339.6" cy="210.4" r="1.6" fill="#fff"/>
  </g>
  <g class="eyes-happy" fill="none" stroke="#2A1B2E" stroke-width="2.6" stroke-linecap="round">
    <path d="M296 216q6 -9 12 0"/><path d="M332 216q6 -9 12 0"/>
  </g>
  <circle cx="302" cy="213" r="16" fill="#F4E9D3" fill-opacity=".07" stroke="#2A1B2E" stroke-width="2"/>
  <circle cx="338" cy="213" r="16" fill="#F4E9D3" fill-opacity=".07" stroke="#2A1B2E" stroke-width="2"/>
  <path d="M318 211q2 -3 4 0" fill="none" stroke="#2A1B2E" stroke-width="2" stroke-linecap="round"/>
  <g fill="#E58BAA"><circle cx="296.6" cy="184" r="3.6"/><circle cx="293.4" cy="188.4" r="3.6"/><circle cx="288.2" cy="186.7" r="3.6"/><circle cx="288.2" cy="181.3" r="3.6"/><circle cx="293.4" cy="179.6" r="3.6"/></g>
  <circle cx="292" cy="184" r="2.2" fill="#FFE3A0"/>
  <circle cx="268" cy="214" r="16" fill="#F4E9D3"/><circle cx="268" cy="214" r="10" fill="#D9C7A5"/><circle cx="268" cy="214" r="5.5" fill="#EF9A45"/>
  <path d="M264 211l1-4 3 2ZM272 211l-1-4-3 2Z" fill="#EF9A45"/>
  <circle cx="372" cy="214" r="16" fill="#F4E9D3"/><circle cx="372" cy="214" r="10" fill="#D9C7A5"/>
</g>

<!-- desk -->
<rect x="112" y="334" width="416" height="96" fill="#3A2233"/>
<rect x="100" y="316" width="440" height="18" rx="4" fill="#5A3446"/>
<g fill="#5A3446" opacity=".5"><rect x="140" y="344" width="4" height="78"/><rect x="168" y="344" width="4" height="78"/><rect x="468" y="344" width="4" height="78"/><rect x="496" y="344" width="4" height="78"/></g>
<rect x="260" y="352" width="120" height="32" rx="4" fill="#F2B84B"/>
<text x="320" y="367" text-anchor="middle" font-family="DM Mono, monospace" font-size="12" font-weight="500" letter-spacing="2" fill="#12162B">${esc(clerk.toUpperCase())}</text>
<text x="320" y="378" text-anchor="middle" font-family="DM Mono, monospace" font-size="7.5" letter-spacing="1.5" fill="#12162B">FRONT DESK</text>

<!-- on the desk: books, laptop, mug, bell, the sleeping little one -->
${books}

<rect x="408" y="312" width="84" height="5" rx="2" fill="#2A2E40"/>
<rect x="412" y="262" width="76" height="52" rx="5" fill="#3A3F55"/>
<text x="432" y="288" text-anchor="middle" font-family="DM Mono, monospace" font-size="14" font-weight="500" fill="#9AA3C0">&lt;/&gt;</text>
<circle cx="468" cy="276" r="8" fill="#12162B"/><path d="M461 272L463 266L468 270ZM475 272L473 266L468 270Z" fill="#12162B"/>
<circle cx="465" cy="276" r="1.2" fill="#F4E9D3"/><circle cx="471" cy="276" r="1.2" fill="#F4E9D3"/>
<path d="M440 308L452 290L464 308Z" fill="#3A4285"/><path d="M448 298L452 290L456 298Z" fill="#F4E9D3"/><circle cx="468" cy="300" r="3.6" fill="#E58BAA"/>

<g class="fx-mug">
  <rect x="306" y="288" width="28" height="28" rx="7" fill="#FFF1DC"/>
  <path d="M334 296a7 7 0 0 1 0 12" fill="none" stroke="#FFF1DC" stroke-width="3.5" stroke-linecap="round"/>
  <rect x="306" y="288" width="28" height="6" rx="3" fill="#A9692F"/>
  <circle cx="314" cy="302" r="1.7" fill="#3A2233"/><circle cx="326" cy="302" r="1.7" fill="#3A2233"/>
  <path d="M317.5 306.5q2.5 2.5 5 0" fill="none" stroke="#3A2233" stroke-width="1.5" stroke-linecap="round"/>
  <ellipse cx="311" cy="306" rx="3" ry="2" fill="#F28B9B" opacity=".6"/><ellipse cx="329" cy="306" rx="3" ry="2" fill="#F28B9B" opacity=".6"/>
  <ellipse cx="303" cy="302" rx="8" ry="7" fill="#FFF1DC"/><ellipse cx="337" cy="302" rx="8" ry="7" fill="#FFF1DC"/>
  <path class="steam" d="M314 284q-4 -6 0 -11q4 -5 0 -10"/><path class="steam s2" d="M326 284q-4 -6 0 -11q4 -5 0 -10"/>
</g>

<!-- things to click -->
<g class="hit" data-act="bell" role="button" tabindex="0" aria-label="Ring the bell">
  <rect class="focus-ring" x="212" y="250" width="52" height="68" rx="8"/>
  <rect x="212" y="250" width="52" height="68" fill="transparent"/>
  <circle class="lb-ping" cx="238" cy="302" r="22"/>
  <g id="lb-bell-dome">
    <path d="M222 316a16 16 0 0 1 32 0Z" fill="#F2B84B"/>
    <rect x="220" y="314" width="36" height="4" rx="2" fill="#F2B84B"/>
    <path d="M227 309a10 10 0 0 1 5-7" fill="none" stroke="#FFE3A0" stroke-width="2" stroke-linecap="round"/>
    <rect x="236" y="296" width="4" height="4" fill="#F2B84B"/>
    <circle class="lb-btn" cx="238" cy="293" r="4.5" fill="#B3263E"/>
  </g>
  <path class="lb-ding" d="M208 306q-7 -9 0 -18M202 312q-12 -14 0 -28"/><path class="lb-ding" d="M268 306q7 -9 0 -18M274 312q12 -14 0 -28"/>
  <text class="lb-ringme" x="238" y="270" text-anchor="middle">${esc(L.ringMe)}</text>
</g>

<g class="hit" data-act="baby" role="button" tabindex="0" aria-label="The sleeping baby fox">
  <rect class="focus-ring" x="492" y="276" width="48" height="42" rx="8"/>
  <rect x="492" y="276" width="48" height="42" fill="transparent"/>
  <ellipse cx="518" cy="308" rx="19" ry="9" fill="#EF9A45"/>
  <path d="M534 306q8 -2 6 6q-6 4 -14 2Z" fill="#FFF1DC"/>
  <circle cx="503" cy="305" r="7.5" fill="#EF9A45"/>
  <path d="M498 300L497 292L503 297ZM508 299L511 291L512 298Z" fill="#EF9A45"/>
  <path d="M500 305q2 2 4 0" fill="none" stroke="#3A2233" stroke-width="1.4" stroke-linecap="round"/>
  <text class="zzz" x="510" y="290">z</text><text class="zzz z2" x="520" y="282">z</text>
</g>

<g class="hit" data-act="foxie" role="button" tabindex="0" aria-label="Talk to ${esc(clerk)}">
  <rect class="focus-ring" x="268" y="130" width="104" height="184" rx="12"/>
  <rect x="268" y="130" width="104" height="184" fill="transparent"/>
</g>
<rect id="lb-anchor" x="318" y="130" width="4" height="4" fill="none"/>
</svg>`;
  }

  /* ---------- the floor ---------- */
  Hotel.register('lobby', function (section, floor, content) {
    var L = content.lobby;
    var clerk = (content.clerk && content.clerk.name) || 'Foxie';
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

    section.classList.add('lobby');
    section.innerHTML =
      '<h2 class="sr-only" id="title-lobby">' + esc(floor.name) + '</h2>' +
      '<div class="lb-scene">' + svgMarkup(L, clerk) + '</div>' +
      '<div class="lb-bubble" role="group" aria-label="' + esc(clerk) + ' says">' +
        '<span class="lb-name">' + esc(clerk) + '</span>' +
        '<p class="lb-say"><span class="lb-typed"></span><span class="lb-rest" aria-hidden="true"></span></p>' +
        '<div class="lb-chips" hidden></div>' +
      '</div>';

    function $(s) { return section.querySelector(s); }
    var svg = $('.lb-svg');
    var bubble = $('.lb-bubble');
    var typed = $('.lb-typed');
    var rest = $('.lb-rest');
    var chipsEl = $('.lb-chips');
    var anchor = $('#lb-anchor');
    var announcer = document.getElementById('announcer');

    var typer = null, hideT = null, seqT = null, sipT = null;
    var token = 0, greeted = false, rings = 0, idleN = 0;
    var flagT = {};
    var idle = shuffled(L.idle);

    function isHere() { return !!(Hotel.elevator && Hotel.elevator.current().id === floor.id); }

    /* the window follows the visitor's clock, smoothly: colours are blended between these hours
       [hour, sky top, sky bottom, stars, moon, sun, sun height, mountain] */
    var NIGHT = [[10, 13, 30], [27, 32, 64]];
    var STOPS = [
      [0,    NIGHT[0], NIGHT[1], 1, 1, 0, 60, [18, 22, 43]],
      [5,    NIGHT[0], NIGHT[1], 1, 1, 0, 60, [18, 22, 43]],
      [6.5,  [75, 92, 168], [247, 181, 138], .2, 0, 1, 34, [43, 49, 96]],
      [9,    [106, 139, 200], [249, 217, 168], 0, 0, 1, 0, [58, 66, 133]],
      [13,   [127, 178, 217], [214, 234, 240], 0, 0, 1, -30, [58, 66, 133]],
      [16.5, [127, 178, 217], [214, 234, 240], 0, 0, 1, -12, [58, 66, 133]],
      [18.5, [59, 31, 74], [232, 80, 58], .45, 0, 1, 42, [36, 19, 53]],
      [20,   [29, 21, 54], [90, 42, 85], .8, .5, 0, 60, [24, 16, 41]],
      [21.5, NIGHT[0], NIGHT[1], 1, 1, 0, 60, [18, 22, 43]],
      [24,   NIGHT[0], NIGHT[1], 1, 1, 0, 60, [18, 22, 43]]
    ];
    function mix(a, b, t) {
      if (typeof a === 'number') return a + (b - a) * t;
      return a.map(function (v, i) { return v + (b[i] - v) * t; });
    }
    function rgb(c) { return 'rgb(' + c.map(Math.round).join(',') + ')'; }
    function skyAt(h) {
      var i = 0;
      while (i < STOPS.length - 2 && h >= STOPS[i + 1][0]) i++;
      var a = STOPS[i], b = STOPS[i + 1];
      var t = Math.max(0, Math.min(1, (h - a[0]) / (b[0] - a[0])));
      return [1, 2, 3, 4, 5, 6, 7].map(function (k) { return mix(a[k], b[k], t); });
    }
    function timeLabel(d) {
      try { return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }); }
      catch (e) { return d.getHours() + ':' + ('0' + d.getMinutes()).slice(-2); }
    }
    function applyTime() {
      var d = new Date();
      var h = d.getHours(), m = d.getMinutes();
      var p = period(h);
      ['morning', 'afternoon', 'evening', 'night'].forEach(function (n) {
        section.classList.toggle('t-' + n, n === p);
      });
      var k = skyAt(h + m / 60), st = section.style;
      st.setProperty('--sky-a', rgb(k[0]));
      st.setProperty('--sky-b', rgb(k[1]));
      st.setProperty('--stars', k[2].toFixed(2));
      st.setProperty('--moon', k[3].toFixed(2));
      st.setProperty('--sun', k[4].toFixed(2));
      st.setProperty('--sun-y', Math.round(k[5]) + 'px');
      st.setProperty('--fuji', rgb(k[6]));
      var hh = svg.querySelector('.lb-hand-h'), mm = svg.querySelector('.lb-hand-m');
      if (hh) hh.setAttribute('transform', 'rotate(' + (((h % 12) + m / 60) * 30).toFixed(1) + ' 196 48)');
      if (mm) mm.setAttribute('transform', 'rotate(' + (m * 6) + ' 196 48)');
      var ck = svg.querySelector('[data-act="clock"]');
      if (ck) ck.setAttribute('aria-label', 'Wall clock: ' + timeLabel(d));
      return p;
    }

    /* short-lived looks on the drawing: sip, perk, is-happy, ring */
    function flag(cls, ms) {
      svg.classList.add(cls);
      clearTimeout(flagT[cls]);
      flagT[cls] = setTimeout(function () { svg.classList.remove(cls); }, ms);
    }

    /* ----- speech bubble ----- */
    function position() {
      var s = section.getBoundingClientRect();
      var a = anchor.getBoundingClientRect();
      if (!s.width) return;
      var cx = a.left + a.width / 2 - s.left;
      /* sit just above Foxie's head, but never run off the top of the screen */
      var want = Math.max(8, s.bottom - a.top + 16);
      var room = s.height - bubble.offsetHeight - 8;
      bubble.style.bottom = Math.max(8, Math.min(want, room)) + 'px';
      var w = bubble.offsetWidth;
      var left = Math.max(10, Math.min(cx - w / 2, s.width - w - 10));
      bubble.style.left = left + 'px';
      bubble.style.setProperty('--tail', Math.max(20, Math.min(cx - left, w - 20)) + 'px');
    }

    function hide() {
      if (!chipsEl.hidden) return; // keep the menu on screen until a choice is made
      bubble.classList.remove('is-on');
    }

    function say(text, o) {
      o = o || {};
      clearInterval(typer);
      clearTimeout(hideT);
      bubble.classList.add('is-on');
      typed.textContent = '';
      rest.textContent = text;   // invisible, but it sizes the bubble before the typing starts
      position();
      if (announcer) announcer.textContent = text;
      svg.classList.add('talk');

      function finish() {
        svg.classList.remove('talk');
        typed.textContent = text;
        rest.textContent = '';
        if (!o.keep) hideT = setTimeout(hide, Math.max(4200, text.length * 60));
        if (o.done) o.done();
      }
      if (reduce.matches) { finish(); return; }

      var i = 0;
      typer = setInterval(function () {
        i++;
        typed.textContent = text.slice(0, i);
        rest.textContent = text.slice(i);
        if (i >= text.length) { clearInterval(typer); finish(); }
      }, 24);
    }

    /* say several lines in a row; starting a new run cancels the old one */
    function run(steps) {
      var my = ++token;
      clearTimeout(seqT);
      var i = 0;
      (function next() {
        if (my !== token || i >= steps.length) return;
        var st = steps[i++];
        if (st.before) st.before();
        say(st.text, {
          keep: i < steps.length || !!st.keep,
          done: function () {
            seqT = setTimeout(function () {
              if (my !== token) return;
              if (st.after) st.after();
              next();
            }, st.wait || 0);
          }
        });
      })();
    }

    function stopTalking() {
      token++;
      clearTimeout(seqT); clearInterval(typer); clearTimeout(hideT);
      chipsEl.hidden = true;
      bubble.classList.remove('has-chips');
      bubble.classList.remove('is-on');
      svg.classList.remove('talk');
    }

    /* ----- the menu Foxie offers after the bell ----- */
    function showChips() {
      chipsEl.innerHTML = '';
      L.chips.forEach(function (c) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'lb-chip';
        b.textContent = c.label;
        b.addEventListener('click', function () { choose(c); });
        chipsEl.appendChild(b);
      });
      chipsEl.hidden = false;
      bubble.classList.add('has-chips');
      position();
    }

    function choose(c) {
      chipsEl.hidden = true;
      bubble.classList.remove('has-chips');
      flag('is-happy', 1400);
      run([{
        text: c.say,
        wait: (c.floor || c.board) ? 900 : 0,
        after: function () {
          if (c.board) openBoard(null);
          else if (c.floor && Hotel.elevator) Hotel.elevator.goToId(c.floor);
        }
      }]);
    }

    /* ----- things Foxie does ----- */
    function ring() {
      rings++;
      try { if (Hotel.audio) Hotel.audio.bell(); } catch (e) { /* sound is optional */ }
      svg.classList.remove('ring');
      void svg.getBoundingClientRect(); // restart the wobble if it is rung twice quickly
      flag('ring', 950);
      flag('is-happy', 1800);
      svg.classList.add('rung');

      if (rings === 1) {
        if (Hotel.keys) Hotel.keys.add({ id: 'guest', label: 'Guest key', color: '#F2B84B' });
        run([{ text: L.firstRing, wait: 700 }, { text: L.ask, keep: true, after: showChips }]);
      } else {
        run([
          { text: L.moreRings[(rings - 2) % L.moreRings.length], wait: 500 },
          { text: L.askAgain, keep: true, after: showChips }
        ]);
      }
    }

    function talk() {
      flag('is-happy', 1300);
      flag('perk', 1200);
      run([{ text: idle[idleN++ % idle.length] }]);
    }

    /* ----- the to-do board: a funny list that is really a list of hints ----- */
    var B = L.board || { items: [] };
    var bdlg = document.createElement('dialog');
    bdlg.className = 'lb-dialog';
    bdlg.setAttribute('aria-labelledby', 'lb-board-title');
    bdlg.innerHTML =
      '<h3 id="lb-board-title" class="lb-d-title">' + esc(B.title || 'TO DO') + '</h3>' +
      (B.sub ? '<p class="lb-d-sub">' + esc(B.sub) + '</p>' : '') +
      '<ul class="lb-todo"></ul>' +
      (B.foot ? '<p class="lb-d-foot">' + esc(B.foot) + '</p>' : '') +
      '<div class="lb-d-bar"><button type="button" class="lb-d-close">' + esc(B.close || 'Close') + '</button></div>';
    document.body.appendChild(bdlg);
    var todoEl = bdlg.querySelector('.lb-todo');
    var boardOpener = null;
    function drawBoard() {
      todoEl.innerHTML = '';
      (B.items || []).forEach(function (it) {
        var done = !!it.done || !!(it.key && Hotel.keys && Hotel.keys.has(it.key));
        var li = document.createElement('li');
        li.className = 'lb-todo-item' + (done ? ' is-done' : '');
        li.innerHTML = '<span class="lb-box" aria-hidden="true"></span><span class="lb-todo-text">' + esc(it.text) + '</span>' +
          '<span class="sr-only">' + (done ? ' (done)' : ' (not done)') + '</span>';
        todoEl.appendChild(li);
      });
    }
    function openBoard(from) {
      if (typeof bdlg.showModal !== 'function') { run([{ text: (B.items && B.items[0] && B.items[0].text) || '' }]); return; }
      boardOpener = from || null;
      drawBoard();
      bdlg.showModal();
      bdlg.querySelector('.lb-d-close').focus();
    }
    bdlg.querySelector('.lb-d-close').addEventListener('click', function () { bdlg.close(); });
    bdlg.addEventListener('click', function (e) { if (e.target === bdlg) bdlg.close(); });
    bdlg.addEventListener('close', function () { if (boardOpener) { try { boardOpener.focus(); } catch (e) {} } });
    bdlg.addEventListener('keydown', function (e) { e.stopPropagation(); });   // keep the elevator's keys out
    document.addEventListener('hotel:depart', function () { if (bdlg.open) bdlg.close(); });

    function clockSay() {
      var p = period(new Date().getHours());
      var C = L.clock || {};
      var line = (C[p] || 'It is {time}.').replace('{time}', timeLabel(new Date()));
      flag('perk', 900);
      run([{ text: line }]);
    }

    function act(name, from) {
      if (name === 'bell') ring();
      else if (name === 'foxie') talk();
      else if (name === 'baby') { flag('perk', 900); run([{ text: L.baby }]); }
      else if (name === 'lamp') flick();
      else if (name === 'clock') clockSay();
      else if (name === 'board') openBoard(from);
    }

    /* tap the lamp: it flickers and swings; every third tap Foxie says something (lobby.lamp) */
    var lampTaps = 0;
    function flick() {
      svg.classList.remove('flicker');
      void svg.getBoundingClientRect();          // restart the animation on every tap
      flag('flicker', 1200);
      lampTaps++;
      var lines = L.lamp || [];
      if (lines.length && lampTaps % 3 === 0) {
        run([{ text: lines[(lampTaps / 3 - 1) % lines.length] }]);
      }
    }

    function greet(fromEntrance) {
      if (greeted) return;
      greeted = true;
      var p = applyTime();
      var steps = [];
      if (fromEntrance) {
        steps.push({
          text: L.arrival,
          before: function () { flag('perk', 1200); flag('sip', 2300); },
          wait: 1500
        });
      }
      steps.push({ text: L.greeting[p], before: function () { flag('is-happy', 1500); }, wait: 600 });
      steps.push({ text: L.intro });
      run(steps);
      scheduleSip();
    }

    /* now and then she takes a sip when nobody is asking for anything */
    function scheduleSip() {
      clearTimeout(sipT);
      sipT = setTimeout(function () {
        if (isHere() && !svg.classList.contains('talk')) flag('sip', 2400);
        scheduleSip();
      }, 11000 + Math.random() * 9000);
    }

    /* ----- input ----- */
    section.addEventListener('click', function (e) {
      var t = e.target.closest && e.target.closest('[data-act]');
      if (t) act(t.getAttribute('data-act'), t);
    });
    section.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      var t = e.target.closest && e.target.closest('[data-act]');
      if (!t) return;
      e.preventDefault();
      act(t.getAttribute('data-act'), t);
    });
    window.addEventListener('resize', function () { if (bubble.classList.contains('is-on')) position(); });

    /* ----- when to speak ----- */
    document.addEventListener('hotel:enter', function () {
      setTimeout(function () { if (isHere()) greet(true); }, 350);
    });
    document.addEventListener('hotel:arrive', function (e) {
      if (e.detail.floor.id !== floor.id) return;
      applyTime();
      if (!greeted) greet(false);
      else run([{ text: pick(L.back) }]);
    });
    document.addEventListener('hotel:depart', function (e) {
      if (e.detail.from.id === floor.id) stopTalking();
    });

    applyTime();
    setInterval(applyTime, 30000);   // the window and the clock keep up with real time
    /* returning visitors and ?skip: no entrance to wait for */
    setTimeout(function () {
      if (!greeted && !document.body.classList.contains('is-entering') && isHere()) greet(false);
    }, 1400);
  });
})();
