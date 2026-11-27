import type { Metadata, Viewport } from "next";
import { Fredoka, Nunito, Caveat } from "next/font/google";
import "./globals.css";

const judul = Fredoka({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-judul", display: "swap" });
const sans = Nunito({ subsets: ["latin"], weight: ["400", "600", "700", "800"], variable: "--font-sans", display: "swap" });
const tangan = Caveat({ subsets: ["latin"], weight: ["500", "600"], variable: "--font-tangan", display: "swap" });

export const metadata: Metadata = {
  title: "Selamat Ulang Tahun, Inka",
  description: "Untuk Inka Puspita Ningrum, 3 Januari 2027. Dari Ean, dua jam lebih awal.",
  openGraph: { title: "Selamat Ulang Tahun, Inka", description: "Dari Hekinan ke Batam, dua jam lebih awal." },
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='14' fill='%23E95A86'/%3E%3Ctext x='16' y='22' font-size='16' text-anchor='middle' fill='%23FFF7EF' font-family='sans-serif'%3E%E2%99%A1%3C/text%3E%3C/svg%3E",
  },
};

export const viewport: Viewport = { themeColor: "#FFF7EF" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${judul.variable} ${sans.variable} ${tangan.variable}`}>
      <body>{children}</body>
    </html>
  );
}
