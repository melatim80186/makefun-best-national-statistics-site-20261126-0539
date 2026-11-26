/* NusaStat — data.js
 *
 * Semua angka di berkas ini berasal dari rilis resmi yang tercantum di
 * NUSA.sources. Tidak ada angka yang dikarang: angka yang tidak bisa
 * diverifikasi tidak masuk. Setiap deret mencantumkan tahun dan
 * penerbitnya di tempat angka itu ditampilkan.
 *
 * Tahun rujukan utama: 2024 (tahun lengkap terakhir). Angka 2025 hanya
 * yang rilisnya sudah terbit saat situs dibuat. */

const NUSA = {};

/* Identitas negara. */
NUSA.country = {
  name: "Indonesia",
  capital: "Jakarta",
  provinces: 38,
  regenciesCities: 514,
  islands: 17380,
  landAreaKm2: 1890179,
  population2024: 281603800,
  populationNote: "BPS, pertengahan 2024 (281,6 juta jiwa)"
};

/* Enam indikator utama di beranda. */
NUSA.kpi = [
  {
    id: "penduduk", label: "Penduduk", value: "281,6 jt",
    sub: "jiwa, pertengahan 2024", change: "+1,0% dari 2023",
    source: "BPS, 2024",
    detail: "Negara ke-4 terpadat di dunia."
  },
  {
    id: "pdb", label: "PDB (harga berlaku)", value: "Rp22.139 T",
    sub: "tahun 2024", change: "+Rp1.247 T dari 2023",
    source: "BPS, BRS 5 Feb 2025",
    detail: "PDB per kapita Rp78,6 jt (US$4.960)."
  },
  {
    id: "tumbuh", label: "Pertumbuhan ekonomi", value: "5,03%",
    sub: "tahun 2024 (c-to-c)", change: "2023: 5,05% · 2025: 5,11%",
    source: "BPS, BRS 5 Feb 2025",
    detail: "Tumbuh di atas 5% empat tahun beruntun."
  },
  {
    id: "inflasi", label: "Inflasi (Des, y-on-y)", value: "1,57%",
    sub: "Desember 2024", change: "Terendah sepanjang sejarah BPS",
    source: "BPS, BRS 2 Jan 2025",
    detail: "Inflasi inti 2,26%; sasaran BI 2,5±1%."
  },
  {
    id: "tpt", label: "Pengangguran terbuka", value: "4,85%",
    sub: "Agustus 2025", change: "7,46 jt orang menganggur",
    source: "BPS, Sakernas Agu 2025",
    detail: "Turun dari 4,91% pada Agustus 2024."
  },
  {
    id: "miskin", label: "Penduduk miskin", value: "8,47%",
    sub: "Maret 2025", change: "23,85 jt orang",
    source: "BPS, Mar 2025",
    detail: "Garis kemiskinan Rp609.160/kapita/bulan."
  }
];

/* Rilis 2025 yang sudah keluar saat situs dibuat. */
NUSA.updates2025 = [
  { label: "PDB 2025", value: "Rp23.821 T",
    note: "tumbuh 5,11%; per kapita Rp83,7 jt (US$5.083)", source: "BPS, Feb 2026" },
  { label: "Kemiskinan Sep 2025", value: "8,25%",
    note: "23,36 jt orang; gini 0,363", source: "BPS, 2025" },
  { label: "TPT Nov 2025", value: "4,74%",
    note: "147,91 jt orang bekerja; TPAK 70,95%", source: "BPS, Nov 2025" },
  { label: "Pertumbuhan Q3-2025", value: "5,04%",
    note: "y-on-y, didorong ekspor dan investasi", source: "BPS, Nov 2025" }
];

