"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { ULTAH as C } from "@/data/ultah";
import { bagianWaktu, dua, useKurangGerak } from "@/lib/waktu";
import { TEMPAT, tabrak, ke3d, ke2d, W, H } from "./peta";
import { buatPulau, animasiOrang, type Pulau } from "./pulau";
import Lilin from "@/components/Lilin";
import { Galeri, Jarak, Perjalanan, Surat, Tiket } from "@/components/Bagian";
import { BukaSaat, PesanSuara } from "@/components/Tambahan";

const KECEPATAN = 62; // piksel peta per detik
const SUDUT_ATAS = 0.92; // kemiringan kamera (radian dari tanah)

export default function Dunia({ now, keBiasa }: { now: Date; keBiasa: () => void }) {
  const kanvas = useRef<HTMLCanvasElement>(null);
  const labelRef = useRef<Record<string, HTMLButtonElement | null>>({});
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
  const keBiasaRef = useRef(keBiasa); keBiasaRef.current = keBiasa;

  const s = useRef({
    p: { x: 240, y: 186 }, tujuan: null as null | { x: number; y: number }, nanti: null as null | string,
    tombol: new Set<string>(), arah: 0, jalan: false, azimut: 0, jarak: 32, macet: 0,
    beku: true, dekat: null as null | string, pulau: null as null | Pulau, kamera: null as null | THREE.PerspectiveCamera,
  });
  const jamDia = bagianWaktu(C.zonaDia, now), jamAku = bagianWaktu(C.zonaKamu, now);
  const [paksa, setPaksa] = useState<null | boolean>(null); // ?malam / ?siang untuk mengecek tampilan
  useEffect(() => { const q = new URLSearchParams(location.search); setPaksa(q.has("malam") ? true : q.has("siang") ? false : null); }, []);
  const malam = paksa ?? (jamDia.j >= 18 || jamDia.j < 6);
  const info = useRef({ jamDia, kurangGerak });
  info.current = { jamDia, kurangGerak };

  useEffect(() => {
    fetch(C.pesanSuara.file, { method: "HEAD" })
      .then((r) => setAdaSuara(r.ok && !(r.headers.get("content-type") || "").includes("text/html")))
      .catch(() => setAdaSuara(false));
    try { setDikunjungi(JSON.parse(localStorage.getItem("tempatDikunjungi") || "[]")); } catch {}
  }, []);

  s.current.beku = intro || panel !== null || akhir;

  const buka = useCallback((id: string) => {
    const st = s.current;
    st.tujuan = null; st.nanti = null; st.tombol.clear();
    setDaftar(false); setPanel(id);
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

  // ---------- adegan 3D ----------
  useEffect(() => {
    const cv = kanvas.current!;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true, powerPreference: "high-performance" }); }
    catch { keBiasaRef.current(); return; } // perangkat tanpa WebGL -> versi biasa
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.NoToneMapping;

    const pulau = buatPulau();
    const kamera = new THREE.PerspectiveCamera(38, 1, 0.1, 400);
    s.current.pulau = pulau; s.current.kamera = kamera;
    const fokus = new THREE.Vector3();
    const v = new THREE.Vector3();

    const ukur = () => {
      const w = innerWidth, h = innerHeight;
      renderer.setSize(w, h, false);
      kamera.aspect = w / h; kamera.updateProjectionMatrix();
      // layar lebar: dekat; HP tegak: mundur supaya cukup banyak taman terlihat
      s.current.jarak = kamera.aspect >= 1 ? 44 : Math.min(72, 16 / (Math.tan((38 * Math.PI) / 360) * kamera.aspect));
    };
    ukur(); addEventListener("resize", ukur);

    const coba = (x: number, y: number) => { if (!tabrak(x, y)) { s.current.p.x = x; s.current.p.y = y; return true; } return false; };

    const gerak = (dt: number) => {
      const st = s.current;
      st.jalan = false;
      if (st.beku) return;
      let vx = 0, vy = 0;
      if (st.tombol.size) {
        st.tujuan = null; st.nanti = null;
        // arah relatif kamera: "atas" = menjauh dari kamera
        const maju = (st.tombol.has("atas") ? 1 : 0) - (st.tombol.has("bawah") ? 1 : 0);
        const kanan = (st.tombol.has("kanan") ? 1 : 0) - (st.tombol.has("kiri") ? 1 : 0);
        const a = st.azimut;
        vx = -Math.sin(a) * maju + Math.cos(a) * kanan;
        vy = -Math.cos(a) * maju - Math.sin(a) * kanan;
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
        const t = TEMPAT.find((x) => x.id === st.nanti);
        if (t && Math.hypot(st.p.x - t.pintu[0], st.p.y - t.pintu[1]) < 24) buka(t.id);
        st.tujuan = null; st.nanti = null;
      }
      // putar badan ke arah jalan (halus)
      const target = Math.atan2(vx, vy);
      let beda = target - st.arah; beda = Math.atan2(Math.sin(beda), Math.cos(beda));
      st.arah += beda * Math.min(1, dt * 12);
    };

    const jam = new THREE.Clock();
    let lalu = 0, adaPanel = false;
    renderer.setAnimationLoop(() => {
      const t = jam.getElapsedTime(), dt = Math.min(0.05, t - lalu); lalu = t;
      const st = s.current;
      gerak(dt);

      // tempat terdekat
      let id: string | null = null, min = 18;
      for (const tp of tempatRef.current) { const d = Math.hypot(st.p.x - tp.pintu[0], st.p.y - tp.pintu[1]); if (d < min) { min = d; id = tp.id; } }
      if (id !== st.dekat) { st.dekat = id; setDekat(id); }

      // Inka
      const p3 = ke3d(st.p.x, st.p.y);
      pulau.inka.luar.position.set(p3.x, 0, p3.z);
      pulau.inka.luar.rotation.y = st.arah;
      animasiOrang(pulau.inka, t, st.jalan, info.current.kurangGerak);
      pulau.animasi(t, info.current.jamDia, info.current.kurangGerak);

      // kamera mengikuti
      fokus.lerp(v.set(p3.x, 1, p3.z), adaPanel ? 1 : 0.08);
      const r = st.jarak;
      kamera.position.set(
        fokus.x + Math.sin(st.azimut) * Math.cos(SUDUT_ATAS) * r,
        fokus.y + Math.sin(SUDUT_ATAS) * r,
        fokus.z + Math.cos(st.azimut) * Math.cos(SUDUT_ATAS) * r,
      );
      kamera.lookAt(fokus);

      // jangan render ulang di balik panel yang menutup layar
      adaPanel = !!document.querySelector(".panel");
      if (!adaPanel) renderer.render(pulau.scene, kamera);

      // label tempat (DOM, tajam)
      const lebar = innerWidth, tinggi = innerHeight;
      for (const tp of TEMPAT) {
        const el = labelRef.current[tp.id]; if (!el) continue;
        const [x, y, w, h] = tp.rect, c = ke3d(x + w / 2, y + h / 2);
        v.set(c.x, tp.tinggi + 0.4, c.z).project(kamera);
        if (v.z > 1) { el.style.opacity = "0"; continue; }
        const sx = Math.max(70, Math.min(lebar - 70, ((v.x + 1) / 2) * lebar));
        const sy = Math.max(96, Math.min(tinggi - 140, ((1 - v.y) / 2) * tinggi));
        el.style.opacity = "1";
        el.style.transform = `translate(${sx}px, ${sy}px) translate(-50%, -100%)`;
      }
    });

    return () => {
      renderer.setAnimationLoop(null); removeEventListener("resize", ukur);
      pulau.buang(); renderer.dispose();
      s.current.pulau = null; s.current.kamera = null;
    };
  }, [buka]);

  useEffect(() => { s.current.pulau?.setMalam(malam); }, [malam]);
  useEffect(() => { s.current.pulau?.setSuara(adaSuara); }, [adaSuara]);

  // ---------- keyboard ----------
  useEffect(() => {
    const peta: Record<string, string> = { arrowleft: "kiri", a: "kiri", arrowright: "kanan", d: "kanan", arrowup: "atas", w: "atas", arrowdown: "bawah", s: "bawah" };
    const turun = (e: KeyboardEvent) => {
      if (s.current.beku) return;
      if (e.key === "q" || e.key === "Q") { s.current.azimut += 0.3; return; }
      if (e.key === "e" || e.key === "E") { s.current.azimut -= 0.3; return; }
      const arah = peta[e.key.toLowerCase()];
      if (arah) { s.current.tombol.add(arah); e.preventDefault(); return; }
      if ((e.key === "Enter" || e.key === " ") && s.current.dekat && document.activeElement === kanvas.current) { e.preventDefault(); buka(s.current.dekat); }
    };
    const naik = (e: KeyboardEvent) => { const arah = peta[e.key.toLowerCase()]; if (arah) s.current.tombol.delete(arah); };
    const lepas = () => s.current.tombol.clear();
    addEventListener("keydown", turun); addEventListener("keyup", naik); addEventListener("blur", lepas);
    return () => { removeEventListener("keydown", turun); removeEventListener("keyup", naik); removeEventListener("blur", lepas); };
  }, [buka]);

  useEffect(() => {
    if (!panel) return;
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape" && !document.querySelector(".lightbox, .bs-lapis")) tutupPanel(); };
    addEventListener("keydown", esc);
    return () => removeEventListener("keydown", esc);
  }, [panel, tutupPanel]);

  // ---------- ketuk untuk jalan, geser untuk memutar kamera ----------
  const tekan = useRef<{ x: number; y: number; geser: boolean; id: number } | null>(null);
  const ray = useMemo(() => new THREE.Raycaster(), []);
  const bidang = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), []);

  const ketuk = (clientX: number, clientY: number) => {
    const st = s.current; if (st.beku || !st.kamera || !st.pulau) return;
    const box = kanvas.current!.getBoundingClientRect();
    const ndc = new THREE.Vector2(((clientX - box.left) / box.width) * 2 - 1, -((clientY - box.top) / box.height) * 2 + 1);
    ray.setFromCamera(ndc, st.kamera);
    const kena = ray.intersectObjects(st.pulau.stasiun, true)[0];
    if (kena) {
      let o: THREE.Object3D | null = kena.object;
      while (o && !o.userData.id) o = o.parent;
      if (o && tempatRef.current.some((t) => t.id === o!.userData.id)) { jalanKe(o.userData.id); return; }
    }
    const titik = new THREE.Vector3();
    if (!ray.ray.intersectPlane(bidang, titik)) return;
    const p = ke2d(titik.x, titik.z);
    st.tujuan = { x: Math.max(8, Math.min(W - 8, p.x)), y: Math.max(8, Math.min(H - 8, p.y)) }; st.nanti = null; st.macet = 0;
  };

  const onDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    tekan.current = { x: e.clientX, y: e.clientY, geser: false, id: e.pointerId };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const t = tekan.current; if (!t || t.id !== e.pointerId) return;
    const dx = e.clientX - t.x;
    if (!t.geser && Math.hypot(dx, e.clientY - t.y) > 8) t.geser = true;
    if (t.geser) { s.current.azimut -= dx * 0.008; t.x = e.clientX; t.y = e.clientY; }
  };
  const onUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const t = tekan.current; tekan.current = null;
    if (t && !t.geser) ketuk(e.clientX, e.clientY);
  };

  const namaDekat = tempat.find((t) => t.id === dekat)?.nama;
  const namaPanel = tempat.find((t) => t.id === panel)?.nama;
  const jumlahKetemu = tempat.filter((t) => dikunjungi.includes(t.id)).length;

  return (
    <div className="dunia">
      <canvas ref={kanvas} className="dunia-kanvas" tabIndex={0}
        onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={() => { tekan.current = null; }}
        aria-label="Taman ulang tahun 3D. Ketuk tempat untuk berjalan, geser untuk memutar kamera, atau pakai tombol panah lalu Enter. Daftar tempat ada di kanan atas." />

      <div className="label-lapis" aria-hidden={intro || !!panel}>
        {TEMPAT.map((t) => (
          <button key={t.id} type="button" ref={(el) => { labelRef.current[t.id] = el; }} tabIndex={-1}
            className={`label3d${dekat === t.id ? " aktif" : ""}${dikunjungi.includes(t.id) ? " sudah" : ""}`}
            hidden={!tempat.some((x) => x.id === t.id)} onClick={() => jalanKe(t.id)}>
            {t.nama}{dikunjungi.includes(t.id) ? " ✓" : ""}
          </button>
        ))}
      </div>

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
          <p className="hud-pil hud-petunjuk">Ketuk untuk berjalan · geser untuk memutar</p>
        ) : null}
      </div>
      <button type="button" className="hud-pil hud-biasa" onClick={keBiasa}>Versi biasa</button>

      {intro && (
        <div className="dunia-lapis">
          <div className="intro-kartu" data-enter>
            <p className="kicker">3 Januari 2027 · {C.kotaDia} ← {C.kotaKamu}</p>
            <h1>Selamat ulang tahun,<br /><em>{C.namaDia}</em></h1>
            <p className="lead">Aku bikinin pulau kecil buat kamu. Jalan-jalan dan datangi tiap tempat: ada {tempat.length} kejutan yang aku sembunyikan.</p>
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
            <button type="button" className="panel-x" onClick={tutupPanel} aria-label="Kembali ke pulau">×</button>
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
            <div className="aksi"><button type="button" className="tombol tombol-terang" onClick={() => setAkhir(false)}>Kembali ke pulau</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
