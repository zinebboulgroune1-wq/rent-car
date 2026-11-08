'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// ---------- Paths & configuration ----------
const ROOT = __dirname;
const PUBLIC_DIR = path.join(ROOT, 'public');
const DATA_DIR = path.join(ROOT, 'data');
const UPLOAD_DIR = path.join(ROOT, 'uploads');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const VISITS_FILE = path.join(DATA_DIR, 'visits.json'); // one JSON object per line

const PORT = Number(process.env.PORT) || 3000;
const COMPANY = process.env.COMPANY_NAME || 'TuniCar';
const ADMIN_USER = process.env.ADMIN_USER || 'owner';
const ADMIN_PASS = process.env.ADMIN_PASS || crypto.randomBytes(8).toString('hex');
const SESSION_HOURS = 12;
const DELIVERY_FEE = Number(process.env.DELIVERY_FEE) || 10; // TND
const OFFICE_HOURS = { start: '08:00', end: '20:00' };
const MAX_BODY = 6 * 1024 * 1024;
const PROOF_MAX = 4 * 1024 * 1024;
const MAX_RENTAL_DAYS = 60;
const ACTIVE = ['awaiting_payment', 'pending_review', 'confirmed', 'delivered'];
const STATUSES = [...ACTIVE, 'cancelled'];
const LANGS = ['fr', 'ar', 'en'];

const CONTACT = {
  phone: process.env.CONTACT_PHONE || '',
  whatsapp: process.env.CONTACT_WHATSAPP || '',
  email: process.env.CONTACT_EMAIL || '',
  address: process.env.CONTACT_ADDRESS || '',
};
const PAYMENT = {
  usdtTrc20: process.env.USDT_ADDRESS || '',
  btc: process.env.BTC_ADDRESS || '',
  paypalEmail: process.env.PAYPAL_EMAIL || '',
  cardUrl: process.env.CARD_PAYMENT_URL || '', // lien vers une passerelle (Stripe, etc.)
};

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
};

for (const dir of [DATA_DIR, UPLOAD_DIR]) fs.mkdirSync(dir, { recursive: true });
if (!process.env.ADMIN_PASS) {
  console.log(`[admin] ADMIN_PASS non défini. Mot de passe temporaire : ${ADMIN_PASS}`);
}

// ---------- Storage ----------
const sessions = new Map();   // token -> expiresAt
const loginFails = new Map(); // ip -> { count, resetAt }

function seedDb() {
  return {
    cars: [
      { id: 'clio5', brand: 'Renault', model: 'Clio 5', category: 'economy', seats: 5, transmission: 'manual', fuel: 'diesel', pricePerDay: 70, available: true, image: '' },
      { id: 'p208', brand: 'Peugeot', model: '208', category: 'economy', seats: 5, transmission: 'manual', fuel: 'petrol', pricePerDay: 75, available: true, image: '' },
      { id: 'logan', brand: 'Dacia', model: 'Logan', category: 'economy', seats: 5, transmission: 'manual', fuel: 'diesel', pricePerDay: 60, available: true, image: '' },
      { id: 'golf8', brand: 'Volkswagen', model: 'Golf 8', category: 'premium', seats: 5, transmission: 'auto', fuel: 'petrol', pricePerDay: 110, available: true, image: '' },
      { id: 'tucson', brand: 'Hyundai', model: 'Tucson', category: 'suv', seats: 5, transmission: 'auto', fuel: 'diesel', pricePerDay: 130, available: true, image: '' },
    ],
    orders: [],
  };
}

function readJson(file, fallback) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return fallback; }
}
function writeJsonAtomic(file, data) {
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
  fs.renameSync(tmp, file);
}

let db = readJson(DB_FILE, null) || seedDb();
function saveDb() { writeJsonAtomic(DB_FILE, db); }
if (!fs.existsSync(DB_FILE)) saveDb();

function readVisits() {
  if (!fs.existsSync(VISITS_FILE)) return [];
  return fs.readFileSync(VISITS_FILE, 'utf8')
    .split('\n').filter(Boolean)
    .map((line) => { try { return JSON.parse(line); } catch { return null; } })
    .filter(Boolean);
}