/* Deret tahunan. null = rilisnya belum terbit saat situs dibuat. */
NUSA.series = {
  years: [2019, 2020, 2021, 2022, 2023, 2024, 2025],
  gdpGrowth: {
    label: "Pertumbuhan PDB (% y-on-y)",
    unit: "%", values: [5.02, -2.07, 3.70, 5.31, 5.05, 5.03, 5.11],
    source: "BPS, Berita Resmi Statistik PDB tahunan"
  },
  gdpNominal: {
    label: "PDB harga berlaku (Rp triliun)",
    unit: "Rp T", values: [15833.9, 15443.4, 16976.7, 19588.4, 20892.4, 22139.0, 23821.1],
    source: "BPS, Berita Resmi Statistik PDB tahunan"
  },
  inflation: {
    label: "Inflasi Desember (y-on-y, %)",
    unit: "%", values: [2.72, 1.68, 1.87, 5.51, 2.61, 1.57, null],
    source: "BPS, BRS Indeks Harga Konsumen Desember",
    note: "Inflasi 2025 belum dirilis penuh saat situs dibuat."
  },
  population: {
    label: "Penduduk (juta jiwa, pertengahan tahun)",
    unit: "jt", values: [266.91, 270.20, 272.68, 275.77, 278.70, 281.60, null],
    source: "BPS, Proyeksi Penduduk 2020–2050"
  },
  unemployment: {
    label: "Pengangguran terbuka Agustus (% angkatan kerja)",
    unit: "%", values: [5.28, 7.07, 6.49, 5.86, 5.45, 4.91, 4.85],
    source: "BPS, Sakernas Agustus"
  },
  poverty: {
    label: "Penduduk miskin Maret (% penduduk)",
    unit: "%", values: [9.22, 9.78, 10.14, 9.54, 9.36, 9.03, 8.47],
    source: "BPS, Profil Kemiskinan Maret"
  }
};

/* Pangsa PDB 2024 menurut lapangan usaha (persen). */
NUSA.sectors = [
  { name: "Industri pengolahan", share: 18.98, growth: 4.43 },
  { name: "Perdagangan besar & eceran", share: 13.07, growth: 4.86 },
  { name: "Pertanian, kehutanan & perikanan", share: 12.61, growth: 0.67 },
  { name: "Konstruksi", share: 10.09, growth: null },
  { name: "Pertambangan & penggalian", share: 9.15, growth: null },
  { name: "Lapangan usaha lainnya", share: 36.10, growth: null }
];
NUSA.sectorsNote = "Pangsa 2024, BPS. Lima lapangan usaha terbesar mencakup 63,90% PDB; " +
  "sisanya 36,10% adalah 12 lapangan usaha lain (transportasi, informasi, keuangan, " +
  "jasa, dan lain-lain). Pertumbuhan tertinggi 2024: jasa lainnya 9,80%, " +
  "transportasi & pergudangan 8,69%.";

/* Perdagangan luar negeri, US$ miliar. */
NUSA.trade = {
  years: [2019, 2020, 2021, 2022, 2023, 2024],
  exports: [167.68, 163.19, 231.61, 291.90, 258.82, 264.70],
  imports: [170.73, 141.57, 196.27, 237.44, 221.93, 233.66],
  surplus: [-3.05, 21.62, 35.34, 54.46, 36.89, 31.04],
  source: "BPS / Kementerian Keuangan (BKF), 2024",
  note: "Surplus 5 tahun beruntun sejak 2020. Ekspor 2024: nonmigas US$248,83 M + " +
    "migas US$15,89 M. Tujuan ekspor nonmigas terbesar Des 2024: Tiongkok, AS, Jepang."
};

/* Pertumbuhan komponen PDB menurut pengeluaran, 2024 (c-to-c, %). */
NUSA.expenditure = [
  { component: "Konsumsi rumah tangga", growth: 4.94, note: "Penopang terbesar PDB" },
  { component: "Konsumsi pemerintah", growth: 6.61, note: "" },
  { component: "Pembentukan modal tetap bruto (investasi)", growth: 4.61, note: "" },
  { component: "Ekspor barang & jasa", growth: 6.51, note: "" },
  { component: "Impor barang & jasa", growth: 7.95, note: "Faktor pengurang PDB" },
  { component: "Konsumsi LNPRT", growth: 12.48, note: "Tumbuh tertinggi 2024" }
];

/* Sepuluh provinsi terpadat — proyeksi BPS 2026, juta jiwa. */
NUSA.provinces = [
  { rank: 1, name: "Jawa Barat", capital: "Bandung", pop: 51.16, island: "Jawa" },
  { rank: 2, name: "Jawa Timur", capital: "Surabaya", pop: 42.35, island: "Jawa" },
  { rank: 3, name: "Jawa Tengah", capital: "Semarang", pop: 38.57, island: "Jawa" },
  { rank: 4, name: "Sumatera Utara", capital: "Medan", pop: 15.79, island: "Sumatera" },
  { rank: 5, name: "Banten", capital: "Serang", pop: 12.64, island: "Jawa" },
  { rank: 6, name: "DKI Jakarta", capital: "Jakarta", pop: 10.67, island: "Jawa" },
  { rank: 7, name: "Sulawesi Selatan", capital: "Makassar", pop: 9.66, island: "Sulawesi" },
  { rank: 8, name: "Lampung", capital: "Bandar Lampung", pop: 9.10, island: "Sumatera" },
  { rank: 9, name: "Sumatera Selatan", capital: "Palembang", pop: 8.99, island: "Sumatera" },
  { rank: 10, name: "Riau", capital: "Pekanbaru", pop: 7.30, island: "Sumatera" }
];
NUSA.provincesMeta = {
  source: "BPS, Proyeksi Penduduk Indonesia 2020–2050 (proyeksi 2026)",
  total2026: 287.1,
  note: "Pangsa dihitung dari total proyeksi nasional 287,1 juta jiwa (BPS 2026). " +
    "Lima provinsi teratas menampung 56,2% penduduk. Provinsi tersedikit 2024: " +
    "Kalimantan Utara, 739.800 jiwa (BPS)."
};

