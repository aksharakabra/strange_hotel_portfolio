/* Builds the Staff entrance (staff.html) and the CV page (cv.html) from js/content.js.
   Nothing here needs editing: change your details in js/content.js instead.
   Anything marked `placeholder: true` there shows a small "Placeholder" tag and a dashed
   border, so you can see what still needs replacing. Delete the flag when it is real. */
(function () {
  'use strict';

  var H = window.HOTEL;
  var main = document.getElementById('main');
  if (!H || !main) return;

  var O = H.owner || {};
  var L = O.links || {};
  var S = H.staff || {};
  var name = O.name || 'Your name';

  /* ---------- small helpers ---------- */
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined && text !== null && text !== '') n.textContent = text;
    return n;
  }
  function safe(url) {            // never let a pasted link run code
    url = String(url || '').trim();
    return /^(javascript|data|vbscript):/i.test(url) ? '' : url;
  }
  function isWeb(u) { return /^https?:/i.test(u); }
  function mailto(v) {
    v = String(v || '').trim();
    return v ? (/^mailto:/i.test(v) ? v : 'mailto:' + v) : '';
  }
  function plainUrl(u) { return u.replace(/^https?:\/\/(www\.)?/i, '').replace(/\/$/, ''); }

  function link(href, text, cls) {
    var a = el('a', cls, text);
    a.href = href;
    if (isWeb(href)) {
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      var sr = el('span', 'sr-only', ' (opens in a new tab)');
      a.appendChild(sr);
    }
    return a;
  }
  function todo(text) {
    var s = el('span', 'btn btn-todo', text);
    s.title = 'Not added yet. Add it in js/content.js';
    return s;
  }
  function ph() { return el('span', 'ph', 'Placeholder'); }
  function mark(node, item) { if (item && item.placeholder) { node.classList.add('is-placeholder'); node.appendChild(ph()); } return node; }

  var navItems = [];
  function section(id, title) {
    var s = el('section', 'block');
    s.id = id;
    s.setAttribute('aria-labelledby', id + '-h');
    var h = el('h2', null, title);
    h.id = id + '-h';
    s.appendChild(h);
    navItems.push({ id: id, title: title });
    return s;
  }
  function chips(list) {
    var ul = el('ul', 'chips');
    (list || []).forEach(function (t) { ul.appendChild(el('li', null, t)); });
    return ul;
  }

  /* ---------- the little fox on the badge ---------- */
  function fox() {
    var d = el('div');
    d.innerHTML =
      '<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">' +
      '<rect width="64" height="64" fill="#2B3160"/>' +
      '<path d="M14 30L12 8L28 20Z" fill="#EF9A45"/><path d="M50 30L52 8L36 20Z" fill="#EF9A45"/>' +
      '<path d="M16 26L15 14L24 21Z" fill="#FFF1DC"/><path d="M48 26L49 14L40 21Z" fill="#FFF1DC"/>' +
      '<ellipse cx="32" cy="36" rx="19" ry="17" fill="#EF9A45"/>' +
      '<path d="M14 38C17 54 47 54 50 38C42 46 22 46 14 38Z" fill="#FFF1DC"/>' +
      '<ellipse cx="32" cy="44" rx="9" ry="7" fill="#FFF1DC"/>' +
      '<path d="M29 40h6l-3 3.5Z" fill="#3A2233"/>' +
      '<circle cx="24" cy="34" r="6.5" fill="none" stroke="#2A1B2E" stroke-width="1.6"/>' +
      '<circle cx="40" cy="34" r="6.5" fill="none" stroke="#2A1B2E" stroke-width="1.6"/>' +
      '<circle cx="24" cy="34" r="2.2" fill="#2A1B2E"/><circle cx="40" cy="34" r="2.2" fill="#2A1B2E"/>' +
      '<path d="M12 34C10 10 54 10 52 34" fill="none" stroke="#F4E9D3" stroke-width="3.5" stroke-linecap="round"/>' +
      '<circle cx="11" cy="36" r="6" fill="#F4E9D3"/><circle cx="53" cy="36" r="6" fill="#F4E9D3"/>' +
      '</svg>';
    return d.firstChild;
  }

  /* ---------- the top of the page ---------- */
  function hero() {
    var sec = el('section', 'hero');
    sec.setAttribute('aria-labelledby', 'name');

    var badge = el('div', 'badge');
    badge.appendChild(el('span', 'badge-slot'));
    badge.appendChild(el('p', 'badge-role', 'STAFF'));
    var pic = el('div', 'badge-photo');
    var photo = safe(S.photo);
    if (photo) {
      var img = el('img');
      img.src = photo;
      img.alt = 'Portrait of ' + name;
      pic.appendChild(img);
    } else {
      pic.appendChild(fox());
    }
    badge.appendChild(pic);
    badge.appendChild(el('p', 'badge-name', name));
    badge.appendChild(el('p', 'badge-note', S.badgeNote || 'Status: still checked in'));
    sec.appendChild(badge);

    var text = el('div', 'hero-text');
    text.appendChild(el('p', 'kicker', 'Portfolio'));
    var h1 = el('h1', null, name);
    h1.id = 'name';
    text.appendChild(h1);
    if (S.headline) text.appendChild(el('p', 'headline', S.headline));
    var meta = [O.studying, S.location].filter(Boolean).join(' · ');
    if (meta) text.appendChild(el('p', 'meta', meta));

    var actions = el('div', 'actions');
    var cv = S.cv || {};
    var pdf = safe(cv.pdf);
    actions.appendChild(link('cv.html', 'View CV', 'btn btn-primary'));
    if (pdf) {
      var dl = link(pdf, 'Download CV (PDF)', 'btn');
      dl.setAttribute('download', '');
      actions.appendChild(dl);
    } else {
      actions.appendChild(todo('Download CV: add file'));
    }
    var gh = safe(L.github), li = safe(L.linkedin), em = mailto(L.email);
    actions.appendChild(gh ? link(gh, 'GitHub', 'btn') : todo('GitHub: add link'));
    actions.appendChild(li ? link(li, 'LinkedIn', 'btn') : todo('LinkedIn: add link'));
    actions.appendChild(em ? link(em, 'Email', 'btn') : todo('Email: add address'));
    text.appendChild(actions);
    sec.appendChild(text);
    return sec;
  }

  /* ---------- sections ---------- */
  function about() {
    var a = S.about;
    if (!a || !a.text || !a.text.length) return null;
    var s = section('about', 'About');
    a.text.forEach(function (t) { s.appendChild(el('p', null, t)); });
    if (a.placeholder) s.appendChild(ph());
    return s;
  }

  function education() {
    var list = S.education || [];
    if (!list.length) return null;
    var s = section('education', 'Education');
    var ul = el('ul', 'timeline');
    list.forEach(function (e) {
      var item = el('li', 'timeline-item');
      item.appendChild(el('h3', null, e.degree));
      var line = [e.school, e.years].filter(Boolean).join(' · ');
      if (line) item.appendChild(el('p', 'muted', line));
      if (e.note) item.appendChild(el('p', null, e.note));
      if (e.placeholder) item.appendChild(ph());
      ul.appendChild(item);
    });
    s.appendChild(ul);
    return s;
  }

  function projects() {
    var list = S.projects || [];
    if (!list.length) return null;
    var s = section('projects', 'Projects');
    var ul = el('ul', 'cards');
    list.forEach(function (p) {
      var card = el('li', 'card');
      card.appendChild(el('h3', null, p.title));
      if (p.description) card.appendChild(el('p', null, p.description));
      if (p.tech && p.tech.length) card.appendChild(chips(p.tech));
      var code = safe(p.code), live = safe(p.live);
      if (code || live) {
        var links = el('p', 'links');
        if (code) links.appendChild(link(code, 'Code'));
        if (live) links.appendChild(link(live, 'Live demo'));
        card.appendChild(links);
      }
      ul.appendChild(mark(card, p));
    });
    s.appendChild(ul);
    var gh = safe(L.github);
    if (gh) {
      var more = el('p', 'more');
      more.appendChild(link(gh, 'More projects on GitHub'));
      s.appendChild(more);
    }
    return s;
  }

  function certificates() {
    var list = S.certificates || [];
    if (!list.length) return null;
    var s = section('certificates', 'Certificates');
    var ul = el('ul', 'certs');
    list.forEach(function (c) {
      var row = el('li', 'cert');
      var left = el('div');
      left.appendChild(el('h3', null, c.name));
      var line = [c.issuer, c.year].filter(Boolean).join(' · ');
      if (line) left.appendChild(el('p', 'muted', line));
      row.appendChild(left);
      var url = safe(c.url);
      if (url) row.appendChild(link(url, 'View certificate'));
      ul.appendChild(mark(row, c));
    });
    s.appendChild(ul);
    var li = safe(L.linkedin);
    if (li) {
      var more = el('p', 'more');
      more.appendChild(link(li, 'All certificates on LinkedIn'));
      s.appendChild(more);
    }
    return s;
  }

  function posters() {
    var list = S.posters || [];
    if (!list.length) return null;
    var s = section('posters', 'Academic posters');
    var ul = el('ul', 'posters');
    list.forEach(function (p) {
      var li = el('li');
      var fig = el('figure', 'poster');
      var image = safe(p.image);
      if (image) {
        var a = link(image, '');
        var img = el('img');
        img.src = image;
        img.loading = 'lazy';
        img.alt = 'Poster: ' + (p.title || 'untitled');
        a.appendChild(img);
        fig.appendChild(a);
      } else {
        fig.appendChild(el('div', 'poster-ph', 'Poster image goes here'));
      }
      var cap = el('figcaption');
      cap.appendChild(el('b', null, p.title));
      if (p.event) cap.appendChild(el('span', 'muted', p.event));
      fig.appendChild(cap);
      if (p.placeholder) fig.appendChild(ph());
      li.appendChild(fig);
      ul.appendChild(li);
    });
    s.appendChild(ul);
    return s;
  }

  function research() {
    var list = S.research || [];
    if (!list.length) return null;    // no research yet: the section simply does not appear
    var s = section('research', 'Research');
    var ul = el('ul', 'cards');
    list.forEach(function (r) {
      var card = el('li', 'card');
      card.appendChild(el('h3', null, r.title));
      if (r.description) card.appendChild(el('p', null, r.description));
      var url = safe(r.url);
      if (url) {
        var links = el('p', 'links');
        links.appendChild(link(url, 'Read'));
        card.appendChild(links);
      }
      ul.appendChild(mark(card, r));
    });
    s.appendChild(ul);
    return s;
  }

  function skills() {
    var groups = S.skills || [];
    if (!groups.length) return null;
    var s = section('skills', 'Skills');
    groups.forEach(function (g) {
      var box = el('div', 'skill-group');
      box.appendChild(el('h3', null, g.group));
      box.appendChild(chips(g.items));
      if (g.placeholder) box.appendChild(ph());
      s.appendChild(box);
    });
    return s;
  }

  function contact() {
    var s = section('contact', 'Contact');
    var ul = el('ul', 'contact');
    function row(label, node) {
      var li = el('li');
      li.appendChild(el('span', 'label', label));
      li.appendChild(node);
      ul.appendChild(li);
    }
    var em = mailto(L.email), gh = safe(L.github), li = safe(L.linkedin);
    row('Email', em ? link(em, String(L.email).replace(/^mailto:/i, '')) : todo('Add your email in js/content.js'));
    row('LinkedIn', li ? link(li, plainUrl(li)) : todo('Add your LinkedIn link in js/content.js'));
    row('GitHub', gh ? link(gh, plainUrl(gh)) : todo('Add your GitHub link in js/content.js'));
    if (S.location) row('Location', el('span', null, S.location));
    s.appendChild(ul);
    return s;
  }

  function toc() {
    var nav = el('nav', 'toc');
    nav.setAttribute('aria-label', 'Jump to a section');
    navItems.forEach(function (n) { nav.appendChild(link('#' + n.id, n.title)); });
    return nav;
  }

  function footer() {
    var f = el('footer', 'foot');
    f.appendChild(link('index.html', 'Back to the lobby', 'btn'));
    var p = el('p');
    p.textContent = S.updated ? 'Last updated ' + S.updated : 'Hotel Akshara · checked in, not checked out';
    f.appendChild(p);
    return f;
  }

  /* ---------- the staff entrance page ---------- */
  function renderStaff() {
    document.title = name + ' | Portfolio, CV and links (Staff entrance)';
    var parts = [about(), education(), projects(), certificates(), posters(), research(), skills(), contact()];
    main.textContent = '';
    main.appendChild(hero());
    main.appendChild(toc());   // navItems is filled by the sections above
    parts.forEach(function (p) { if (p) main.appendChild(p); });
    main.appendChild(footer());
  }

  /* ---------- the CV page ---------- */
  function renderCV() {
    document.title = 'CV | ' + name;
    var cv = S.cv || {};
    var pdf = safe(cv.pdf);
    var image = safe(cv.image);

    main.textContent = '';
    var head = el('div', 'cv-head');
    var h1 = el('h1', null, 'CV: ' + name);
    head.appendChild(h1);
    var actions = el('div', 'actions');
    if (pdf) {
      var dl = link(pdf, 'Download CV (PDF)', 'btn btn-primary');
      dl.setAttribute('download', '');
      actions.appendChild(dl);
      actions.appendChild(link(pdf, 'Open in a new tab', 'btn'));
    } else if (image) {
      actions.appendChild(link(image, 'Open full size', 'btn btn-primary'));
    }
    actions.appendChild(link('staff.html', 'Back to the staff entrance', 'btn'));
    head.appendChild(actions);
    main.appendChild(head);

    var view = el('div', 'block');
    if (pdf) {
      var obj = el('object', 'cv-frame');
      obj.data = pdf;
      obj.type = 'application/pdf';
      obj.setAttribute('aria-label', 'CV of ' + name);
      var fb = el('p', null, 'Your browser cannot show the PDF here. ');
      fb.appendChild(link(pdf, 'Open or download it instead.'));
      obj.appendChild(fb);
      view.appendChild(obj);
    } else if (image) {
      var img = el('img', 'cv-img');
      img.src = image;
      img.alt = 'CV of ' + name;
      view.appendChild(img);
    } else {
      var empty = el('div', 'cv-empty');
      empty.appendChild(el('h2', null, 'The CV is coming soon'));
      empty.appendChild(el('p', null, 'Add your CV file in js/content.js (staff.cv) and it will appear here, with a download button.'));
      empty.appendChild(ph());
      view.appendChild(empty);
    }
    main.appendChild(view);
    main.appendChild(footer());
  }

  if (document.body.getAttribute('data-page') === 'cv') renderCV();
  else renderStaff();
})();
