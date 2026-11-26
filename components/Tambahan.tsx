"use client";
import { useEffect, useRef, useState } from "react";
import { ULTAH as C } from "@/data/ultah";
import { dua } from "@/lib/waktu";

/* ================= Amplop "Buka saat…" ================= */
export function BukaSaat() {
  const [dibuka, setDibuka] = useState<number[]>([]);
  const [aktif, setAktif] = useState<number | null>(null);
  const pemicu = useRef<HTMLButtonElement | null>(null);
  const tutupBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    try { setDibuka(JSON.parse(localStorage.getItem("suratDibuka") || "[]")); } catch {}
  }, []);

  const tutup = () => { setAktif(null); pemicu.current?.focus(); };

  useEffect(() => {
    if (aktif === null) return;
    tutupBtn.current?.focus();
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") tutup(); };
    addEventListener("keydown", esc);
    return () => removeEventListener("keydown", esc);
  }, [aktif]);

  const buka = (i: number, el: HTMLButtonElement) => {
    pemicu.current = el;
    setAktif(i);
    if (!dibuka.includes(i)) {
      const n = [...dibuka, i];
      setDibuka(n);
      try { localStorage.setItem("suratDibuka", JSON.stringify(n)); } catch {}
    }
  };

  return (
    <section id="bukasaat" className="bukasaat" data-cap="Buka saat">
      <div className="wrap">
        <h2>Surat kecil untuk hari-hari biasa</h2>
        <p className="lead">Ulang tahun cuma sehari. Amplop-amplop ini untuk hari lainnya. Buka satu kalau waktunya pas, nggak usah semuanya sekarang.</p>
        <ul className="bs-grid">
          {C.bukaSaat.map((s, i) => {
            const sudah = dibuka.includes(i);
            return (
              <li key={i}>
                <button type="button" className={`bs-amplop${sudah ? " sudah" : ""}`} onClick={(e) => buka(i, e.currentTarget)}
                  aria-label={`Buka saat ${s.kapan}${sudah ? " (sudah pernah dibuka)" : ""}`}>
                  <span className="bs-tutup" aria-hidden="true" />
                  <span className="bs-cap" aria-hidden="true">{sudah ? "✓" : "I"}</span>
                  <span className="bs-label"><small>Buka saat</small>{s.kapan}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {aktif !== null && (
        <div className="bs-lapis" onClick={(e) => { if (e.target === e.currentTarget) tutup(); }}>
          <div className="bs-surat" role="dialog" aria-modal="true" aria-labelledby="bs-judul">
            <button ref={tutupBtn} type="button" className="bs-x" onClick={tutup} aria-label="Tutup surat">×</button>
            <p className="bs-kecil">Buka saat</p>
            <h3 id="bs-judul">{C.bukaSaat[aktif].kapan}</h3>
            <p className="bs-isi">{C.bukaSaat[aktif].isi}</p>
            <p className="bs-ttd">— {C.panggilanKamu}</p>
          </div>
        </div>
      )}
    </section>
  );
}

/* ================= Kaset pesan suara ================= */
const fmt = (s: number) => (isFinite(s) ? `${Math.floor(s / 60)}:${dua(Math.floor(s % 60))}` : "0:00");

export function PesanSuara() {
  const audio = useRef<HTMLAudioElement>(null);
  const [ada, setAda] = useState<boolean | null>(null); // null = sedang dicek
  const [main, setMain] = useState(false);
  const [posisi, setPosisi] = useState(0);
  const [durasi, setDurasi] = useState(0);

  useEffect(() => {
    // Cek file ada atau belum; kalau belum, bagian ini tidak ditampilkan.
    fetch(C.pesanSuara.file, { method: "HEAD" })
      .then((r) => setAda(r.ok && !(r.headers.get("content-type") || "").includes("text/html")))
      .catch(() => setAda(false));
  }, []);

  if (!ada) return null;

  const toggle = () => {
    const a = audio.current; if (!a) return;
    if (a.paused) a.play().catch(() => {}); else a.pause();
  };
  const sisaRasio = durasi ? 1 - posisi / durasi : 1; // pita pindah dari gulungan kiri ke kanan

  return (
    <section id="suara" className="suara" data-cap="Kaset">
      <div className="wrap suara-grid">
        <div>
          <h2>Suara yang nggak bisa kamu dengar langsung hari ini</h2>
          <p className="lead">Aku rekam ini dari {C.kotaKamu}. Pakai earphone kalau bisa, biar rasanya aku ngomong pas di sebelahmu.</p>
          <div className="aksi">
            <button className="tombol" type="button" onClick={toggle} aria-pressed={main}>{main ? "Jeda suaraku" : "Putar suaraku"}</button>
          </div>
        </div>

        <div className="kaset-bingkai">
          <div className={`kaset${main ? " putar" : ""}`} style={{ ["--kiri" as string]: 0.55 + 0.45 * sisaRasio, ["--kanan" as string]: 0.55 + 0.45 * (1 - sisaRasio) }}>
            <div className="kaset-label">
              <span className="kaset-tulisan">{C.pesanSuara.label}</span>
              <span className="kaset-sisi">A</span>
            </div>
            <div className="kaset-jendela" aria-hidden="true">
              <span className="gulungan kiri"><i /></span>
              <span className="pita" />
              <span className="gulungan kanan"><i /></span>
            </div>
            <span className="kaset-sekrup s1" /><span className="kaset-sekrup s2" />
            <span className="kaset-sekrup s3" /><span className="kaset-sekrup s4" />
            <div className="kaset-bawah" aria-hidden="true"><i /><i /><i /><i /></div>
          </div>

          <div className="kaset-kontrol">
            <span>{fmt(posisi)}</span>
            <input type="range" min={0} max={durasi || 0} step={0.1} value={posisi} aria-label="Posisi rekaman"
              onChange={(e) => { const a = audio.current; if (a) { a.currentTime = Number(e.target.value); setPosisi(a.currentTime); } }}
              style={{ ["--isi" as string]: `${durasi ? (posisi / durasi) * 100 : 0}%` }} />
            <span>{fmt(durasi)}</span>
          </div>
        </div>
      </div>
      <audio ref={audio} src={C.pesanSuara.file} preload="metadata"
        onLoadedMetadata={(e) => setDurasi(e.currentTarget.duration)}
        onTimeUpdate={(e) => setPosisi(e.currentTarget.currentTime)}
        onPlay={() => setMain(true)} onPause={() => setMain(false)} onEnded={() => setMain(false)}
        onError={() => setAda(false)} />
    </section>
  );
}
