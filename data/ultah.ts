/* ==========================================================
   SEMUA YANG PERLU KAMU UBAH ADA DI FILE INI SAJA.
   Saat `npm run dev` jalan, simpan file ini dan browser langsung ter-update.
   ========================================================== */
export const ULTAH = {
  namaDia: "Inka Puspita Ningrum",
  panggilanDia: "Inka",
  namaKamu: "Zean Nerro Revanza",
  panggilanKamu: "Ean",
  namaPasangan: "ZEINKA",
  umur: 25,

  // Inka di Batam (WIB), Ean di Hekinan (JST): selisih 2 jam.
  kotaDia: "Batam",
  kotaKamu: "Hekinan",
  zonaDia: "Asia/Jakarta",
  zonaKamu: "Asia/Tokyo",

  // 3 Januari 2027, 00:00 waktu Inka (WIB).
  ultah: "2027-01-03T00:00:00+07:00",

  // Tanggal pertama kali ketemu (untuk penghitung hari).
  ketemu: "2026-08-14T00:00:00+07:00",

  // Jarak kira-kira Hekinan–Batam (km).
  jarakKm: 5000,

  // true = sebelum hari H hanya tampil hitung mundur. Intip dengan alamat ?intip
  kunciSampaiUltah: true,

  // Lagu (opsional): taruh mp3 di public/musik, contoh "/musik/lagu-kita.mp3". Kosongkan "" kalau tidak pakai.
  lagu: "",

  // Foto galeri: taruh di public/foto lalu tulis namanya di sini.
  foto: ["/foto/1.jpg", "/foto/2.jpg", "/foto/3.jpg", "/foto/4.jpg", "/foto/5.jpg", "/foto/6.jpg", "/foto/7.jpg", "/foto/8.jpg"],

  // Kartu Hati: tulisan di luar amplop + 6 kolom isi kartu (urutan baca 1–6).
  kartuHati: {
    luar: "Happy 25th birthday, Inka ♡",
    luarKecil: "Bukanya pelan-pelan ya, aku nulisnya juga pelan-pelan hehe",
    spanduk: "HAPPY 25TH, INKA",
    kolom: [
      {
        judul: "Happy birthday, sayang!",
        isi: ["Masih inget nggak pertama kali kita ketemu? Aku deg-degan parah, canggung banget sampai bingung mau ngomong apa wkwk. Siapa sangka orang yang bikin aku gugup hari itu sekarang jadi orang yang paling bikin aku tenang."],
      },
      {
        judul: "Teori first love (versi aku)",
        isi: [
          "Kamu tahu nggak, aku punya teori sendiri soal first love.",
          "Buat aku, first love bukan cewek pertama yang aku kenal. First love itu orang pertama yang bikin aku ngerasa nggak ada yang rugi saat aku mengusahakan apa pun, dan bikin aku ngerasa hidup lagi.",
          "And that's you.",
        ],
      },
      {
        judul: "Kamu yang pertama",
        isi: [
          "Kamu yang pertama bikin aku ngerasa nggak rugi apa pun, entah waktu atau materi.",
          "Kamu yang pertama bikin aku sayang melebihi apa pun. Rasanya kayak tangki cinta yang nggak bakal habis kalau sama kamu terus.",
          "Kamu juga yang pertama aku kasih bunga, dan yang pertama bikin aku belajar nulis love letter.",
          "Because I think you'll be really happy reading this ♡",
        ],
      },
      {
        judul: "You noticed",
        isi: [
          "Aku suka semua hal tentang kamu, sekecil apa pun itu. Cara kamu bikin aku tenang, cara kamu menghargai usahaku.",
          "Karena kamu, aku jadi tahu rasanya diapresiasi.",
          "For the first time, someone actually noticed. And this time, it landed.",
        ],
      },
      {
        judul: "Batam dan rindu",
        isi: [
          "Makasih udah ngenalin aku sama gonggong. Awalnya takut, sekarang malah jadi favorit. Luti gendang juga! Pokoknya kalau ke Batam lagi, dua itu wajib.",
          "Dan konser bareng kamu bakal jadi kenangan favorit pertamaku, padahal aku nggak suka keramaian.",
          "Soal chat kamu \"u always miss me right\"... yes, always. Bahkan pas lagi baca ini pun aku kangen.",
        ],
      },
      {
        judul: "Di umur 25 ini",
        isi: [
          "Makasih udah hadir di hidupku sekarang. Karena kamu, aku banyak belajar.",
          "Di umur 25 ini, semoga kamu selalu sehat, bahagia, dan semua doamu dikabulkan Allah. Semoga tahun ini juga jadi tahun kita makin dekat, bukan cuma di hati tapi juga jarak.",
        ],
      },
    ],
    ttd: "Love you, always.",
  },

  // Pesan suara (kaset). Simpan sebagai public/suara/pesan-untuk-inka.mp3.
  // Selama file belum ada, bagian kaset otomatis disembunyikan.
  pesanSuara: {
    file: "/suara/pesan-untuk-inka.mp3",
    label: "Untuk Inka · 03.01.27",
  },

  // Surat-surat kecil "Buka saat…". Boleh tambah/hapus.
  bukaSaat: [
    { kapan: "kamu kangen", isi: "Aku juga. Mungkin lebih. Lihat jam sekarang, tambah dua jam: itu jam di tempatku, dan hampir pasti aku juga lagi mikirin kamu. Telepon aku, ya. Kalau belum aku angkat, pasti aku telepon balik." },
    { kapan: "kamu lagi sedih", isi: "Nggak apa-apa sedih. Kamu nggak harus kuat terus. Tarik napas pelan, minum air, terus cerita ke aku sepanjang apa pun. Aku memang jauh, tapi aku selalu mau dengar." },
    { kapan: "kamu nggak bisa tidur", isi: "Di tempatku dua jam lebih malam, jadi anggap aku yang nemenin kamu begadang. Taruh HP-nya, pejamkan mata, hitung mundur dari seratus. Aku taruhan kamu ketiduran sebelum lima puluh." },
    { kapan: "kita lagi berantem", isi: "Kalau kamu baca ini, berarti kita lagi berantem. Maaf ya, siapa pun yang salah. Aku lebih milih kita baikan daripada menang. Kabarin aku kalau sudah siap ngobrol, aku tunggu." },
    { kapan: "kamu capek ngajar", isi: "Bu Guru kesayanganku sudah berusaha keras hari ini, aku tahu walaupun nggak lihat langsung. Istirahat dulu. Dunia bisa nunggu sebentar, aku juga." },
    { kapan: "ada kabar bahagia", isi: "Ceritain ke aku sekarang juga! Aku mau jadi orang pertama yang ikut senang. Apa pun itu, aku bangga sama kamu." },
  ],

  tiket: {
    dari: "NGO", dariKota: "Nagoya",
    ke: "BTH", keKota: "Batam",
    penumpang: "Ean",
    kursi: "Di sampingmu",
    berlaku: "Sampai kita ketemu",
    janji: "Tukarkan dengan satu pelukan panjang, satu date gonggong & luti gendang, dan aku yang nggak pegang HP seharian.",
  },
};

export type Ultah = typeof ULTAH;
