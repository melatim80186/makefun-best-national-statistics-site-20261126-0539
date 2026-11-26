// NusaStat — halaman. Setiap halaman dirender dari data.js dan digambar
// dengan charts.js. Semua kontrol bekerja tanpa jaringan apa pun.

import {
  SERIES, YEARS, TRADE, TRADE_YEARS, TRADE_SOURCE, SECTORS, EXPENDITURE,
  LABOR, PROVINCES, PROVINCE_FACTS, SOURCES, KPI_CARDS, UPDATES_2025,
  GLANCE_FACTS, fmt, provinceShare, provinceContext, buildCsv,
} from './data.js';
import { barChart, lineChart, hbarChart } from './charts.js';

function segButtons(options, current, groupName) {
  return options
    .map(
      (o) =>
        `<button type="button" class="seg-btn${o.id === current ? ' active' : ''}" data-${groupName}="${o.id}" aria-pressed="${o.id === current}">${o.label}</button>`,
    )
    .join('');
}

function sourceLine(text) {
  return `<p class="source">Sumber: ${text}</p>`;
}

function downloadCsv() {
  const blob = new Blob([buildCsv()], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'nusastat-data-indonesia.csv';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ---------- BERANDA ----------

export function renderHome(root) {
  root.innerHTML = `
  <section class="hero">
    <p class="eyebrow">Statistik Indonesia · Tahun rujukan 2024</p>
    <h1>Indonesia dalam angka, dibaca dengan jelas.</h1>
    <p class="lede">Semua angka di situs ini berasal dari rilis resmi BPS dan kementerian — tidak ada angka yang dikarang. Setiap angka menunjukkan sumber dan tahunnya.</p>
    <p class="hero-meta">Tahun rujukan utama 2024 · Pembaruan 2025 sudah masuk · 38 provinsi · 17.380 pulau · Luas daratan 1.890.180 km²</p>
    <p class="hero-actions">
      <a class="btn btn-primary" href="#/ekonomi">Lihat ekonomi</a>
      <a class="btn" href="#/provinsi">Jelajahi provinsi</a>
    </p>
  </section>

  <section class="card">
    <h2>Enam angka yang menggambarkan Indonesia hari ini</h2>
    <div class="kpi-grid">
      ${KPI_CARDS.map(
        (k) => `
        <article class="kpi">
          <p class="kpi-label">${k.label}</p>
          <p class="kpi-value">${k.value}</p>
          <p class="kpi-sub">${k.sub}</p>
          <p class="kpi-change">${k.change}</p>
          <p class="kpi-detail">${k.detail}</p>
          <p class="source">Sumber: ${k.source}</p>
        </article>`,
      ).join('')}
    </div>
  </section>

  <section class="card">
    <h2>Satu grafik, lima cerita</h2>
    <p class="card-intro">Pilih indikatornya, lalu ubah tampilannya. Deret tahunan 2019–2025.</p>
    <div class="controls" role="group" aria-label="Pilih indikator">
      ${segButtons(
        [
          { id: 'gdpGrowth', label: 'Pertumbuhan PDB' },
          { id: 'inflation', label: 'Inflasi' },
          { id: 'population', label: 'Penduduk' },
          { id: 'unemployment', label: 'Pengangguran' },
          { id: 'poverty', label: 'Kemiskinan' },
        ],
        'gdpGrowth',
        'metric',
      )}
    </div>
    <div class="controls" role="group" aria-label="Jenis grafik">
      ${segButtons(
        [
          { id: 'bar', label: 'Batang' },
          { id: 'line', label: 'Garis' },
        ],
        'bar',
        'chart',
      )}
    </div>
    <div id="trend-chart" class="chart"></div>
    <p id="trend-note" class="note"></p>
    <p id="trend-source" class="source"></p>
  </section>

  <section class="card">
    <h2>Pembaruan 2025</h2>
    <ul class="update-list">
      ${UPDATES_2025.map(
        (u) => `<li><strong>${u.title}</strong> — ${u.text} <span class="source-inline">(${u.source})</span></li>`,
      ).join('')}
    </ul>
  </section>

  <section class="card">
    <h2>Sekilas Indonesia</h2>
    <div class="fact-grid">
      ${GLANCE_FACTS.map(
        (f) => `<article class="fact"><p class="fact-value">${f.value}</p><p>${f.text}</p></article>`,
      ).join('')}
    </div>
    <p class="card-link"><a href="#/sumber">Lihat dari mana semua angka ini →</a></p>
  </section>`;

  let trendId = 'gdpGrowth';
  let trendKind = 'bar';
  const drawTrend = () => {
    const s = SERIES[trendId];
    const chart = document.getElementById('trend-chart');
    chart.innerHTML =
      trendKind === 'bar'
        ? barChart({ values: s.values, labels: YEARS, unit: s.unit, decimals: s.id === 'gdpNominal' ? 1 : 2 })
        : lineChart({ values: s.values, labels: YEARS, unit: s.unit, decimals: s.id === 'gdpNominal' ? 1 : 2 });
    document.getElementById('trend-note').textContent = s.note;
    document.getElementById('trend-source').textContent = `Sumber: ${s.source}`;
  };
  root.querySelectorAll('[data-metric]').forEach((b) => {
    b.addEventListener('click', () => {
      trendId = b.getAttribute('data-metric');
      root.querySelectorAll('[data-metric]').forEach((x) => {
        x.classList.toggle('active', x === b);
        x.setAttribute('aria-pressed', x === b ? 'true' : 'false');
      });
      drawTrend();
    });
  });
  root.querySelectorAll('[data-chart]').forEach((b) => {
    b.addEventListener('click', () => {
      trendKind = b.getAttribute('data-chart');
      root.querySelectorAll('[data-chart]').forEach((x) => {
        x.classList.toggle('active', x === b);
        x.setAttribute('aria-pressed', x === b ? 'true' : 'false');
      });
      drawTrend();
    });
  });
  drawTrend();
}

// ---------- EKONOMI ----------

export function renderEconomy(root) {
  root.innerHTML = `
  <section class="page-head">
    <p class="eyebrow">Ekonomi</p>
    <h1>Ekonomi Indonesia: tumbuh di atas 5%, harga terjaga.</h1>
    <p class="lede">PDB 2024 mencapai Rp22.139 triliun dan tumbuh 5,03%. Inflasi Desember 2024 tercatat 1,57% — terendah sepanjang sejarah perhitungan BPS.</p>
  </section>

  <section class="card chart-card">
    <h2>PDB 2019–2025</h2>
    <div class="controls" role="group" aria-label="Ukuran PDB">
      ${segButtons(
        [
          { id: 'gdpGrowth', label: 'Pertumbuhan (%)' },
          { id: 'gdpNominal', label: 'Nilai nominal (Rp T)' },
        ],
        'gdpGrowth',
        'gdp',
      )}
    </div>
    <div class="controls" role="group" aria-label="Jenis grafik">
      ${segButtons(
        [
          { id: 'bar', label: 'Batang' },
          { id: 'line', label: 'Garis' },
        ],
        'bar',
        'chart',
      )}
    </div>
    <div id="gdp-chart" class="chart"></div>
    <p class="note">2020 adalah satu-satunya kontraksi dalam deret ini (−2,07%), tahun pandemi Covid-19. Sejak 2022 pertumbuhan kembali di atas 5% dan bertahan empat tahun beruntun.</p>
    ${sourceLine('BPS, Berita Resmi Statistik PDB tahunan')}
  </section>

  <section class="card">
    <h2>Siapa yang menggerakkan PDB 2024</h2>
    <p class="card-intro">Pangsa lapangan usaha terhadap PDB, persen.</p>
    <div class="chart">${hbarChart({ items: SECTORS.map((s) => ({ name: s.name, value: s.share })), unit: '%', decimals: 2 })}</div>
    <p class="note">Pangsa 2024, BPS. Lima lapangan usaha terbesar mencakup 63,90% PDB; sisanya 36,10% adalah 12 lapangan usaha lain (transportasi, informasi, keuangan, jasa, dan lain-lain). Pertumbuhan tertinggi 2024: jasa lainnya 9,80%, transportasi &amp; pergudangan 8,69%.</p>
    ${sourceLine('BPS, rilis PDB 2024, dikutip Kemenperin, 2025')}
  </section>

  <section class="card">
    <h2>Perdagangan luar negeri 2019–2024</h2>
    <div class="controls" role="group" aria-label="Pilih arus perdagangan">
      ${segButtons(
        [
          { id: 'exports', label: 'Ekspor' },
          { id: 'imports', label: 'Impor' },
          { id: 'surplus', label: 'Surplus' },
        ],
        'exports',
        'trade',
      )}
    </div>
    <div id="trade-chart" class="chart"></div>
    <p id="trade-note" class="note"></p>
    <p class="note">Ekspor 2024 terdiri dari nonmigas US$248,83 M + migas US$15,89 M. Tujuan ekspor nonmigas terbesar Desember 2024: Tiongkok, AS, Jepang.</p>
    ${sourceLine(TRADE_SOURCE)}
  </section>

  <section class="card">
    <h2>Dari sisi pengeluaran, apa yang tumbuh paling cepat?</h2>
    <p class="card-intro">Pertumbuhan komponen PDB 2024, persen y-on-y.</p>
    <table class="data-table">
      <thead><tr><th>Komponen</th><th>Pertumbuhan</th><th>Catatan</th></tr></thead>
      <tbody>
        ${EXPENDITURE.map(
          (e) => `<tr><td>${e.name}</td><td class="num">${fmt(e.growth)}%</td><td>${e.note}</td></tr>`,
        ).join('')}
      </tbody>
    </table>
    ${sourceLine('BPS, Berita Resmi Statistik PDB Triwulan IV-2024')}
  </section>`;

  let gdpMode = 'gdpGrowth';
  let gdpKind = 'bar';
  const drawGdp = () => {
    const s = SERIES[gdpMode];
    document.getElementById('gdp-chart').innerHTML =
      gdpKind === 'bar'
        ? barChart({ values: s.values, labels: YEARS, unit: s.unit, decimals: gdpMode === 'gdpNominal' ? 1 : 2 })
        : lineChart({ values: s.values, labels: YEARS, unit: s.unit, decimals: gdpMode === 'gdpNominal' ? 1 : 2 });
  };
  root.querySelectorAll('[data-gdp]').forEach((b) => {
    b.addEventListener('click', () => {
      gdpMode = b.getAttribute('data-gdp');
      root.querySelectorAll('[data-gdp]').forEach((x) => {
        x.classList.toggle('active', x === b);
        x.setAttribute('aria-pressed', x === b ? 'true' : 'false');
      });
      drawGdp();
    });
  });
  root.querySelectorAll('[data-chart]').forEach((b) => {
    b.addEventListener('click', () => {
      gdpKind = b.getAttribute('data-chart');
      root.querySelectorAll('[data-chart]').forEach((x) => {
        x.classList.toggle('active', x === b);
        x.setAttribute('aria-pressed', x === b ? 'true' : 'false');
      });
      drawGdp();
    });
  });
  drawGdp();

  let tradeId = 'exports';
  const drawTrade = () => {
    const t = TRADE[tradeId];
    document.getElementById('trade-chart').innerHTML = barChart({
      values: t.values,
      labels: TRADE_YEARS,
      unit: t.unit,
      decimals: 2,
    });
    document.getElementById('trade-note').textContent = t.note;
  };
  root.querySelectorAll('[data-trade]').forEach((b) => {
    b.addEventListener('click', () => {
      tradeId = b.getAttribute('data-trade');
      root.querySelectorAll('[data-trade]').forEach((x) => {
        x.classList.toggle('active', x === b);
        x.setAttribute('aria-pressed', x === b ? 'true' : 'false');
      });
      drawTrade();
    });
  });
  drawTrade();
}

// ---------- PENDUDUK ----------

export function renderPopulation(root) {
  root.innerHTML = `
  <section class="page-head">
    <p class="eyebrow">Penduduk</p>
    <h1>281,6 juta jiwa — dan makin sedikit yang menganggur.</h1>
    <p class="lede">Penduduk tumbuh sekitar 1% per tahun. Pengangguran turun ke 4,85% pada Agustus 2025, kemiskinan ke 8,47% pada Maret 2025.</p>
  </section>

  <section class="card">
    <h2>Penduduk 2019–2024</h2>
    <p class="card-intro">Juta jiwa, pertengahan tahun.</p>
    <div class="chart">${barChart({ values: SERIES.population.values, labels: YEARS, unit: 'juta jiwa', decimals: 2 })}</div>
    <p class="note">Dari 266,91 juta (2019) menjadi 281,60 juta (2024). Jawa menampung 55,93% penduduk — 157,39 juta jiwa (Kemendagri, Semester I 2024).</p>
    ${sourceLine('BPS, Proyeksi Penduduk 2020–2050')}
  </section>

  <section class="card">
    <h2>Pengangguran terbuka — Agustus, 2019–2025</h2>
    <p class="card-intro">Persen angkatan kerja.</p>
    <div class="chart">${lineChart({ values: SERIES.unemployment.values, labels: YEARS, unit: '%', decimals: 2 })}</div>
    <p class="note">Lulusan SMK mencatat TPT tertinggi menurut pendidikan (8,63%, Agustus 2025). TPT November 2025 turun lagi ke 4,74%.</p>
    ${sourceLine('BPS, Survei Angkatan Kerja Nasional (Sakernas) Agustus')}
  </section>

  <section class="card">
    <h2>Kemiskinan — Maret, 2019–2025</h2>
    <p class="card-intro">Persen penduduk.</p>
    <div class="chart">${lineChart({ values: SERIES.poverty.values, labels: YEARS, unit: '%', decimals: 2 })}</div>
    <p class="note">Garis kemiskinan Maret 2025: Rp609.160 per kapita per bulan (±Rp20.305 per hari). September 2025 turun lagi ke 8,25% (23,36 juta orang); gini 0,363.</p>
    ${sourceLine('BPS, Profil Kemiskinan')}
  </section>

  <section class="card">
    <h2>Tenaga kerja Agustus 2025</h2>
    <div class="stat-grid">
      ${LABOR.map(
        (l) => `<article class="stat"><p class="stat-value">${l.value}</p><p class="stat-label">${l.label}</p><p class="source">${l.year}</p></article>`,
      ).join('')}
    </div>
    ${sourceLine('BPS, Keadaan Ketenagakerjaan Indonesia Agustus 2025 (Sakernas)')}
  </section>`;
}

// ---------- PROVINSI ----------

export function renderProvinces(root) {
  root.innerHTML = `
  <section class="page-head">
    <p class="eyebrow">Provinsi</p>
    <h1>Di mana orang Indonesia tinggal?</h1>
    <p class="lede">Sepuluh provinsi terpadat menampung lebih dari tiga perempat penduduk. Klik baris tabel untuk melihat rincian tiap provinsi.</p>
  </section>

  <section class="card">
    <h2>10 provinsi terpadat</h2>
    <p class="card-intro">Proyeksi BPS 2026. Pangsa dihitung dari total proyeksi nasional 287,1 juta jiwa.</p>
    <div class="controls controls-wrap">
      <label class="search-label">Cari provinsi
        <input id="prov-search" type="search" placeholder="Cari provinsi atau ibu kota…" autocomplete="off">
      </label>
      <label class="sort-label">Urutkan
        <select id="prov-sort">
          <option value="pop-desc">Terbanyak dulu</option>
          <option value="pop-asc">Terkecil dulu</option>
          <option value="name">Nama A–Z</option>
        </select>
      </label>
      <button type="button" class="btn btn-primary" id="download-csv">Unduh CSV</button>
    </div>
    <p id="prov-count" class="count" aria-live="polite">Menampilkan 10 dari 10 provinsi</p>
    <div class="table-wrap">
      <table class="data-table" id="prov-table">
        <thead><tr><th>#</th><th>Provinsi</th><th>Ibu kota</th><th>Pulau</th><th>Penduduk (jt)</th><th>Pangsa</th></tr></thead>
        <tbody id="prov-body"></tbody>
      </table>
    </div>
    ${sourceLine('BPS, Proyeksi Penduduk Indonesia 2020–2050 (proyeksi 2026)')}
  </section>

  <section class="card" id="prov-detail-card">
    <h2>Rincian provinsi</h2>
    <div id="prov-detail"><p class="muted">Klik salah satu baris tabel untuk melihat rincian provinsi.</p></div>
  </section>

  <section class="card">
    <h2>Yang juga perlu tahu</h2>
    <ul class="update-list">
      ${PROVINCE_FACTS.map((f) => `<li><strong>${f.title}:</strong> ${f.text}</li>`).join('')}
    </ul>
  </section>`;

  const body = document.getElementById('prov-body');
  const count = document.getElementById('prov-count');
  const detail = document.getElementById('prov-detail');
  const search = document.getElementById('prov-search');
  const sort = document.getElementById('prov-sort');

  function showDetail(p) {
    detail.innerHTML = `
      <h3>${p.name}</h3>
      <dl class="detail-list">
        <div><dt>Peringkat</dt><dd>#${p.rank} terpadat</dd></div>
        <div><dt>Pulau</dt><dd>${p.island}</dd></div>
        <div><dt>Penduduk</dt><dd>${fmt(p.pop)} juta jiwa (proyeksi 2026)</dd></div>
        <div><dt>Pangsa</dt><dd>${fmt(provinceShare(p))}% dari total proyeksi nasional</dd></div>
        <div><dt>Ibu kota</dt><dd>${p.capital}</dd></div>
      </dl>
      <p class="note">${provinceContext(p)}</p>`;
  }

  function renderRows() {
    const q = search.value.trim().toLowerCase();
    let rows = PROVINCES.filter(
      (p) => !q || p.name.toLowerCase().includes(q) || p.capital.toLowerCase().includes(q),
    );
    if (sort.value === 'pop-asc') rows = [...rows].sort((a, b) => a.pop - b.pop);
    else if (sort.value === 'name') rows = [...rows].sort((a, b) => a.name.localeCompare(b.name, 'id'));
    else rows = [...rows].sort((a, b) => b.pop - a.pop);
    body.innerHTML = rows
      .map(
        (p) => `<tr tabindex="0" data-rank="${p.rank}">
          <td>${p.rank}</td><td><strong>${p.name}</strong></td><td>${p.capital}</td>
          <td>${p.island}</td><td class="num">${fmt(p.pop)}</td><td class="num">${fmt(provinceShare(p))}%</td>
        </tr>`,
      )
      .join('');
    count.textContent = `Menampilkan ${rows.length} dari 10 provinsi`;
    body.querySelectorAll('tr').forEach((tr) => {
      const pick = () => {
        const p = PROVINCES.find((x) => x.rank === Number(tr.getAttribute('data-rank')));
        body.querySelectorAll('tr').forEach((x) => x.classList.remove('selected'));
        tr.classList.add('selected');
        showDetail(p);
      };
      tr.addEventListener('click', pick);
      tr.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          pick();
        }
      });
    });
  }

  search.addEventListener('input', renderRows);
  sort.addEventListener('change', renderRows);
  document.getElementById('download-csv').addEventListener('click', downloadCsv);
  renderRows();
}

