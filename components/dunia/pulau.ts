/* Pulau 3D low-poly: semua model dibangun dari bentuk dasar Three.js (tanpa file model). */
import * as THREE from "three";
import { TEMPAT, POHON, JALAN, LAMPU, ke3d, RX, RZ } from "./peta";

const WARNA = {
  rumput: "#9DB57F", rumputT: "#B2C795", tanah: "#B98B62", batuDasar: "#8E6A4E",
  jalan: "#EADCC2", kertas: "#FFF8EE", tinta: "#2B201A", hanko: "#C2412D", hankoG: "#9E3222",
  malam: "#1F2A33", emas: "#D9A441", kayu: "#8A5A3C", kayuT: "#A8754F", batang: "#7A5238",
  daun: "#6F8F5E", daunT: "#86A672", batu: "#E8DCC8", batuG: "#CFC3B2", biru: "#2C4A63",
  kulit: "#EBC09C", rambut: "#2B201A", pipi: "#E9A79A",
};

/* ---------- bahan & bentuk dasar ---------- */
const cacheBahan = new Map<string, THREE.MeshStandardMaterial>();
function bahan(warna: string) {
  if (!cacheBahan.has(warna)) cacheBahan.set(warna, new THREE.MeshStandardMaterial({ color: warna, flatShading: true, roughness: 0.85, metalness: 0 }));
  return cacheBahan.get(warna)!;
}
function pasang(g: THREE.BufferGeometry, m: THREE.Material, x: number, y: number, z: number, induk?: THREE.Object3D) {
  const mesh = new THREE.Mesh(g, m);
  mesh.position.set(x, y, z); mesh.castShadow = true; mesh.receiveShadow = true;
  induk?.add(mesh);
  return mesh;
}
const kotak = (w: number, h: number, d: number, w8: string, x = 0, y = 0, z = 0, p?: THREE.Object3D) => pasang(new THREE.BoxGeometry(w, h, d), bahan(w8), x, y, z, p);
const tabung = (rt: number, rb: number, h: number, seg: number, w8: string, x = 0, y = 0, z = 0, p?: THREE.Object3D) => pasang(new THREE.CylinderGeometry(rt, rb, h, seg), bahan(w8), x, y, z, p);
const kerucut = (r: number, h: number, seg: number, w8: string, x = 0, y = 0, z = 0, p?: THREE.Object3D) => pasang(new THREE.ConeGeometry(r, h, seg), bahan(w8), x, y, z, p);
const bola = (r: number, detail: number, w8: string, x = 0, y = 0, z = 0, p?: THREE.Object3D) => pasang(new THREE.IcosahedronGeometry(r, detail), bahan(w8), x, y, z, p);
/* bahan yang bisa menyala di malam hari (jendela, muka jam) */
function bisaNyala(mesh: THREE.Mesh, cahaya: string, daftar: THREE.MeshStandardMaterial[]) {
  const m = (mesh.material as THREE.MeshStandardMaterial).clone();
  m.emissive = new THREE.Color(cahaya); m.emissiveIntensity = 0;
  mesh.material = m; daftar.push(m);
}

function acak(seed: number) { return () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }; }

/* ---------- karakter ---------- */
export type Orang = { luar: THREE.Group; tubuh: THREE.Group; kakiK: THREE.Group; kakiKa: THREE.Group; tanganK: THREE.Group; tanganKa: THREE.Group };

