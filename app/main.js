/* NusaStat — main.js
 *
 * Router hash + semua kontrol interaktif. Satu pekerjaan: halaman mana
 * yang tampil, dan tombol apa yang hidup. Tidak ada request jaringan di
 * sini: CSV dibuat dari data.js di memori (Blob), grafik digambar dari
 * data.js oleh charts.js.
 *
 * Rute: #/beranda #/ekonomi #/penduduk #/provinsi #/sumber.
 * Rute yang tidak dikenal jatuh ke beranda. */

const ROUTES = {
  beranda: VIEWS.beranda,
  ekonomi: VIEWS.ekonomi,
  penduduk: VIEWS.penduduk,
  provinsi: VIEWS.provinsi,
  sumber: VIEWS.sumber
};
const TITLES = {
  beranda: "Beranda",
  ekonomi: "Ekonomi",
  penduduk: "Penduduk",
  provinsi: "Provinsi",
  sumber: "Sumber & Metode"
};

function currentRoute() {
  const h = (window.location.hash || "#/beranda").replace(/^#\/?/, "");
  return ROUTES[h] ? h : "beranda";
}

/* Pasang status aktif di nav untuk rute yang sedang tampil. */
function markNav(route) {
  document.querySelectorAll(".nav-link").forEach(function (a) {
    const on = a.getAttribute("href") === "#/" + route;
    a.classList.toggle("active", on);
    if (on) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
}

function render() {
  const route = currentRoute();
  const main = document.getElementById("page");
  main.innerHTML = ROUTES[route]();
  markNav(route);
  document.title = "NusaStat — " + TITLES[route] + " | Statistik Indonesia";
  window.scrollTo(0, 0);
  if (route === "beranda") wireBeranda();
  if (route === "ekonomi") wireEkonomi();
  if (route === "provinsi") wireProvinsi();
  wireCsvButtons();
}

/* Chip yang saling eksklusif di dalam satu grup: klik satu, yang lain mati. */
function wireChipGroup(selector, onPick) {
  document.querySelectorAll(selector).forEach(function (b) {
    b.addEventListener("click", function () {
      document.querySelectorAll(selector).forEach(function (x) {
        x.classList.remove("active");
      });
      b.classList.add("active");
      onPick();
    });
  });
}

function activeValue(selector, attr) {
  const el = document.querySelector(selector + ".active");
  return el ? el.dataset[attr] : null;
}

/* ================= Beranda: grafik tren multi-indikator ================= */
const TREND_NOTES = {
  gdpGrowth: "Pandemi 2020 memangkas pertumbuhan ke −2,07% — satu-satunya kontraksi dalam deret ini. Sejak 2022 pertumbuhan kembali di atas 5% dan bertahan empat tahun beruntun.",
  inflation: "Inflasi 2022 melonjak ke 5,51% setelah penyesuaian harga BBM, lalu melandai ke 1,57% pada Desember 2024 — terendah sepanjang sejarah perhitungan BPS.",
  population: "Penduduk tumbuh stabil sekitar 1% per tahun. Dari 266,91 juta (2019) menjadi 281,60 juta (2024); 2025 belum dirilis penuh.",
  unemployment: "Pengangguran melonjak ke 7,07% pada Agustus 2020, lalu turun tiap tahun hingga 4,85% pada Agustus 2025.",
  poverty: "Kemiskinan naik saat pandemi (10,14% pada Maret 2021), lalu turun tiap tahun ke 8,47% pada Maret 2025 — terendah dalam dua dekade."
};

function drawTrend() {
  const metric = activeValue("[data-metric]", "metric");
  const kind = activeValue("#page [data-chart]", "chart");
  const s = NUSA.series[metric];
  const labels = NUSA.series.years.map(String);
  const box = document.getElementById("trend-chart");
  const opts = { labels: labels, values: s.values, unit: s.unit, aria: s.label };
  box.innerHTML = kind === "line"
    ? CHART.line(opts)
    : CHART.bar(Object.assign(opts, { negativeColor: "#b4432f" }));
  document.getElementById("trend-note").textContent = TREND_NOTES[metric];
  document.getElementById("trend-src").textContent = "Sumber: " + s.source + "." +
    (s.note ? " " + s.note : "");
}

function wireBeranda() {
  drawTrend();
  wireChipGroup("[data-metric]", drawTrend);
  wireChipGroup("#page [data-chart]", drawTrend);
}

/* ================= Ekonomi: grafik PDB + perdagangan ================= */
function drawGdp() {
  const key = activeValue("[data-gdp]", "gdp");
  const kind = activeValue("#page [data-chart]", "chart");
  const s = NUSA.series[key];
  const labels = NUSA.series.years.map(String);
  const opts = { labels: labels, values: s.values, unit: s.unit, aria: s.label };
  document.getElementById("gdp-chart").innerHTML = kind === "line"
    ? CHART.line(opts)
    : CHART.bar(Object.assign(opts, { negativeColor: "#b4432f" }));
}

const TRADE_NOTES = {
  exports: "Ekspor 2024 US$264,70 miliar (+2,29% dari 2023); impor US$233,66 miliar (+11,07%). Surplus US$31,04 miliar — tahun kelima beruntun sejak 2020.",
  imports: "Impor 2024 US$233,66 miliar, 90,28% berupa bahan baku/penolong dan barang modal. Impor tumbuh 11,07% — jauh di atas ekspor.",
  surplus: "Surplus perdagangan 2024 US$31,04 miliar, lebih rendah dari 2023 (US$36,89 miliar) karena impor tumbuh lebih cepat dari ekspor."
};

function drawTrade() {
  const key = activeValue("[data-trade]", "trade");
  document.getElementById("trade-chart").innerHTML =
    CHART.bar({
      labels: NUSA.trade.years.map(String),
      values: NUSA.trade[key],
      unit: "US$ M",
      aria: "Perdagangan luar negeri Indonesia 2019 sampai 2024"
    });
  document.getElementById("trade-note").textContent = TRADE_NOTES[key];
}

function wireEkonomi() {
  drawGdp();
  drawTrade();
  wireChipGroup("[data-gdp]", drawGdp);
  wireChipGroup("#page [data-chart]", drawGdp);
  wireChipGroup("[data-trade]", drawTrade);
}

/* ================= Provinsi: cari + urutkan + rincian ================= */
function provShare(p) { return (p.pop / NUSA.provincesMeta.total2026) * 100; }

function showProvDetail(p) {
  const box = document.getElementById("prov-detail");
  const share = provShare(p);
  const rankLine = p.rank === 1
    ? "Satu dari setiap 5–6 orang Indonesia tinggal di provinsi ini."
    : "Satu dari setiap " + Math.round(100 / share) + " orang Indonesia tinggal di provinsi ini.";
  const rankLabel = p.rank === 1 ? "Terpadat di Indonesia" : "Peringkat " + p.rank + " nasional";
  box.innerHTML =
    '<div class="sec-head"><h2>' + esc(p.name) + "</h2><p>Peringkat " + p.rank +
    " dari 10 provinsi terpadat · Pulau " + esc(p.island) + "</p></div>" +
    '<ul class="stat-list">' +
    "<li><strong>" + p.pop.toFixed(2).replace(".", ",") + " jt</strong>" +
      "<span>Penduduk (proyeksi BPS 2026)</span></li>" +
    "<li><strong>" + share.toFixed(1).replace(".", ",") + "%</strong>" +
      "<span>Dari seluruh penduduk Indonesia</span></li>" +
    "<li><strong>" + esc(p.capital) + "</strong><span>Ibu kota provinsi</span></li>" +
    "<li><strong>" + rankLabel + "</strong><span>" + rankLine + "</span></li></ul>" +
    '<p class="chart-src">Sumber: ' + esc(NUSA.provincesMeta.source) + ".</p>";
}

function applyProvFilter() {
  const q = (document.getElementById("prov-search").value || "").toLowerCase();
  const sort = document.getElementById("prov-sort").value;
  const rows = Array.prototype.slice.call(
    document.querySelectorAll("#prov-table tbody tr"));
  let shown = 0;
  rows.forEach(function (tr) {
    const p = NUSA.provinces[+tr.dataset.rank - 1];
    const hit = !q ||
      p.name.toLowerCase().indexOf(q) !== -1 ||
      p.capital.toLowerCase().indexOf(q) !== -1;
    tr.style.display = hit ? "" : "none";
    if (hit) shown++;
  });
  const tbody = document.querySelector("#prov-table tbody");
  const ordered = rows.filter(function (tr) { return tr.style.display !== "none"; });
  ordered.sort(function (a, b) {
    const pa = NUSA.provinces[+a.dataset.rank - 1];
    const pb = NUSA.provinces[+b.dataset.rank - 1];
    if (sort === "pop-asc") return pa.pop - pb.pop;
    if (sort === "name") return pa.name.localeCompare(pb.name, "id");
    return pb.pop - pa.pop;
  });
  ordered.forEach(function (tr) { tbody.appendChild(tr); });
  document.getElementById("prov-count").textContent =
    "Menampilkan " + shown + " dari 10 provinsi" +
    (q ? " untuk pencarian \u201C" + q + "\u201D" : "") + ".";
}

function wireProvinsi() {
  document.getElementById("prov-search").addEventListener("input", applyProvFilter);
  document.getElementById("prov-sort").addEventListener("change", applyProvFilter);
  document.querySelectorAll("#prov-table tbody tr").forEach(function (tr) {
    const open = function () {
      document.querySelectorAll("#prov-table tbody tr").forEach(function (x) {
        x.classList.remove("selected");
      });
      tr.classList.add("selected");
      showProvDetail(NUSA.provinces[+tr.dataset.rank - 1]);
    };
    tr.addEventListener("click", open);
    tr.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
    });
  });
}

/* ================= Unduh CSV (dibuat di memori, tanpa jaringan) ================= */
function downloadCsv() {
  const lines = [["indikator", "nilai", "tahun", "sumber"]];
  NUSA.kpi.forEach(function (k) {
    lines.push([k.label, k.value, k.sub, k.source]);
  });
  lines.push([]);
  lines.push(["provinsi", "ibu kota", "pulau", "penduduk_juta_2026"]);
  NUSA.provinces.forEach(function (p) {
    lines.push([p.name, p.capital, p.island, String(p.pop).replace(".", ",")]);
  });
  const csv = lines.map(function (r) {
    return r.map(function (c) {
      return '"' + String(c).replace(/"/g, '""') + '"';
    }).join(";");
  }).join("\r\n");
  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "nusastat-data-indonesia.csv";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
}

function wireCsvButtons() {
  document.querySelectorAll("#download-csv").forEach(function (b) {
    b.addEventListener("click", downloadCsv);
  });
}

window.addEventListener("hashchange", render);
render();
