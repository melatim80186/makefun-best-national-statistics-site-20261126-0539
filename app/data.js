// NusaStat — data. Semua angka dari rilis resmi BPS, Kemendagri, dan
// Kementerian Keuangan; tidak ada angka yang dikarang. Koma = desimal
// (penulisan Indonesia). Nilai null berarti rilisnya belum terbit.

export const YEARS = [2019, 2020, 2021, 2022, 2023, 2024, 2025];

export function fmt(n, d = 2) {
  if (n === null || n === undefined) return 'belum rilis';
  const parts = Number(n).toFixed(d).split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return parts.join(',');
}

export const SERIES = {
  gdpGrowth: {
    id: 'gdpGrowth',
    label: 'Pertumbuhan PDB',
    unit: '%',
    values: [5.02, -2.07, 3.70, 5.31, 5.05, 5.03, 5.11],
    source: 'BPS, Berita Resmi Statistik PDB tahunan',
    note: 'Pandemi 2020 memangkas pertumbuhan ke −2,07% — satu-satunya kontraksi dalam deret ini. Sejak 2022 pertumbuhan kembali di atas 5% dan bertahan empat tahun beruntun.',
  },
  gdpNominal: {
    id: 'gdpNominal',
    label: 'PDB harga berlaku',
    unit: 'Rp triliun',
    values: [15833.9, 15443.4, 16976.7, 19588.4, 20892.4, 22139.0, 23821.1],
    source: 'BPS, Berita Resmi Statistik PDB tahunan',
    note: 'PDB harga berlaku naik dari Rp15.833,9 triliun (2019) menjadi Rp23.821,1 triliun (2025). PDB per kapita 2024: Rp78,6 juta (US$4.960,3); 2025: Rp83,7 juta (US$5.083,4).',
  },
  inflation: {
    id: 'inflation',
    label: 'Inflasi',
    unit: '%',
    values: [2.72, 1.68, 1.87, 5.51, 2.61, 1.57, null],
    source: 'BPS, Berita Resmi Statistik Indeks Harga Konsumen Desember',
    note: 'Inflasi 2022 melonjak ke 5,51% setelah penyesuaian harga BBM, lalu melandai ke 1,57% pada Desember 2024 — terendah sepanjang sejarah perhitungan BPS.',
  },
  population: {
    id: 'population',
    label: 'Penduduk',
    unit: 'juta jiwa',
    values: [266.91, 270.20, 272.68, 275.77, 278.70, 281.60, null],
    source: 'BPS, Proyeksi Penduduk Indonesia 2020–2050',
    note: 'Penduduk tumbuh stabil sekitar 1% per tahun. Dari 266,91 juta (2019) menjadi 281,60 juta (2024); 2025 belum dirilis penuh.',
  },
  unemployment: {
    id: 'unemployment',
    label: 'Pengangguran',
    unit: '%',
    values: [5.28, 7.07, 6.49, 5.86, 5.45, 4.91, 4.85],
    source: 'BPS, Survei Angkatan Kerja Nasional (Sakernas) Agustus',
    note: 'Pengangguran melonjak ke 7,07% pada Agustus 2020, lalu turun tiap tahun hingga 4,85% pada Agustus 2025.',
  },
  poverty: {
    id: 'poverty',
    label: 'Kemiskinan',
    unit: '%',
    values: [9.22, 9.78, 10.14, 9.54, 9.36, 9.03, 8.47],
    source: 'BPS, Profil Kemiskinan Maret',
    note: 'Kemiskinan naik saat pandemi (10,14% pada Maret 2021), lalu turun tiap tahun ke 8,47% pada Maret 2025 — terendah dalam dua dekade.',
  },
};

export const TRADE_YEARS = [2019, 2020, 2021, 2022, 2023, 2024];

