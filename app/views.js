/* NusaStat — views.js
 *
 * Satu fungsi render per halaman. Setiap fungsi mengembalikan HTML;
 * main.js yang memasang perilaku tombolnya. Semua angka di sini diambil
 * dari data.js — tidak ada angka yang ditulis langsung di berkas ini,
 * kecuali yang sudah menjadi bagian kalimat penjelas dan tercantum juga
 * di data.js.
 *
 * Halaman: beranda, ekonomi, penduduk, provinsi, sumber. */

const VIEWS = {};

/* Kartu indikator utama di beranda. */
function kpiCard(k) {
  return '<article class="kpi">' +
    '<p class="kpi-label">' + esc(k.label) + "</p>" +
    '<p class="kpi-value">' + esc(k.value) + "</p>" +
    '<p class="kpi-sub">' + esc(k.sub) + "</p>" +
    '<p class="kpi-change">' + esc(k.change) + "</p>" +
    '<p class="kpi-detail">' + esc(k.detail) + "</p>" +
    '<p class="kpi-source">Sumber: ' + esc(k.source) + "</p>" +
    "</article>";
}

/* Judul + pengantar tiap blok kartu. */
function sectionHead(title, sub) {
  return '<div class="sec-head"><h2>' + esc(title) + "</h2><p>" + esc(sub) + "</p></div>";
}

/* Kepala halaman dalam (selain beranda). */
function pageHead(eyebrow, title, lede) {
  return '<section class="page-head">' +
    '<p class="eyebrow">' + esc(eyebrow) + "</p>" +
    "<h1>" + esc(title) + "</h1>" +
    '<p class="lede">' + lede + "</p>" +
    "</section>";
}

/* ================= Beranda ================= */
VIEWS.beranda = function () {
  const kpis = NUSA.kpi.map(kpiCard).join("");
  const updates = NUSA.updates2025.map(function (u) {
    return "<li><strong>" + esc(u.label) + " — " + esc(u.value) + "</strong><span>" +
      esc(u.note) + " · " + esc(u.source) + "</span></li>";
  }).join("");
  return "" +
  '<section class="hero">' +
    '<p class="eyebrow">Situs statistik nasional · Indonesia</p>' +
    "<h1>Indonesia dalam angka, dibaca dengan jelas.</h1>" +
    '<p class="lede">Penduduk, ekonomi, pekerjaan, dan daerah — dirangkum dari rilis resmi ' +
    "Badan Pusat Statistik (BPS) dan kementerian, lengkap dengan sumber dan tahunnya. " +
    "Tidak ada angka yang dikarang.</p>" +
    '<p class="hero-meta">Tahun rujukan utama: <strong>2024</strong> · Pembaruan 2025 sudah masuk · ' +
    "38 provinsi · 17.380 pulau · Luas daratan 1.890.180 km²</p>" +
    '<p class="hero-cta"><a class="btn" href="#/ekonomi">Lihat ekonomi →</a> ' +
    '<a class="btn ghost" href="#/provinsi">Jelajahi provinsi →</a></p>' +
  "</section>" +
  '<section aria-label="Indikator utama"><div class="kpi-grid">' + kpis + "</div></section>" +
  '<section class="card chart-card" aria-label="Tren nasional">' +
    sectionHead("Satu grafik, lima cerita",
      "Pilih indikatornya — grafik dan penjelasannya ikut berubah. Semua deret memakai definisi yang sama setiap tahun.") +
    '<div class="controls" role="group" aria-label="Pilih indikator">' +
      '<button class="chip active" data-metric="gdpGrowth">Pertumbuhan PDB</button>' +
      '<button class="chip" data-metric="inflation">Inflasi</button>' +
      '<button class="chip" data-metric="population">Penduduk</button>' +
      '<button class="chip" data-metric="unemployment">Pengangguran</button>' +
      '<button class="chip" data-metric="poverty">Kemiskinan</button>' +
    "</div>" +
    '<div class="controls" role="group" aria-label="Jenis grafik">' +
      '<button class="chip small active" data-chart="bar">Batang</button>' +
      '<button class="chip small" data-chart="line">Garis</button>' +
    "</div>" +
    '<div id="trend-chart"></div>' +
    '<p class="chart-note" id="trend-note"></p>' +
    '<p class="chart-src" id="trend-src"></p>' +
  "</section>" +
  '<section class="card" aria-label="Pembaruan 2025">' +
    sectionHead("Pembaruan 2025 — angka terbaru yang sudah dirilis",
      "Tahun 2024 adalah tahun lengkap terakhir; di bawah ini rilis 2025 yang sudah keluar saat situs dibuat.") +
    '<ul class="updates">' + updates + "</ul>" +
  "</section>" +
  '<section class="card" aria-label="Sekilas Indonesia">' +
    sectionHead("Sekilas Indonesia", "Gambaran yang paling sering dicari orang.") +
    '<ul class="facts">' +
    "<li><strong>55,93%</strong> penduduk tinggal di Pulau Jawa — 157,39 juta jiwa dari 282,48 juta (Kemendagri, Semester I 2024).</li>" +
    "<li><strong>5 tahun beruntun</strong> surplus neraca perdagangan, terakhir US$31,04 miliar pada 2024.</li>" +
    "<li><strong>1,57%</strong> inflasi Desember 2024 — terendah sepanjang sejarah perhitungan BPS (sejak 1958).</li>" +
    "<li><strong>8,47%</strong> penduduk miskin pada Maret 2025 — terendah dalam dua dekade.</li>" +
    "</ul>" +
    '<p class="card-link"><a href="#/sumber">Semua sumber &amp; metode →</a></p>' +
  "</section>";
};

