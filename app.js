(() => {
  const C = window.ULTAH;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const kurangGerak = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- isi teks dari config ----------
  $$('[data-isi]').forEach(el => { el.textContent = C[el.dataset.isi] ?? ''; });
  document.title = `Selamat Ulang Tahun, ${C.panggilanDia}`;
  $$('.tulisan-kue').forEach(el => el.textContent = C.panggilanDia);
  $('.amplop-teks').textContent = `Untuk ${C.panggilanDia}`;

  // ---------- waktu per zona ----------
  const bagianWaktu = (zona, d = new Date()) => {
    const p = new Intl.DateTimeFormat('en-GB', { timeZone: zona, hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' }).formatToParts(d);
    const g = t => +p.find(x => x.type === t).value;
    return { j: g('hour'), m: g('minute'), d: g('second') };
  };
  const dua = n => String(n).padStart(2, '0');

  // ---------- gerbang / kunci ----------
  const target = new Date(C.ultah).getTime();
  const intip = new URLSearchParams(location.search).has('intip');
  const gerbang = $('#gerbang');
  let terkunci = C.kunciSampaiUltah && !intip && Date.now() < target;

  function aturKunci() {
    document.body.classList.toggle('terkunci', terkunci);
    gerbang.hidden = !terkunci;
  }
  function tickGerbang() {
    const sisa = Math.max(0, target - Date.now());
    const s = Math.floor(sisa / 1000);
    $('[data-h="hari"]').textContent = dua(Math.floor(s / 86400));
    $('[data-h="jam"]').textContent = dua(Math.floor(s / 3600) % 24);
    $('[data-h="menit"]').textContent = dua(Math.floor(s / 60) % 60);
    $('[data-h="detik"]').textContent = dua(s % 60);
    if (terkunci && sisa === 0) { terkunci = false; aturKunci(); window.scrollTo(0, 0); }
  }
  aturKunci();

  // ---------- jam analog ----------
  $$('.jam-tanda').forEach(g => {
    for (let i = 0; i < 12; i++) {
      const a = i * 30 * Math.PI / 180, besar = i % 3 === 0;
      const r1 = besar ? 76 : 82, r2 = 88;
      const l = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      l.setAttribute('x1', 100 + r1 * Math.sin(a)); l.setAttribute('y1', 100 - r1 * Math.cos(a));
      l.setAttribute('x2', 100 + r2 * Math.sin(a)); l.setAttribute('y2', 100 - r2 * Math.cos(a));
      if (besar) l.classList.add('besar');
      g.appendChild(l);
    }
  });
  function tickJam() {
    $$('.jam').forEach(f => {
      const zona = f.dataset.zona === 'dia' ? C.zonaDia : C.zonaKamu;
      const { j, m, d } = bagianWaktu(zona);
      $('.jarum-jam', f).style.transform = `rotate(${(j % 12) * 30 + m * .5}deg)`;
      $('.jarum-menit', f).style.transform = `rotate(${m * 6 + d * .1}deg)`;
      $('.jarum-detik', f).style.transform = `rotate(${d * 6}deg)`;
      $('.jam-digital', f).textContent = `${dua(j)}:${dua(m)}`;
    });
    // pita siang-malam
    const pDia = bagianWaktu(C.zonaDia), pKamu = bagianWaktu(C.zonaKamu);
    $('#pitaDia').style.setProperty('--x', ((pDia.j * 60 + pDia.m) / 1440 * 100) + '%');
    $('#pitaKamu').style.setProperty('--x', ((pKamu.j * 60 + pKamu.m) / 1440 * 100) + '%');
    const j = pDia.j;
    const langit = j < 4 ? 'Larut' : j < 10 ? 'Pagi' : j < 15 ? 'Siang' : j < 18 ? 'Sore' : 'Malam';
    $('#langit').textContent = langit;
    $('#langitTeks').textContent = `di tempatmu sekarang. Di tempatku sudah jam ${dua(pKamu.j)}.${dua(pKamu.m)}.`;
  }

  function detak() { tickGerbang(); tickJam(); }
  detak();
  setInterval(detak, 1000);

  // ---------- nav ----------
  const nav = $('.nav');
  const cekNav = () => nav.classList.toggle('solid', scrollY > 40);
  addEventListener('scroll', cekNav, { passive: true }); cekNav();

  // ---------- angka naik saat terlihat ----------
  const hariBersama = Math.max(0, Math.floor((Date.now() - new Date(C.jadian).getTime()) / 86400000));
  const fmt = n => n.toLocaleString('id-ID');
  $('#jarakKm').textContent = fmt(C.jarakKm);
  const angka = [[$('#hariBersama'), hariBersama], [$('#jamLebih'), 2]];
  angka.forEach(([el, v]) => el.textContent = fmt(v));
  if (!kurangGerak && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const step = t => {
        const k = Math.min(1, (t - t0) / 1400), e2 = 1 - Math.pow(1 - k, 3);
        angka.forEach(([el, v]) => el.textContent = fmt(Math.round(v * e2)));
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }), { threshold: .4 });
    io.observe($('.angka-grid'));
  }

  // ---------- foto dengan cadangan ----------
  function bingkaiFoto(src, alt) {
    const div = document.createElement('div');
    div.className = 'foto-bingkai';
    if (!src) { div.classList.add('kosong'); return div; }
    const img = new Image();
    img.loading = 'lazy'; img.decoding = 'async'; img.alt = alt; img.src = src;
    img.onerror = () => div.classList.add('kosong');
    div.appendChild(img);
    return div;
  }

  // ---------- kartu pos ----------
  const list = $('#kartuposList');
  C.perjalanan.forEach((p, i) => {
    const li = document.createElement('li');
    li.className = 'kartupos';
    li.appendChild(bingkaiFoto(p.foto, p.judul));
    li.insertAdjacentHTML('beforeend', `<span class="stempel" aria-hidden="true">${i === C.perjalanan.length - 1 ? 'HARI<br>INI' : 'POS<br>' + dua(i + 1)}</span>`);
    const t = document.createElement('time'); t.textContent = p.tanggal;
    const h = document.createElement('h3'); h.textContent = p.judul;
    const c = document.createElement('p'); c.textContent = p.cerita;
    li.append(t, h, c);
    list.appendChild(li);
  });

  // ---------- galeri + lightbox ----------
  const dinding = $('#dinding'), lb = $('#lightbox'), lbImg = $('img', lb);
  let pemicu = null;
  C.foto.forEach((src, i) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'polaroid';
    b.setAttribute('aria-label', `Perbesar foto ${i + 1}`);
    const fb = bingkaiFoto(src, `Foto kenangan ${i + 1}`);
    b.appendChild(fb);
    b.addEventListener('click', () => {
      if (fb.classList.contains('kosong')) return;
      pemicu = b; lbImg.src = src; lbImg.alt = `Foto kenangan ${i + 1}`;
      lb.hidden = false; $('.lb-tutup', lb).focus();
    });
    dinding.appendChild(b);
  });
  const tutupLb = () => { lb.hidden = true; pemicu && pemicu.focus(); };
  lb.addEventListener('click', e => { if (e.target !== lbImg) tutupLb(); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && !lb.hidden) tutupLb(); });

  // ---------- surat ----------
  const amplop = $('#amplop'), kertas = $('#kertas');
  C.surat.forEach(par => { const p = document.createElement('p'); p.textContent = par; kertas.appendChild(p); });
  const ttd = document.createElement('p'); ttd.className = 'ttd'; ttd.textContent = `— ${C.panggilanKamu}`; kertas.appendChild(ttd);
  amplop.addEventListener('click', () => {
    amplop.classList.add('buka');
    amplop.setAttribute('aria-expanded', 'true');
    setTimeout(() => {
      amplop.classList.add('hilang');
      kertas.hidden = false; kertas.focus({ preventScroll: true });
    }, kurangGerak ? 0 : 750);
  });

  // ---------- tiket ----------
  const T = C.tiket;
  $('#tDari').textContent = T.dari; $('#tDariKota').textContent = T.dariKota;
  $('#tKe').textContent = T.ke; $('#tKeKota').textContent = T.keKota;
  $('#tNama').textContent = C.namaDia; $('#tKursi').textContent = T.kursi;
  $('#tBerlaku').textContent = T.berlaku; $('#tJanji').textContent = T.janji;
  const sobek = $('#sobek');
  const tandaiSobek = () => { $('#tiket').classList.add('tersobek'); sobek.hidden = true; $('#sobekHasil').hidden = false; };
  try { if (localStorage.getItem('tiketDisobek')) tandaiSobek(); } catch (e) {}
  sobek.addEventListener('click', () => { tandaiSobek(); try { localStorage.setItem('tiketDisobek', '1'); } catch (e) {} });

  // ---------- lilin ----------
  const JUMLAH = 5;
  const baris = $('#lilinBaris'), status = $('#lilinStatus'), harapan = $('#harapan'), ulang = $('#nyalakanLagi'), tombolMik = $('#pakaiMik');
  let lilin = [];
  function buatLilin() {
    baris.innerHTML = ''; harapan.hidden = true; ulang.hidden = true;
    lilin = Array.from({ length: JUMLAH }, (_, i) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'lilin-satu';
      b.setAttribute('aria-label', `Tiup lilin ${i + 1}`);
      b.innerHTML = '<span class="api"></span><span class="asap"></span>';
      b.addEventListener('click', () => padamkan(b));
      baris.appendChild(b);
      return b;
    });
    status.textContent = '';
  }
  function padamkan(b) {
    if (b.classList.contains('padam')) return;
    b.classList.add('padam'); b.setAttribute('aria-label', 'Lilin sudah padam'); b.disabled = true;
    const sisa = lilin.filter(x => !x.classList.contains('padam')).length;
    status.textContent = sisa ? `${sisa} lilin lagi.` : '';
    if (!sisa) selesai();
  }
  function selesai() {
    harapan.hidden = false; ulang.hidden = false;
    status.textContent = `Selamat ulang tahun, ${C.panggilanDia}!`;
    hentikanMik();
    if (!kurangGerak) taburKelopak();
  }
  ulang.addEventListener('click', buatLilin);
  buatLilin();

  let streamMik = null, rafMik = 0;
  function hentikanMik() {
    cancelAnimationFrame(rafMik);
    if (streamMik) streamMik.getTracks().forEach(t => t.stop());
    streamMik = null; tombolMik.textContent = 'Nyalakan mikrofon';
  }
  tombolMik.addEventListener('click', async () => {
    if (streamMik) { hentikanMik(); status.textContent = ''; return; }
    if (!navigator.mediaDevices?.getUserMedia) { status.textContent = 'Browser ini nggak bisa pakai mikrofon. Ketuk lilinnya saja, ya.'; return; }
    try {
      streamMik = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const an = ctx.createAnalyser(); an.fftSize = 512;
      ctx.createMediaStreamSource(streamMik).connect(an);
      const data = new Uint8Array(an.fftSize);
      let kuat = 0;
      tombolMik.textContent = 'Matikan mikrofon';
      status.textContent = 'Sekarang tiup ke arah mikrofon…';
      const loop = () => {
        an.getByteTimeDomainData(data);
        let s = 0; for (const v of data) { const x = (v - 128) / 128; s += x * x; }
        const rms = Math.sqrt(s / data.length);
        kuat = rms > 0.18 ? kuat + 1 : Math.max(0, kuat - 1);
        if (kuat > 6) { // tiupan beberapa frame berturut-turut
          kuat = 0;
          const nyala = lilin.filter(x => !x.classList.contains('padam'));
          nyala.slice(0, Math.max(1, Math.ceil(nyala.length / 2))).forEach(padamkan);
        }
        if (streamMik) rafMik = requestAnimationFrame(loop);
      };
      loop();
    } catch (e) {
      streamMik = null;
      status.textContent = 'Mikrofon nggak diizinkan. Ketuk lilinnya satu per satu, ya.';
    }
  });

  function taburKelopak() {
    const wadah = document.createElement('div');
    wadah.setAttribute('aria-hidden', 'true');
    wadah.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:80;overflow:hidden';
    document.body.appendChild(wadah);
    const warna = ['#C2412D', '#E9A79A', '#F6D9CF', '#D9A441'];
    for (let i = 0; i < 46; i++) {
      const k = document.createElement('i');
      const ukuran = 8 + Math.random() * 10;
      k.style.cssText = `position:absolute;top:-20px;left:${Math.random() * 100}%;width:${ukuran}px;height:${ukuran * 1.3}px;background:${warna[i % 4]};border-radius:60% 0 60% 0;opacity:.9`;
      wadah.appendChild(k);
      k.animate([
        { transform: 'translate(0,0) rotate(0deg)' },
        { transform: `translate(${(Math.random() - .5) * 240}px, ${innerHeight + 40}px) rotate(${Math.random() * 720}deg)` }
      ], { duration: 3000 + Math.random() * 2500, delay: Math.random() * 800, easing: 'cubic-bezier(.3,.6,.4,1)', fill: 'forwards' });
    }
    setTimeout(() => wadah.remove(), 6500);
  }

  // ---------- musik ----------
  if (C.lagu) {
    const audio = $('#audio'), btn = $('.musik');
    audio.src = C.lagu; btn.hidden = false;
    btn.addEventListener('click', () => {
      if (audio.paused) { audio.play().catch(() => {}); btn.setAttribute('aria-pressed', 'true'); $('.musik-teks', btn).textContent = 'Jeda lagu'; }
      else { audio.pause(); btn.setAttribute('aria-pressed', 'false'); $('.musik-teks', btn).textContent = 'Putar lagu'; }
    });
  }
})();
