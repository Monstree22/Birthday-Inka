/* Pixel art dunia taman: semua digambar dengan kode, tanpa file gambar. Ukuran dunia W x H piksel logis. */
export const W = 480;
export const H = 320;

type Ctx = CanvasRenderingContext2D;
export type Tempat = { id: string; nama: string; rect: [number, number, number, number]; pintu: [number, number] };

export const TEMPAT: Tempat[] = [
  { id: "kue", nama: "Zean & kue ulang tahun", rect: [218, 34, 44, 40], pintu: [240, 88] },
  { id: "galeri", nama: "Our Gallery", rect: [36, 30, 88, 64], pintu: [80, 108] },
  { id: "jam", nama: "Menara dua jam", rect: [384, 18, 36, 80], pintu: [402, 112] },
  { id: "surat", nama: "Kotak pos", rect: [56, 148, 18, 32], pintu: [66, 194] },
  { id: "bukasaat", nama: "Pohon amplop", rect: [66, 220, 52, 58], pintu: [92, 292] },
  { id: "suara", nama: "Bangku kaset", rect: [214, 262, 52, 18], pintu: [240, 252] },
  { id: "perjalanan", nama: "Papan kartu pos", rect: [392, 144, 56, 36], pintu: [420, 196] },
  { id: "tiket", nama: "Gerbang NGO → BTH", rect: [364, 236, 106, 60], pintu: [352, 268] },
];

const POHON: [number, number][] = [
  [14, 120], [20, 200], [150, 112], [176, 236], [300, 44], [330, 112], [300, 222], [462, 120],
  [458, 212], [154, 304], [306, 306], [22, 306], [192, 22], [462, 22], [16, 30], [340, 196],
];

const P = {
  rumput: "#A7B98A", rumput2: "#9AAE7C", rumput3: "#B4C497",
  jalan: "#EADCC2", jalanTepi: "#D9C6A6",
  kertas: "#FFF8EE", tinta: "#2B201A", hanko: "#C2412D", hankoG: "#9E3222", malam: "#1F2A33",
  emas: "#D9A441", kayu: "#8A5A3C", kayuT: "#A8754F", batang: "#7A5238",
  daun: "#6F8F5E", daunT: "#86A672", batu: "#E3D5BF", batuG: "#CFC3B2", biru: "#2C4A63",
};

const r = (c: Ctx, x: number, y: number, w: number, h: number, col: string) => { c.fillStyle = col; c.fillRect(Math.round(x), Math.round(y), w, h); };
const bulat = (c: Ctx, x: number, y: number, rad: number, col: string) => { c.fillStyle = col; c.beginPath(); c.arc(x, y, rad, 0, Math.PI * 2); c.fill(); };

function acak(seed: number) { return () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }; }

/* ---------- Sprite karakter (12 x 16) ---------- */
const WARNA: Record<string, string> = { h: "#2B201A", s: "#EBC09C", e: "#2B201A", m: "#C66B5A", r: "#C2412D", R: "#9E3222", k: "#2B201A", b: "#2C4A63", p: "#3B3030" };
const INKA_ATAS = ["...hhhhhh...", "..hhhhhhhh..", ".hhhsssshhh.", ".hhsesseshh.", ".hhssmmsshh.", ".hh.ssss.hh.", ".hhrrrrrrhh.", ".hrrrrrrrrh.", "..srrrrrrs..", "..srrrrrrs..", "...rrrrrr...", "...RRRRRR...", "...RRRRRR..."];
const INKA_BLKG = ["...hhhhhh...", "..hhhhhhhh..", ".hhhhhhhhhh.", ".hhhhhhhhhh.", ".hhhhhhhhhh.", ".hhhhhhhhhh.", ".hhrrrrrrhh.", ".hrrrrrrrrh.", "..srrrrrrs..", "..srrrrrrs..", "...rrrrrr...", "...RRRRRR...", "...RRRRRR..."];
const KAKI_A = ["....s..s....", "....s..s....", "...kk..kk..."];
const KAKI_B = ["....s..s....", "...s....s...", "..kk....kk.."];
const ZEAN = ["...hhhhhh...", "..hhhhhhhh..", "..hssssssh..", "..sesssess..", "..ssssssss..", "...ssmmss...", "....ssss....", "..bbbbbbbb..", ".bbbbbbbbbb.", ".sbbbbbbbbs.", ".sbbbbbbbbs.", "..bbbbbbbb..", "..pppppppp..", "..pp....pp..", "..pp....pp..", "..kk....kk.."];