export const TRADE = {
  exports: {
    id: 'exports',
    label: 'Ekspor',
    unit: 'US$ miliar',
    values: [167.68, 163.19, 231.61, 291.90, 258.82, 264.70],
    note: 'Ekspor 2024 US$264,70 miliar (+2,29% dari 2023); impor US$233,66 miliar (+11,07%). Surplus US$31,04 miliar — tahun kelima beruntun sejak 2020.',
  },
  imports: {
    id: 'imports',
    label: 'Impor',
    unit: 'US$ miliar',
    values: [170.73, 141.57, 196.27, 237.44, 221.93, 233.66],
    note: 'Impor 2024 US$233,66 miliar, 90,28% berupa bahan baku/penolong dan barang modal. Impor tumbuh 11,07% — jauh di atas ekspor.',
  },
  surplus: {
    id: 'surplus',
    label: 'Surplus',
    unit: 'US$ miliar',
    values: [-3.05, 21.62, 35.34, 54.46, 36.89, 31.04],
    note: 'Surplus perdagangan 2024 US$31,04 miliar, lebih rendah dari 2023 (US$36,89 miliar) karena impor tumbuh lebih cepat dari ekspor.',
  },
};

export const TRADE_SOURCE = 'BPS / Kementerian Keuangan (BKF), 2024';

export const SECTORS = [
  { name: 'Industri pengolahan', share: 18.98 },
  { name: 'Perdagangan besar & eceran', share: 13.07 },
  { name: 'Pertanian, kehutanan & perikanan', share: 12.61 },
  { name: 'Konstruksi', share: 10.09 },
  { name: 'Pertambangan & penggalian', share: 9.15 },
  { name: 'Lapangan usaha lainnya', share: 36.10 },
];

export const EXPENDITURE = [
  { name: 'Konsumsi rumah tangga', growth: 4.94, note: 'Penopang terbesar PDB' },
  { name: 'Konsumsi pemerintah', growth: 6.61, note: '' },
  { name: 'Pembentukan modal tetap bruto (investasi)', growth: 4.61, note: '' },
  { name: 'Ekspor barang & jasa', growth: 6.51, note: '' },
  { name: 'Impor barang & jasa', growth: 7.95, note: 'Faktor pengurang PDB' },
  { name: 'Konsumsi LNPRT', growth: 12.48, note: 'Tumbuh tertinggi 2024' },
];

export const LABOR = [
  { label: 'Penduduk usia kerja', value: '218,17 jt', year: 'Agustus 2025' },
  { label: 'Tingkat partisipasi angkatan kerja', value: '70,59%', year: 'Agustus 2025' },
  { label: 'Bekerja', value: '147,91 jt', year: 'November 2025' },
  { label: 'Pekerja informal', value: '57,80%', year: '84,58 jt orang' },
  { label: 'Setengah penganggur', value: '7,91%', year: '11,60 jt orang' },
  { label: 'Upah rata-rata buruh', value: 'Rp3,33 jt/bln', year: 'Agustus 2025' },
];

export const NATIONAL_PROJECTION_2026 = 287.1;

export const PROVINCES = [
  { rank: 1, name: 'Jawa Barat', capital: 'Bandung', island: 'Jawa', pop: 51.16 },
  { rank: 2, name: 'Jawa Timur', capital: 'Surabaya', island: 'Jawa', pop: 42.35 },
  { rank: 3, name: 'Jawa Tengah', capital: 'Semarang', island: 'Jawa', pop: 38.57 },
  { rank: 4, name: 'Sumatera Utara', capital: 'Medan', island: 'Sumatera', pop: 15.79 },
  { rank: 5, name: 'Banten', capital: 'Serang', island: 'Jawa', pop: 12.64 },
  { rank: 6, name: 'DKI Jakarta', capital: 'Jakarta', island: 'Jawa', pop: 10.67 },
  { rank: 7, name: 'Sulawesi Selatan', capital: 'Makassar', island: 'Sulawesi', pop: 9.66 },
  { rank: 8, name: 'Lampung', capital: 'Bandar Lampung', island: 'Sumatera', pop: 9.10 },
  { rank: 9, name: 'Sumatera Selatan', capital: 'Palembang', island: 'Sumatera', pop: 8.99 },
  { rank: 10, name: 'Riau', capital: 'Pekanbaru', island: 'Sumatera', pop: 7.30 },
];

export function provinceShare(p) {
  return (p.pop / NATIONAL_PROJECTION_2026) * 100;
}