/* Ketenagakerjaan — Sakernas Agustus 2025 (BPS). */
NUSA.labour = [
  { label: "Penduduk usia kerja", value: "218,17 jt", note: "Agustus 2025" },
  { label: "Tingkat partisipasi angkatan kerja", value: "70,59%", note: "Agustus 2025" },
  { label: "Bekerja", value: "147,91 jt", note: "November 2025" },
  { label: "Pekerja informal", value: "57,80%", note: "84,58 jt orang" },
  { label: "Setengah penganggur", value: "7,91%", note: "11,60 jt orang" },
  { label: "Upah rata-rata buruh", value: "Rp3,33 jt/bln", note: "Agustus 2025" }
];

/* Daftar sumber — ditampilkan apa adanya di halaman Sumber. */
NUSA.sources = [
  { n: 1, what: "Pertumbuhan ekonomi & PDB 2024 (5,03%; Rp22.139,0 T; per kapita Rp78,6 jt / US$4.960,3)",
    pub: "BPS — Berita Resmi Statistik No. 17/02/Th. XXVIII, 5 Februari 2025" },
  { n: 2, what: "PDB 2025 (Rp23.821,1 T; tumbuh 5,11%; per kapita Rp83,7 jt / US$5.083,4)",
    pub: "BPS — rilis PDB tahunan 2025, Februari 2026" },
  { n: 3, what: "Inflasi Desember 2024 (1,57% y-on-y; inti 2,26%; IHK 106,80)",
    pub: "BPS — BRS No. 01/01/Th. XXVIII, 2 Januari 2025" },
  { n: 4, what: "Penduduk 281,6 juta jiwa (pertengahan 2024) dan deret 2019–2024",
    pub: "BPS — Proyeksi Penduduk Indonesia 2020–2050; Sensus Penduduk 2024" },
  { n: 5, what: "Pengangguran terbuka Agustus 2025 (4,85%; 7,46 jt orang) dan kondisi kerja",
    pub: "BPS — Keadaan Ketenagakerjaan Indonesia Agustus 2025, 5 November 2025 (Sakernas)" },
  { n: 6, what: "Kemiskinan Maret 2025 (8,47%; 23,85 jt; garis Rp609.160) dan September 2025 (8,25%)",
    pub: "BPS — Profil Kemiskinan, 2025" },
  { n: 7, what: "Ekspor 2024 US$264,70 M; impor US$233,66 M; surplus US$31,04 M",
    pub: "BPS / Kementerian Keuangan (BKF), 16 Januari 2025" },
  { n: 8, what: "Struktur PDB 2024: industri 18,98%; perdagangan 13,07%; pertanian 12,61%; konstruksi 10,09%; pertambangan 9,15%",
    pub: "BPS — rilis PDB 2024, dikutip Kemenperin, 2025" },
  { n: 9, what: "10 provinsi terpadat (proyeksi 2026) dan total proyeksi 287,1 juta jiwa",
    pub: "BPS — Proyeksi Penduduk Indonesia 2020–2050" },
  { n: 10, what: "Pulau Jawa 55,93% penduduk (157,39 jt jiwa, Semester I 2024)",
    pub: "Kemendagri — Ditjen Dukcapil, Data Kependudukan Bersih Semester I 2024" }
];
NUSA.methodNote = "NusaStat adalah situs independen yang merangkum angka resmi — bukan situs BPS " +
  "dan tidak berafiliasi dengan BPS. Angka dibulatkan ke dua desimal dari rilis aslinya; " +
  "deret tahunan memakai definisi yang sama di setiap tahun (Desember y-on-y untuk inflasi, " +
  "Agustus untuk TPT, Maret untuk kemiskinan). Angka 2025 adalah rilis yang sudah keluar " +
  "saat situs dibuat; sel yang kosong berarti rilisnya belum terbit.";
