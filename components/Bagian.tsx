"use client";
import { useEffect, useRef, useState } from "react";
import { ULTAH as C } from "@/data/ultah";
import { bagianWaktu, dua, useKurangGerak } from "@/lib/waktu";

/* ---------- Foto dengan cadangan kalau file belum ada ---------- */
function Foto({ src, alt }: { src?: string; alt: string }) {
  const [gagal, setGagal] = useState(!src);
  return (
    <div className={`foto-bingkai${gagal ? " kosong" : ""}`}>
      {src && <img src={src} alt={alt} loading="lazy" decoding="async" onError={() => setGagal(true)} />}
    </div>
  );
}

/* ---------- Nav ---------- */
export function Nav() {
  const [solid, setSolid] = useState(false);
  const [main, setMain] = useState(false);
  const audio = useRef<HTMLAudioElement>(null);
  useEffect(() => {
    const cek = () => setSolid(scrollY > 40);
    cek(); addEventListener("scroll", cek, { passive: true });
    return () => removeEventListener("scroll", cek);
  }, []);
  const putar = () => {
    const a = audio.current; if (!a) return;
    if (a.paused) { a.play().catch(() => {}); setMain(true); } else { a.pause(); setMain(false); }
  };
  return (
    <header className={`nav${solid ? " solid" : ""}`}>
      <div className="wrap nav-isi">
        <a className="merek" href="#atas" aria-label="Kembali ke atas"><span className="cap">I</span><span>{C.panggilanDia} · 03.01</span></a>
        <nav aria-label="Bagian">
          <a href="#lilin">Lilin</a><a href="#jarak">Dua jam</a><a href="#perjalanan">Perjalanan</a><a href="#galeri">Galeri</a><a href="#surat">Surat</a>
        </nav>
        {C.lagu && (
          <>
            <button className="musik" type="button" aria-pressed={main} onClick={putar}>
              <span className="musik-bar" aria-hidden="true"><i /><i /><i /></span>
              <span>{main ? "Jeda lagu" : "Putar lagu"}</span>
            </button>
            <audio ref={audio} src={C.lagu} loop preload="none" />
          </>
        )}
      </div>
    </header>
  );
}

/* ---------- Gerbang hitung mundur ---------- */
export function Gerbang({ now }: { now: Date | null }) {
  const sisa = now ? Math.max(0, new Date(C.ultah).getTime() - now.getTime()) : 0;
  const s = Math.floor(sisa / 1000);
  const kotak = [["hari", Math.floor(s / 86400)], ["jam", Math.floor(s / 3600) % 24], ["menit", Math.floor(s / 60) % 60], ["detik", s % 60]] as const;
  return (
    <section className="gerbang">
      <div className="wrap" data-enter>
        <p className="kicker">Untuk {C.panggilanDia}, dari {C.panggilanKamu}</p>
        <h1 className="gerbang-judul">Ada yang lagi aku siapin.<br /><em>Buka lagi pas kamu ulang tahun.</em></h1>
        <div className="hitung" role="timer">
          {kotak.map(([l, v]) => <div key={l}><b>{dua(v)}</b><span>{l}</span></div>)}
        </div>
        <p className="gerbang-catatan">Terbuka 3 Januari 2027, 00.00 di tempatmu, 02.00 di tempatku.</p>
      </div>
    </section>
  );
}

