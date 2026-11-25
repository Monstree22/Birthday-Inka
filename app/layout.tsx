import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope, Caveat } from "next/font/google";
import "./globals.css";

const serif = Fraunces({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-serif", display: "swap" });
const sans = Manrope({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const tangan = Caveat({ subsets: ["latin"], weight: ["500", "600"], variable: "--font-tangan", display: "swap" });

export const metadata: Metadata = {
  title: "Selamat Ulang Tahun, Inka",
  description: "Untuk Inka Puspita Ningrum, 3 Januari 2027. Dari Zean, dua jam lebih awal.",
  openGraph: { title: "Selamat Ulang Tahun, Inka", description: "Dari Jepang ke Indonesia, dua jam lebih awal." },
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='14' fill='%23C2412D'/%3E%3Ctext x='16' y='22' font-size='16' text-anchor='middle' fill='%23F3ECE1' font-family='serif'%3EI%3C/text%3E%3C/svg%3E",
  },
};

export const viewport: Viewport = { themeColor: "#F3ECE1" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${serif.variable} ${sans.variable} ${tangan.variable}`}>
      <body>{children}</body>
    </html>
  );
}
