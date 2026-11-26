"use client";
import { useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import { ULTAH as C } from "@/data/ultah";
import { bagianWaktu, dua, useKurangGerak } from "@/lib/waktu";
import { Foto } from "@/components/Bagian";

/* ================= Progres gulir: --p 0..1 sepanjang section tinggi ================= */
function useProgres(ref: RefObject<HTMLElement | null>) {
  const kurangGerak = useKurangGerak();
  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (kurangGerak) { el.style.setProperty("--p", "1"); return; }
    let raf = 0;
    const hitung = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const jarak = Math.max(1, r.height - innerHeight);
      const p = Math.min(1, Math.max(0, -r.top / jarak));
      el.style.setProperty("--p", p.toFixed(3));
    };
    const minta = () => { if (!raf) raf = requestAnimationFrame(hitung); };
    hitung();
    addEventListener("scroll", minta, { passive: true }); addEventListener("resize", minta);
    return () => { removeEventListener("scroll", minta); removeEventListener("resize", minta); cancelAnimationFrame(raf); };
  }, [ref, kurangGerak]);
}

/* ================= Jendela (ilustrasi SVG) ================= */
function Siluet({ kota }: { kota: "nagoya" | "batam" }) {
  const g = "#141C23", lampu = "#D9A441";
  if (kota === "nagoya") return (
    <g>
      <rect x="14" y="196" width="22" height="40" fill={g} /><rect x="38" y="182" width="18" height="54" fill={g} />
      <rect x="72" y="192" width="56" height="44" fill={g} />
      <polygon points="62,194 138,194 124,182 76,182" fill={g} />
      <rect x="80" y="170" width="40" height="14" fill={g} />
      <polygon points="70,172 130,172 117,160 83,160" fill={g} />
      <rect x="88" y="150" width="24" height="12" fill={g} />
      <polygon points="80,152 120,152 110,139 90,139" fill={g} />
      <rect x="96" y="133" width="3" height="7" fill={g} /><rect x="101" y="133" width="3" height="7" fill={g} />
      <rect x="160" y="120" width="4" height="116" fill={g} /><rect x="154" y="160" width="16" height="6" fill={g} /><rect x="150" y="186" width="24" height="4" fill={g} />
      <rect x="172" y="204" width="20" height="32" fill={g} />
      {[[18, 206], [26, 216], [42, 194], [48, 210], [90, 200], [108, 212], [176, 212], [184, 222]].map(([x, y], i) => <rect key={i} x={x} y={y} width="3" height="3" fill={lampu} />)}
    </g>
  );
  return (
    <g>
      <rect x="10" y="206" width="180" height="30" fill="#1A2A36" />
      <rect x="10" y="200" width="180" height="5" fill={g} />
      <rect x="58" y="140" width="6" height="66" fill={g} /><rect x="136" y="140" width="6" height="66" fill={g} />
      {[-1, 1].flatMap((arah) => [8, 18, 28, 38].map((d) => [arah, d])).map(([arah, d], i) => (
        <g key={i} stroke={g} strokeWidth="1">
          <line x1="61" y1={146 + d / 4} x2={61 + arah * (d + 6)} y2="201" /><line x1="139" y1={146 + d / 4} x2={139 + arah * (d + 6)} y2="201" />
        </g>
      ))}
      <rect x="170" y="176" width="3" height="26" fill={g} transform="rotate(8 171 189)" />
      <path d="M172 176 q-14 -4 -20 6 M172 176 q14 -6 20 4 M172 176 q-6 -12 -16 -12 M172 176 q8 -12 18 -10" stroke={g} strokeWidth="3" fill="none" />
      <rect x="16" y="186" width="26" height="16" fill={g} /><polygon points="13,188 45,188 29,176" fill={g} />
      {[[22, 192], [32, 192], [90, 214], [120, 220], [60, 224]].map(([x, y], i) => <rect key={i} x={x} y={y} width="3" height="3" fill={lampu} opacity={i > 1 ? 0.5 : 1} />)}
    </g>
  );
}