/* ---------- Dua jam / jarak ---------- */
export function Jarak({ now }: { now: Date | null }) {
  const kurangGerak = useKurangGerak();
  const grid = useRef<HTMLDivElement>(null);
  const [k, setK] = useState(1);
  const hariBersama = now ? Math.max(0, Math.floor((now.getTime() - new Date(C.jadian).getTime()) / 86400000)) : 0;
  useEffect(() => {
    if (kurangGerak || !grid.current) return;
    setK(0);
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const step = (t: number) => { const p = Math.min(1, (t - t0) / 1400); setK(1 - Math.pow(1 - p, 3)); if (p < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    }, { threshold: 0.4 });
    io.observe(grid.current);
    return () => io.disconnect();
  }, [kurangGerak]);

  const fmt = (n: number) => n.toLocaleString("id-ID");
  const dia = now ? bagianWaktu(C.zonaDia, now) : null;
  const aku = now ? bagianWaktu(C.zonaKamu, now) : null;
  const langit = !dia ? "--" : dia.j < 4 ? "Larut" : dia.j < 10 ? "Pagi" : dia.j < 15 ? "Siang" : dia.j < 18 ? "Sore" : "Malam";
  const posisi = (w: { j: number; m: number } | null) => ({ ["--x" as string]: w ? `${((w.j * 60 + w.m) / 1440) * 100}%` : "50%" });

  return (
    <section id="jarak" className="jarak">
      <div className="wrap">
        <h2 className="jarak-judul">Kita dipisah <em>2 jam</em> dan <em>{fmt(C.jarakKm)} km</em>, tapi tetap di hari yang sama.</h2>
        <div className="angka-grid" ref={grid}>
          <div className="angka"><b>{fmt(Math.round(hariBersama * k))}</b><span>hari sejak kita jadian</span></div>
          <div className="angka"><b>{Math.round(2 * k)}</b><span>jam aku hidup lebih dulu darimu, cuma buat nungguin kamu</span></div>
          <div className="angka"><b>{langit}</b><span>{aku ? `di tempatmu sekarang. Di tempatku sudah jam ${dua(aku.j)}.${dua(aku.m)}.` : "langit di atasmu sekarang"}</span></div>
        </div>
        <div className="garis-waktu" aria-hidden="true">
          <div className="gw-baris"><span>Kamu</span><div className="gw-pita" style={posisi(dia)} /></div>
          <div className="gw-baris"><span>Aku</span><div className="gw-pita" style={posisi(aku)} /></div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Perjalanan ---------- */
export function Perjalanan() {
  const n = C.perjalanan.length;
  return (
    <section id="perjalanan" className="perjalanan">
      <div className="wrap">
        <h2>Perjalanan kita, kartu pos demi kartu pos</h2>
        <ol className="kartupos-list">
          {C.perjalanan.map((p, i) => (
            <li className="kartupos" key={i}>
              <Foto src={p.foto} alt={p.judul} />
              <span className="stempel" aria-hidden="true">{i === n - 1 ? <>HARI<br />INI</> : <>POS<br />{dua(i + 1)}</>}</span>
              <time>{p.tanggal}</time>
              <h3>{p.judul}</h3>
              <p>{p.cerita}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------- Galeri + lightbox ---------- */
export function Galeri() {
  const [buka, setBuka] = useState<number | null>(null);
  const tutup = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (buka === null) return;
    tutup.current?.focus();
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setBuka(null);
    addEventListener("keydown", esc);
    return () => removeEventListener("keydown", esc);
  }, [buka]);
  return (
    <section id="galeri" className="galeri">
      <div className="wrap">
        <h2>Kamu, dalam foto-foto yang aku simpan</h2>
        <div className="dinding">
          {C.foto.map((src, i) => (
            <button key={src + i} type="button" className="polaroid" aria-label={`Perbesar foto ${i + 1}`}
              onClick={(e) => { if (!e.currentTarget.querySelector(".kosong")) setBuka(i); }}>
              <Foto src={src} alt={`Foto kenangan ${i + 1}`} />
            </button>
          ))}
        </div>
      </div>
      {buka !== null && (
        <div className="lightbox" onClick={(e) => { if ((e.target as HTMLElement).tagName !== "IMG") setBuka(null); }}>
          <button ref={tutup} className="lb-tutup" type="button" aria-label="Tutup foto">×</button>
          <img src={C.foto[buka]} alt={`Foto kenangan ${buka + 1}`} />
        </div>
      )}
    </section>
  );
}

/* ---------- Surat ---------- */
export function Surat() {
  const [tahap, setTahap] = useState<"tutup" | "buka" | "baca">("tutup");
  const kurangGerak = useKurangGerak();
  const kertas = useRef<HTMLElement>(null);
  const bukaAmplop = () => {
    setTahap("buka");
    setTimeout(() => setTahap("baca"), kurangGerak ? 0 : 750);
  };
  useEffect(() => { if (tahap === "baca") kertas.current?.focus({ preventScroll: true }); }, [tahap]);
  return (
    <section id="surat" className="surat">
      <div className="wrap surat-grid">
        <div>
          <h2>Surat yang nggak muat di chat</h2>
          <p className="lead">Ditulis jam dua pagi waktu Jepang. Buka amplopnya pelan-pelan.</p>
        </div>
        <div className="amplop-bingkai">
          {tahap !== "baca" ? (
            <button className={`amplop${tahap === "buka" ? " buka" : ""}`} type="button" aria-expanded={false} onClick={bukaAmplop}>
              <span className="amplop-belakang" /><span className="amplop-tutup" /><span className="amplop-depan" />
              <span className="segel">I</span><span className="amplop-teks">Untuk {C.panggilanDia}</span>
            </button>
          ) : (
            <article className="kertas" ref={kertas} tabIndex={-1}>
              {C.surat.map((p, i) => <p key={i}>{p}</p>)}
              <p className="ttd">— {C.panggilanKamu}</p>
            </article>
          )}
        </div>
      </div>
    </section>
  );
}

/* ---------- Tiket ---------- */
export function Tiket() {
  const T = C.tiket;
  const [sobek, setSobek] = useState(false);
  useEffect(() => { try { if (localStorage.getItem("tiketDisobek")) setSobek(true); } catch {} }, []);
  const klik = () => { setSobek(true); try { localStorage.setItem("tiketDisobek", "1"); } catch {} };
  return (
    <section id="tiket" className="tiket-sek">
      <div className="wrap">
        <h2>Satu tiket, berlaku sampai kita ketemu</h2>
        <div className={`tiket${sobek ? " tersobek" : ""}`}>
          <div className="tiket-utama">
            <div className="tiket-atas"><span className="cap kecil">I</span><span>BOARDING PASS · KELAS RINDU</span></div>
            <div className="tiket-rute">
              <div><b>{T.dari}</b><span>{T.dariKota}</span></div>
              <svg viewBox="0 0 120 24" aria-hidden="true"><path d="M2 12h104" strokeDasharray="4 5" /><path d="M104 5l12 7-12 7" /></svg>
              <div><b>{T.ke}</b><span>{T.keKota}</span></div>
            </div>
            <dl className="tiket-info">
              <div><dt>Penumpang</dt><dd>{C.namaDia}</dd></div>
              <div><dt>Kursi</dt><dd>{T.kursi}</dd></div>
              <div><dt>Berlaku</dt><dd>{T.berlaku}</dd></div>
            </dl>
            <p className="tiket-janji">{T.janji}</p>
          </div>
          <div className="tiket-sobek">
            {sobek
              ? <p className="sobek-hasil">Tersimpan. Tunjukkan ke aku pas kita ketemu, ya.</p>
              : <button className="tombol" type="button" onClick={klik}>Sobek &amp; simpan tiketnya</button>}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Penutup & kaki ---------- */
export function Penutup() {
  return (
    <section className="penutup">
      <div className="wrap">
        <p className="penutup-besar">Selamat ulang tahun, <em>{C.panggilanDia}</em>.</p>
        <p className="penutup-kecil">Dari {C.namaKamu}, dua jam di depanmu, selalu.</p>
      </div>
    </section>
  );
}

export function Kaki() {
  return (
    <footer className="kaki">
      <div className="wrap kaki-isi">
        <span>Dibuat dengan sabar, dari {C.kotaKamu} untuk {C.kotaDia}.</span>
        <a href="#atas">Kembali ke atas</a>
      </div>
    </footer>
  );
}