/* ================= Ekonomi ================= */
VIEWS.ekonomi = function () {
  const sectors = NUSA.sectors.map(function (s, i) {
    return {
      label: s.name,
      value: s.share,
      color: i === 0 ? CH.teal : (i < 5 ? CH.tealSoft : "#c9d6cf")
    };
  });
  const expRows = NUSA.expenditure.map(function (e) {
    return "<tr><td>" + esc(e.component) + "</td>" +
      '<td class="num">' + (e.growth > 0 ? "+" : "") +
      e.growth.toString().replace(".", ",") + "%</td>" +
      "<td>" + esc(e.note) + "</td></tr>";
  }).join("");
  return "" +
  pageHead("Ekonomi",
    "Ekonomi Indonesia: tumbuh di atas 5%, harga terjaga.",
    "PDB 2024 mencapai Rp22.139 triliun dan tumbuh 5,03%. Industri pengolahan " +
    "tetap menjadi tulang punggung, perdagangan surplus lima tahun beruntun.") +
  '<section class="card chart-card" aria-label="PDB">' +
    sectionHead("PDB 2019–2025", "Beralih antara nilai nominal dan laju pertumbuhannya.") +
    '<div class="controls" role="group" aria-label="Ukuran PDB">' +
      '<button class="chip active" data-gdp="gdpGrowth">Pertumbuhan (%)</button>' +
      '<button class="chip" data-gdp="gdpNominal">Nilai nominal (Rp T)</button>' +
    "</div>" +
    '<div class="controls" role="group" aria-label="Jenis grafik">' +
      '<button class="chip small active" data-chart="bar">Batang</button>' +
      '<button class="chip small" data-chart="line">Garis</button>' +
    "</div>" +
    '<div id="gdp-chart"></div>' +
    '<p class="chart-note">2020 adalah satu-satunya kontraksi dalam deret ini (−2,07%), tahun pandemi Covid-19. ' +
    "Sejak 2022 pertumbuhan kembali di atas 5% dan bertahan empat tahun beruntun.</p>" +
    '<p class="chart-src">Sumber: BPS, Berita Resmi Statistik PDB tahunan.</p>' +
  "</section>" +
  '<section class="card chart-card" aria-label="Struktur PDB">' +
    sectionHead("Siapa yang menggerakkan PDB 2024",
      "Pangsa tiap lapangan usaha terhadap PDB. Lima terbesar mencakup 63,90%.") +
    '<div id="sector-chart">' +
      CHART.hbar({ rows: sectors, aria: "Pangsa lapangan usaha terhadap PDB 2024" }) +
    "</div>" +
    '<p class="chart-note">' + esc(NUSA.sectorsNote) + "</p>" +
    '<p class="chart-src">Sumber: BPS, rilis PDB 2024.</p>' +
  "</section>" +
  '<section class="card chart-card" aria-label="Perdagangan">' +
    sectionHead("Perdagangan luar negeri 2019–2024",
      "Ekspor, impor, dan surplusnya — pilih yang mau dilihat.") +
    '<div class="controls" role="group" aria-label="Ukuran perdagangan">' +
      '<button class="chip active" data-trade="exports">Ekspor</button>' +
      '<button class="chip" data-trade="imports">Impor</button>' +
      '<button class="chip" data-trade="surplus">Surplus</button>' +
    "</div>" +
    '<div id="trade-chart"></div>' +
    '<p class="chart-note" id="trade-note">Ekspor 2024 US$264,70 miliar (+2,29% dari 2023); impor US$233,66 miliar (+11,07%). ' +
    "Surplus US$31,04 miliar — tahun kelima beruntun sejak 2020.</p>" +
    '<p class="chart-src">Sumber: ' + esc(NUSA.trade.source) + ".</p>" +
  "</section>" +
  '<section class="card" aria-label="Pengeluaran PDB">' +
    sectionHead("Dari sisi pengeluaran, apa yang tumbuh paling cepat?",
      "Pertumbuhan komponen PDB menurut pengeluaran, 2024 (c-to-c).") +
    '<table class="data-table"><thead><tr><th>Komponen</th><th>Pertumbuhan 2024</th><th>Catatan</th></tr></thead>' +
    "<tbody>" + expRows + "</tbody></table>" +
    '<p class="chart-src">Sumber: BPS, BRS PDB Triwulan IV-2024.</p>' +
  "</section>";
};

