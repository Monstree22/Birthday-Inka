"use client";
import { useEffect, useState } from "react";

export const dua = (n: number) => String(n).padStart(2, "0");

export function bagianWaktu(zona: string, d = new Date()) {
  const p = new Intl.DateTimeFormat("en-GB", {
    timeZone: zona, hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
  }).formatToParts(d);
  const g = (t: string) => Number(p.find((x) => x.type === t)?.value ?? 0);
  return { j: g("hour"), m: g("minute"), d: g("second") };
}

/** Waktu sekarang, diperbarui tiap detik. null saat render di server (hindari beda isi server/klien). */
export function useDetik() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

export function useKurangGerak() {
  const [v, setV] = useState(false);
  useEffect(() => { setV(matchMedia("(prefers-reduced-motion: reduce)").matches); }, []);
  return v;
}