// ---------- Helpers ----------
class HttpError extends Error {
  constructor(status, code) { super(code); this.status = status; this.code = code; }
}
const fail = (status, code) => { throw new HttpError(status, code); };

function send(res, status, data, headers = {}) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'X-Content-Type-Options': 'nosniff',
    'Cache-Control': 'no-store',
    ...headers,
  });
  res.end(JSON.stringify(data));
}

function readBody(req, limit = MAX_BODY) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > limit) { reject(new HttpError(413, 'too_large')); req.destroy(); return; }
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}
async function readJsonBody(req) {
  const raw = await readBody(req);
  if (!raw) return {};
  try { return JSON.parse(raw); } catch { return fail(400, 'invalid_json'); }
}

function clientIp(req) {
  const xf = req.headers['x-forwarded-for'];
  return (xf ? String(xf).split(',')[0] : req.socket.remoteAddress || '').trim();
}
function clientCountry(req) {
  return String(req.headers['cf-ipcountry'] || req.headers['x-vercel-ip-country'] || req.headers['x-country-code'] || '').slice(0, 4);
}

function todayStr() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Tunis' }).format(new Date());
}
function parseDay(s) {
  if (typeof s !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const ms = Date.parse(`${s}T00:00:00Z`);
  return Number.isNaN(ms) || new Date(ms).toISOString().slice(0, 10) !== s ? null : ms;
}
function daysBetween(a, b) {
  return Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86400000) + 1;
}
function isCarFree(carId, start, end, ignoreId = null) {
  return !db.orders.some((o) =>
    o.carId === carId && o.id !== ignoreId && ACTIVE.includes(o.status) && start <= o.end && o.start <= end);
}
function quote(car, start, end, delivery) {
  const days = daysBetween(start, end);
  const rental = days * car.pricePerDay;
  const fee = delivery ? DELIVERY_FEE : 0;
  return { days, rental, fee, total: rental + fee, currency: 'TND' };
}
function oneOf(v, list, code) {
  if (!list.includes(v)) fail(400, code);
  return v;
}
function clampInt(v, min, max, code) {
  const n = Math.round(Number(v));
  if (!Number.isFinite(n) || n < min || n > max) fail(400, code);
  return n;
}

function safeEqual(a, b) {
  const ha = crypto.createHash('sha256').update(String(a)).digest();
  const hb = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
}
function checkLoginRate(ip) {
  const now = Date.now();
  let entry = loginFails.get(ip);
  if (!entry || now > entry.resetAt) {
    entry = { count: 0, resetAt: now + 15 * 60e3 };
    loginFails.set(ip, entry);
  }
  entry.count += 1;
  if (entry.count > 10) fail(429, 'too_many_attempts');
}
function requireAdmin(req) {
  const h = req.headers.authorization || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : '';
  const exp = sessions.get(token);
  if (!exp || exp < Date.now()) { sessions.delete(token); fail(401, 'unauthorized'); }
}

function savePaymentProof(dataUrl) {
  if (!dataUrl) return '';
  const m = /^data:image\/(png|jpeg|webp);base64,([A-Za-z0-9+/=]+)$/.exec(String(dataUrl));
  if (!m) fail(400, 'proof_invalid');
  const buf = Buffer.from(m[2], 'base64');
  if (buf.length > PROOF_MAX) fail(413, 'proof_too_large');
  const ext = m[1] === 'jpeg' ? 'jpg' : m[1];
  const name = `${crypto.randomBytes(12).toString('hex')}.${ext}`;
  fs.writeFileSync(path.join(UPLOAD_DIR, name), buf);
  return name;
}