/* ================= Penduduk ================= */
VIEWS.penduduk = function () {
  const labour = NUSA.labour.map(function (l) {
    return "<li><strong>" + esc(l.value) + "</strong><span>" + esc(l.label) +
      " · " + esc(l.note) + "</span></li>";
  }).join("");
  const yearLabels = ["2019", "2020", "2021", "2022", "2023", "2024", "2025"];
  return "" +
  pageHead("Penduduk & tenaga kerja",
    "281,6 juta jiwa — dan makin sedikit yang menganggur.",
    "Penduduk tumbuh sekitar 1% per tahun. Pengangguran turun ke 4,85% pada Agustus 2025, " +
    "kemiskinan ke 8,47% pada Maret 2025 — keduanya terendah dalam dua dekade.") +
  '<section class="card chart-card" aria-label="Penduduk">' +
    sectionHead("Penduduk 2019–2024",
      "Pertumbuhan stabil sekitar 1% per tahun; 2025 belum dirilis penuh.") +
    '<div id="pop-chart">' +
      CHART.bar({ labels: yearLabels.slice(0, 6),
        values: NUSA.series.population.values.slice(0, 6), unit: "jt",
        aria: "Jumlah penduduk Indonesia 2019 sampai 2024" }) +
    "</div>" +
    '<p class="chart-note">Dari 266,91 juta (2019) menjadi 281,60 juta (2024). Jawa menampung 55,93% penduduk ' +
    "— 157,39 juta jiwa (Kemendagri, Semester I 2024).</p>" +
    '<p class="chart-src">Sumber: BPS, Proyeksi Penduduk 2020–2050.</p>' +
  "</section>" +
  '<section class="card chart-card" aria-label="Pengangguran">' +
    sectionHead("Pengangguran terbuka — Agustus, 2019–2025",
      "Lonjakan pandemi 2020 (7,07%) sudah pulih sepenuhnya; Agustus 2025 di 4,85%.") +
    '<div id="tpt-chart">' +
      CHART.line({ labels: yearLabels,
        values: NUSA.series.unemployment.values, unit: "%", color: CH.amber,
        aria: "Tingkat pengangguran terbuka Agustus 2019 sampai 2025" }) +
    "</div>" +
    '<p class="chart-note">Lulusan SMK mencatat TPT tertinggi menurut pendidikan (8,63%, Agustus 2025). ' +
    "TPT November 2025 turun lagi ke 4,74%.</p>" +
    '<p class="chart-src">Sumber: BPS, Sakernas Agustus.</p>' +
  "</section>" +
  '<section class="card chart-card" aria-label="Kemiskinan">' +
    sectionHead("Kemiskinan — Maret, 2019–2025",
      "Naik saat pandemi, lalu turun tiap tahun ke titik terendah.") +
    '<div id="pov-chart">' +
      CHART.line({ labels: yearLabels,
        values: NUSA.series.poverty.values, unit: "%", color: CH.green,
        aria: "Persentase penduduk miskin Maret 2019 sampai 2025" }) +
    "</div>" +
    '<p class="chart-note">Garis kemiskinan Maret 2025: Rp609.160 per kapita per bulan (±Rp20.305 per hari). ' +
    "September 2025 turun lagi ke 8,25% (23,36 juta orang); gini 0,363.</p>" +
    '<p class="chart-src">Sumber: BPS, Profil Kemiskinan.</p>' +
  "</section>" +
  '<section class="card" aria-label="Tenaga kerja">' +
    sectionHead("Tenaga kerja Agustus 2025",
      "Bukan cuma angka pengangguran — ini gambaran siapa yang bekerja dan bagaimana.") +
    '<ul class="stat-list">' + labour + "</ul>" +
    '<p class="chart-src">Sumber: BPS, Keadaan Ketenagakerjaan Indonesia Agustus 2025 (Sakernas).</p>' +
  "</section>";
};

