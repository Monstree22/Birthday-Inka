"use client";
import { useEffect, useRef, useState } from "react";
import { ULTAH as C } from "@/data/ultah";
import { dua, useKurangGerak } from "@/lib/waktu";

/* ---------- Foto dengan cadangan kalau file belum ada ---------- */
export function Foto({ src, alt }: { src?: string; alt: string }) {
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
          <a href="#langit">Langit</a><a href="#buku">Buku harian</a><a href="#surat">Surat</a><a href="#lilin">Lilin</a><a href="#satu">Satu jendela</a>
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
          <h2>Amplopnya akhirnya sampai</h2>
          <p className="lead">Dari tadi dia ikut di pojok layarmu, dapat cap pos di setiap halaman. Isinya surat yang nggak muat di chat. Buka pelan-pelan.</p>
        </div>
        <div className="amplop-bingkai">
          <span className="cap-pos cp1" aria-hidden="true">NGO</span>
          <span className="cap-pos cp2" aria-hidden="true">03·01</span>
          <span className="cap-pos cp3" aria-hidden="true">BTH</span>
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
