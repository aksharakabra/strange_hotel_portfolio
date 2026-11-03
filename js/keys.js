/* The key ring: small keys collected during a visit, shown top-right.
     Hotel.keys.add({ id, label, color })  -> true if it was new
     Hotel.keys.has(id), Hotel.keys.list()
   Fires 'hotel:key' with { key } when one is added.
   The lobby hands out the first one (the guest key); the Trophy Room
   will add one per certificate. Kept for the browser tab (sessionStorage). */
(function () {
  'use strict';

  var Hotel = window.Hotel;
  if (!Hotel) return;

  var SKEY = 'hotel.keys';
  var keys = [];
  var listEl = null;

  function ring() {
    if (listEl) return listEl;
    var stage = document.getElementById('stage');
    if (!stage) return null;
    listEl = document.createElement('ul');
    listEl.className = 'keyring';
    listEl.setAttribute('aria-label', 'Keys you have collected');
    stage.appendChild(listEl);
    return listEl;
  }

  function icon(color) {
    return '<svg viewBox="0 0 32 32" width="26" height="26" aria-hidden="true" focusable="false">' +
      '<circle cx="9" cy="16" r="6.5" fill="none" stroke="' + color + '" stroke-width="3"/>' +
      '<path d="M15.5 16H29M24 16v6M29 16v4" fill="none" stroke="' + color +
      '" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }

  function render(k, isNew) {
    var ul = ring();
    if (!ul) return;
    var li = document.createElement('li');
    li.className = 'key' + (isNew ? ' is-new' : '');
    li.title = k.label;
    li.innerHTML = icon(/^#[0-9a-fA-F]{3,8}$/.test(k.color) ? k.color : '#F2B84B');
    var sr = document.createElement('span');
    sr.className = 'sr-only';
    sr.textContent = k.label;
    li.appendChild(sr);
    ul.appendChild(li);
  }

  function save() {
    try { sessionStorage.setItem(SKEY, JSON.stringify(keys)); } catch (e) { /* storage blocked */ }
  }

  function has(id) { return keys.some(function (k) { return k.id === id; }); }

  function add(k) {
    if (!k || !k.id || has(k.id)) return false;
    var key = { id: String(k.id), label: String(k.label || 'Key'), color: k.color || '#F2B84B' };
    keys.push(key);
    save();
    render(key, true);
    document.dispatchEvent(new CustomEvent('hotel:key', { detail: { key: key } }));
    return true;
  }

  try {
    var saved = JSON.parse(sessionStorage.getItem(SKEY) || '[]');
    if (Array.isArray(saved)) {
      saved.forEach(function (k) {
        if (k && k.id && !has(k.id)) { keys.push(k); render(k, false); }
      });
    }
  } catch (e) { /* ignore */ }

  Hotel.keys = { add: add, has: has, list: function () { return keys.slice(); } };
})();