/* ================= Provinsi ================= */
VIEWS.provinsi = function () {
  const rows = NUSA.provinces.map(function (p) {
    const share = (p.pop / NUSA.provincesMeta.total2026) * 100;
    return '<tr data-rank="' + p.rank + '" tabindex="0">' +
      '<td class="num">' + p.rank + "</td>" +
      "<td><strong>" + esc(p.name) + "</strong></td>" +
      "<td>" + esc(p.capital) + "</td>" +
      "<td>" + esc(p.island) + "</td>" +
      '<td class="num">' + p.pop.toFixed(2).replace(".", ",") + "</td>" +
      '<td class="num">' + share.toFixed(1).replace(".", ",") + "%</td></tr>";
  }).join("");
  return "" +
  pageHead("Provinsi",
    "Di mana orang Indonesia tinggal?",
    "Sepuluh provinsi terpadat menampung lebih dari tiga perempat penduduk. " +
    "Cari provinsinya, urutkan tabelnya, klik barisnya untuk melihat rinciannya.") +
  '<section class="card" aria-label="Tabel provinsi">' +
    sectionHead("10 provinsi terpadat",
      "Proyeksi BPS 2026. Pangsa dihitung dari total proyeksi nasional 287,1 juta jiwa.") +
    '<div class="controls prov-controls">' +
      '<input id="prov-search" type="search" placeholder="Cari provinsi atau ibu kota…" aria-label="Cari provinsi">' +
      '<label>Urutkan <select id="prov-sort" aria-label="Urutkan provinsi">' +
        '<option value="pop-desc">Penduduk terbanyak</option>' +
        '<option value="pop-asc">Penduduk tersedikit</option>' +
        '<option value="name">Nama (A–Z)</option>' +
      "</select></label>" +
    "</div>" +
    '<div class="table-wrap"><table class="data-table" id="prov-table">' +
    "<thead><tr><th>#</th><th>Provinsi</th><th>Ibu kota</th><th>Pulau</th>" +
    "<th>Penduduk (jt)</th><th>Pangsa</th></tr></thead>" +
    "<tbody>" + rows + "</tbody></table></div>" +
    '<p class="chart-note" id="prov-count">Menampilkan 10 dari 10 provinsi.</p>' +
    '<p class="chart-src">Sumber: ' + esc(NUSA.provincesMeta.source) + ".</p>" +
  "</section>" +
  '<section class="card" id="prov-detail" aria-label="Rincian provinsi" aria-live="polite">' +
    sectionHead("Rincian provinsi", "Klik salah satu baris tabel di atas.") +
    '<p class="muted">Belum ada provinsi yang dipilih — klik baris <strong>Jawa Barat</strong> untuk mencoba.</p>' +
  "</section>" +
  '<section class="card" aria-label="Catatan provinsi">' +
    sectionHead("Yang juga perlu tahu", "Di luar sepuluh besar.") +
    '<ul class="facts">' +
    "<li><strong>Kalimantan Utara</strong> adalah provinsi tersedikit penduduknya: 739.800 jiwa (BPS, 2024).</li>" +
    "<li><strong>Papua Pegunungan</strong> mencatat inflasi provinsi tertinggi Desember 2024: 5,36% y-on-y (BPS).</li>" +
    "<li><strong>Papua</strong> mencatat TPT tertinggi Agustus 2025: 6,96%, disusul Papua Barat Daya 6,85% dan Jawa Barat 6,77% (BPS).</li>" +
    "</ul>" +
    '<p class="card-link"><button class="btn" id="download-csv">Unduh data provinsi (CSV) ↓</button></p>' +
  "</section>";
};

