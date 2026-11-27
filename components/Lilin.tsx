"use client";
import { useEffect, useRef, useState } from "react";
import { ULTAH as C } from "@/data/ultah";
import { useKurangGerak } from "@/lib/waktu";

const JUMLAH = 5;

function taburKelopak() {
  const wadah = document.createElement("div");
  wadah.setAttribute("aria-hidden", "true");
  wadah.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:80;overflow:hidden";
  document.body.appendChild(wadah);
  const warna = ["#E95A86", "#F6B3C8", "#D7263D", "#F7C04A"];
  for (let i = 0; i < 46; i++) {
    const k = document.createElement("i");
    const u = 8 + Math.random() * 10;
    k.style.cssText = `position:absolute;top:-20px;left:${Math.random() * 100}%;width:${u}px;height:${u * 1.3}px;background:${warna[i % 4]};border-radius:60% 0 60% 0;opacity:.9`;
    wadah.appendChild(k);
    k.animate(
      [{ transform: "translate(0,0) rotate(0deg)" }, { transform: `translate(${(Math.random() - 0.5) * 240}px, ${innerHeight + 40}px) rotate(${Math.random() * 720}deg)` }],
      { duration: 3000 + Math.random() * 2500, delay: Math.random() * 800, easing: "cubic-bezier(.3,.6,.4,1)", fill: "forwards" }
    );
  }
  setTimeout(() => wadah.remove(), 6500);
}

export default function Lilin() {
  const [padam, setPadam] = useState<boolean[]>(Array(JUMLAH).fill(false));
  const [status, setStatus] = useState("");
  const [mikAktif, setMikAktif] = useState(false);
  const stream = useRef<MediaStream | null>(null);
  const raf = useRef(0);
  const kurangGerak = useKurangGerak();
  const sisa = padam.filter((p) => !p).length;
  const selesai = sisa === 0;

  const hentikanMik = () => {
    cancelAnimationFrame(raf.current);
    stream.current?.getTracks().forEach((t) => t.stop());
    stream.current = null;
    setMikAktif(false);
  };

  useEffect(() => {
    if (!selesai) return;
    setStatus(`Selamat ulang tahun, ${C.panggilanDia}!`);
    hentikanMik();
    if (!kurangGerak) taburKelopak();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selesai]);

  useEffect(() => () => hentikanMik(), []);

  const tiupSatu = (i: number) => setPadam((p) => {
    if (p[i]) return p;
    const n = [...p]; n[i] = true;
    const s = n.filter((x) => !x).length;
    if (s) setStatus(`${s} lilin lagi.`);
    return n;
  });

  const tiupSetengah = () => setPadam((p) => {
    const nyala = p.map((x, i) => (x ? -1 : i)).filter((i) => i >= 0);
    const n = [...p];
    nyala.slice(0, Math.max(1, Math.ceil(nyala.length / 2))).forEach((i) => (n[i] = true));
    const s = n.filter((x) => !x).length;
    if (s) setStatus(`${s} lilin lagi.`);
    return n;
  });

  const ulang = () => { setPadam(Array(JUMLAH).fill(false)); setStatus(""); };

  const pakaiMik = async () => {
    if (stream.current) { hentikanMik(); setStatus(""); return; }
    if (!navigator.mediaDevices?.getUserMedia) { setStatus("Browser ini nggak bisa pakai mikrofon. Ketuk lilinnya saja, ya."); return; }
    try {
      stream.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new Ctx();
      const an = ctx.createAnalyser(); an.fftSize = 512;
      ctx.createMediaStreamSource(stream.current).connect(an);
      const data = new Uint8Array(an.fftSize);
      let kuat = 0;
      setMikAktif(true);
      setStatus("Sekarang tiup ke arah mikrofon…");
      const loop = () => {
        an.getByteTimeDomainData(data);
        let s = 0; for (const v of data) { const x = (v - 128) / 128; s += x * x; }
        kuat = Math.sqrt(s / data.length) > 0.18 ? kuat + 1 : Math.max(0, kuat - 1);
        if (kuat > 6) { kuat = 0; tiupSetengah(); }
        if (stream.current) raf.current = requestAnimationFrame(loop);
      };
      loop();
    } catch {
      stream.current = null;
      setStatus("Mikrofon nggak diizinkan. Ketuk lilinnya satu per satu, ya.");
    }
  };

  return (
    <section id="lilin" className="lilin">
      <div className="wrap lilin-grid">
        <div>
          <h2>Make a wish, <em>{C.panggilanDia}</em></h2>
          <p className="lead">Aku nggak bisa pegangin kuenya, jadi kuenya aku kirim lewat sini. Izinkan mikrofon, pejamkan mata, bikin permohonan, lalu tiup ke layar. Nggak ada mikrofon? Ketuk lilinnya satu per satu.</p>
          <div className="aksi">
            <button className="tombol" type="button" onClick={pakaiMik}>{mikAktif ? "Matikan mikrofon" : "Nyalakan mikrofon"}</button>
            {selesai && <button className="tombol tombol-garis" type="button" onClick={ulang}>Nyalakan lagi lilinnya</button>}
          </div>
          <p className="lilin-status" aria-live="polite">{status}</p>
        </div>
        <div className="kue-bingkai">
          <div className="kue">
            <div className="lilin-baris">
              {padam.map((p, i) => (
                <button key={i} type="button" className={`lilin-satu${p ? " padam" : ""}`} disabled={p}
                  aria-label={p ? "Lilin sudah padam" : `Tiup lilin ${i + 1}`} onClick={() => tiupSatu(i)}>
                  <span className="api" /><span className="asap" />
                </button>
              ))}
            </div>
            <div className="kue-lapis kue-atas"><span className="krim" /></div>
            <div className="kue-lapis kue-bawah"><span className="tulisan-kue">{C.umur}</span></div>
            <div className="piring" />
          </div>
          {selesai && <p className="harapan">Permohonanmu sudah aku dengar dari jauh. Semoga semuanya terkabul.</p>}
        </div>
      </div>
    </section>
  );
}