function buatOrang(o: { baju: string; bawah: string; perempuan: boolean }): Orang {
  const luar = new THREE.Group(), tubuh = new THREE.Group();
  luar.add(tubuh);
  const kaki = (x: number) => {
    const g = new THREE.Group(); g.position.set(x, 0.66, 0); tubuh.add(g);
    kotak(0.17, 0.6, 0.2, o.perempuan ? WARNA.kulit : o.bawah, 0, -0.3, 0, g);
    kotak(0.2, 0.1, 0.3, WARNA.tinta, 0, -0.6, 0.04, g);
    return g;
  };
  const kakiK = kaki(-0.13), kakiKa = kaki(0.13);
  if (o.perempuan) {
    tabung(0.25, 0.5, 0.9, 8, o.baju, 0, 1.0, 0, tubuh);
  } else {
    kotak(0.56, 0.22, 0.32, o.bawah, 0, 0.74, 0, tubuh);
    kotak(0.62, 0.66, 0.36, o.baju, 0, 1.16, 0, tubuh);
  }
  const tangan = (x: number) => {
    const g = new THREE.Group(); g.position.set(x, 1.4, 0); tubuh.add(g);
    kotak(0.17, 0.26, 0.17, o.baju, 0, -0.1, 0, g);
    kotak(0.13, 0.5, 0.13, WARNA.kulit, 0, -0.36, 0, g);
    return g;
  };
  const tanganK = tangan(o.perempuan ? -0.33 : -0.4), tanganKa = tangan(o.perempuan ? 0.33 : 0.4);
  kotak(0.15, 0.14, 0.15, WARNA.kulit, 0, 1.52, 0, tubuh);
  bola(0.34, 1, WARNA.kulit, 0, 1.86, 0, tubuh);
  kotak(0.06, 0.09, 0.03, WARNA.tinta, -0.12, 1.88, 0.31, tubuh);
  kotak(0.06, 0.09, 0.03, WARNA.tinta, 0.12, 1.88, 0.31, tubuh);
  kotak(0.09, 0.05, 0.02, WARNA.pipi, -0.2, 1.78, 0.28, tubuh);
  kotak(0.09, 0.05, 0.02, WARNA.pipi, 0.2, 1.78, 0.28, tubuh);
  const topi = pasang(new THREE.SphereGeometry(0.37, 10, 6, 0, Math.PI * 2, 0, Math.PI * 0.52), bahan(WARNA.rambut), 0, 1.9, -0.03, tubuh);
  topi.rotation.x = -0.35;
  if (o.perempuan) {
    kotak(0.66, 0.9, 0.2, WARNA.rambut, 0, 1.62, -0.24, tubuh);
    kotak(0.12, 0.6, 0.16, WARNA.rambut, -0.33, 1.7, -0.04, tubuh);
    kotak(0.12, 0.6, 0.16, WARNA.rambut, 0.33, 1.7, -0.04, tubuh);
  } else {
    kotak(0.5, 0.1, 0.14, WARNA.rambut, 0, 2.12, 0.22, tubuh);
  }
  return { luar, tubuh, kakiK, kakiKa, tanganK, tanganKa };
}

export function animasiOrang(o: Orang, t: number, jalan: boolean, diam: boolean) {
  const s = jalan ? Math.sin(t * 11) * 0.65 : 0;
  o.kakiK.rotation.x = s; o.kakiKa.rotation.x = -s;
  o.tanganK.rotation.x = -s * 0.8; o.tanganKa.rotation.x = s * 0.8;
  o.tubuh.position.y = jalan ? Math.abs(Math.sin(t * 11)) * 0.07 : diam ? 0 : Math.sin(t * 2) * 0.025;
}

/* ---------- tempat-tempat ---------- */
type Bagian = {
  jendela: THREE.MeshStandardMaterial[]; api: THREE.Mesh[]; lampuKue: THREE.PointLight;
  jarumJam: THREE.Group; jarumMenit: THREE.Group; amplop: THREE.Object3D[]; kaset: THREE.Group; zean: Orang;
};

