"use client";
import { ULTAH as C } from "@/data/ultah";
import { bagianWaktu, dua } from "@/lib/waktu";

const TANDA = Array.from({ length: 12 }, (_, i) => {
  const a = (i * 30 * Math.PI) / 180, besar = i % 3 === 0, r1 = besar ? 76 : 82, r2 = 88;
  return { x1: 100 + r1 * Math.sin(a), y1: 100 - r1 * Math.cos(a), x2: 100 + r2 * Math.sin(a), y2: 100 - r2 * Math.cos(a), besar };
});

function Jam({ zona, nama, kota, kecil, now }: { zona: string; nama: string; kota: string; kecil?: boolean; now: Date | null }) {
  const w = now ? bagianWaktu(zona, now) : null;
  const rot = (deg: number) => ({ transform: `rotate(${deg}deg)` });
  return (
    <figure className={`jam${kecil ? " jam-kecil" : ""}`}>
      <svg viewBox="0 0 200 200" aria-hidden="true">
        <circle cx="100" cy="100" r="96" className="jam-muka" />
        <g className="jam-tanda">
          {TANDA.map((t, i) => <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} className={t.besar ? "besar" : undefined} />)}
        </g>
        <line x1="100" y1="100" x2="100" y2="52" className="jarum-jam" style={w ? rot((w.j % 12) * 30 + w.m * 0.5) : undefined} />
        <line x1="100" y1="100" x2="100" y2="30" className="jarum-menit" style={w ? rot(w.m * 6 + w.d * 0.1) : undefined} />
        <line x1="100" y1="112" x2="100" y2="24" className="jarum-detik" style={w ? rot(w.d * 6) : undefined} />
        <circle cx="100" cy="100" r="5" className="jam-pusat" />
      </svg>
      <div className="jam-label">
        <b className="jam-digital">{w ? `${dua(w.j)}:${dua(w.m)}` : "--:--"}</b>
        <span>{nama} · {kota}</span>
      </div>
    </figure>
  );
}

export default function Hero({ now }: { now: Date | null }) {
  return (
    <section id="atas" className="hero">
      <div className="wrap hero-grid">
        <div className="hero-teks" data-enter>
          <p className="kicker">3 Januari 2027 · {C.kotaDia} ← {C.kotaKamu}</p>
          <h1>Selamat ulang tahun,<br /><em>{C.namaDia}</em></h1>
          <p className="lead">Di tempatmu jam 00.00, di tempatku sudah 02.00. Aku duluan dua jam ke hari ini, cuma buat nungguin kamu sampai.</p>
          <div className="aksi">
            <a className="tombol" href="#lilin">Tiup lilinnya</a>
            <a className="tombol tombol-garis" href="#surat">Baca suratku</a>
          </div>
        </div>
        <div className="jam-pasang" data-enter style={{ ["--d" as string]: ".25s" }}>
          <Jam zona={C.zonaDia} nama={C.panggilanDia} kota={C.kotaDia} now={now} />
          <Jam zona={C.zonaKamu} nama={C.panggilanKamu} kota={C.kotaKamu} kecil now={now} />
          <span className="selisih" aria-hidden="true">+2 jam</span>
        </div>
      </div>
    </section>
  );
}
