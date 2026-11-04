/* The Archive (cluster 9): a library of notes, and shelves saved for future research papers.
   - Pull a spine off the shelf to read a card about it (title, date, tags, summary, link).
   - Empty "ghost" spines hold the place of papers that are not written yet.
   Notes come from `archive.notes`; papers come from `staff.research` (empty for now).
   Words and placeholders live under `archive` in js/content.js. */
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
  function safe(url) {
    url = String(url || '').trim();
    return /^(javascript|data|vbscript):/i.test(url) ? '' : url;
  }
  var COLORS = ['#B3263E', '#2B6F77', '#C98B2B', '#5B4B8A', '#3C7A4E', '#9C4A2F', '#2F5D8A'];
  function short(t) { t = String(t || ''); return t.length > 11 ? t.slice(0, 10) + '…' : t; }

  Hotel.register('archive', function (section, floor, content) {
    var A = content.archive || {};
    var notes = A.notes || [];
    var papers = (content.staff || {}).research || [];
    var ghosts = papers.length ? [] : (A.ghosts || []);
    var status = A.status || {};

    var room = el('div', 'ar');
    room.appendChild(el('p', 'kicker', floor.kicker));
    var h = el('h2', 'floor-name', floor.name);
    h.id = 'title-' + floor.id;
    room.appendChild(h);
    room.appendChild(el('p', 'tagline', A.tagline || floor.tagline));

    var cabinet = el('div', 'ar-cabinet');
    var all = [];

    function shelf(title, mood, books, ghostList) {
      var s = el('section', 'ar-shelf');
      var hh = el('h3', 'ar-shelf-h', title);
      if (mood) hh.appendChild(el('span', 'ar-mood', mood));
      s.appendChild(hh);
      var row = el('ul', 'ar-row');
      books.forEach(function (b) {
        var n = all.length;
        var li = el('li', 'ar-slot');
        var btn = el('button', 'ar-book');
        btn.type = 'button';
        btn.setAttribute('aria-pressed', 'false');
        btn.setAttribute('aria-label', b.title + (b.date ? ', ' + b.date : ''));
        btn.style.setProperty('--c', COLORS[n % COLORS.length]);
        btn.style.setProperty('--h', (112 + (n * 17) % 34) + 'px');
        btn.appendChild(el('span', 'ar-spine', short(b.title)));
        li.appendChild(btn); row.appendChild(li);
        var item = { btn: btn, book: b, ghost: false };
        btn.addEventListener('click', function () { pull(item); });
        all.push(item);
      });
      ghostList.forEach(function (g) {
        var li = el('li', 'ar-slot');
        var btn = el('button', 'ar-book is-ghost');
        btn.type = 'button';
        btn.setAttribute('aria-pressed', 'false');
        btn.setAttribute('aria-label', g + ': ' + (A.ghostTitle || 'Not written yet'));
        btn.style.setProperty('--h', '124px');
        btn.appendChild(el('span', 'ar-spine', g));
        li.appendChild(btn); row.appendChild(li);
        var item = { btn: btn, book: { title: g }, ghost: true };
        btn.addEventListener('click', function () { pull(item); });
        all.push(item);
      });
      if (!books.length && !ghostList.length) row.appendChild(el('li', 'ar-none', 'Empty shelf'));
      s.appendChild(row);
      cabinet.appendChild(s);
    }

    shelf(A.notesShelf || 'Notes', A.notesMood, notes, []);
    shelf(A.papersShelf || 'Research papers', A.papersMood,
      papers.map(function (r) { return { title: r.title, date: r.date || '', status: 'written', tags: r.tags || [], summary: r.description || '', url: r.url, placeholder: r.placeholder }; }),
      ghosts);
    room.appendChild(cabinet);

    /* ---- the card ---- */
    var card = el('div', 'ar-card');
    card.setAttribute('aria-live', 'polite');
    var cTitle = el('h3', 'ar-card-title', A.hint || 'Pull a book off the shelf.');
    var cMeta = el('p', 'ar-card-meta');
    var cText = el('p', 'ar-card-text', A.how || '');
    var cTags = el('ul', 'ar-tags');
    var cLink = el('p', 'ar-card-link');
    var ph = el('span', 'ar-ph', 'Placeholder'); ph.hidden = true;
    [cTitle, cMeta, cText, cTags, cLink, ph].forEach(function (n) { card.appendChild(n); });
    room.appendChild(card);
    section.appendChild(room);

    var keyed = false;
    function pull(it) {
      all.forEach(function (o) {
        var on = o === it;
        o.btn.setAttribute('aria-pressed', String(on));
        o.btn.classList.toggle('is-out', on);
      });
      var b = it.book;
      cTags.textContent = ''; cLink.textContent = ''; cMeta.textContent = ''; cText.textContent = '';
      if (it.ghost) {
        cTitle.textContent = b.title + ': ' + (A.ghostTitle || 'Not written yet');
        cText.textContent = A.ghostText || '';
        ph.hidden = true;
      } else {
        cTitle.textContent = b.title;
        cMeta.textContent = [b.date, status[b.status] || ''].filter(Boolean).join(' · ');
        cText.textContent = b.summary || '';
        (b.tags || []).forEach(function (t) { cTags.appendChild(el('li', null, t)); });
        var url = safe(b.url);
        if (url) {
          var a = el('a', null, A.read || 'Read it');
          a.href = url;
          if (/^https?:/i.test(url)) {
            a.target = '_blank'; a.rel = 'noopener noreferrer';
            a.appendChild(el('span', 'sr-only', ' (opens in a new tab)'));
          }
          cLink.appendChild(a);
        } else {
          cLink.appendChild(el('span', 'ar-nolink', A.noLink || 'Link coming soon'));
        }
        ph.hidden = !b.placeholder;
        if (!keyed && Hotel.keys && !Hotel.keys.has('archive')) {
          keyed = true;
          Hotel.keys.add({ id: 'archive', label: A.keyLabel || 'Archive key', color: floor.accent });
        }
      }
      card.classList.remove('is-pop'); void card.offsetWidth; card.classList.add('is-pop');
    }
  });
})();
