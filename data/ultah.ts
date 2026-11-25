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

  // Tanggal pertama kali ketemu (untuk penghitung hari di bagian "Dua jam").
  ketemu: "2026-08-14T00:00:00+07:00",

  // Jarak kira-kira (km), garis lurus Nagoya–Batam ± 5.050 km.
  jarakKm: 5050,

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
    "Terima kasih sudah sabar sama jarak dan sinyal yang putus-putus. Terima kasih karena kamu selalu menghargai hal-hal kecil yang aku lakukan, bahkan yang aku kira nggak kelihatan. Dan terima kasih karena suaramu selalu bisa bikin aku tenang, seberat apa pun hariku di sini. Terima kasih sudah tetap memilih aku, dari jauh.",
    "Semoga umur barumu penuh hal baik: sehat, tenang, banyak tertawa, dan semua yang kamu doakan pelan-pelan jadi nyata. Dan semoga tahun ini, jarak kita tinggal cerita.",
    "Aku sayang kamu. Hari ini, besok, dan dua jam lebih awal dari kamu setiap harinya.",
  ],

  // Pesan suara (kaset). Rekam di HP, simpan sebagai public/suara/pesan-untuk-inka.mp3 (m4a juga bisa, sesuaikan nama).
  // Selama file belum ada, bagian kaset otomatis disembunyikan.
  pesanSuara: {
    file: "/suara/pesan-untuk-inka.mp3",
    label: "Untuk Inka · 03.01.27",
  },

  // Surat-surat kecil "Buka saat…". Boleh tambah/hapus. EDIT kata-katanya sesukamu.
  bukaSaat: [
    { kapan: "kamu kangen", isi: "Aku juga. Mungkin lebih. Lihat jam sekarang, tambah dua jam: itu jam di tempatku, dan hampir pasti aku juga lagi mikirin kamu. Telepon aku, ya. Kalau belum aku angkat, pasti aku telepon balik." },
    { kapan: "kamu lagi sedih", isi: "Nggak apa-apa sedih. Kamu nggak harus kuat terus. Tarik napas pelan, minum air, terus cerita ke aku sepanjang apa pun. Aku memang jauh, tapi aku selalu mau dengar." },
    { kapan: "kamu nggak bisa tidur", isi: "Di tempatku dua jam lebih malam, jadi anggap aku yang nemenin kamu begadang. Taruh HP-nya, pejamkan mata, hitung mundur dari seratus. Aku taruhan kamu ketiduran sebelum lima puluh." },
    { kapan: "kita lagi berantem", isi: "Kalau kamu baca ini, berarti kita lagi berantem. Maaf ya, siapa pun yang salah. Aku lebih milih kita baikan daripada menang. Kabarin aku kalau sudah siap ngobrol, aku tunggu." },
    { kapan: "kamu capek banget", isi: "Kamu sudah berusaha keras hari ini, aku tahu walaupun nggak lihat langsung. Istirahat dulu. Dunia bisa nunggu sebentar, aku juga." },
    { kapan: "ada kabar bahagia", isi: "Ceritain ke aku sekarang juga! Aku mau jadi orang pertama yang ikut senang. Apa pun itu, aku bangga sama kamu." },
  ],

  tiket: {
    dari: "NGO", dariKota: "Nagoya",
    ke: "BTH", keKota: "Batam",
    berlaku: "Sampai kita ketemu",
    janji: "Tukarkan dengan satu pelukan panjang, satu hari jalan-jalan sesukamu, dan aku yang nggak pegang HP seharian.",
  },
};

export type Ultah = typeof ULTAH;