// ---------- SUMBER ----------

export function renderSources(root) {
  root.innerHTML = `
  <section class="page-head">
    <p class="eyebrow">Sumber</p>
    <h1>Dari mana semua angka ini?</h1>
    <p class="lede">Setiap angka di NusaStat bisa dilacak ke rilis resminya. Di bawah ini sepuluh sumber utama yang dipakai di seluruh situs.</p>
  </section>

  <section class="card">
    <h2>Daftar sumber</h2>
    <ol class="sources source-list" id="sources-list">
      ${SOURCES.map(
        (s, i) => `<li class="source-item" data-source="${i + 1}"><strong>${s.title}</strong> — ${s.detail}<br><span class="source">${s.cite}</span></li>`,
      ).join('')}
    </ol>
    <p><button type="button" class="btn btn-primary" id="download-csv">Unduh CSV</button></p>
  </section>

  <section class="card">
    <h2>Metode</h2>
    <ul class="update-list">
      <li><strong>Tahun rujukan:</strong> 2024 adalah tahun lengkap terakhir; angka 2025 hanya bila rilisnya sudah terbit.</li>
      <li><strong>Definisi tetap:</strong> inflasi memakai Desember y-on-y, pengangguran memakai Agustus, kemiskinan memakai Maret.</li>
      <li><strong>Pembulatan:</strong> angka dibulatkan ke dua desimal dari rilis aslinya; pangsa provinsi dihitung dari total proyeksi BPS 2026 (287,1 juta jiwa).</li>
    </ul>
    <p class="note">NusaStat adalah situs independen yang merangkum angka resmi — bukan situs BPS dan tidak berafiliasi dengan BPS. Angka dibulatkan ke dua desimal dari rilis aslinya; deret tahunan memakai definisi yang sama di setiap tahun (Desember y-on-y untuk inflasi, Agustus untuk TPT, Maret untuk kemiskinan). Angka 2025 adalah rilis yang sudah keluar saat situs dibuat; sel yang kosong berarti rilisnya belum terbit.</p>
  </section>`;

  document.getElementById('download-csv').addEventListener('click', downloadCsv);
}