function sprite(c: Ctx, rows: string[], x: number, y: number, flip = false) {
  rows.forEach((row, j) => {
    for (let i = 0; i < row.length; i++) {
      const ch = row[flip ? row.length - 1 - i : i];
      if (ch !== ".") r(c, x + i, y + j, 1, 1, WARNA[ch]);
    }
  });
}

/* ---------- Latar statis (digambar sekali) ---------- */
export function gambarLatar(c: Ctx, adaSuara: boolean) {
  const rnd = acak(7);
  r(c, 0, 0, W, H, P.rumput);
  for (let i = 0; i < 520; i++) r(c, rnd() * W, rnd() * H, 2, 1, rnd() > 0.5 ? P.rumput2 : P.rumput3);
  for (let i = 0; i < 90; i++) { const x = rnd() * W, y = rnd() * H; r(c, x, y, 2, 2, rnd() > 0.6 ? P.hanko : rnd() > 0.5 ? P.kertas : P.emas); r(c, x, y + 2, 1, 1, P.daun); }

  // jalan setapak
  const potong: [number, number, number, number][] = [
    [30, 164, 420, 16], [232, 84, 16, 172], [74, 104, 12, 62], [396, 108, 12, 58], [60, 178, 12, 18],
    [124, 178, 12, 120], [86, 286, 50, 12], [414, 178, 12, 20], [346, 178, 12, 96],
  ];
  potong.forEach(([x, y, w, h]) => r(c, x - 1, y - 1, w + 2, h + 2, P.jalanTepi));
  bulat(c, 240, 172, 27, P.jalanTepi);
  potong.forEach(([x, y, w, h]) => r(c, x, y, w, h, P.jalan));
  bulat(c, 240, 172, 26, P.jalan);
  bulat(c, 240, 172, 8, P.jalanTepi); bulat(c, 240, 172, 6, P.hanko); bulat(c, 240, 172, 2, P.kertas);

  // galeri
  r(c, 38, 44, 84, 52, P.tinta); r(c, 40, 44, 80, 50, P.kertas);
  r(c, 34, 30, 92, 16, P.hankoG); r(c, 34, 30, 92, 13, P.hanko);
  for (let i = 0; i < 92; i += 8) r(c, 34 + i, 43, 4, 3, P.hankoG);
  r(c, 72, 70, 16, 24, P.kayu); r(c, 74, 72, 12, 22, "#5A3A2A"); r(c, 84, 82, 1, 2, P.emas);
  r(c, 46, 54, 20, 15, P.tinta); r(c, 48, 56, 16, 11, "#E9A79A"); r(c, 52, 60, 6, 4, P.kertas);
  r(c, 94, 54, 20, 15, P.tinta); r(c, 96, 56, 16, 11, P.biru); r(c, 100, 59, 4, 4, P.emas);

  // menara jam
  for (let i = 0; i < 16; i++) r(c, 402 - i - 2, 18 + i, (i + 2) * 2, 1, P.malam);
  r(c, 386, 34, 32, 64, P.batuG); r(c, 388, 34, 28, 64, P.batu);
  for (let y = 40; y < 96; y += 8) r(c, 388, y, 28, 1, P.batuG);
  r(c, 396, 80, 12, 18, P.kayu); r(c, 398, 82, 8, 16, "#5A3A2A");
  bulat(c, 402, 52, 11, P.tinta); bulat(c, 402, 52, 10, P.kertas);

  // kotak pos
  r(c, 63, 166, 4, 14, "#5A3A2A");
  r(c, 56, 148, 18, 20, P.hanko); r(c, 56, 148, 18, 4, P.hankoG); r(c, 60, 156, 10, 2, P.tinta);
  r(c, 61, 153, 8, 4, P.kertas); r(c, 64, 154, 2, 1, P.hanko);

  // pohon amplop (batang; daun digambar dinamis supaya amplop bisa bergoyang)
  r(c, 88, 254, 8, 24, P.batang); r(c, 86, 276, 12, 2, P.batang);

  // bangku
  r(c, 218, 272, 3, 8, P.kayu); r(c, 259, 272, 3, 8, P.kayu);
  r(c, 214, 268, 52, 5, P.kayuT); r(c, 214, 268, 52, 1, P.kayu); r(c, 214, 262, 52, 3, P.kayuT);
  if (adaSuara) { r(c, 232, 263, 14, 7, P.hanko); r(c, 234, 264, 10, 3, P.kertas); r(c, 235, 267, 2, 2, P.tinta); r(c, 241, 267, 2, 2, P.tinta); }

  // papan kartu pos
  r(c, 398, 166, 4, 14, P.kayu); r(c, 438, 166, 4, 14, P.kayu);
  r(c, 392, 144, 56, 26, P.kayu); r(c, 394, 146, 52, 22, P.kayuT);
  ([[398, 149, P.kertas], [410, 151, "#E9A79A"], [422, 148, P.kertas], [434, 150, "#F6D9CF"]] as [number, number, string][]).forEach(([x, y, col]) => {
    r(c, x, y, 10, 14, col); r(c, x + 6, y + 2, 2, 2, P.hanko);
  });

  // bandara: landasan + pesawat + papan
  r(c, 364, 278, 106, 14, "#9AA0A6"); for (let x = 368; x < 466; x += 10) r(c, x, 284, 5, 2, P.kertas);
  r(c, 386, 256, 60, 11, P.tinta); r(c, 386, 257, 60, 9, P.kertas); r(c, 446, 258, 6, 7, P.kertas); r(c, 452, 260, 2, 3, P.kertas);
  r(c, 386, 246, 8, 11, P.hanko); r(c, 404, 249, 18, 7, P.batuG); r(c, 404, 266, 18, 7, P.batuG);
  for (let x = 398; x < 444; x += 5) r(c, x, 259, 2, 2, P.biru);
  r(c, 386, 262, 60, 1, P.hanko);
  r(c, 364, 236, 24, 16, P.malam); r(c, 366, 238, 20, 6, P.emas); r(c, 374, 252, 2, 14, P.tinta);
}