function galeri(g: THREE.Group, b: Bagian) {
  kotak(7.9, 0.3, 5.5, WARNA.batuG, 0, 0.15, 0, g);
  kotak(7.6, 3.4, 5.2, WARNA.kertas, 0, 1.9, 0, g);
  const segitiga = new THREE.Shape([new THREE.Vector2(-2.6, 0), new THREE.Vector2(2.6, 0), new THREE.Vector2(0, 1.35)]);
  const geo = new THREE.ExtrudeGeometry(segitiga, { depth: 7.6, bevelEnabled: false });
  geo.rotateY(Math.PI / 2); geo.translate(-3.8, 0, 0);
  pasang(geo, bahan(WARNA.kertas), 0, 3.6, 0, g);
  const atap = (arah: number) => { const m = kotak(8.4, 0.3, 3.35, WARNA.hanko, 0, 4.3, arah * 1.45, g); m.rotation.x = arah * 0.47; };
  atap(1); atap(-1);
  kotak(8.5, 0.25, 0.3, WARNA.hankoG, 0, 5.0, 0, g);
  kotak(1.3, 2.2, 0.12, "#5A3A2A", 0, 1.4, 2.62, g);
  kotak(0.12, 0.12, 0.05, WARNA.emas, 0.4, 1.4, 2.7, g);
  const lukisan = (x: number, w8: string) => {
    kotak(1.8, 1.4, 0.1, WARNA.tinta, x, 2.3, 2.62, g);
    bisaNyala(kotak(1.5, 1.1, 0.1, w8, x, 2.3, 2.66, g), "#FFC870", b.jendela);
  };
  lukisan(-2.5, "#E9A79A"); lukisan(2.5, WARNA.biru);
}

function kue(g: THREE.Group, b: Bagian) {
  b.zean.luar.position.set(0.2, 0, -1.2); g.add(b.zean.luar);
  kotak(3.6, 0.2, 1.6, WARNA.kayuT, 0, 1.1, 0, g);
  for (const [x, z] of [[-1.6, -0.6], [1.6, -0.6], [-1.6, 0.6], [1.6, 0.6]]) kotak(0.16, 1.0, 0.16, WARNA.kayu, x, 0.5, z, g);
  kotak(3.7, 0.08, 1.7, WARNA.kertas, 0, 1.22, 0, g);
  tabung(0.65, 0.65, 0.55, 12, WARNA.hanko, 0, 1.53, 0.1, g);
  tabung(0.68, 0.68, 0.14, 12, WARNA.kertas, 0, 1.84, 0.1, g);
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2, x = Math.cos(a) * 0.4, z = 0.1 + Math.sin(a) * 0.4;
    tabung(0.04, 0.04, 0.36, 5, i % 2 ? WARNA.kertas : "#F6D9CF", x, 2.08, z, g);
    const api = pasang(new THREE.ConeGeometry(0.075, 0.2, 5), new THREE.MeshBasicMaterial({ color: "#FFC24B" }), x, 2.36, z, g);
    api.castShadow = false; b.api.push(api);
  }
  b.lampuKue.position.set(0, 2.8, 0.4); g.add(b.lampuKue);
}

function menara(g: THREE.Group, b: Bagian) {
  kotak(2.9, 6.6, 2.9, WARNA.batu, 0, 3.3, 0, g);
  for (const y of [0.15, 2.2, 4.0, 6.4]) kotak(3.1, 0.25, 3.1, WARNA.batuG, 0, y, 0, g);
  const atap = kerucut(2.45, 2.4, 4, WARNA.malam, 0, 7.8, 0, g); atap.rotation.y = Math.PI / 4;
  kerucut(0.12, 0.6, 5, WARNA.hanko, 0, 9.2, 0, g);
  const bingkai = tabung(1.12, 1.12, 0.14, 18, WARNA.tinta, 0, 5.0, 1.46, g); bingkai.rotation.x = Math.PI / 2;
  const muka = tabung(1.0, 1.0, 0.16, 18, WARNA.kertas, 0, 5.0, 1.5, g); muka.rotation.x = Math.PI / 2;
  bisaNyala(muka, "#FFE2A8", b.jendela);
  const poros = new THREE.Group(); poros.position.set(0, 5.0, 1.6); g.add(poros);
  poros.add(b.jarumJam); kotak(0.12, 0.55, 0.05, WARNA.tinta, 0, 0.26, 0, b.jarumJam);
  poros.add(b.jarumMenit); kotak(0.07, 0.82, 0.05, WARNA.tinta, 0, 0.4, 0.03, b.jarumMenit);
  tabung(0.08, 0.08, 0.08, 8, WARNA.hanko, 0, 5.0, 1.68, g).rotation.x = Math.PI / 2;
  kotak(1.1, 1.8, 0.12, WARNA.kayu, 0, 0.95, 1.46, g);
}