function Jendela({ kota, jam, bulan = 1, posisiBulan = 100 }: { kota: "nagoya" | "batam"; jam: string | null; bulan?: number | string; posisiBulan?: number }) {
  return (
    <figure className={`jendela jendela-${kota}`}>
      <svg viewBox="0 0 200 260" role="img" aria-label={`Jendela di ${kota === "nagoya" ? "Nagoya" : "Batam"}, bulan yang sama di langit`}>
        <rect x="0" y="0" width="200" height="260" rx="6" fill="#E3D5BF" />
        <rect x="10" y="10" width="180" height="226" fill="#22384A" />
        <rect x="10" y="10" width="180" height="90" fill="#1B2D3C" />
        {[[30, 30], [70, 52], [150, 28], [120, 70], [40, 84], [176, 96], [96, 24]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={i % 3 ? 1 : 1.6} fill="#F3ECE1" />)}
        <g style={{ opacity: bulan } as CSSProperties}>
          <circle cx={posisiBulan} cy="62" r="18" fill="#F3ECE1" />
          <circle cx={posisiBulan + 6} cy="56" r="4" fill="#E3D8C6" /><circle cx={posisiBulan - 6} cy="68" r="3" fill="#E3D8C6" />
        </g>
        <Siluet kota={kota} />
        <rect x="97" y="10" width="6" height="226" fill="#E3D5BF" />
        <rect x="10" y="118" width="180" height="6" fill="#E3D5BF" />
        <rect x="-4" y="236" width="208" height="16" rx="3" fill="#CFC3B2" />
      </svg>
      <figcaption>
        <b>{jam ?? "--:--"}</b>
        <span>{kota === "nagoya" ? `${C.panggilanKamu} · Nagoya` : `${C.panggilanDia} · Batam`}</span>
      </figcaption>
    </figure>
  );
}

function useJam(now: Date | null) {
  if (!now) return { dia: null, aku: null };
  const d = bagianWaktu(C.zonaDia, now), a = bagianWaktu(C.zonaKamu, now);
  return { dia: `${dua(d.j)}:${dua(d.m)}`, aku: `${dua(a.j)}:${dua(a.m)}` };
}

/* ================= Adegan 1: Dua jendela ================= */
export function AdeganJendela({ now }: { now: Date | null }) {
  const ref = useRef<HTMLElement>(null);
  useProgres(ref);
  const jam = useJam(now);
  const hari = now ? Math.max(0, Math.floor((now.getTime() - new Date(C.ketemu).getTime()) / 86400000)) : 0;
  return (
    <section id="atas" ref={ref} className="adegan adegan-jendela" data-cap="Nagoya">
      <div className="panggung">
        <div className="wrap panggung-isi">
          <div className="jendela-teks" data-enter>
            <p className="kicker">3 Januari 2027 · Nagoya ← → Batam</p>
            <h1>Selamat ulang tahun,<br /><em>{C.namaDia}</em></h1>
          </div>
          <div className="jendela-pasang" data-enter style={{ ["--d" as string]: ".2s" }}>
            <Jendela kota="nagoya" jam={jam.aku} posisiBulan={140} />
            <span className="selisih-dua" aria-hidden="true">+2 jam</span>
            <Jendela kota="batam" jam={jam.dia} posisiBulan={60} />
          </div>
          <p className="jendela-fakta">
            Bulan yang sama, dua jendela. <b>{hari.toLocaleString("id-ID")}</b> hari sejak pertama ketemu, <b>{C.jarakKm.toLocaleString("id-ID")} km</b> jauhnya, dan aku selalu <b>2 jam</b> lebih dulu sampai di hari esok.
          </p>
          <p className="gulir-petunjuk" aria-hidden="true">Gulir pelan-pelan</p>
        </div>
      </div>
    </section>
  );
}

/* ================= Adegan 2: Langit yang sama ================= */
const RASI: [number, number][] = [[32, 14], [50, 14], [68, 14], [50, 38], [50, 62], [32, 86], [50, 86], [68, 86]];
const GARIS = "M32 14 L68 14 M50 14 L50 86 M32 86 L68 86";

export function AdeganLangit() {
  const ref = useRef<HTMLElement>(null);
  useProgres(ref);
  const [buka, setBuka] = useState<number | null>(null);
  const tutup = useRef<HTMLButtonElement>(null);
  const bintang = useRef(Array.from({ length: 90 }, (_, i) => ({ x: (i * 37.7) % 100, y: (i * 61.3) % 100, r: i % 5 ? 0.25 : 0.45 }))).current;
  const kenangan = RASI.slice(0, Math.max(1, Math.min(RASI.length, C.foto.length)));
  useEffect(() => {
    if (buka === null) return;
    tutup.current?.focus();
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setBuka(null); };
    addEventListener("keydown", esc); return () => removeEventListener("keydown", esc);
  }, [buka]);
  return (
    <section id="langit" ref={ref} className="adegan adegan-langit" data-cap="Langit">
      <div className="panggung">
        <div className="wrap langit-isi">
          <div className="langit-teks">
            <h2>Langit yang sama</h2>
            <p className="lead">Bulan yang kamu lihat malam ini, sudah aku lihat dua jam lebih dulu. Setiap bintang terang di sini satu kenangan kita. Ketuk salah satunya.</p>
          </div>
          <div className="langit-kotak">
            <svg viewBox="0 0 100 100" className="langit-svg" aria-hidden="true">
              {bintang.map((b, i) => <circle key={i} cx={b.x} cy={b.y} r={b.r} fill="#F3ECE1" opacity={0.5 + (i % 3) * 0.2} />)}
              <path d={GARIS} className="rasi-garis" pathLength={1} />
            </svg>
            {kenangan.map(([x, y], i) => (
              <button key={i} type="button" className="bintang-kenangan" style={{ left: `${x}%`, top: `${y}%`, ["--i" as string]: i }}
                aria-label={`Buka kenangan ${i + 1}`} onClick={() => setBuka(i)}>
                <span />
              </button>
            ))}
          </div>
        </div>
      </div>
      {buka !== null && (
        <div className="lightbox" onClick={(e) => { if (e.target === e.currentTarget) setBuka(null); }}>
          <button ref={tutup} className="lb-tutup" type="button" aria-label="Tutup kenangan" onClick={() => setBuka(null)}>×</button>
          <div className="lb-polaroid"><Foto src={C.foto[buka]} alt={`Kenangan ${buka + 1}`} /></div>
        </div>
      )}
    </section>
  );
}