function applyCarFields(car, b) {
  if (b.brand !== undefined) car.brand = String(b.brand).trim().slice(0, 40);
  if (b.model !== undefined) car.model = String(b.model).trim().slice(0, 40);
  if (b.category !== undefined) car.category = oneOf(b.category, ['economy', 'premium', 'suv'], 'invalid_category');
  if (b.seats !== undefined) car.seats = clampInt(b.seats, 2, 9, 'invalid_seats');
  if (b.transmission !== undefined) car.transmission = oneOf(b.transmission, ['manual', 'auto'], 'invalid_transmission');
  if (b.fuel !== undefined) car.fuel = oneOf(b.fuel, ['petrol', 'diesel', 'hybrid', 'electric'], 'invalid_fuel');
  if (b.pricePerDay !== undefined) car.pricePerDay = clampInt(b.pricePerDay, 10, 10000, 'invalid_price');
  if (b.available !== undefined) car.available = Boolean(b.available);
  if (b.image !== undefined) {
    const img = String(b.image || '').trim();
    if (img && !/^https?:\/\//.test(img)) fail(400, 'invalid_image');
    car.image = img.slice(0, 500);
  }
  return car;
}

// ---------- Business logic ----------
function createBooking(input) {
  const name = String(input.name || '').trim().slice(0, 100);
  const phone = String(input.phone || '').replace(/[\s().-]/g, '');
  const email = String(input.email || '').trim().slice(0, 120);
  if (!name || !/^\+?\d{8,15}$/.test(phone)) fail(400, 'invalid_contact');
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fail(400, 'invalid_contact');

  const car = db.cars.find((c) => c.id === input.carId);
  if (!car) fail(404, 'car_not_found');
  if (!car.available) fail(409, 'car_unavailable');

  if (!parseDay(input.start) || !parseDay(input.end)) fail(400, 'invalid_dates');
  if (input.start < todayStr()) fail(400, 'past_date');
  const days = daysBetween(input.start, input.end);
  if (days < 1) fail(400, 'invalid_dates');
  if (days > MAX_RENTAL_DAYS) fail(400, 'too_long');

  const time = String(input.deliveryTime || '');
  if (!/^\d{2}:\d{2}$/.test(time) || time < OFFICE_HOURS.start || time > OFFICE_HOURS.end) {
    fail(400, 'time_out_of_hours');
  }

  const delivery = input.deliveryMode === 'delivery';
  const address = delivery ? String(input.address || '').trim().slice(0, 200) : '';
  if (delivery && !address) fail(400, 'address_required');

  const method = input.paymentMethod;
  if (!['card', 'paypal', 'crypto', 'cod'].includes(method)) fail(400, 'payment_invalid');
  let coin = '';
  if (method === 'crypto') {
    if (!['USDT', 'BTC'].includes(input.coin)) fail(400, 'coin_invalid');
    coin = input.coin;
  }

  if (!isCarFree(car.id, input.start, input.end)) fail(409, 'dates_unavailable');

  const proof = savePaymentProof(input.proof);
  const txHash = String(input.txHash || '').trim().slice(0, 120);
  const price = quote(car, input.start, input.end, delivery);

  let status = 'awaiting_payment';
  if (method === 'cod' || proof || txHash) status = 'pending_review';

  const now = new Date().toISOString();
  const order = {
    id: `TC-${Date.now().toString(36).toUpperCase()}${crypto.randomBytes(2).toString('hex').toUpperCase()}`,
    createdAt: now,
    status,
    carId: car.id,
    carName: `${car.brand} ${car.model}`,
    start: input.start,
    end: input.end,
    days,
    deliveryTime: time,
    deliveryMode: delivery ? 'delivery' : 'office',
    address,
    name,
    phone,
    email,
    lang: LANGS.includes(input.lang) ? input.lang : 'fr',
    notes: String(input.notes || '').trim().slice(0, 500),
    paymentMethod: method,
    coin,
    txHash,
    proof,
    amount: price.total,
    price,
    history: [{ at: now, status, note: 'created' }],
  };
  db.orders.push(order);
  saveDb();
  return order;
}

function recordVisit(req, body) {
  const b = body || {};
  const visit = {
    at: new Date().toISOString(),
    vid: String(b.vid || '').slice(0, 64),
    ip: clientIp(req),
    country: clientCountry(req),
    ua: String(req.headers['user-agent'] || '').slice(0, 300),
    acceptLang: String(req.headers['accept-language'] || '').slice(0, 80),
    path: String(b.path || '/').slice(0, 200),
    referrer: String(b.referrer || '').slice(0, 300),
    lang: LANGS.includes(b.lang) ? b.lang : '',
    screen: String(b.screen || '').slice(0, 20),
    tz: String(b.tz || '').slice(0, 60),
  };
  fs.appendFileSync(VISITS_FILE, `${JSON.stringify(visit)}\n`);
}

function summary() {
  const visits = readVisits();
  const today = todayStr();
  const todays = visits.filter((v) => v.at.slice(0, 10) === today);
  const tally = (list, key) => list.reduce((acc, v) => {
    const k = v[key] || 'inconnu';
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});
  const byStatus = Object.fromEntries(STATUSES.map((s) => [s, 0]));
  for (const o of db.orders) byStatus[o.status] = (byStatus[o.status] || 0) + 1;
  const revenue = db.orders
    .filter((o) => ['confirmed', 'delivered'].includes(o.status))
    .reduce((s, o) => s + o.amount, 0);
  return {
    currency: 'TND',
    visitsTotal: visits.length,
    visitsToday: todays.length,
    uniqueVisitors: new Set(visits.map((v) => v.vid)).size,
    uniqueToday: new Set(todays.map((v) => v.vid)).size,
    ordersTotal: db.orders.length,
    byStatus,
    revenue,
    languages: tally(visits, 'lang'),
    countries: tally(visits, 'country'),
  };
}

// ---------- API ----------
async function handleApi(req, res, url) {
  const p = url.pathname;
  const method = req.method;
  const q = url.searchParams;

  // Public
  if (method === 'GET' && p === '/api/config') {
    return send(res, 200, {
      company: COMPANY,
      contact: CONTACT,
      deliveryFee: DELIVERY_FEE,
      currency: 'TND',
      officeHours: OFFICE_HOURS,
      payment: {
        usdtTrc20: PAYMENT.usdtTrc20,
        btc: PAYMENT.btc,
        paypalEmail: PAYMENT.paypalEmail,
        cardEnabled: Boolean(PAYMENT.cardUrl),
      },
    });
  }
  if (method === 'GET' && p === '/api/cars') return send(res, 200, db.cars);

  if (method === 'GET' && p === '/api/availability') {
    const start = q.get('start');
    const end = q.get('end');
    if (!parseDay(start) || !parseDay(end) || end < start) fail(400, 'invalid_dates');
    return send(res, 200, { free: isCarFree(q.get('carId'), start, end) });
  }

  if (method === 'GET' && p === '/api/quote') {
    const car = db.cars.find((c) => c.id === q.get('carId'));
    if (!car) fail(404, 'car_not_found');
    const start = q.get('start');
    const end = q.get('end');
    if (!parseDay(start) || !parseDay(end) || end < start) fail(400, 'invalid_dates');
    return send(res, 200, quote(car, start, end, q.get('delivery') === '1'));
  }

  if (method === 'POST' && p === '/api/bookings') {
    const order = createBooking(await readJsonBody(req));
    return send(res, 201, {
      id: order.id,
      status: order.status,
      amount: order.amount,
      currency: 'TND',
      paymentUrl: order.paymentMethod === 'card' ? PAYMENT.cardUrl : '',
    });
  }

  if (method === 'POST' && p === '/api/track') {
    recordVisit(req, await readJsonBody(req));
    res.writeHead(204);
    return res.end();
  }

  // Admin login
  if (method === 'POST' && p === '/api/admin/login') {
    const ip = clientIp(req);
    checkLoginRate(ip);
    const body = await readJsonBody(req);
    const ok = safeEqual(body.username, ADMIN_USER) && safeEqual(body.password, ADMIN_PASS);
    if (!ok) fail(401, 'bad_credentials');
    loginFails.delete(ip);
    const token = crypto.randomBytes(32).toString('hex');
    sessions.set(token, Date.now() + SESSION_HOURS * 3600e3);
    return send(res, 200, { token });
  }
  if (method === 'POST' && p === '/api/admin/logout') {
    const h = req.headers.authorization || '';
    sessions.delete(h.startsWith('Bearer ') ? h.slice(7) : '');
    return send(res, 200, { ok: true });
  }

  // Everything below requires an admin session
  if (p.startsWith('/api/admin/')) requireAdmin(req);

  if (method === 'GET' && p === '/api/admin/summary') return send(res, 200, summary());
  if (method === 'GET' && p === '/api/admin/visits') return send(res, 200, readVisits().slice(-2000).reverse());
  if (method === 'GET' && p === '/api/admin/orders') return send(res, 200, [...db.orders].reverse());

  const proofMatch = p.match(/^\/api\/admin\/proof\/([a-f0-9]{24}\.(?:png|jpg|webp))$/);
  if (method === 'GET' && proofMatch) {
    const file = path.join(UPLOAD_DIR, proofMatch[1]);
    if (!fs.existsSync(file)) fail(404, 'not_found');
    const ext = path.extname(file).slice(1);
    res.writeHead(200, {
      'Content-Type': ext === 'jpg' ? 'image/jpeg' : `image/${ext}`,
      'Cache-Control': 'private, no-store',
    });
    return fs.createReadStream(file).pipe(res);
  }

  const orderMatch = p.match(/^\/api\/admin\/orders\/(TC-[A-Z0-9]+)$/);
  if (method === 'PATCH' && orderMatch) {
    const order = db.orders.find((o) => o.id === orderMatch[1]);
    if (!order) fail(404, 'not_found');
    const body = await readJsonBody(req);
    if (!STATUSES.includes(body.status)) fail(400, 'invalid_status');
    if (ACTIVE.includes(body.status) && !isCarFree(order.carId, order.start, order.end, order.id)) {
      fail(409, 'dates_unavailable');
    }
    order.status = body.status;
    order.history.push({ at: new Date().toISOString(), status: body.status, note: String(body.note || '').slice(0, 200) });
    saveDb();
    return send(res, 200, order);
  }

  if (method === 'GET' && p === '/api/admin/cars') return send(res, 200, db.cars);

  if (method === 'POST' && p === '/api/admin/cars') {
    const body = await readJsonBody(req);
    const car = applyCarFields({
      id: `c${crypto.randomBytes(4).toString('hex')}`,
      brand: '', model: '', category: 'economy', seats: 5, transmission: 'manual',
      fuel: 'petrol', pricePerDay: 0, available: true, image: '',
    }, body);
    if (!car.brand || !car.model || !car.pricePerDay) fail(400, 'missing_fields');
    db.cars.push(car);
    saveDb();
    return send(res, 201, car);
  }

  const carMatch = p.match(/^\/api\/admin\/cars\/([a-z0-9]+)$/);
  if (method === 'PATCH' && carMatch) {
    const car = db.cars.find((c) => c.id === carMatch[1]);
    if (!car) fail(404, 'not_found');
    applyCarFields(car, await readJsonBody(req));
    saveDb();
    return send(res, 200, car);
  }

  return send(res, 404, { error: 'not_found' });
}

// ---------- Static files ----------
function serveStatic(res, pathname) {
  const routes = { '/': 'index.html', '/admin': 'admin.html' };
  const rel = routes[pathname] || pathname.replace(/^\/+/, '');
  const file = path.resolve(PUBLIC_DIR, rel);
  if (!file.startsWith(PUBLIC_DIR + path.sep)) return send(res, 404, { error: 'not_found' });
  fs.readFile(file, (err, data) => {
    if (err) return send(res, 404, { error: 'not_found' });
    res.writeHead(200, {
      'Content-Type': MIME[path.extname(file)] || 'application/octet-stream',
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'no-cache',
    });
    res.end(data);
  });
}

// ---------- Server ----------
const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    if (url.pathname.startsWith('/api/')) return await handleApi(req, res, url);
    if (req.method !== 'GET') return send(res, 405, { error: 'method_not_allowed' });
    return serveStatic(res, decodeURIComponent(url.pathname));
  } catch (err) {
    if (err instanceof HttpError) return send(res, err.status, { error: err.code });
    console.error(err);
    return send(res, 500, { error: 'server_error' });
  }
});

server.listen(PORT, () => {
  console.log(`${COMPANY} en ligne : http://localhost:${PORT}  |  Admin : http://localhost:${PORT}/admin`);
});