function kotakPos(g: THREE.Group) {
  tabung(0.12, 0.14, 1.3, 6, "#5A3A2A", 0, 0.65, 0, g);
  kotak(1.1, 1.2, 0.9, WARNA.hanko, 0, 1.85, 0, g);
  const atap = pasang(new THREE.CylinderGeometry(0.55, 0.55, 0.9, 10, 1, false, 0, Math.PI), bahan(WARNA.hankoG), 0, 2.45, 0, g);
  atap.rotation.set(Math.PI / 2, Math.PI / 2, 0);
  kotak(0.62, 0.07, 0.06, WARNA.tinta, 0, 2.05, 0.46, g);
  const amp = kotak(0.42, 0.28, 0.04, WARNA.kertas, 0.05, 2.12, 0.5, g); amp.rotation.z = 0.15;
}

function pohonAmplop(g: THREE.Group, b: Bagian) {
  tabung(0.3, 0.42, 2.6, 7, WARNA.batang, 0, 1.3, 0, g);
  bola(2.0, 1, WARNA.daun, 0, 3.5, 0, g);
  bola(1.25, 1, WARNA.daun, -1.5, 2.9, 0.3, g);
  bola(1.25, 1, WARNA.daunT, 1.4, 3.0, -0.2, g);
  bola(0.9, 1, WARNA.daunT, 0.4, 4.6, 0.6, g);
  const posisi: [number, number, number][] = [[-1.6, 2.2, 1.0], [0.2, 2.3, 1.7], [1.7, 2.3, 0.8], [-0.9, 2.1, -1.4], [1.2, 2.2, -1.3], [-2.2, 2.0, -0.4]];
  posisi.forEach(([x, y, z]) => {
    const poros = new THREE.Group(); poros.position.set(x, y, z); g.add(poros);
    kotak(0.02, 0.35, 0.02, WARNA.batang, 0, -0.17, 0, poros);
    kotak(0.46, 0.32, 0.05, WARNA.kertas, 0, -0.5, 0, poros);
    kotak(0.1, 0.1, 0.06, WARNA.hanko, 0, -0.5, 0.01, poros);
    poros.rotation.y = Math.atan2(x, z);
    b.amplop.push(poros);
  });
}

function bangku(g: THREE.Group, b: Bagian) {
  kotak(4.2, 0.14, 1.0, WARNA.kayuT, 0, 0.8, 0, g);
  kotak(4.2, 0.55, 0.12, WARNA.kayuT, 0, 1.32, -0.45, g);
  for (const [x, z] of [[-1.8, -0.35], [1.8, -0.35], [-1.8, 0.35], [1.8, 0.35]]) kotak(0.14, 0.8, 0.14, WARNA.kayu, x, 0.4, z, g);
  g.add(b.kaset);
  kotak(0.9, 0.12, 0.56, WARNA.hanko, 0, 0.93, 0.05, b.kaset);
  kotak(0.62, 0.13, 0.28, WARNA.kertas, 0, 0.94, 0.02, b.kaset);
}

