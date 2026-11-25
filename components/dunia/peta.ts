/* Peta dunia taman dalam koordinat 2D (W x H). Gerak & tabrakan dihitung di sini; pulau 3D memakai ke3d(). */
export const W = 480;
export const H = 320;

export type Tempat = { id: string; nama: string; rect: [number, number, number, number]; pintu: [number, number]; tinggi: number };

export const TEMPAT: Tempat[] = [
  { id: "kue", nama: "Zean & kue ulang tahun", rect: [218, 34, 44, 40], pintu: [240, 88], tinggi: 3.6 },
  { id: "galeri", nama: "Our Gallery", rect: [36, 30, 88, 64], pintu: [80, 108], tinggi: 5.6 },
  { id: "jam", nama: "Menara dua jam", rect: [384, 18, 36, 80], pintu: [402, 112], tinggi: 9.4 },
  { id: "surat", nama: "Kotak pos", rect: [56, 148, 18, 32], pintu: [66, 194], tinggi: 3.2 },
  { id: "bukasaat", nama: "Pohon amplop", rect: [66, 220, 52, 58], pintu: [92, 292], tinggi: 5.8 },
  { id: "suara", nama: "Bangku kaset", rect: [214, 262, 52, 18], pintu: [240, 252], tinggi: 2.2 },
  { id: "perjalanan", nama: "Papan kartu pos", rect: [392, 144, 56, 36], pintu: [420, 196], tinggi: 3.8 },
  { id: "tiket", nama: "Gerbang NGO → BTH", rect: [364, 236, 106, 60], pintu: [352, 268], tinggi: 3.4 },
];

export const POHON: [number, number][] = [
  [14, 120], [20, 200], [150, 112], [176, 236], [300, 44], [330, 112], [300, 222], [462, 120],
  [458, 212], [154, 304], [306, 306], [22, 306], [192, 22], [462, 22], [16, 30], [340, 196],
];

/* Lampu taman di sudut alun-alun */
export const LAMPU: [number, number][] = [[206, 140], [274, 140], [206, 204], [274, 204]];

/* Jalan setapak (rect 2D) */
export const JALAN: [number, number, number, number][] = [
  [30, 164, 420, 16], [232, 84, 16, 172], [74, 104, 12, 62], [396, 108, 12, 58], [60, 178, 12, 18],
  [124, 178, 12, 120], [86, 286, 50, 12], [414, 178, 12, 20], [346, 178, 12, 96],
];

/* 1 satuan 3D = 10 piksel peta; pusat pulau di (240, 170). */
export const ke3d = (x: number, y: number) => ({ x: (x - 240) / 10, z: (y - 170) / 10 });
export const ke2d = (x: number, z: number) => ({ x: x * 10 + 240, y: z * 10 + 170 });

/* Pulau berbentuk elips; titik di luar elips dianggap jurang. */
export const RX = 30, RZ = 22;
export const diPulau = (x: number, y: number, tepi = 0) => {
  const p = ke3d(x, y);
  return (p.x / (RX - tepi)) ** 2 + (p.z / (RZ - tepi)) ** 2 <= 1;
};

export function tabrak(x: number, y: number): boolean {
  if (!diPulau(x, y, 1.2)) return true;
  const kx = x - 3, ky = y - 3, kw = 6, kh = 3;
  const kena = (a: number, b: number, w: number, h: number) => kx < a + w && kx + kw > a && ky < b + h && ky + kh > b;
  for (const t of TEMPAT) if (kena(...t.rect)) return true;
  for (const [px, py] of POHON) if (kena(px - 4, py - 4, 8, 6)) return true;
  for (const [px, py] of LAMPU) if (kena(px - 2, py - 2, 4, 4)) return true;
  return false;
}
