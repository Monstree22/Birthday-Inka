"use client";
import { useEffect, useRef, useState } from "react";
import { ULTAH as C } from "@/data/ultah";
import { bagianWaktu, dua, useKurangGerak } from "@/lib/waktu";
import Ikon from "@/components/Ikon";

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
        <a className="merek" href="#atas" aria-label="Kembali ke atas">{C.namaPasangan} <span aria-hidden="true">♡</span></a>
        <nav aria-label="Bagian">
          <a href="#kartu">Kartu</a><a href="#foto">Foto</a><a href="#kecil">Hal kecil</a><a href="#lilin">Lilin</a><a href="#tiket">Tiket</a>
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
        <p className="kicker">Untuk {C.panggilanDia}, dari {C.panggilanKamu} ♡</p>
        <h1 className="gerbang-judul">Ada yang lagi aku siapin.<br /><em>Buka lagi pas kamu ulang tahun.</em></h1>
        <div className="hitung" role="timer">
          {kotak.map(([l, v]) => <div key={l}><b>{dua(v)}</b><span>{l}</span></div>)}
        </div>
        <p className="gerbang-catatan">Terbuka 3 Januari 2027, 00.00 di {C.kotaDia}, 02.00 di {C.kotaKamu}.</p>
      </div>
    </section>
  );
}

