"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ULTAH as C } from "@/data/ultah";
import { bagianWaktu, dua, useKurangGerak } from "@/lib/waktu";
import { W, H, TEMPAT, gambarLatar, gambarDinamis, tabrak, type InfoGambar } from "./gambar";
import Lilin from "@/components/Lilin";
import { Galeri, Jarak, Perjalanan, Surat, Tiket } from "@/components/Bagian";
import { BukaSaat, PesanSuara } from "@/components/Tambahan";

type Hadap = InfoGambar["hadap"];
const KECEPATAN = 74; // piksel dunia per detik

export default function Dunia({ now, keBiasa }: { now: Date; keBiasa: () => void }) {
  const kanvas = useRef<HTMLCanvasElement>(null);
  const kurangGerak = useKurangGerak();
  const [adaSuara, setAdaSuara] = useState(false);
  const [intro, setIntro] = useState(true);
  const [panel, setPanel] = useState<string | null>(null);
  const [dekat, setDekat] = useState<string | null>(null);
  const [daftar, setDaftar] = useState(false);
  const [dikunjungi, setDikunjungi] = useState<string[]>([]);
  const [akhir, setAkhir] = useState(false);

  const tempat = useMemo(() => TEMPAT.filter((t) => t.id !== "suara" || adaSuara), [adaSuara]);
  const tempatRef = useRef(tempat); tempatRef.current = tempat;
  const dikunjungiRef = useRef(dikunjungi); dikunjungiRef.current = dikunjungi;

  const s = useRef({
    p: { x: 240, y: 176 }, tujuan: null as null | { x: number; y: number }, nanti: null as null | string,
    tombol: new Set<string>(), hadap: "bawah" as Hadap, jalan: false, cam: { x: 0, y: 0 }, skala: 1, macet: 0,
    beku: true, dekat: null as null | string,
  });
  const jamDia = bagianWaktu(C.zonaDia, now), jamAku = bagianWaktu(C.zonaKamu, now);
  const malam = jamDia.j >= 18 || jamDia.j < 6;
  const info = useRef({ jamDia, malam, kurangGerak });
  info.current = { jamDia, malam, kurangGerak };

  useEffect(() => {
    fetch(C.pesanSuara.file, { method: "HEAD" })
      .then((r) => setAdaSuara(r.ok && !(r.headers.get("content-type") || "").includes("text/html")))
      .catch(() => setAdaSuara(false));
    try { setDikunjungi(JSON.parse(localStorage.getItem("tempatDikunjungi") || "[]")); } catch {}
  }, []);

  s.current.beku = intro || panel !== null || akhir;

  const buka = useCallback((id: string) => {
    s.current.tujuan = null; s.current.nanti = null; s.current.tombol.clear();
    setDaftar(false);
    setPanel(id);
    setDikunjungi((d) => {
      if (d.includes(id)) return d;
      const n = [...d, id];
      try { localStorage.setItem("tempatDikunjungi", JSON.stringify(n)); } catch {}
      return n;
    });
  }, []);

  const jalanKe = useCallback((id: string) => {
    const t = TEMPAT.find((x) => x.id === id); if (!t) return;
    const st = s.current;
    setDaftar(false);
    if (Math.hypot(st.p.x - t.pintu[0], st.p.y - t.pintu[1]) < 6) { buka(id); return; }
    st.tujuan = { x: t.pintu[0], y: t.pintu[1] }; st.nanti = id; st.macet = 0;
  }, [buka]);

  const tutupPanel = useCallback(() => {
    setPanel(null);
    setTimeout(() => kanvas.current?.focus({ preventScroll: true }), 0);
  }, []);

  // Semua tempat sudah didatangi -> penutup (sekali per kunjungan)
  const sudahAkhir = useRef(false);
  useEffect(() => {
    if (panel === null && !sudahAkhir.current && dikunjungi.length > 0 && tempat.every((t) => dikunjungi.includes(t.id))) {
      sudahAkhir.current = true; setAkhir(true);
    }
  }, [panel, dikunjungi, tempat]);

  // ---------- loop gambar & gerak ----------
  useEffect(() => {
    const cv = kanvas.current!; const ctx = cv.getContext("2d")!;
    const latar = document.createElement("canvas"); latar.width = W; latar.height = H;
    gambarLatar(latar.getContext("2d")!, adaSuara);
    const buf = document.createElement("canvas"); buf.width = W; buf.height = H;
    const b = buf.getContext("2d")!;
    const huruf = getComputedStyle(document.body).fontFamily;
    let dpr = 1, raf = 0, lalu = performance.now();

    const ukur = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      cv.width = Math.round(innerWidth * dpr); cv.height = Math.round(innerHeight * dpr);
      // Layar lebar: penuhi layar. HP tegak: jangan terlalu dekat (minimal ±200 piksel dunia terlihat melebar).
      s.current.skala = Math.min(Math.max(cv.width / W, cv.height / H), Math.max(cv.width / W, cv.width / 200));
    };
    ukur(); addEventListener("resize", ukur);

    const coba = (x: number, y: number) => { if (!tabrak(x, y)) { s.current.p.x = x; s.current.p.y = y; return true; } return false; };

    const gerak = (dt: number) => {
      const st = s.current;
      st.jalan = false;
      if (st.beku) return;
      let vx = 0, vy = 0;
      const k = st.tombol;
      if (k.size) {
        st.tujuan = null; st.nanti = null;
        if (k.has("kiri")) vx -= 1;
        if (k.has("kanan")) vx += 1;
        if (k.has("atas")) vy -= 1;
        if (k.has("bawah")) vy += 1;
        const l = Math.hypot(vx, vy) || 1; vx /= l; vy /= l;
      } else if (st.tujuan) {
        const dx = st.tujuan.x - st.p.x, dy = st.tujuan.y - st.p.y, jarak = Math.hypot(dx, dy);
        if (jarak < 1.5) {
          st.tujuan = null;
          if (st.nanti) { const id = st.nanti; st.nanti = null; buka(id); }
          return;
        }
        vx = dx / jarak; vy = dy / jarak;
      }
      if (!vx && !vy) return;
      const d = Math.min(KECEPATAN * dt, st.tujuan ? Math.hypot(st.tujuan.x - st.p.x, st.tujuan.y - st.p.y) : Infinity);
      const ok = coba(st.p.x + vx * d, st.p.y + vy * d) || coba(st.p.x + vx * d, st.p.y) || coba(st.p.x, st.p.y + vy * d)
        || coba(st.p.x - vy * d, st.p.y + vx * d) || coba(st.p.x + vy * d, st.p.y - vx * d);
      if (ok) { st.jalan = true; st.macet = 0; }
      else if (st.tujuan && (st.macet += dt) > 0.6) {
        // benar-benar tersangkut: kalau sudah dekat tempat tujuan, buka saja
        const t = TEMPAT.find((x) => x.id === st.nanti);
        if (t && Math.hypot(st.p.x - t.pintu[0], st.p.y - t.pintu[1]) < 24) buka(t.id);
        st.tujuan = null; st.nanti = null;
      }
      st.hadap = Math.abs(vx) > Math.abs(vy) ? (vx < 0 ? "kiri" : "kanan") : vy < 0 ? "atas" : "bawah";
    };

    const pill = (teks: string, x: number, y: number, aktif: boolean) => {
      ctx.font = `600 ${12 * dpr}px ${huruf}`;
      const w = ctx.measureText(teks).width + 16 * dpr, h = 22 * dpr;
      const px = Math.max(6 * dpr, Math.min(cv.width - w - 6 * dpr, x - w / 2)), py = y - h;
      ctx.fillStyle = aktif ? "#C2412D" : "rgba(255,251,244,.94)";
      ctx.beginPath(); ctx.roundRect(px, py, w, h, 11 * dpr); ctx.fill();
      ctx.fillStyle = aktif ? "#FFF8EE" : "#2B201A";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(teks, px + w / 2, py + h / 2 + 1 * dpr);
    };

    const gambar = (t: number) => {
      const st = s.current, sk = st.skala;
      const lebar = cv.width / sk, tinggi = cv.height / sk;
      st.cam.x = lebar >= W ? (W - lebar) / 2 : Math.max(0, Math.min(W - lebar, st.p.x - lebar / 2));
      st.cam.y = tinggi >= H ? (H - tinggi) / 2 : Math.max(0, Math.min(H - tinggi, st.p.y - tinggi / 2));

      b.drawImage(latar, 0, 0);
      gambarDinamis(b, { t, pemain: st.p, hadap: st.hadap, jalan: st.jalan, jamDia: info.current.jamDia, malam: info.current.malam, diam: info.current.kurangGerak });
      if (st.tujuan) { b.strokeStyle = "rgba(194,65,45,.85)"; b.lineWidth = 1; b.beginPath(); b.ellipse(st.tujuan.x, st.tujuan.y, 5, 2.5, 0, 0, Math.PI * 2); b.stroke(); }

      ctx.imageSmoothingEnabled = false;
      ctx.fillStyle = "#A7B98A"; ctx.fillRect(0, 0, cv.width, cv.height);
      ctx.setTransform(sk, 0, 0, sk, -st.cam.x * sk, -st.cam.y * sk);
      ctx.drawImage(buf, 0, 0);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      if (info.current.malam) { ctx.fillStyle = "rgba(18,28,44,.3)"; ctx.fillRect(0, 0, cv.width, cv.height); }

      // label tempat (tajam, di ruang layar)
      for (const tp of tempatRef.current) {
        const sx = (tp.rect[0] + tp.rect[2] / 2 - st.cam.x) * sk, sy = (tp.rect[1] - st.cam.y) * sk - 4 * dpr;
        if (sx < -160 * dpr || sx > cv.width + 160 * dpr || sy < 0 || sy > cv.height + 40 * dpr) continue;
        const sudah = dikunjungiRef.current.includes(tp.id);
        pill(`${tp.nama}${sudah ? "  ✓" : ""}`, sx, Math.max(84 * dpr, sy), st.dekat === tp.id);
      }
    };

    const putar = (t: number) => {
      const dt = Math.min(0.05, (t - lalu) / 1000); lalu = t;
      gerak(dt);
      const st = s.current;
      let id: string | null = null, min = 18;
      for (const tp of tempatRef.current) { const d = Math.hypot(st.p.x - tp.pintu[0], st.p.y - tp.pintu[1]); if (d < min) { min = d; id = tp.id; } }
      if (id !== st.dekat) { st.dekat = id; setDekat(id); }
      gambar(t);
      raf = requestAnimationFrame(putar);
    };
    raf = requestAnimationFrame(putar);
    return () => { cancelAnimationFrame(raf); removeEventListener("resize", ukur); };
  }, [adaSuara, buka]);

  // ---------- input keyboard ----------
  useEffect(() => {
    const peta: Record<string, string> = { arrowleft: "kiri", a: "kiri", arrowright: "kanan", d: "kanan", arrowup: "atas", w: "atas", arrowdown: "bawah", s: "bawah" };
    const turun = (e: KeyboardEvent) => {
      if (s.current.beku) return;
      const arah = peta[e.key.toLowerCase()];
      if (arah) { s.current.tombol.add(arah); e.preventDefault(); return; }
      if ((e.key === "Enter" || e.key === " ") && s.current.dekat && document.activeElement === kanvas.current) { e.preventDefault(); buka(s.current.dekat); }
    };
    const naik = (e: KeyboardEvent) => { const arah = peta[e.key.toLowerCase()]; if (arah) s.current.tombol.delete(arah); };
    const lepas = () => s.current.tombol.clear();
    addEventListener("keydown", turun); addEventListener("keyup", naik); addEventListener("blur", lepas);
    return () => { removeEventListener("keydown", turun); removeEventListener("keyup", naik); removeEventListener("blur", lepas); };
  }, [buka]);

  // Esc menutup panel (kecuali ada jendela foto/surat kecil yang terbuka di dalamnya)
  useEffect(() => {
    if (!panel) return;
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape" && !document.querySelector(".lightbox, .bs-lapis")) tutupPanel(); };
    addEventListener("keydown", esc);
    return () => removeEventListener("keydown", esc);
  }, [panel, tutupPanel]);

  const ketuk = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const st = s.current; if (st.beku) return;
    const cv = kanvas.current!; const box = cv.getBoundingClientRect();
    const dpr = cv.width / box.width;
    const wx = st.cam.x + ((e.clientX - box.left) * dpr) / st.skala, wy = st.cam.y + ((e.clientY - box.top) * dpr) / st.skala;
    const kena = tempat.find((t) => { const [x, y, w, h] = t.rect; return wx > x - 8 && wx < x + w + 8 && wy > y - 16 && wy < y + h + 6; });
    if (kena) { jalanKe(kena.id); return; }
    st.tujuan = { x: Math.max(8, Math.min(W - 8, wx)), y: Math.max(24, Math.min(H - 4, wy)) }; st.nanti = null; st.macet = 0;
  };

  const namaDekat = tempat.find((t) => t.id === dekat)?.nama;
  const namaPanel = tempat.find((t) => t.id === panel)?.nama;
  const jumlahKetemu = tempat.filter((t) => dikunjungi.includes(t.id)).length;

  return (
    <div className="dunia">
      <canvas ref={kanvas} className="dunia-kanvas" tabIndex={0} onPointerDown={ketuk}
        aria-label="Taman ulang tahun. Ketuk tempat untuk berjalan, atau pakai tombol panah lalu Enter. Daftar tempat ada di kanan atas." />

      <div className="hud-atas">
        <div className="hud-pil">
          <span className="cap kecil">I</span><span className="hud-nama">{C.panggilanDia} · 03.01</span>
          <span className="hud-skor">{jumlahKetemu}/{tempat.length} kejutan</span>
        </div>
        <div className="hud-kanan">
          <div className="hud-pil hud-jam"><span>Kamu <b>{dua(jamDia.j)}:{dua(jamDia.m)}</b></span><span>Aku <b>{dua(jamAku.j)}:{dua(jamAku.m)}</b></span></div>
          <button type="button" className="hud-pil hud-tombol" aria-expanded={daftar} onClick={() => setDaftar((v) => !v)}>Daftar tempat</button>
        </div>
      </div>
      {daftar && (
        <ul className="hud-daftar">
          {tempat.map((t) => (
            <li key={t.id}><button type="button" onClick={() => jalanKe(t.id)}>{t.nama}{dikunjungi.includes(t.id) ? " ✓" : ""}</button></li>
          ))}
        </ul>
      )}

      <div className="hud-bawah" aria-live="polite">
        {dekat && !panel && !intro && !akhir ? (
          <button type="button" className="tombol" onClick={() => buka(dekat)}>Buka: {namaDekat}</button>
        ) : !panel && !intro && !akhir ? (
          <p className="hud-pil hud-petunjuk">Ketuk tempat mana pun untuk berjalan</p>
        ) : null}
      </div>
      <button type="button" className="hud-pil hud-biasa" onClick={keBiasa}>Versi biasa</button>

      {intro && (
        <div className="dunia-lapis">
          <div className="intro-kartu" data-enter>
            <p className="kicker">3 Januari 2027 · {C.kotaDia} ← {C.kotaKamu}</p>
            <h1>Selamat ulang tahun,<br /><em>{C.namaDia}</em></h1>
            <p className="lead">Aku bikinin taman kecil buat kamu. Jalan-jalan dan datangi tiap tempat: ada {tempat.length} kejutan yang aku sembunyikan.</p>
            <div className="aksi">
              <button type="button" className="tombol" onClick={() => { setIntro(false); setTimeout(() => kanvas.current?.focus({ preventScroll: true }), 0); }}>Mulai jalan-jalan</button>
              <button type="button" className="tombol tombol-garis" onClick={keBiasa}>Lihat versi biasa</button>
            </div>
          </div>
        </div>
      )}

      {panel && (
        <div className="panel" role="dialog" aria-modal="true" aria-label={namaPanel} onClick={(e) => { if (e.target === e.currentTarget) tutupPanel(); }}>
          <div className="panel-kotak">
            <button type="button" className="panel-x" onClick={tutupPanel} aria-label="Kembali ke taman">×</button>
            <div className="panel-isi">
              {panel === "kue" && <Lilin />}
              {panel === "galeri" && <Galeri />}
              {panel === "jam" && <Jarak now={now} />}
              {panel === "surat" && <Surat />}
              {panel === "bukasaat" && <BukaSaat />}
              {panel === "suara" && <PesanSuara />}
              {panel === "perjalanan" && <Perjalanan />}
              {panel === "tiket" && <Tiket />}
            </div>
          </div>
        </div>
      )}

      {akhir && (
        <div className="dunia-lapis akhir-lapis">
          <div className="akhir-kartu" data-enter>
            <p className="penutup-besar">Selamat ulang tahun, <em>{C.panggilanDia}</em>.</p>
            <p className="penutup-kecil">Kamu sudah menemukan semuanya. Dari {C.namaKamu}, dua jam di depanmu, selalu.</p>
            <div className="aksi"><button type="button" className="tombol tombol-terang" onClick={() => setAkhir(false)}>Kembali ke taman</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