/* ---------- Bagian yang bergerak ---------- */
export type InfoGambar = {
  t: number; pemain: { x: number; y: number }; hadap: "bawah" | "atas" | "kiri" | "kanan"; jalan: boolean;
  jamDia: { j: number; m: number } | null; malam: boolean; diam: boolean;
};

function pohon(c: Ctx, x: number, y: number) {
  r(c, x - 5, y - 1, 10, 2, "rgba(43,32,26,.18)");
  r(c, x - 2, y - 7, 4, 7, P.batang);
  bulat(c, x, y - 14, 9, P.daun); bulat(c, x - 3, y - 17, 4, P.daunT);
}

function inka(c: Ctx, info: InfoGambar) {
  const { x, y } = info.pemain;
  const langkah = info.jalan && Math.floor(info.t / 160) % 2 === 1;
  r(c, x - 5, y - 1, 10, 2, "rgba(43,32,26,.22)");
  const badan = info.hadap === "atas" ? INKA_BLKG : INKA_ATAS;
  const flip = info.hadap === "kiri";
  const naik = langkah ? -1 : 0;
  sprite(c, badan, Math.round(x - 6), Math.round(y - 16 + naik), flip);
  sprite(c, langkah ? KAKI_B : KAKI_A, Math.round(x - 6), Math.round(y - 3), flip);
}

