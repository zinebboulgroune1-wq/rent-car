(() => {
  'use strict';

  // ---------- Translations ----------
  const dict = {
    fr: {
      site_title: 'TuniCar — Location de voitures en Tunisie',
      nav_fleet: 'Nos véhicules', nav_how: 'Comment ça marche', nav_booking: 'Réserver', nav_contact: 'Contact',
      hero_eyebrow: 'Location de voitures · Tunisie',
      hero_title: 'Louez votre voiture en Tunisie, simplement et en toute sécurité',
      hero_sub: 'Véhicules propres et fiables, tarifs transparents, livraison à l\'agence ou à votre domicile, et paiement par carte, PayPal, crypto ou à la livraison.',
      hero_cta: 'Voir la flotte', hero_cta2: 'Réserver maintenant',
      trust1: 'Tarifs clairs', trust2: 'Livraison à domicile', trust3: '4 modes de paiement',
      fleet_title: 'Notre flotte', fleet_sub: 'Choisissez le véhicule qui vous convient.',
      how_title: 'Louer en 3 étapes',
      step1_t: 'Choisissez votre véhicule', step1_d: 'Sélectionnez vos dates et voyez le prix immédiatement.',
      step2_t: 'Choisissez le paiement', step2_d: 'Visa / Mastercard, PayPal, crypto, ou paiement à la livraison.',
      step3_t: 'Récupérez votre voiture', step3_d: 'Choisissez l\'heure qui vous convient, à l\'agence ou chez vous.',
      booking_title: 'Réserver', booking_sub: 'La réservation est confirmée après vérification du paiement.',
      f_car: 'Véhicule', f_start: 'Date de départ', f_end: 'Date de retour', f_time: 'Heure de livraison',
      f_mode: 'Mode de livraison', mode_office: 'Retrait à l\'agence', mode_delivery: 'Livraison à domicile (+{fee} DT)',
      f_address: 'Adresse de livraison', f_name: 'Nom complet', f_phone: 'Téléphone', f_email: 'Email (optionnel)',
      f_notes: 'Remarques', f_pay: 'Mode de paiement',
      pay_card: 'Visa / Mastercard', pay_paypal: 'PayPal', pay_crypto: 'Crypto', pay_cod: 'Paiement à la livraison',
      f_coin: 'Crypto', f_txhash: 'N° de transaction (TxID)', f_proof: 'Preuve de paiement (capture d\'écran, optionnel)',
      pay_info_card: 'Le paiement par carte se fait sur une page sécurisée. Votre réservation sera confirmée après validation.',
      pay_info_paypal: 'Envoyez le paiement à cette adresse : {email}, puis ajoutez une capture ou le numéro de transaction.',
      pay_info_crypto: 'Choisissez la crypto, envoyez le montant à l\'adresse ci-dessous, puis ajoutez le TxID ou une capture.',
      pay_info_cod: 'Vous payez en espèces à la remise du véhicule. Nous vous appelons pour confirmer.',
      pay_card_pending: 'Le paiement par carte n\'est pas encore activé. Nous vous contacterons pour finaliser.',
      not_configured: 'Non disponible pour le moment',
      copy: 'Copier', copied: 'Copié !',
      summary_title: 'Récapitulatif', summary_empty: 'Choisissez un véhicule et des dates pour voir le prix.',
      days: 'jours', rental: 'Location', delivery_fee: 'Livraison', total: 'Total',
      free: 'Véhicule disponible pour ces dates.', busy: 'Ces dates ne sont pas disponibles pour ce véhicule.',
      date_order: 'La date de retour doit être après la date de départ.',
      submit: 'Confirmer la réservation', sending: 'Envoi en cours...',
      success_title: 'Réservation enregistrée !',
      success_body: 'Votre numéro de commande : {id}. Nous vous contacterons rapidement pour confirmer.',
      go_pay: 'Payer maintenant',
      car_per_day: 'DT / jour', car_choose: 'Choisir', car_unavailable: 'Indisponible', seats: 'places',
      transmission_manual: 'Manuelle', transmission_auto: 'Automatique',
      fuel_petrol: 'Essence', fuel_diesel: 'Diesel', fuel_hybrid: 'Hybride', fuel_electric: 'Électrique',
      cat_economy: 'Économique', cat_premium: 'Premium', cat_suv: 'SUV',
      contact_title: 'Contact', contact_hours: 'Ouvert tous les jours de {start} à {end}.',
      contact_phone: 'Téléphone', contact_wa: 'WhatsApp', contact_email: 'Email', contact_addr: 'Agence',
      footer_note: 'Location de voitures en Tunisie. Tous droits réservés.',
      err_invalid_contact: 'Vérifiez votre nom, votre téléphone et votre email.',
      err_car_not_found: 'Véhicule introuvable.',
      err_car_unavailable: 'Ce véhicule n\'est pas disponible.',
      err_invalid_dates: 'Dates invalides.',
      err_past_date: 'La date de départ est déjà passée.',
      err_too_long: 'Durée maximale : 60 jours.',
      err_time_out_of_hours: 'L\'heure de livraison doit être entre {start} et {end}.',
      err_address_required: 'Indiquez l\'adresse de livraison.',
      err_payment_invalid: 'Mode de paiement invalide.',
      err_coin_invalid: 'Choisissez une crypto valide.',
      err_dates_unavailable: 'Ce véhicule est déjà réservé sur ces dates.',
      err_proof_invalid: 'Image invalide (PNG, JPG ou WEBP uniquement).',
      err_proof_too_large: 'Image trop lourde (4 Mo maximum).',
      err_too_many_attempts: 'Trop de tentatives. Réessayez plus tard.',
      err_default: 'Une erreur est survenue. Réessayez.',
    },

    ar: {
      site_title: 'TuniCar — كراء كراهب في تونس',
      nav_fleet: 'الكراهب', nav_how: 'كيفاش نخدمو', nav_booking: 'احجز', nav_contact: 'اتصل بينا',
      hero_eyebrow: 'كراء كراهب · تونس',
      hero_title: 'كرا كرهبتك في تونس، بالسهولة و الأمان',
      hero_sub: 'كراهب نظيفة و موثوقة، أسعار واضحة بلا مصاريف خفية، تسليم في المكتب ولا في دارك، والخلاص كيفما تحب: بطاقة، PayPal، كريبتو ولا كاش وقت الاستلام.',
      hero_cta: 'شوف الكراهب', hero_cta2: 'احجز توّا',
      trust1: 'أسعار واضحة', trust2: 'توصيل لدارك', trust3: '4 طرق خلاص',
      fleet_title: 'الكراهب المتوفرة', fleet_sub: 'اختار الكرهبة اللي تناسبك.',
      how_title: 'كيفاش تكري في 3 خطوات',
      step1_t: 'اختار الكرهبة', step1_d: 'حط تاريخ الأخذ و الرجعة و شوف السعر فورا.',
      step2_t: 'اختار طريقة الخلاص', step2_d: 'فيزا / ماستر، PayPal، كريبتو ولا كاش وقت الاستلام.',
      step3_t: 'خذ كرهبتك', step3_d: 'اختار الساعة اللي تحبها، في المكتب ولا في دارك.',
      booking_title: 'احجز كرهبتك', booking_sub: 'الحجز يتثبت بعد ما نتحققو من الخلاص.',
      f_car: 'الكرهبة', f_start: 'تاريخ الأخذ', f_end: 'تاريخ الرجعة', f_time: 'ساعة التسليم',
      f_mode: 'طريقة التسليم', mode_office: 'نجيوا للمكتب', mode_delivery: 'توصيل لدارك (+{fee} د.ت)',
      f_address: 'عنوان التوصيل', f_name: 'الاسم و اللقب', f_phone: 'رقم التليفون', f_email: 'الإيميل (اختياري)',
      f_notes: 'ملاحظات', f_pay: 'طريقة الخلاص',
      pay_card: 'فيزا / ماستر', pay_paypal: 'PayPal', pay_crypto: 'كريبتو', pay_cod: 'كاش وقت الاستلام',
      f_coin: 'العملة', f_txhash: 'رقم المعاملة (TxID)', f_proof: 'صورة الخلاص (اختياري)',
      pay_info_card: 'الخلاص بالفيزا/ماستر يتعمل في صفحة آمنة. بعد الخلاص الحجز يتأكد.',
      pay_info_paypal: 'ابعث الخلاص لهذا الإيميل: {email}، و حط صورة الخلاص ولا رقم المعاملة.',
      pay_info_crypto: 'اختار العملة و ابعث المبلغ للعنوان اللي تحت، و حط رقم المعاملة ولا صورة الخلاص.',
      pay_info_cod: 'تخلص كاش وقت ما تستلم الكرهبة. نكلموك بالتليفون باش نأكدو الحجز.',
      pay_card_pending: 'خلاص الفيزا/ماستر مازال ما تفعّلش. نكلموك باش نخلصو مع بعض.',
      not_configured: 'غير متوفر توّا',
      copy: 'انسخ', copied: 'تنسخ!',
      summary_title: 'ملخص الحجز', summary_empty: 'اختار كرهبة و التواريخ باش تشوف السعر.',
      days: 'أيام', rental: 'الكراء', delivery_fee: 'التوصيل', total: 'المجموع',
      free: 'الكرهبة متوفرة في التواريخ هذي.', busy: 'التواريخ هذي محجوزة، جرب تواريخ أخرى.',
      date_order: 'تاريخ الرجعة لازم يكون بعد تاريخ الأخذ.',
      submit: 'ثبّت الحجز', sending: 'نبعثو...',
      success_title: 'تسجّل الحجز!',
      success_body: 'رقم الطلب متاعك: {id}. نكلموك قريب باش نأكدو.',
      go_pay: 'خلّص توّا',
      car_per_day: 'د.ت / النهار', car_choose: 'اختار هذي', car_unavailable: 'غير متوفرة توّا', seats: 'مقاعد',
      transmission_manual: 'عادية', transmission_auto: 'أوتوماتيك',
      fuel_petrol: 'بنزين', fuel_diesel: 'غازوال', fuel_hybrid: 'هجين', fuel_electric: 'كهربائية',
      cat_economy: 'اقتصادية', cat_premium: 'فاخرة', cat_suv: 'SUV',
      contact_title: 'اتصل بينا', contact_hours: 'نخدمو كل يوم من {start} لـ {end}.',
      contact_phone: 'التليفون', contact_wa: 'واتساب', contact_email: 'الإيميل', contact_addr: 'المكتب',
      footer_note: 'كراء كراهب في تونس. كل الحقوق محفوظة.',
      err_invalid_contact: 'تأكد من الاسم و رقم التليفون و الإيميل.',
      err_car_not_found: 'الكرهبة هذي مش موجودة.',
      err_car_unavailable: 'الكرهبة هذي مش متوفرة.',
      err_invalid_dates: 'التواريخ مش صحيحة.',
      err_past_date: 'تاريخ الأخذ عدّى.',
      err_too_long: 'أقصى مدة: 60 نهار.',
      err_time_out_of_hours: 'ساعة التسليم لازم تكون بين {start} و {end}.',
      err_address_required: 'حط عنوان التوصيل.',
      err_payment_invalid: 'طريقة الخلاص مش صحيحة.',
      err_coin_invalid: 'اختار عملة كريبتو صحيحة.',
      err_dates_unavailable: 'الكرهبة هذي محجوزة في التواريخ هذي.',
      err_proof_invalid: 'الصورة مش صحيحة (PNG ولا JPG ولا WEBP برك).',
      err_proof_too_large: 'الصورة كبيرة بزاف (أقصى حاجة 4 ميغا).',
      err_too_many_attempts: 'بزاف محاولات. جرب بعد شوية.',
      err_default: 'صار مشكل. عاود جرب.',
    },

    en: {
      site_title: 'TuniCar — Car rental in Tunisia',
      nav_fleet: 'Our fleet', nav_how: 'How it works', nav_booking: 'Book', nav_contact: 'Contact',
      hero_eyebrow: 'Car rental · Tunisia',
      hero_title: 'Rent a car in Tunisia, simply and securely',
      hero_sub: 'Clean, reliable vehicles, transparent prices, delivery to the office or your door, and payment by card, PayPal, crypto or cash on delivery.',
      hero_cta: 'View the fleet', hero_cta2: 'Book now',
      trust1: 'Clear pricing', trust2: 'Home delivery', trust3: '4 payment options',
      fleet_title: 'Our fleet', fleet_sub: 'Pick the vehicle that suits you.',
      how_title: 'Rent in 3 steps',
      step1_t: 'Choose your car', step1_d: 'Select your dates and see the price instantly.',
      step2_t: 'Choose how to pay', step2_d: 'Visa / Mastercard, PayPal, crypto, or cash on delivery.',
      step3_t: 'Pick up your car', step3_d: 'Choose the time that works, at the office or at your place.',
      booking_title: 'Book your car', booking_sub: 'Your booking is confirmed once the payment is verified.',
      f_car: 'Vehicle', f_start: 'Pick-up date', f_end: 'Return date', f_time: 'Delivery time',
      f_mode: 'Delivery method', mode_office: 'Pick up at the office', mode_delivery: 'Delivery to my address (+{fee} TND)',
      f_address: 'Delivery address', f_name: 'Full name', f_phone: 'Phone', f_email: 'Email (optional)',
      f_notes: 'Notes', f_pay: 'Payment method',
      pay_card: 'Visa / Mastercard', pay_paypal: 'PayPal', pay_crypto: 'Crypto', pay_cod: 'Cash on delivery',
      f_coin: 'Coin', f_txhash: 'Transaction ID (TxID)', f_proof: 'Payment proof (screenshot, optional)',
      pay_info_card: 'Card payments are processed on a secure page. Your booking is confirmed after validation.',
      pay_info_paypal: 'Send the payment to: {email}, then add a screenshot or the transaction ID.',
      pay_info_crypto: 'Choose the coin, send the amount to the address below, then add the TxID or a screenshot.',
      pay_info_cod: 'Pay in cash when you receive the car. We will call you to confirm.',
      pay_card_pending: 'Card payment is not enabled yet. We will contact you to complete it.',
      not_configured: 'Not available right now',
      copy: 'Copy', copied: 'Copied!',
      summary_title: 'Summary', summary_empty: 'Choose a vehicle and dates to see the price.',
      days: 'days', rental: 'Rental', delivery_fee: 'Delivery', total: 'Total',
      free: 'Vehicle available for these dates.', busy: 'These dates are not available for this vehicle.',
      date_order: 'The return date must be after the pick-up date.',
      submit: 'Confirm booking', sending: 'Sending...',
      success_title: 'Booking received!',
      success_body: 'Your order number: {id}. We will contact you shortly to confirm.',
      go_pay: 'Pay now',
      car_per_day: 'TND / day', car_choose: 'Choose', car_unavailable: 'Unavailable', seats: 'seats',
      transmission_manual: 'Manual', transmission_auto: 'Automatic',
      fuel_petrol: 'Petrol', fuel_diesel: 'Diesel', fuel_hybrid: 'Hybrid', fuel_electric: 'Electric',
      cat_economy: 'Economy', cat_premium: 'Premium', cat_suv: 'SUV',
      contact_title: 'Contact', contact_hours: 'Open every day from {start} to {end}.',
      contact_phone: 'Phone', contact_wa: 'WhatsApp', contact_email: 'Email', contact_addr: 'Office',
      footer_note: 'Car rental in Tunisia. All rights reserved.',
      err_invalid_contact: 'Please check your name, phone and email.',
      err_car_not_found: 'Vehicle not found.',
      err_car_unavailable: 'This vehicle is not available.',
      err_invalid_dates: 'Invalid dates.',
      err_past_date: 'The pick-up date has already passed.',
      err_too_long: 'Maximum rental: 60 days.',
      err_time_out_of_hours: 'Delivery time must be between {start} and {end}.',
      err_address_required: 'Please enter the delivery address.',
      err_payment_invalid: 'Invalid payment method.',
      err_coin_invalid: 'Please choose a valid crypto.',
      err_dates_unavailable: 'This vehicle is already booked for these dates.',
      err_proof_invalid: 'Invalid image (PNG, JPG or WEBP only).',
      err_proof_too_large: 'Image too large (4 MB max).',
      err_too_many_attempts: 'Too many attempts. Try again later.',
      err_default: 'Something went wrong. Please try again.',
    },
  };

  const CAR_SVG = '<svg viewBox="0 0 120 60" aria-hidden="true"><path d="M8 40 L14 24 Q18 16 30 15 L48 13 Q60 6 76 13 L94 17 Q104 19 108 30 L112 36 Q114 40 110 41 L104 41 A8 8 0 0 1 88 41 L40 41 A8 8 0 0 1 24 41 L12 41 Q6 41 8 40 Z" fill="currentColor"/><circle cx="32" cy="42" r="6" fill="#0b1f33"/><circle cx="96" cy="42" r="6" fill="#0b1f33"/><path d="M52 16 Q60 11 74 16 L78 25 L46 25 Z" fill="#dbe7f3"/></svg>';

  // ---------- State ----------
  let lang = localStorage.getItem('tc_lang') || detectLang();
  let config = { deliveryFee: 10, officeHours: { start: '08:00', end: '20:00' }, payment: {}, contact: {} };
  let cars = [];
  let quoteTimer = null;

  // ---------- Helpers ----------
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const enc = encodeURIComponent;

  function detectLang() {
    const nav = (navigator.language || 'fr').toLowerCase();
    if (nav.startsWith('ar')) return 'ar';
    if (nav.startsWith('en')) return 'en';
    return 'fr';
  }

  function t(key, vars = {}) {
    let s = (dict[lang] && dict[lang][key]) || dict.fr[key] || key;
    for (const [k, v] of Object.entries(vars)) s = s.split(`{${k}}`).join(v);
    return s;
  }

  function vars() {
    return {
      fee: config.deliveryFee,
      start: config.officeHours.start,
      end: config.officeHours.end,
      email: config.payment.paypalEmail || t('not_configured'),
    };
  }

  function errText(code) {
    const key = `err_${code}`;
    return dict[lang][key] ? t(key, vars()) : t('err_default');
  }

  const val = (name) => { const el = $('#bookingForm').elements.namedItem(name); return el ? el.value : ''; };

  async function getJson(url) {
    const r = await fetch(url);
    const data = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(data.error || 'default');
    return data;
  }

  // ---------- Rendering ----------
  function applyLang() {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.title = t('site_title');
    $$('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n, vars()); });
    $$('[data-lang]').forEach((b) => b.classList.toggle('active', b.dataset.lang === lang));
    renderCars();
    renderContact();
    renderTimeSlots();
    updatePayUI();
    refreshQuote();
  }

  function carImage(car) {
    if (car.image) return `<img src="${esc(car.image)}" alt="${esc(`${car.brand} ${car.model}`)}" loading="lazy">`;
    return `<div class="car-placeholder">${CAR_SVG}</div>`;
  }

  function renderCars() {
    $('#fleetGrid').innerHTML = cars.map((c) => `
      <article class="car-card ${c.available ? '' : 'is-off'}">
        <div class="car-media">${carImage(c)}</div>
        <div class="car-body">
          <span class="badge">${esc(t(`cat_${c.category}`))}</span>
          <h3>${esc(c.brand)} ${esc(c.model)}</h3>
          <ul class="specs">
            <li>${c.seats} ${esc(t('seats'))}</li>
            <li>${esc(t(`transmission_${c.transmission}`))}</li>
            <li>${esc(t(`fuel_${c.fuel}`))}</li>
          </ul>
          <div class="car-foot">
            <div class="price"><strong>${c.pricePerDay}</strong> <span>${esc(t('car_per_day'))}</span></div>
            <button class="btn btn-primary btn-sm" type="button" data-pick="${esc(c.id)}" ${c.available ? '' : 'disabled'}>
              ${esc(c.available ? t('car_choose') : t('car_unavailable'))}
            </button>
          </div>
        </div>
      </article>`).join('');

    const sel = $('#carSelect');
    const current = sel.value;
    sel.innerHTML = cars.map((c) => `
      <option value="${esc(c.id)}" ${c.available ? '' : 'disabled'}>${esc(c.brand)} ${esc(c.model)} — ${c.pricePerDay} ${esc(t('car_per_day').split('/')[0].trim())}</option>`).join('');
    if (current) sel.value = current;
  }

  function renderContact() {
    const c = config.contact || {};
    const items = [];
    if (c.phone) items.push(`<li><small>${esc(t('contact_phone'))}</small><a href="tel:${esc(c.phone)}">${esc(c.phone)}</a></li>`);
    if (c.whatsapp) items.push(`<li><small>${esc(t('contact_wa'))}</small><a href="https://wa.me/${esc(c.whatsapp.replace(/\D/g, ''))}" target="_blank" rel="noopener">${esc(c.whatsapp)}</a></li>`);
    if (c.email) items.push(`<li><small>${esc(t('contact_email'))}</small><a href="mailto:${esc(c.email)}">${esc(c.email)}</a></li>`);
    if (c.address) items.push(`<li><small>${esc(t('contact_addr'))}</small><span>${esc(c.address)}</span></li>`);
    $('#contactList').innerHTML = items.join('');
    $('#footerName').textContent = config.company || 'TuniCar';
  }

  function renderTimeSlots() {
    const sel = $('#timeSelect');
    const current = sel.value;
    const [sh, sm] = config.officeHours.start.split(':').map(Number);
    const [eh, em] = config.officeHours.end.split(':').map(Number);
    const slots = [];
    for (let m = sh * 60 + sm; m <= eh * 60 + em; m += 30) {
      const hh = String(Math.floor(m / 60)).padStart(2, '0');
      const mm = String(m % 60).padStart(2, '0');
      slots.push(`${hh}:${mm}`);
    }
    sel.innerHTML = slots.map((s) => `<option value="${s}">${s}</option>`).join('');
    if (current) sel.value = current;
  }

  function updatePayUI() {
    const method = val('paymentMethod');
    const p = config.payment || {};
    const isCrypto = method === 'crypto';
    $('#cryptoFields').classList.toggle('hidden', !isCrypto);
    $('#proofField').classList.toggle('hidden', !(isCrypto || method === 'paypal'));

    let info = '';
    if (method === 'card') info = p.cardEnabled ? t('pay_info_card') : t('pay_card_pending');
    if (method === 'paypal') info = p.paypalEmail ? t('pay_info_paypal', vars()) : t('not_configured');
    if (method === 'crypto') info = t('pay_info_crypto');
    if (method === 'cod') info = t('pay_info_cod');
    $('#payInfo').textContent = info;

    if (isCrypto) {
      const coin = val('coin');
      const addr = coin === 'BTC' ? p.btc : p.usdtTrc20;
      $('#walletAddr').textContent = addr || t('not_configured');
      $('#copyWallet').disabled = !addr;
    }
  }

  function renderSummary(q, free) {
    const body = $('#summaryBody');
    const note = $('#availNote');
    if (!q) {
      body.innerHTML = `<p class="empty">${esc(t('summary_empty'))}</p>`;
      note.textContent = '';
      note.className = 'avail';
      return;
    }
    const car = cars.find((c) => c.id === val('carId'));
    body.innerHTML = `
      <div class="sum-row"><span>${esc(car ? `${car.brand} ${car.model}` : '')}</span><span></span></div>
      <div class="sum-row"><span>${esc(t('days'))}</span><span>${q.days}</span></div>
      <div class="sum-row"><span>${esc(t('rental'))}</span><span>${q.rental} DT</span></div>
      <div class="sum-row"><span>${esc(t('delivery_fee'))}</span><span>${q.fee} DT</span></div>
      <div class="sum-row total"><span>${esc(t('total'))}</span><span>${q.total} DT</span></div>`;
    note.textContent = free ? t('free') : t('busy');
    note.className = `avail ${free ? 'ok' : 'busy'}`;
  }

  // ---------- Availability & quote ----------
  function scheduleQuote() {
    clearTimeout(quoteTimer);
    quoteTimer = setTimeout(refreshQuote, 200);
  }

  async function refreshQuote() {
    const carId = val('carId');
    const start = val('start');
    const end = val('end');
    const delivery = val('deliveryMode') === 'delivery' ? 1 : 0;
    const submit = $('#submitBtn');
    $('#endDate').min = start || todayLocal();

    if (!carId || !start || !end) { renderSummary(null); submit.disabled = false; return; }
    if (end < start) {
      renderSummary(null);
      $('#availNote').textContent = t('date_order');
      $('#availNote').className = 'avail busy';
      submit.disabled = true;
      return;
    }
    try {
      const [q, av] = await Promise.all([
        getJson(`/api/quote?carId=${enc(carId)}&start=${enc(start)}&end=${enc(end)}&delivery=${delivery}`),
        getJson(`/api/availability?carId=${enc(carId)}&start=${enc(start)}&end=${enc(end)}`),
      ]);
      renderSummary(q, av.free);
      submit.disabled = !av.free;
    } catch (err) {
      renderSummary(null);
      $('#availNote').textContent = errText(err.message);
      $('#availNote').className = 'avail busy';
      submit.disabled = true;
    }
  }

  function todayLocal() {
    return new Date().toLocaleDateString('sv-SE');
  }

  // ---------- Booking submit ----------
  function readAsDataURL(file) {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result);
      r.onerror = reject;
      r.readAsDataURL(file);
    });
  }

  function showError(msg) {
    const box = $('#formError');
    box.textContent = msg;
    box.classList.remove('hidden');
  }

  async function onSubmit(e) {
    e.preventDefault();
    $('#formError').classList.add('hidden');
    const form = $('#bookingForm');
    if (!form.reportValidity()) return;

    const payload = {
      carId: val('carId'), start: val('start'), end: val('end'),
      deliveryTime: val('deliveryTime'), deliveryMode: val('deliveryMode'), address: val('address'),
      name: val('name'), phone: val('phone'), email: val('email'), notes: val('notes'),
      paymentMethod: val('paymentMethod'), coin: val('coin'), txHash: val('txHash'), lang,
    };

    const file = form.elements.namedItem('proof').files[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) return showError(errText('proof_too_large'));
      payload.proof = await readAsDataURL(file);
    }

    const btn = $('#submitBtn');
    btn.disabled = true;
    btn.textContent = t('sending');
    try {
      const r = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data.error || 'default');
      showResult(data);
      form.reset();
      renderTimeSlots();
      updatePayUI();
      refreshQuote();
    } catch (err) {
      showError(errText(err.message));
    } finally {
      btn.textContent = t('submit');
      btn.disabled = false;
    }
  }

  function showResult(data) {
    const box = $('#bookingResult');
    let extra = '';
    if (data.paymentUrl) {
      extra = `<a class="btn btn-primary" href="${esc(data.paymentUrl)}" target="_blank" rel="noopener">${esc(t('go_pay'))}</a>`;
    } else if (data.paymentUrl === '' && $('#bookingForm').elements.namedItem('paymentMethod').value === 'card') {
      extra = `<p class="note">${esc(t('pay_card_pending'))}</p>`;
    }
    box.innerHTML = `<h4>${esc(t('success_title'))}</h4><p>${esc(t('success_body', { id: data.id }))}</p>${extra}`;
    box.classList.remove('hidden');
    box.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // ---------- Visitor tracking ----------
  function track() {
    let vid = localStorage.getItem('tc_vid');
    if (!vid) {
      vid = (crypto.randomUUID ? crypto.randomUUID() : `${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`);
      localStorage.setItem('tc_vid', vid);
    }
    const body = JSON.stringify({
      vid,
      lang,
      path: location.pathname,
      referrer: document.referrer,
      screen: `${screen.width}x${screen.height}`,
      tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
    const blob = new Blob([body], { type: 'application/json' });
    if (!navigator.sendBeacon || !navigator.sendBeacon('/api/track', blob)) {
      fetch('/api/track', { method: 'POST', body, keepalive: true, headers: { 'Content-Type': 'application/json' } }).catch(() => {});
    }
  }

  // ---------- Init ----------
  async function init() {
    try {
      const [cfg, list] = await Promise.all([getJson('/api/config'), getJson('/api/cars')]);
      config = cfg;
      cars = list;
    } catch (err) {
      showError(t('err_default'));
    }

    const today = todayLocal();
    $('#startDate').min = today;
    $('#endDate').min = today;

    applyLang();
    track();

    $$('[data-lang]').forEach((b) => b.addEventListener('click', () => {
      lang = b.dataset.lang;
      localStorage.setItem('tc_lang', lang);
      applyLang();
    }));

    $('#burger').addEventListener('click', () => $('#mainNav').classList.toggle('open'));
    $('#mainNav').addEventListener('click', (e) => {
      if (e.target.tagName === 'A') $('#mainNav').classList.remove('open');
    });

    $('#fleetGrid').addEventListener('click', (e) => {
      const btn = e.target.closest('[data-pick]');
      if (!btn) return;
      $('#carSelect').value = btn.dataset.pick;
      refreshQuote();
      document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
    });

    const form = $('#bookingForm');
    form.addEventListener('submit', onSubmit);
    form.addEventListener('change', (e) => {
      if (e.target.name === 'deliveryMode') $('#addressField').classList.toggle('hidden', val('deliveryMode') !== 'delivery');
      if (e.target.name === 'paymentMethod' || e.target.name === 'coin') updatePayUI();
      if (['carId', 'start', 'end', 'deliveryMode'].includes(e.target.name)) scheduleQuote();
    });

    $('#copyWallet').addEventListener('click', async () => {
      const text = $('#walletAddr').textContent;
      try {
        await navigator.clipboard.writeText(text);
        $('#copyWallet').textContent = t('copied');
        setTimeout(() => { $('#copyWallet').textContent = t('copy'); }, 1500);
      } catch (_) { /* clipboard unavailable */ }
    });
  }

  init();
})();
