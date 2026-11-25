"use client";
import { useEffect, useState } from "react";
import { ULTAH as C } from "@/data/ultah";
import { useDetik } from "@/lib/waktu";
import Hero from "@/components/Hero";
import Lilin from "@/components/Lilin";
import { Nav, Gerbang, Jarak, Perjalanan, Galeri, Surat, Tiket, Penutup, Kaki } from "@/components/Bagian";
import { BukaSaat, PesanSuara } from "@/components/Tambahan";
import dynamic from "next/dynamic";

// Three.js hanya diunduh saat dunia 3D dibuka (versi biasa & hitung mundur tetap ringan).
const Dunia = dynamic(() => import("@/components/dunia/Dunia"), { ssr: false, loading: () => <div className="dunia" /> });

export default function Halaman() {
  const now = useDetik();
  const [intip, setIntip] = useState(false);
  const [mode, setMode] = useState<"dunia" | "biasa">("dunia");
  useEffect(() => {
    const q = new URLSearchParams(location.search);
    setIntip(q.has("intip"));
    if (q.has("biasa")) setMode("biasa");
  }, []);

  // Sebelum jam berjalan di browser, tampilkan latar kosong (hindari kedip isi sebelum kunci).
  if (!now) return <div className="memuat" />;

  const terkunci = C.kunciSampaiUltah && !intip && now.getTime() < new Date(C.ultah).getTime();
  if (terkunci) return <Gerbang now={now} />;

  if (mode === "dunia") return <Dunia now={now} keBiasa={() => { setMode("biasa"); scrollTo(0, 0); }} />;

  return (
    <>
      <a className="skip" href="#utama">Lewati ke isi</a>
      <Nav />
      <main id="utama">
        <Hero now={now} />
        <Lilin />
        <Jarak now={now} />
        <Perjalanan />
        <Galeri />
        <Surat />
        <PesanSuara />
        <BukaSaat />
        <Tiket />
        <Penutup />
      </main>
      <Kaki />
      <button type="button" className="ke-taman" onClick={() => { setMode("dunia"); scrollTo(0, 0); }}>Kembali ke taman</button>
    </>
  );
}