/* ================= Sumber ================= */
VIEWS.sumber = function () {
  const items = NUSA.sources.map(function (s) {
    return "<li><strong>" + s.n + ". " + esc(s.what) + "</strong><span>" +
      esc(s.pub) + "</span></li>";
  }).join("");
  return "" +
  pageHead("Sumber & metode",
    "Dari mana semua angka ini?",
    "Setiap angka di situs ini bisa dilacak ke rilis resminya. Kalau sebuah angka " +
    "tidak bisa diverifikasi, angka itu tidak masuk.") +
  '<section class="card" aria-label="Daftar sumber">' +
    sectionHead("Daftar sumber", "Sepuluh rilis yang dipakai situs ini.") +
    '<ol class="sources">' + items + "</ol>" +
  "</section>" +
  '<section class="card" aria-label="Metode">' +
    sectionHead("Cara membaca situs ini",
      "Tiga hal yang perlu diketahui sebelum mengutip angkanya.") +
    '<ul class="facts">' +
    "<li><strong>Tahun rujukan.</strong> 2024 adalah tahun lengkap terakhir untuk sebagian besar deret. Angka 2025 hanya ditampilkan bila rilisnya sudah terbit.</li>" +
    "<li><strong>Definisi tetap.</strong> Inflasi memakai Desember y-on-y, pengangguran memakai Agustus, kemiskinan memakai Maret — definisi yang sama di setiap tahun deretnya.</li>" +
    "<li><strong>Pembulatan.</strong> Angka dibulatkan ke dua desimal dari rilis aslinya; pangsa provinsi dihitung dari total proyeksi BPS 2026 (287,1 juta jiwa).</li>" +
    "</ul>" +
    '<p class="chart-note">' + esc(NUSA.methodNote) + "</p>" +
    '<p class="card-link"><button class="btn" id="download-csv">Unduh semua data situs (CSV) ↓</button></p>' +
  "</section>";
};