/* ---------- Pembuka ---------- */
export function Pembuka() {
  return (
    <section id="atas" className="pembuka">
      <div className="wrap pembuka-isi">
        <div className="pembuka-teks" data-enter>
          <p className="kicker">3 Januari 2027 · {C.kotaKamu} ♡ {C.kotaDia}</p>
          <h1>Happy {C.umur}th, <span>{C.panggilanDia}</span> <i aria-hidden="true">♡</i></h1>
          <p className="lead">Website kecil ini aku bikin pelan-pelan dari {C.kotaKamu}, buat Bu Guru kesayanganku di {C.kotaDia}. Isinya kartu, foto, dan semua yang pengin aku bilang langsung.</p>
          <div className="aksi">
            <a className="tombol" href="#kartu">Buka kartunya</a>
            <a className="tombol tombol-garis" href="#foto">Lihat foto kita</a>
          </div>
        </div>
        <div className="pembuka-stiker" aria-hidden="true" data-enter style={{ ["--d" as string]: ".15s" }}>
          <div className="stiker w-pink st-1"><Ikon n="balon" className="ikon" /><b>HAPPY 25TH,<br />INKA</b></div>
          <div className="stiker w-krem st-2"><Ikon n="hatiDua" className="ikon" /><b className="lebar">{C.namaPasangan} ♡</b></div>
          <div className="stiker w-kalender st-3"><span>JANUARI</span><b>03</b><small>03.01.2027</small></div>
          <div className="stiker w-putih st-4"><Ikon n="hati" className="ikon ikon-kecil" /><em>My first love</em><small>(versi aku)</small></div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Beda dua jam ---------- */
export function DuaJam({ now }: { now: Date | null }) {
  const aku = now ? bagianWaktu(C.zonaKamu, now) : null;
  const dia = now ? bagianWaktu(C.zonaDia, now) : null;
  const hari = now ? Math.max(0, Math.floor((now.getTime() - new Date(C.ketemu).getTime()) / 86400000)) : 0;
  return (
    <section id="jarak" className="jarak">
      <div className="wrap">
        <h2>Beda 2 jam, <em>kangennya sama</em></h2>
        <p className="lead">Jamnya jalan beneran. Jam di {C.kotaKamu} selalu dua jam lebih dulu, jadi aku yang duluan kangen.</p>
        <ul className="stiker-grid jarak-grid">
          <li className="stiker w-krem jam-stiker">
            <span className="ikon-pasang"><Ikon n="jepang" className="ikon" /><Ikon n="hati" className="ikon mini" /><Ikon n="indonesia" className="ikon" /></span>
            <div className="jam-dua">
              <div><b>{aku ? `${dua(aku.j)}.${dua(aku.m)}` : "--.--"}</b><span>{C.kotaKamu}</span></div>
              <div><b>{dia ? `${dua(dia.j)}.${dua(dia.m)}` : "--.--"}</b><span>{C.kotaDia}</span></div>
            </div>
            <em>beda 2 jam, kangennya sama</em>
          </li>
          <li className="stiker w-lavender"><b className="angka">±{C.jarakKm.toLocaleString("id-ID")} km</b><em>jauh di peta, dekat di hati</em></li>
          <li className="stiker w-mint"><b className="angka">{hari} hari</b><em>sejak pertama kali ketemu, 14 Agustus 2026</em></li>
          <li className="stiker w-malam"><Ikon n="bulan" className="ikon" /><b>Langit beda,<br />bulannya sama</b></li>
          <li className="stiker w-langit"><span className="ikon-pasang"><Ikon n="fuji" className="ikon" /><Ikon n="jembatan" className="ikon" /></span><em>Fuji ke Barelang</em></li>
        </ul>
      </div>
    </section>
  );
}

/* ---------- Kartu Hati ---------- */
export function KartuHati() {
  const K = C.kartuHati;
  const [tahap, setTahap] = useState<"tutup" | "buka" | "baca">("tutup");
  const kurangGerak = useKurangGerak();
  const isi = useRef<HTMLDivElement>(null);
  const buka = () => { setTahap("buka"); setTimeout(() => setTahap("baca"), kurangGerak ? 0 : 750); };
  useEffect(() => { if (tahap === "baca") isi.current?.focus({ preventScroll: true }); }, [tahap]);
  return (
    <section id="kartu" className="kartu">
      <div className="wrap">
        <h2>Kartu hati <em>untuk kamu</em></h2>
        {tahap !== "baca" ? (
          <>
            <p className="lead">Enam bagian, disusun jadi satu hati. Ketuk amplopnya.</p>
            <div className="amplop-bingkai">
              <button className={`amplop${tahap === "buka" ? " buka" : ""}`} type="button" aria-expanded={false} onClick={buka}>
                <span className="amplop-belakang" /><span className="amplop-tutup" /><span className="amplop-depan" />
                <span className="segel">♡</span>
                <span className="amplop-teks"><b>{K.luar}</b><small>{K.luarKecil}</small></span>
              </button>
            </div>
          </>
        ) : (
          <div className="hati-grid" ref={isi} tabIndex={-1}>
            <div className="spanduk" aria-label={K.spanduk}>
              {K.spanduk.split("").map((h, i) => h === " "
                ? <span key={i} className="spasi" />
                : <span key={i} className="bendera" style={{ ["--i" as string]: i }} aria-hidden="true">{h}</span>)}
            </div>
            {K.kolom.map((k, i) => (
              <article key={i} className={`hk hk-${i + 1}`} style={{ ["--i" as string]: i }}>
                <span className="hk-no" aria-hidden="true">{i + 1}</span>
                <h3>{k.judul}</h3>
                {k.isi.map((p, j) => <p key={j}>{p}</p>)}
                {i === K.kolom.length - 1 && <p className="hk-ttd">{K.ttd}<br />— {C.panggilanKamu} ♡</p>}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------- Galeri ---------- */
export function Galeri() {
  const [buka, setBuka] = useState<number | null>(null);
  const tutup = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (buka === null) return;
    tutup.current?.focus();
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setBuka(null); };
    addEventListener("keydown", esc); return () => removeEventListener("keydown", esc);
  }, [buka]);
  return (
    <section id="foto" className="galeri">
      <div className="wrap">
        <h2>Foto-foto <em>kita</em></h2>
        <p className="lead">Ketuk fotonya buat lihat lebih besar.</p>
        <div className="dinding">
          {C.foto.map((src, i) => (
            <button key={i} type="button" className="polaroid" style={{ ["--r" as string]: `${[-2.5, 1.8, -1, 2.6, -1.8, 1.2, -2.2, 2][i % 8]}deg` }}
              aria-label={`Buka foto ${i + 1}`} onClick={() => setBuka(i)}>
              <span className="selotip" aria-hidden="true" />
              <Foto src={src} alt={`Foto kita ${i + 1}`} />
            </button>
          ))}
        </div>
      </div>
      {buka !== null && (
        <div className="lightbox" onClick={(e) => { if (e.target === e.currentTarget) setBuka(null); }}>
          <button ref={tutup} className="lb-tutup" type="button" aria-label="Tutup foto" onClick={() => setBuka(null)}>×</button>
          <div className="lb-polaroid"><Foto src={C.foto[buka]} alt={`Foto kita ${buka + 1}`} /></div>
        </div>
      )}
    </section>
  );
}

/* ---------- Hal-hal kecil kita (stiker) ---------- */
export function HalKecil() {
  return (
    <section id="kecil" className="kecil">
      <div className="wrap">
        <h2>Hal-hal kecil <em>tentang kita</em></h2>
        <p className="lead">Yang mungkin kelihatan sepele, tapi aku inget semuanya.</p>
        <ul className="stiker-grid kecil-grid">
          <li className="stiker w-krem"><span className="ikon-pasang"><Ikon n="gonggong" className="ikon" /><Ikon n="luti" className="ikon" /></span><b>Gonggong &amp; luti gendang</b><em>date soon</em></li>
          <li className="stiker w-mint"><Ikon n="tangki" className="ikon" /><b>Tangki cinta: FULL</b></li>
          <li className="stiker w-lavender chat"><span className="gelembung kiri">u always miss me right?</span><span className="gelembung kanan">Yes, I always miss you ♡</span></li>
          <li className="stiker w-pink"><Ikon n="mik" className="ikon" /><b>Konser pertama kita</b><em>padahal aku nggak suka keramaian</em></li>
          <li className="stiker w-putih"><Ikon n="bunga" className="ikon" /><b>Bunga pertamaku</b><em>buat kamu</em></li>
          <li className="stiker w-krem"><Ikon n="surat" className="ikon" /><b>Love letter #1</b><em>yang barusan kamu baca</em></li>
          <li className="stiker w-langit"><Ikon n="buku" className="ikon" /><b>Bu Guru kesayangan</b><em>semangat ngajarnya!</em></li>
          <li className="stiker w-merah"><b className="jp">大好き</b><small>daisuki = sayang banget</small></li>
          <li className="stiker w-malam"><Ikon n="bulan" className="ikon ikon-kecil" /><b className="jp">おやすみ</b><em>oyasumi, sayang</em></li>
          <li className="stiker w-krem"><span className="ikon-pasang"><Ikon n="onigiri" className="ikon" /><Ikon n="hati" className="ikon mini" /><Ikon n="gonggong" className="ikon" /></span><b>onigiri × gonggong</b></li>
          <li className="stiker w-langit"><Ikon n="pesawat" className="ikon" /><em className="besar">You noticed.<br />It landed.</em></li>
          <li className="stiker w-pink"><b className="angka">senyummu = HEALING</b><em>kamu itu cukup, lebih dari cukup</em></li>
        </ul>
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
        <h2>Satu tiket, <em>berlaku sampai kita ketemu</em></h2>
        <div className={`tiket${sobek ? " tersobek" : ""}`}>
          <div className="tiket-utama">
            <div className="tiket-atas"><span>BOARDING PASS</span><span aria-hidden="true">✈</span></div>
            <div className="tiket-badan">
              <div className="tiket-rute">
                <div><b>{T.dari}</b><span>{T.dariKota}</span></div>
                <svg viewBox="0 0 120 24" aria-hidden="true"><path d="M2 12h104" strokeDasharray="4 5" /><path d="M104 5l12 7-12 7" /></svg>
                <div><b>{T.ke}</b><span>{T.keKota}</span></div>
              </div>
              <dl className="tiket-info">
                <div><dt>Penumpang</dt><dd>{T.penumpang}</dd></div>
                <div><dt>Kursi</dt><dd>{T.kursi}</dd></div>
                <div><dt>Berlaku</dt><dd>{T.berlaku}</dd></div>
              </dl>
              <p className="tiket-janji">{T.janji}</p>
            </div>
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
      <div className="wrap penutup-isi">
        <p className="penutup-kecil">Kado utamanya:</p>
        <p className="penutup-besar">aku pulang.</p>
        <p className="penutup-ttd">Selamat ulang tahun ke-{C.umur}, {C.panggilanDia}.<br />To be continued…<br />— {C.panggilanKamu} ♡</p>
      </div>
    </section>
  );
}

export function Kaki() {
  return (
    <footer className="kaki">
      <div className="wrap kaki-isi">
        <span>Dibuat pelan-pelan dari {C.kotaKamu} untuk {C.kotaDia}.</span>
        <a href="#atas">Kembali ke atas</a>
      </div>
    </footer>
  );
}