export function gambarDinamis(c: Ctx, info: InfoGambar) {
  const { t, diam } = info;

  // jarum menara jam (waktu Inka)
  if (info.jamDia) {
    const sudutJ = ((info.jamDia.j % 12) + info.jamDia.m / 60) * (Math.PI / 6);
    const sudutM = info.jamDia.m * (Math.PI / 30);
    c.strokeStyle = P.tinta; c.lineCap = "round";
    c.lineWidth = 2; c.beginPath(); c.moveTo(402, 52); c.lineTo(402 + Math.sin(sudutJ) * 5, 52 - Math.cos(sudutJ) * 5); c.stroke();
    c.lineWidth = 1; c.beginPath(); c.moveTo(402, 52); c.lineTo(402 + Math.sin(sudutM) * 8, 52 - Math.cos(sudutM) * 8); c.stroke();
    r(c, 401, 51, 2, 2, P.hanko);
  }

  // Zean di belakang meja kue
  const ayun = diam ? 0 : Math.round(Math.sin(t / 420));
  r(c, 230, 73, 20, 2, "rgba(43,32,26,.18)");
  sprite(c, ZEAN, 234, 30 + ayun);
  r(c, 222, 60, 3, 13, P.kayu); r(c, 255, 60, 3, 13, P.kayu); r(c, 220, 56, 40, 5, P.kayuT); r(c, 220, 60, 40, 1, P.kayu);
  r(c, 231, 47, 18, 9, P.hanko); r(c, 231, 45, 18, 3, P.kertas); r(c, 231, 48, 18, 1, "#F6D9CF");
  for (let i = 0; i < 5; i++) {
    const x = 233 + i * 3.5;
    r(c, x, 41, 1, 4, i % 2 ? P.kertas : "#F6D9CF");
    const nyala = diam || Math.floor(t / 130 + i) % 3 !== 0;
    r(c, x, 39, 1, 2, nyala ? "#FFC24B" : "#FF8A3D");
  }

  // daun pohon amplop + amplop bergoyang
  bulat(c, 92, 240, 20, P.daun); bulat(c, 77, 248, 12, P.daun); bulat(c, 107, 248, 12, P.daun); bulat(c, 86, 233, 8, P.daunT);
  [[78, 246], [92, 238], [104, 250], [86, 254], [100, 236], [72, 254]].forEach(([x, y], i) => {
    const g = diam ? 0 : Math.round(Math.sin(t / 500 + i));
    r(c, x + g, y - 3, 1, 3, P.batang);
    r(c, x - 3 + g, y, 7, 5, P.kertas); r(c, x - 3 + g, y, 7, 1, P.batuG); r(c, x + g, y + 2, 1, 1, P.hanko);
  });

  // lampu jendela di malam hari
  if (info.malam) {
    c.fillStyle = "rgba(255,200,90,.35)";
    [[56, 61], [104, 61], [402, 52]].forEach(([x, y]) => { c.beginPath(); c.arc(x, y, 14, 0, Math.PI * 2); c.fill(); });
  }

  // pohon & pemain, diurutkan dari atas ke bawah supaya bisa "di belakang" pohon
  const benda: { y: number; gambar: () => void }[] = POHON.map(([x, y]) => ({ y, gambar: () => pohon(c, x, y) }));
  benda.push({ y: info.pemain.y, gambar: () => inka(c, info) });
  benda.sort((a, b) => a.y - b.y).forEach((b) => b.gambar());
}

/* ---------- Tabrakan ---------- */
export function tabrak(x: number, y: number): boolean {
  if (x < 6 || x > W - 6 || y < 22 || y > H - 3) return true;
  const kx = x - 3, ky = y - 3, kw = 6, kh = 3;
  const kena = (a: number, b: number, w: number, h: number) => kx < a + w && kx + kw > a && ky < b + h && ky + kh > b;
  for (const t of TEMPAT) if (kena(...t.rect)) return true;
  for (const [px, py] of POHON) if (kena(px - 3, py - 4, 6, 4)) return true;
  return false;
}
