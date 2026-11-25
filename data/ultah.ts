/* ==========================================================
   SEMUA YANG PERLU KAMU UBAH ADA DI FILE INI SAJA.
   Saat `npm run dev` jalan, simpan file ini dan browser langsung ter-update.
   ========================================================== */
export const ULTAH = {
  namaDia: "Inka Puspita Ningrum",
  panggilanDia: "Inka",
  namaKamu: "Zean Nerro Revanza",
  panggilanKamu: "Zean",

  // Inka di Indonesia (WIB), Zean di Jepang (JST): selisih 2 jam.
  kotaDia: "Indonesia",
  kotaKamu: "Jepang",
  zonaDia: "Asia/Jakarta",
  zonaKamu: "Asia/Tokyo",

  // 3 Januari 2027, 00:00 waktu Inka (WIB).
  ultah: "2027-01-03T00:00:00+07:00",

  // Tanggal jadian (untuk penghitung "hari bersama"). EDIT.
  jadian: "2024-02-14T00:00:00+07:00",

  // Jarak kira-kira (km). Jakarta–Tokyo ± 5.800 km. EDIT kalau beda kota.
  jarakKm: 5800,

  // true = sebelum hari H hanya tampil hitung mundur. Intip dengan alamat ?intip
  kunciSampaiUltah: true,

  // Lagu (opsional): taruh mp3 di public/musik, contoh "/musik/lagu-kita.mp3". Kosongkan "" kalau tidak pakai.
  lagu: "",

  // Foto galeri: taruh di public/foto lalu tulis namanya di sini.
  foto: ["/foto/1.jpg", "/foto/2.jpg", "/foto/3.jpg", "/foto/4.jpg", "/foto/5.jpg", "/foto/6.jpg", "/foto/7.jpg", "/foto/8.jpg"],

  // Perjalanan LDR. EDIT sesuai kisah kalian.
  perjalanan: [
    { tanggal: "14 Feb 2024", judul: "Hari kita resmi", cerita: "Aku masih ingat deg-degannya nunggu balasan kamu. Satu kata \"iya\" yang bikin aku senyum sampai pagi.", foto: "/foto/1.jpg" },
    { tanggal: "Agustus 2024", judul: "Aku berangkat ke Jepang", cerita: "Bandara, pelukan terakhir yang kelamaan, dan kamu yang pura-pura nggak nangis. Sejak hari itu, jam kita beda dua.", foto: "/foto/2.jpg" },
    { tanggal: "Setiap malam", judul: "Telepon jam 23.00 di sini, 21.00 di sana", cerita: "Aku belajar ngitung mundur dua jam tanpa mikir. Kamu belajar tidur sambil telepon nyala.", foto: "/foto/3.jpg" },
    { tanggal: "3 Jan 2027", judul: "Hari ini, ulang tahunmu", cerita: "Aku belum bisa ada di sebelahmu, jadi aku bikinin tempat kecil ini. Isinya semua yang pengin aku bilang langsung.", foto: "/foto/4.jpg" },
  ],

  // Surat cinta: satu item = satu paragraf. EDIT sepenuh hati.
  surat: [
    "Inka sayang,",
    "Waktu kamu baca ini, di tempatmu sudah lewat tengah malam, dan di sini sudah jam dua pagi. Aku sengaja nggak tidur. Aku mau jadi orang yang pertama bilang: selamat ulang tahun.",
    "Dua jam itu lucu ya. Aku selalu duluan sampai di hari esok, tapi rasanya aku yang selalu nungguin kamu nyusul. Hari ini aku nungguin kamu sampai di hari paling penting tahun ini.",
    "Terima kasih sudah sabar sama jarak, sama sinyal yang putus-putus, sama aku yang kadang ketiduran di tengah telepon. Terima kasih sudah tetap memilih aku, dari jauh.",
    "Semoga umur barumu penuh hal baik: sehat, tenang, banyak tertawa, dan semua yang kamu doakan pelan-pelan jadi nyata. Dan semoga tahun ini, jarak kita tinggal cerita.",
    "Aku sayang kamu. Hari ini, besok, dan dua jam lebih awal dari kamu setiap harinya.",
  ],

  tiket: {
    dari: "NRT", dariKota: "Tokyo",
    ke: "CGK", keKota: "Jakarta",
    kursi: "Di sebelahmu",
    berlaku: "Sampai kita ketemu",
    janji: "Tukarkan dengan satu pelukan panjang, satu hari jalan-jalan sesukamu, dan aku yang nggak pegang HP seharian.",
  },
};

export type Ultah = typeof ULTAH;