export function provinceContext(p) {
  if (p.rank === 1) {
    return 'Jawa Barat adalah provinsi terpadat di Indonesia dengan 51,16 juta jiwa — 17,82% dari total proyeksi nasional 2026 — dan ibu kotanya Bandung.';
  }
  return `${p.name} adalah provinsi terpadat ke-${p.rank} di Indonesia dengan ${fmt(p.pop)} juta jiwa (${fmt(provinceShare(p))}% dari total proyeksi nasional 2026); ibu kotanya ${p.capital}.`;
}

export const PROVINCE_FACTS = [
  { title: 'Provinsi tersedikit penduduknya', text: 'Kalimantan Utara adalah provinsi tersedikit penduduknya: 739.800 jiwa (BPS, 2024).' },
  { title: 'Inflasi provinsi tertinggi', text: 'Papua Pegunungan mencatat inflasi provinsi tertinggi Desember 2024: 5,36% y-on-y (BPS).' },
  { title: 'Pengangguran provinsi tertinggi', text: 'Papua mencatat TPT tertinggi Agustus 2025: 6,96%, disusul Papua Barat Daya 6,85% dan Jawa Barat 6,77% (BPS).' },
];

export const SOURCES = [
  { title: 'Pertumbuhan ekonomi & PDB 2024', detail: '5,03%; Rp22.139,0 T; per kapita Rp78,6 jt / US$4.960,3', cite: 'BPS, Berita Resmi Statistik No. 17/02/Th. XXVIII, 5 Februari 2025' },
  { title: 'PDB 2025', detail: 'Rp23.821,1 T; tumbuh 5,11%; per kapita Rp83,7 jt / US$5.083,4', cite: 'BPS, rilis PDB tahunan 2025, Februari 2026' },
  { title: 'Inflasi Desember 2024', detail: '1,57% y-on-y; inti 2,26%; IHK 106,80', cite: 'BPS, BRS No. 01/01/Th. XXVIII, 2 Januari 2025' },
  { title: 'Penduduk 281,6 juta jiwa', detail: 'Pertengahan 2024 dan deret 2019–2024', cite: 'BPS, Proyeksi Penduduk Indonesia 2020–2050; Sensus Penduduk 2024' },
  { title: 'Pengangguran terbuka Agustus 2025', detail: '4,85%; 7,46 jt orang; dan kondisi kerja', cite: 'BPS, Keadaan Ketenagakerjaan Indonesia Agustus 2025, 5 November 2025 (Sakernas)' },
  { title: 'Kemiskinan Maret 2025', detail: '8,47%; 23,85 jt; garis Rp609.160; dan September 2025 (8,25%)', cite: 'BPS, Profil Kemiskinan, 2025' },
  { title: 'Perdagangan luar negeri 2024', detail: 'Ekspor US$264,70 M; impor US$233,66 M; surplus US$31,04 M', cite: 'BPS / Kementerian Keuangan (BKF), 16 Januari 2025' },
  { title: 'Struktur PDB 2024', detail: 'Industri 18,98%; perdagangan 13,07%; pertanian 12,61%; konstruksi 10,09%; pertambangan 9,15%', cite: 'BPS, rilis PDB 2024, dikutip Kemenperin, 2025' },
  { title: '10 provinsi terpadat', detail: 'Proyeksi 2026 dan total proyeksi 287,1 juta jiwa', cite: 'BPS, Proyeksi Penduduk Indonesia 2020–2050' },
  { title: 'Pulau Jawa 55,93% penduduk', detail: '157,39 jt jiwa, Semester I 2024', cite: 'Kemendagri, Ditjen Dukcapil, Data Kependudukan Bersih Semester I 2024' },
];

