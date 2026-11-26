"use client";
import { useEffect, useState } from "react";
import { ULTAH as C } from "@/data/ultah";
import { useDetik } from "@/lib/waktu";
import Lilin from "@/components/Lilin";
import { Nav, Gerbang, Surat, Tiket, Penutup, Kaki } from "@/components/Bagian";
import { BukaSaat, PesanSuara } from "@/components/Tambahan";
import { AdeganJendela, AdeganLangit, AdeganBuku, AdeganSatu, AmplopKecil } from "@/components/cerita/Adegan";

export default function Halaman() {
  const now = useDetik();
  const [intip, setIntip] = useState(false);
  useEffect(() => { setIntip(new URLSearchParams(location.search).has("intip")); }, []);

  // Sebelum jam berjalan di browser, tampilkan latar kosong (hindari kedip isi sebelum kunci).
  if (!now) return <div className="memuat" />;

  const terkunci = C.kunciSampaiUltah && !intip && now.getTime() < new Date(C.ultah).getTime();
  if (terkunci) return <Gerbang now={now} />;

  return (
    <>
      <a className="skip" href="#utama">Lewati ke isi</a>
      <Nav />
      <main id="utama">
        <AdeganJendela now={now} />
        <AdeganLangit />
        <AdeganBuku />
        <PesanSuara />
        <BukaSaat />
        <Surat />
        <Lilin />
        <AdeganSatu now={now} />
        <Tiket />
        <Penutup />
      </main>
      <Kaki />
      <AmplopKecil />
    </>
  );
}