/* ================= Adegan 3: Buku harian ================= */
export function AdeganBuku() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("muncul"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -15% 0px" });
    el.querySelectorAll(".entri").forEach((x) => io.observe(x));
    return () => io.disconnect();
  }, []);
  return (
    <section id="buku" ref={ref} className="adegan-buku" data-cap="Kenangan">
      <div className="wrap">
        <h2>Buku harian kita</h2>
        <p className="lead">Halaman-halaman yang kita tulis dari dua kota.</p>
        <ol className="buku-halaman">
          {C.perjalanan.map((p, i) => (
            <li className={`entri${i % 2 ? " kanan" : ""}`} key={i}>
              <div className="entri-foto"><span className="selotip" aria-hidden="true" /><Foto src={p.foto} alt={p.judul} /></div>
              <div className="entri-teks">
                <time>{p.tanggal}</time>
                <h3>{p.judul}</h3>
                <p>{p.cerita}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ================= Adegan 7: Satu jendela ================= */
export function AdeganSatu({ now }: { now: Date | null }) {
  const ref = useRef<HTMLElement>(null);
  useProgres(ref);
  const jam = useJam(now);
  return (
    <section id="satu" ref={ref} className="adegan adegan-satu">
      <div className="panggung">
        <div className="wrap panggung-isi">
          <div className="satu-pasang">
            <Jendela kota="nagoya" jam={jam.aku} posisiBulan={140} bulan="calc(1 - var(--p) * 1.6)" />
            <Jendela kota="batam" jam={jam.dia} posisiBulan={60} bulan="calc(1 - var(--p) * 1.6)" />
            <span className="satu-bulan" aria-hidden="true" />
          </div>
          <div className="satu-teks">
            <h2>Suatu hari nanti, <em>satu jendela.</em></h2>
            <p className="lead">Bukan lagi dua kota dan selisih dua jam. Sampai hari itu datang, tiket di bawah ini berlaku.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================= Amplop kecil yang ikut sepanjang cerita ================= */
export function AmplopKecil() {
  const [cap, setCap] = useState<string[]>([]);
  const [tampil, setTampil] = useState(false);
  useEffect(() => {
    let raf = 0;
    const cek = () => {
      raf = 0;
      const lewat = [...document.querySelectorAll<HTMLElement>("[data-cap]")]
        .filter((s) => s.getBoundingClientRect().top < innerHeight * 0.5).map((s) => s.dataset.cap!);
      setCap((c) => (c.length === lewat.length ? c : lewat));
      const surat = document.getElementById("surat")?.getBoundingClientRect().top ?? 9999;
      setTampil(scrollY > innerHeight * 0.6 && surat > innerHeight * 0.6);
    };
    const minta = () => { if (!raf) raf = requestAnimationFrame(cek); };
    cek(); addEventListener("scroll", minta, { passive: true }); addEventListener("resize", minta);
    return () => { removeEventListener("scroll", minta); removeEventListener("resize", minta); cancelAnimationFrame(raf); };
  }, []);
  return (
    <button type="button" className={`amplop-kecil${tampil ? " tampil" : ""}`} tabIndex={tampil ? 0 : -1} aria-hidden={!tampil}
      aria-label={`Amplop untuk ${C.panggilanDia}, ${cap.length} cap pos. Lompat ke surat`}
      onClick={() => document.getElementById("surat")?.scrollIntoView({ behavior: "smooth" })}>
      <span className="ak-badan" aria-hidden="true"><span className="ak-tutup" /><span className="ak-segel">I</span></span>
      {cap.map((c, i) => <span key={c} className="ak-cap" style={{ ["--i" as string]: i }} aria-hidden="true">{c}</span>)}
    </button>
  );
}