function papan(g: THREE.Group) {
  kotak(0.2, 2.4, 0.2, WARNA.kayu, -2.1, 1.2, 0, g); kotak(0.2, 2.4, 0.2, WARNA.kayu, 2.1, 1.2, 0, g);
  kotak(5.0, 2.1, 0.2, WARNA.kayu, 0, 2.3, 0, g); kotak(4.7, 1.8, 0.22, WARNA.kayuT, 0, 2.3, 0, g);
  const atap = kotak(5.4, 0.18, 0.6, WARNA.hanko, 0, 3.45, 0, g); atap.rotation.x = 0.1;
  ([[-1.65, WARNA.kertas, 0.06], [-0.55, "#E9A79A", -0.05], [0.55, WARNA.kertas, 0.04], [1.65, "#F6D9CF", -0.07]] as [number, string, number][]).forEach(([x, w8, rot]) => {
    const k = kotak(0.9, 1.2, 0.05, w8, x, 2.3, 0.14, g); k.rotation.z = rot;
    kotak(0.16, 0.16, 0.06, WARNA.hanko, x + 0.24, 2.7, 0.16, g);
  });
}

function bandara(g: THREE.Group) {
  kotak(10, 0.06, 2.0, "#9AA0A6", 0, 0.04, 1.4, g);
  for (let x = -4.4; x < 4.6; x += 1.2) kotak(0.6, 0.07, 0.12, WARNA.kertas, x, 0.06, 1.4, g);
  const pesawat = new THREE.Group(); pesawat.position.set(0.6, 0, -0.8); g.add(pesawat);
  const badan = tabung(0.5, 0.5, 5, 12, WARNA.kertas, 0, 1.15, 0, pesawat); badan.rotation.z = Math.PI / 2;
  const hidung = kerucut(0.5, 0.9, 12, WARNA.kertas, 2.95, 1.15, 0, pesawat); hidung.rotation.z = -Math.PI / 2;
  const ekor = kerucut(0.5, 1.1, 12, WARNA.kertas, -3.05, 1.15, 0, pesawat); ekor.rotation.z = Math.PI / 2;
  kotak(0.9, 1.2, 0.12, WARNA.hanko, -3.0, 1.9, 0, pesawat);
  kotak(0.6, 0.08, 1.8, WARNA.batuG, -3.0, 1.3, 0, pesawat);
  kotak(1.3, 0.1, 5.2, WARNA.batuG, 0.2, 1.0, 0, pesawat);
  for (let i = 0; i < 6; i++) { kotak(0.2, 0.2, 0.04, WARNA.biru, -1.6 + i * 0.6, 1.32, 0.49, pesawat); kotak(0.2, 0.2, 0.04, WARNA.biru, -1.6 + i * 0.6, 1.32, -0.49, pesawat); }
  for (const z of [-0.3, 0.3]) tabung(0.12, 0.12, 0.5, 6, WARNA.tinta, 1.6, 0.25, z, pesawat);
  tabung(0.12, 0.12, 0.5, 6, WARNA.tinta, -1.4, 0.25, 0, pesawat);
  kotak(0.16, 2.2, 0.16, WARNA.tinta, -4.3, 1.1, 1.0, g);
  kotak(1.8, 0.9, 0.2, WARNA.malam, -4.3, 2.5, 1.0, g);
  kotak(1.5, 0.35, 0.22, WARNA.emas, -4.3, 2.6, 1.02, g);
}

/* ---------- pohon hias ---------- */
function pohon(x: number, z: number, jenis: number, skala: number, induk: THREE.Object3D) {
  const g = new THREE.Group(); g.position.set(x, 0, z); g.scale.setScalar(skala); induk.add(g);
  tabung(0.18, 0.26, 1.2, 6, WARNA.batang, 0, 0.6, 0, g);
  if (jenis === 0) { bola(1.15, 0, WARNA.daun, 0, 1.9, 0, g); bola(0.6, 0, WARNA.daunT, -0.35, 2.4, 0.3, g); }
  else { kerucut(1.15, 1.9, 7, WARNA.daun, 0, 1.9, 0, g); kerucut(0.85, 1.4, 7, WARNA.daunT, 0, 2.7, 0, g); }
}

