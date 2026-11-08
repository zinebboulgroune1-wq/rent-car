(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const TOKEN_KEY = 'tc_admin';

  const STATUS = {
    awaiting_payment: 'En attente de paiement',
    pending_review: 'À vérifier',
    confirmed: 'Confirmée (payée)',
    delivered: 'Livrée',
    cancelled: 'Annulée',
  };
  const METHOD = { card: 'Visa / Mastercard', paypal: 'PayPal', crypto: 'Crypto', cod: 'Paiement à la livraison' };
  const CAT = { economy: 'Économique', premium: 'Premium', suv: 'SUV' };
  const TRANS = { manual: 'Manuelle', auto: 'Automatique' };
  const FUEL = { petrol: 'Essence', diesel: 'Diesel', hybrid: 'Hybride', electric: 'Électrique' };

  const fmtDate = (iso) => iso ? new Date(iso).toLocaleString('fr-TN', { timeZone: 'Africa/Tunis', dateStyle: 'short', timeStyle: 'short' }) : '—';
  const fmtDay = (d) => d ? d.split('-').reverse().join('/') : '—';

  let cache = { orders: [], visits: [], cars: [] };
  let currentTab = 'dash';

  // ---------- API ----------
  const token = () => sessionStorage.getItem(TOKEN_KEY);

  async function api(path, opts = {}) {
    const headers = { 'Content-Type': 'application/json' };
    if (token()) headers.Authorization = `Bearer ${token()}`;
    const res = await fetch(path, { ...opts, headers: { ...headers, ...(opts.headers || {}) } });
    if (res.status === 401) { logout(); throw new Error('Session expirée, reconnectez-vous.'); }
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(messageFor(data.error));
    return data;
  }

  function messageFor(code) {
    const map = {
      dates_unavailable: 'Véhicule déjà réservé sur ces dates.',
      invalid_status: 'Statut invalide.',
      invalid_price: 'Prix invalide (minimum 10 DT).',
      invalid_image: 'Le lien de la photo doit commencer par https://',
      missing_fields: 'Marque, modèle et prix sont obligatoires.',
      too_many_attempts: 'Trop de tentatives. Réessayez dans 15 minutes.',
    };
    return map[code] || `Erreur : ${code || 'inconnue'}`;
  }

  // ---------- Auth ----------
  function showApp() {
    $('#loginView').classList.add('hidden');
    $('#appView').classList.remove('hidden');
    loadAll();
  }
  function logout() {
    api('/api/admin/logout', { method: 'POST' }).catch(() => {});
    sessionStorage.removeItem(TOKEN_KEY);
    $('#appView').classList.add('hidden');
    $('#loginView').classList.remove('hidden');
  }

  $('#loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = e.target;
    $('#loginErr').textContent = '';
    try {
      const data = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: f.username.value, password: f.password.value }),
      }).then(async (r) => ({ ok: r.ok, body: await r.json().catch(() => ({})) }));
      if (!data.ok) throw new Error(messageFor(data.body.error));
      sessionStorage.setItem(TOKEN_KEY, data.body.token);
      f.password.value = '';
      showApp();
    } catch (err) {
      $('#loginErr').textContent = err.message === 'Failed to fetch' ? 'Serveur injoignable.' : err.message;
    }
  });

  $('#logoutBtn').addEventListener('click', logout);
  $('#refreshBtn').addEventListener('click', loadAll);

  // ---------- Tabs ----------
  $$('nav.tabs button').forEach((b) => b.addEventListener('click', () => {
    currentTab = b.dataset.tab;
    $$('nav.tabs button').forEach((x) => x.classList.toggle('active', x === b));
    ['dash', 'visits', 'orders', 'cars'].forEach((id) => $(`#tab-${id}`).classList.toggle('hidden', id !== currentTab));
  }));

  // ---------- Load ----------
  async function loadAll() {
    try {
      const [summary, visits, orders, cars] = await Promise.all([
        api('/api/admin/summary'),
        api('/api/admin/visits'),
        api('/api/admin/orders'),
        api('/api/admin/cars'),
      ]);
      cache = { summary, visits, orders, cars };
      renderDashboard();
      renderVisits();
      renderOrders();
      renderCars();
    } catch (err) {
      alert(err.message);
    }
  }

  // ---------- Dashboard ----------
  function renderDashboard() {
    const s = cache.summary;
    const bs = s.byStatus || {};
    const cards = [
      ['Visites aujourd\'hui', s.visitsToday],
      ['Visiteurs uniques (aujourd\'hui)', s.uniqueToday],
      ['Visiteurs uniques (total)', s.uniqueVisitors],
      ['Réservations (total)', s.ordersTotal],
      ['À vérifier', bs.pending_review || 0],
      ['En attente de paiement', bs.awaiting_payment || 0],
      ['Revenus encaissés', `${Number(s.revenue || 0).toLocaleString('fr-TN')} DT`],
    ];
    $('#statCards').innerHTML = cards.map(([label, value]) =>
      `<div class="stat"><small>${esc(label)}</small><b>${esc(value)}</b></div>`).join('');

    const bars = (obj, labelFn = (k) => k) => {
      const entries = Object.entries(obj || {}).sort((a, b) => b[1] - a[1]);
      if (!entries.length) return '<div class="notes">Aucune donnée pour le moment.</div>';
      return entries.map(([k, v]) => `<div><span>${esc(labelFn(k))}</span><b>${v}</b></div>`).join('');
    };
    const langName = { fr: 'Français', ar: 'Arabe tunisien', en: 'English', '': 'Non défini' };
    $('#langBars').innerHTML = bars(s.languages, (k) => langName[k] || k);
    $('#countryBars').innerHTML = bars(s.countries);

    $('#recentOrders').innerHTML = cache.orders.length
      ? `<table><thead><tr><th>Commande</th><th>Client</th><th>Dates</th><th>Montant</th><th>Statut</th></tr></thead><tbody>${
          cache.orders.slice(0, 8).map((o) => `
            <tr>
              <td class="order-id">${esc(o.id)}</td>
              <td>${esc(o.name)}<div class="notes">${esc(o.phone)}</div></td>
              <td>${esc(fmtDay(o.start))} → ${esc(fmtDay(o.end))}</td>
              <td>${esc(o.amount)} DT</td>
              <td><span class="pill ${esc(o.status)}">${esc(STATUS[o.status] || o.status)}</span></td>
            </tr>`).join('')}</tbody></table>`
      : '<div class="notes">Aucune réservation.</div>';
  }

  // ---------- Visitors ----------
  function deviceOf(ua = '') {
    if (/iphone|ipad/i.test(ua)) return 'iOS';
    if (/android/i.test(ua)) return 'Android';
    if (/windows/i.test(ua)) return 'Windows';
    if (/mac os/i.test(ua)) return 'macOS';
    if (/linux/i.test(ua)) return 'Linux';
    return 'Autre';
  }
  function renderVisits() {
    $('#visitRows').innerHTML = cache.visits.map((v) => `
      <tr>
        <td>${esc(fmtDate(v.at))}</td>
        <td>${esc(v.country || '—')}</td>
        <td>${esc(v.ip || '—')}</td>
        <td>${esc(v.lang || '—')}</td>
        <td>${esc(v.path)}</td>
        <td class="small">${esc(v.referrer || 'Accès direct')}</td>
        <td class="small">${esc(v.screen || '—')}<br>${esc(v.tz || '')}</td>
        <td class="small">${esc(deviceOf(v.ua))}<br>${esc((v.acceptLang || '').split(',')[0])}</td>
      </tr>`).join('') || '<tr><td colspan="8" class="notes">Aucune visite enregistrée.</td></tr>';
  }

  // ---------- Orders ----------
  function renderOrders() {
    const filter = $('#orderFilter').value;
    const list = cache.orders.filter((o) => !filter || o.status === filter);
    $('#orderRows').innerHTML = list.map((o) => {
      const delivery = o.deliveryMode === 'delivery'
        ? `Domicile<div class="notes">${esc(o.address)}</div>`
        : 'Agence';
      const pay = `${esc(METHOD[o.paymentMethod] || o.paymentMethod)}${o.coin ? ` (${esc(o.coin)})` : ''}`;
      const proof = o.proof
        ? `<div><button class="btn light" type="button" data-proof="${esc(o.proof)}">Voir la preuve</button></div>`
        : '';
      const tx = o.txHash ? `<div class="notes">TxID : ${esc(o.txHash)}</div>` : '';
      return `
        <tr>
          <td><span class="order-id">${esc(o.id)}</span><div class="notes">${esc(fmtDate(o.createdAt))}</div></td>
          <td>${esc(o.name)}<div class="notes">${esc(o.phone)}</div><div class="notes">${esc(o.email)}</div>${o.notes ? `<div class="notes">« ${esc(o.notes)} »</div>` : ''}</td>
          <td>${esc(o.carName)}<div class="notes">${esc(fmtDay(o.start))} → ${esc(fmtDay(o.end))} · ${o.days} j</div></td>
          <td>${esc(o.deliveryTime)}<div class="notes">${delivery}</div></td>
          <td>${pay}${tx}${proof}</td>
          <td><strong>${esc(o.amount)} DT</strong></td>
          <td>
            <span class="pill ${esc(o.status)}">${esc(STATUS[o.status] || o.status)}</span>
            <div style="margin-top:6px">
              <select data-status="${esc(o.id)}">
                ${Object.entries(STATUS).map(([k, label]) => `<option value="${k}" ${k === o.status ? 'selected' : ''}>${esc(label)}</option>`).join('')}
              </select>
            </div>
          </td>
        </tr>`;
    }).join('') || '<tr><td colspan="7" class="notes">Aucune réservation.</td></tr>';
  }

  $('#orderFilter').addEventListener('change', renderOrders);

  $('#orderRows').addEventListener('change', async (e) => {
    const sel = e.target.closest('select[data-status]');
    if (!sel) return;
    const id = sel.dataset.status;
    const status = sel.value;
    const note = prompt('Note interne (optionnel) :', '') || '';
    try {
      await api(`/api/admin/orders/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        body: JSON.stringify({ status, note }),
      });
      await loadAll();
    } catch (err) {
      alert(err.message);
      renderOrders();
    }
  });

  $('#orderRows').addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-proof]');
    if (!btn) return;
    try {
      const res = await fetch(`/api/admin/proof/${encodeURIComponent(btn.dataset.proof)}`, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      if (!res.ok) throw new Error('Preuve introuvable.');
      const url = URL.createObjectURL(await res.blob());
      window.open(url, '_blank', 'noopener');
    } catch (err) {
      alert(err.message);
    }
  });

  $('#exportBtn').addEventListener('click', () => {
    const cols = ['id', 'createdAt', 'status', 'name', 'phone', 'email', 'carName', 'start', 'end', 'days', 'deliveryMode', 'address', 'deliveryTime', 'paymentMethod', 'coin', 'txHash', 'amount'];
    const csvCell = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const lines = [cols.join(','), ...cache.orders.map((o) => cols.map((c) => csvCell(o[c])).join(','))];
    const blob = new Blob(['﻿' + lines.join('\n')], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `reservations-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  });

  // ---------- Cars ----------
  function renderCars() {
    $('#carRows').innerHTML = cache.cars.map((c) => `
      <tr data-car="${esc(c.id)}">
        <td><strong>${esc(c.brand)} ${esc(c.model)}</strong><div class="notes">${c.seats} places · ${esc(TRANS[c.transmission] || c.transmission)} · ${esc(FUEL[c.fuel] || c.fuel)}</div></td>
        <td>${esc(CAT[c.category] || c.category)}</td>
        <td><input type="number" min="10" class="f-price" value="${esc(c.pricePerDay)}" style="width:110px"></td>
        <td><label><input type="checkbox" class="f-avail" ${c.available ? 'checked' : ''}> ${c.available ? 'Oui' : 'Non'}</label></td>
        <td><input class="f-image" value="${esc(c.image)}" placeholder="https://…" style="width:260px"></td>
        <td><button class="btn gold" type="button" data-save="${esc(c.id)}">Enregistrer</button></td>
      </tr>`).join('') || '<tr><td colspan="6" class="notes">Aucun véhicule.</td></tr>';
  }

  $('#carRows').addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-save]');
    if (!btn) return;
    const row = btn.closest('tr');
    try {
      await api(`/api/admin/cars/${encodeURIComponent(btn.dataset.save)}`, {
        method: 'PATCH',
        body: JSON.stringify({
          pricePerDay: row.querySelector('.f-price').value,
          available: row.querySelector('.f-avail').checked,
          image: row.querySelector('.f-image').value.trim(),
        }),
      });
      btn.textContent = 'Enregistré ✓';
      setTimeout(() => { btn.textContent = 'Enregistrer'; }, 1500);
      await loadAll();
    } catch (err) {
      alert(err.message);
    }
  });

  $('#addCarForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = e.target;
    const body = {
      brand: f.brand.value, model: f.model.value, category: f.category.value,
      seats: f.seats.value, transmission: f.transmission.value, fuel: f.fuel.value,
      pricePerDay: f.pricePerDay.value, image: f.image.value.trim(),
    };
    $('#carMsg').textContent = '';
    try {
      await api('/api/admin/cars', { method: 'POST', body: JSON.stringify(body) });
      f.reset();
      f.seats.value = 5;
      $('#carMsg').className = 'ok-text';
      $('#carMsg').textContent = 'Véhicule ajouté.';
      await loadAll();
    } catch (err) {
      $('#carMsg').className = 'err';
      $('#carMsg').textContent = err.message;
    }
  });

  // Auto-refresh every 60s while logged in
  setInterval(() => { if (token() && !$('#appView').classList.contains('hidden')) loadAll(); }, 60000);

  // Start
  if (token()) showApp();
})();