export const KPI_CARDS = [
  { label: 'Penduduk', value: '281,6 jt jiwa', sub: 'Pertengahan 2024', change: '+1,0% dari 2023', detail: 'Negara ke-4 terpadat di dunia', source: 'BPS, 2024' },
  { label: 'PDB (harga berlaku)', value: 'Rp22.139 T', sub: 'Tahun 2024', change: '+Rp1.247 T dari 2023', detail: 'PDB per kapita Rp78,6 jt (US$4.960)', source: 'BPS, BRS 5 Feb 2025' },
  { label: 'Pertumbuhan ekonomi', value: '5,03%', sub: 'Tahun 2024 (c-to-c)', change: '2023: 5,05% · 2025: 5,11%', detail: 'Tumbuh di atas 5% empat tahun beruntun', source: 'BPS, BRS 5 Feb 2025' },
  { label: 'Inflasi (Des, y-on-y)', value: '1,57%', sub: 'Desember 2024', change: 'Terendah sepanjang sejarah BPS', detail: 'Inflasi inti 2,26%; sasaran BI 2,5±1%', source: 'BPS, BRS 2 Jan 2025' },
  { label: 'Pengangguran terbuka', value: '4,85%', sub: 'Agustus 2025', change: '7,46 jt orang menganggur', detail: 'Turun dari 4,91% pada Agustus 2024', source: 'BPS, Sakernas Agu 2025' },
  { label: 'Penduduk miskin', value: '8,47%', sub: 'Maret 2025', change: '23,85 jt orang', detail: 'Garis kemiskinan Rp609.160/kapita/bulan', source: 'BPS, Mar 2025' },
];

export const UPDATES_2025 = [
  { title: 'PDB 2025', text: 'Rp23.821 T (tumbuh 5,11%; per kapita Rp83,7 jt / US$5.083)', source: 'BPS, Feb 2026' },
  { title: 'Kemiskinan Sep 2025', text: '8,25% (23,36 jt orang; gini 0,363)', source: 'BPS, 2025' },
  { title: 'TPT Nov 2025', text: '4,74% (147,91 jt orang bekerja; TPAK 70,95%)', source: 'BPS, Nov 2025' },
  { title: 'Pertumbuhan Q3-2025', text: '5,04% (y-on-y, didorong ekspor dan investasi)', source: 'BPS, Nov 2025' },
];

export const GLANCE_FACTS = [
  { value: '55,93%', text: 'penduduk tinggal di Pulau Jawa — 157,39 juta jiwa dari 282,48 juta (Kemendagri, Semester I 2024).' },
  { value: '5 tahun', text: 'beruntun surplus neraca perdagangan, terakhir US$31,04 miliar pada 2024.' },
  { value: '1,57%', text: 'inflasi Desember 2024 — terendah sepanjang sejarah perhitungan BPS (sejak 1958).' },
  { value: '8,47%', text: 'penduduk miskin pada Maret 2025 — terendah dalam dua dekade.' },
];

export const INDICATOR_ROWS = [
  { indicator: 'Pertumbuhan PDB (%)', value: '5.03', year: 2024, source: 'BPS, Berita Resmi Statistik PDB tahunan' },
  { indicator: 'PDB harga berlaku (Rp triliun)', value: '22139.0', year: 2024, source: 'BPS, Berita Resmi Statistik PDB tahunan' },
  { indicator: 'Inflasi Desember y-on-y (%)', value: '1.57', year: 2024, source: 'BPS, Berita Resmi Statistik Indeks Harga Konsumen Desember' },
  { indicator: 'Penduduk (juta jiwa)', value: '281.6', year: 2024, source: 'BPS, Proyeksi Penduduk Indonesia 2020-2050' },
  { indicator: 'Pengangguran terbuka Agustus (%)', value: '4.85', year: 2025, source: 'BPS, Sakernas Agustus' },
  { indicator: 'Kemiskinan Maret (%)', value: '8.47', year: 2025, source: 'BPS, Profil Kemiskinan Maret' },
  { indicator: 'Ekspor (US$ miliar)', value: '264.70', year: 2024, source: 'BPS / Kementerian Keuangan (BKF)' },
  { indicator: 'Impor (US$ miliar)', value: '233.66', year: 2024, source: 'BPS / Kementerian Keuangan (BKF)' },
  { indicator: 'Surplus perdagangan (US$ miliar)', value: '31.04', year: 2024, source: 'BPS / Kementerian Keuangan (BKF)' },
];

export function buildCsv() {
  const lines = ['indikator,nilai,tahun,sumber'];
  for (const r of INDICATOR_ROWS) {
    lines.push(`"${r.indicator}",${r.value},${r.year},"${r.source}"`);
  }
  lines.push('');
  lines.push('provinsi,ibu_kota,pulau,penduduk_juta_2026');
  for (const p of PROVINCES) {
    lines.push(`"${p.name}","${p.capital}","${p.island}",${p.pop.toFixed(2)}`);
  }
  return lines.join('\n');
}