/* ---------- adegan lengkap ---------- */
export type Pulau = {
  scene: THREE.Scene; stasiun: THREE.Object3D[]; inka: Orang;
  setMalam: (m: boolean) => void; setSuara: (ada: boolean) => void;
  animasi: (t: number, jam: { j: number; m: number }, diam: boolean) => void; buang: () => void;
};

export function buatPulau(): Pulau {
  const scene = new THREE.Scene();
  const rnd = acak(11);

  // cahaya
  const langit = new THREE.HemisphereLight("#FFF6E8", "#7E9466", 1.25);
  const matahari = new THREE.DirectionalLight("#FFFFFF", 1.7);
  matahari.position.set(-18, 34, 16); matahari.castShadow = true;
  Object.assign(matahari.shadow.camera, { left: -34, right: 34, top: 28, bottom: -28, near: 1, far: 90 });
  matahari.shadow.mapSize.set(2048, 2048); matahari.shadow.bias = -0.0006; matahari.shadow.normalBias = 0.02;
  scene.add(langit, matahari);

  // pulau: tutup rumput + badan tanah + dasar batu menggantung
  const tutup = pasang(new THREE.CylinderGeometry(1, 1, 0.5, 40), bahan(WARNA.rumput), 0, -0.25, 0, scene);
  tutup.scale.set(RX, 1, RZ); tutup.castShadow = false;
  const badanGeo = new THREE.CylinderGeometry(1, 0.86, 2.6, 40, 2);
  const pos = badanGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) if (pos.getY(i) < 1.2) { pos.setX(i, pos.getX(i) * (0.97 + rnd() * 0.06)); pos.setZ(i, pos.getZ(i) * (0.97 + rnd() * 0.06)); }
  badanGeo.computeVertexNormals();
  const badan = pasang(badanGeo, bahan(WARNA.tanah), 0, -1.8, 0, scene); badan.scale.set(RX, 1, RZ);
  const dasarGeo = new THREE.ConeGeometry(1, 1, 18, 3);
  const dp = dasarGeo.attributes.position;
  for (let i = 0; i < dp.count; i++) { const k = 0.85 + rnd() * 0.3; dp.setX(i, dp.getX(i) * k); dp.setZ(i, dp.getZ(i) * k); }
  dasarGeo.computeVertexNormals();
  const dasar = pasang(dasarGeo, bahan(WARNA.batuDasar), 0, -7.9, 0, scene);
  dasar.scale.set(RX * 0.86, 9.6, RZ * 0.86); dasar.rotation.x = Math.PI;

  // jalan setapak & alun-alun
  const bahanJalan = bahan(WARNA.jalan);
  JALAN.forEach(([x, y, w, h]) => {
    const c = ke3d(x + w / 2, y + h / 2);
    const m = pasang(new THREE.BoxGeometry(w / 10, 0.08, h / 10), bahanJalan, c.x, 0.03, c.z, scene); m.castShadow = false;
  });
  const alun = pasang(new THREE.CylinderGeometry(2.7, 2.7, 0.1, 24), bahanJalan, 0, 0.04, 0, scene); alun.castShadow = false;
  tabung(0.7, 0.8, 0.3, 10, WARNA.batuG, 0, 0.15, 0, scene);
  tabung(0.5, 0.5, 0.32, 10, WARNA.hanko, 0, 0.2, 0, scene);

  // bunga (instanced, ringan)
  const bunga = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.13, 0), new THREE.MeshStandardMaterial({ flatShading: true, roughness: 0.8 }), 160);
  const warnaBunga = [WARNA.hanko, WARNA.kertas, WARNA.emas, "#E9A79A"].map((c) => new THREE.Color(c));
  const mtx = new THREE.Matrix4();
  for (let i = 0; i < bunga.count; i++) {
    let x = 0, z = 0;
    do { x = (rnd() * 2 - 1) * RX; z = (rnd() * 2 - 1) * RZ; } while ((x / (RX - 1.5)) ** 2 + (z / (RZ - 1.5)) ** 2 > 1);
    mtx.makeTranslation(x, 0.1, z); bunga.setMatrixAt(i, mtx); bunga.setColorAt(i, warnaBunga[i % 4]);
  }
  bunga.receiveShadow = true; scene.add(bunga);

  // pohon hias
  POHON.forEach(([px, py], i) => {
    const c = ke3d(px, py);
    if ((c.x / (RX - 1)) ** 2 + (c.z / (RZ - 1)) ** 2 > 1) return;
    pohon(c.x, c.z, i % 3 === 0 ? 1 : 0, 0.9 + rnd() * 0.45, scene);
  });

  // lampu taman (menyala hangat di malam hari)
  const lampuTaman: THREE.PointLight[] = [];
  const bahanBohlam = new THREE.MeshStandardMaterial({ color: "#FFF1CF", emissive: new THREE.Color("#FFC870"), emissiveIntensity: 0, flatShading: true });
  LAMPU.forEach(([px, py]) => {
    const c = ke3d(px, py);
    tabung(0.08, 0.12, 2.6, 6, WARNA.malam, c.x, 1.3, c.z, scene);
    kotak(0.5, 0.08, 0.5, WARNA.malam, c.x, 2.62, c.z, scene);
    const bohlam = pasang(new THREE.OctahedronGeometry(0.22, 0), bahanBohlam, c.x, 2.85, c.z, scene); bohlam.castShadow = false;
    kerucut(0.32, 0.25, 4, WARNA.malam, c.x, 3.12, c.z, scene).rotation.y = Math.PI / 4;
    const l = new THREE.PointLight("#FFC27A", 0, 11, 1.4); l.position.set(c.x, 2.7, c.z); scene.add(l); lampuTaman.push(l);
  });

  // bintang (hanya terlihat malam)
  const bintangGeo = new THREE.BufferGeometry();
  const titik: number[] = [];
  for (let i = 0; i < 260; i++) {
    const a = rnd() * Math.PI * 2, e = 0.15 + rnd() * 1.2, r = 120;
    titik.push(Math.cos(a) * Math.cos(e) * r, Math.sin(e) * r, Math.sin(a) * Math.cos(e) * r);
  }
  bintangGeo.setAttribute("position", new THREE.Float32BufferAttribute(titik, 3));
  const bintang = new THREE.Points(bintangGeo, new THREE.PointsMaterial({ color: "#FFF4DA", size: 0.9, sizeAttenuation: true, fog: false }));
  scene.add(bintang);

  // awan
  const awan: THREE.Mesh[] = [];
  const bahanAwan = new THREE.MeshStandardMaterial({ color: WARNA.kertas, flatShading: true, roughness: 1 });
  const grupAwan: THREE.Group[] = [];
  for (let i = 0; i < 5; i++) {
    const a = new THREE.Group();
    for (let j = 0; j < 3; j++) {
      const m = pasang(new THREE.IcosahedronGeometry(1.2 + rnd(), 0), bahanAwan, j * 1.6 - 1.6, rnd() * 0.5, rnd() * 0.8, a);
      m.castShadow = false; m.receiveShadow = false; awan.push(m);
    }
    a.userData.sudut = (i / 5) * Math.PI * 2 + rnd() * 0.5;
    a.userData.tinggi = 1 + rnd() * 4;
    scene.add(a); grupAwan.push(a);
  }

  // tempat-tempat
  const b: Bagian = {
    jendela: [], api: [], lampuKue: new THREE.PointLight("#FFB65C", 0, 9, 1.6),
    jarumJam: new THREE.Group(), jarumMenit: new THREE.Group(), amplop: [], kaset: new THREE.Group(),
    zean: buatOrang({ baju: WARNA.biru, bawah: "#3B3030", perempuan: false }),
  };
  const pembuat: Record<string, (g: THREE.Group) => void> = {
    galeri: (g) => galeri(g, b), kue: (g) => kue(g, b), jam: (g) => menara(g, b), surat: kotakPos,
    bukasaat: (g) => pohonAmplop(g, b), suara: (g) => bangku(g, b), perjalanan: papan, tiket: bandara,
  };
  const stasiun: THREE.Object3D[] = [];
  TEMPAT.forEach((t) => {
    const [x, y, w, h] = t.rect;
    const c = ke3d(x + w / 2, y + h / 2), p = ke3d(t.pintu[0], t.pintu[1]);
    const g = new THREE.Group(); g.position.set(c.x, 0, c.z);
    g.rotation.y = Math.atan2(p.x - c.x, p.z - c.z);
    g.userData.id = t.id;
    pembuat[t.id](g);
    scene.add(g); stasiun.push(g);
  });

  const inka = buatOrang({ baju: WARNA.hanko, bawah: WARNA.hankoG, perempuan: true });
  scene.add(inka.luar);

  const setMalam = (malam: boolean) => {
    const bg = new THREE.Color(malam ? "#1F2A33" : "#F3ECE1");
    scene.background = bg; scene.fog = new THREE.Fog(bg, 80, 160);
    langit.color.set(malam ? "#9FB2D0" : "#FFF6E8"); langit.groundColor.set(malam ? "#2C3A33" : "#7E9466");
    langit.color.set(malam ? "#B9C8E6" : "#FFF6E8"); langit.groundColor.set(malam ? "#45553F" : "#7E9466");
    langit.intensity = malam ? 1.0 : 1.25;
    matahari.color.set(malam ? "#C9D6FF" : "#FFFFFF"); matahari.intensity = malam ? 0.85 : 1.7;
    b.jendela.forEach((m) => { m.emissiveIntensity = malam ? 0.9 : 0; });
    b.lampuKue.intensity = malam ? 8 : 1.5;
    lampuTaman.forEach((l) => { l.intensity = malam ? 9 : 0; });
    bahanBohlam.emissiveIntensity = malam ? 1.2 : 0;
    bintang.visible = malam;
    bahanAwan.color.set(malam ? "#4A5A68" : WARNA.kertas);
  };
  setMalam(false);

  const setSuara = (ada: boolean) => { b.kaset.visible = ada; };

  const animasi = (t: number, jam: { j: number; m: number }, diam: boolean) => {
    b.jarumJam.rotation.z = -((jam.j % 12) + jam.m / 60) * (Math.PI / 6);
    b.jarumMenit.rotation.z = -jam.m * (Math.PI / 30);
    animasiOrang(b.zean, t, false, diam);
    if (!diam) {
      b.api.forEach((a, i) => { const k = 0.85 + Math.sin(t * 14 + i * 1.7) * 0.15; a.scale.set(k, 1 + (1 - k) * 2, k); });
      b.amplop.forEach((a, i) => { a.rotation.z = Math.sin(t * 1.6 + i) * 0.12; });
    }
    // awan mengitari pulau pelan-pelan, di luar tepi pulau
    grupAwan.forEach((a) => {
      const s = a.userData.sudut + (diam ? 0 : t * 0.015);
      a.position.set(Math.cos(s) * (RX + 12), a.userData.tinggi, Math.sin(s) * (RZ + 12));
    });
  };

  const buang = () => {
    scene.traverse((o) => { const m = o as THREE.Mesh; if (m.geometry) m.geometry.dispose(); });
    cacheBahan.forEach((m) => m.dispose()); cacheBahan.clear();
  };

  return { scene, stasiun, inka, setMalam, setSuara, animasi, buang };
}
