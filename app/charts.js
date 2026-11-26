/* NusaStat — charts.js
 *
 * Tiga jenis grafik SVG inline yang digambar langsung dari angka data.js.
 * Tanpa library, tanpa gambar luar, tanpa request jaringan. Semua grafik
 * mengembalikan string SVG yang disisipkan ke halaman oleh views.js /
 * main.js.
 *
 * Aturan gambar yang dijaga di sini:
 * - batang negatif (mis. pertumbuhan PDB 2020: -2,07%) digambar KE BAWAH
 *   dari garis nol, dan label nilainya ditaruh di atas garis nol supaya
 *   tidak bertabrakan dengan label tahun di bawah sumbu;
 * - sel yang belum rilis (nilai null) digambar sebagai teks "belum rilis",
 *   bukan batang nol — nol palsu akan menyesatkan. */

const CHART = {};

/* Palet — sama dengan style.css. */
const CH = {
  ink: "#1d2f2c",
  muted: "#5b6f6a",
  grid: "#dfe7e2",
  teal: "#0e5f56",
  tealSoft: "#7fb3a9",
  amber: "#d97706",
  amberSoft: "#f2c879",
  red: "#b4432f",
  green: "#2e7d4f",
  card: "#ffffff"
};

/* Loloskan teks ke dalam atribut/isi SVG. */
function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/* Angka Indonesia: koma desimal, satuan ditempel (mis. 5,03%). */
function fmtNum(v, unit) {
  if (v === null || v === undefined) return "—";
  const s = (Math.round(v * 100) / 100).toString().replace(".", ",");
  return unit === "%" ? s + "%" : s;
}

/* Garis grid horizontal + label sumbu-y. ticks: [{val, pos}] dengan
 * pos 0..1 dari bawah. Mengembalikan potongan string SVG. */
function axisLines(w, h, pad, ticks, fmt) {
  let out = "";
  ticks.forEach(function (t) {
    const y = pad.t + (1 - t.pos) * (h - pad.t - pad.b);
    out += '<line x1="' + pad.l + '" y1="' + y.toFixed(1) +
      '" x2="' + (w - pad.r) + '" y2="' + y.toFixed(1) +
      '" stroke="' + CH.grid + '" stroke-width="1"/>';
    out += '<text x="' + (pad.l - 8) + '" y="' + (y + 4).toFixed(1) +
      '" text-anchor="end" font-size="11" fill="' + CH.muted + '">' +
      esc(fmt(t.val)) + "</text>";
  });
  return out;
}

/* Lima tick merata dari lo ke hi. */
function evenTicks(lo, hi, n) {
  const ticks = [];
  for (let i = 0; i <= n; i++) {
    const v = lo + ((hi - lo) * i) / n;
    ticks.push({ val: v, pos: (v - lo) / (hi - lo) });
  }
  return ticks;
}

function svgOpen(w, h, aria) {
  return '<svg viewBox="0 0 ' + w + " " + h + '" role="img" aria-label="' +
    esc(aria) + '" style="width:100%;height:auto;display:block">';
}

/* ---- Grafik batang vertikal ----
 * opts: {labels, values, unit, color, negativeColor, aria, width, height} */
CHART.bar = function (opts) {
  const labels = opts.labels, values = opts.values;
  const w = opts.width || 720, h = opts.height || 300;
  const pad = { t: 18, r: 12, b: 34, l: 52 };
  const plotW = w - pad.l - pad.r, plotH = h - pad.t - pad.b;

  let lo = 0, hi = 0;
  values.forEach(function (v) {
    if (v === null) return;
    if (v < lo) lo = v;
    if (v > hi) hi = v;
  });
  if (hi === lo) hi = lo + 1;
  const span = hi - lo;
  const slot = plotW / labels.length;
  const bw = Math.min(46, slot * 0.62);
  const zeroY = pad.t + (1 - (0 - lo) / span) * plotH;

  let s = svgOpen(w, h, opts.aria || "Grafik batang");
  s += axisLines(w, h, pad, evenTicks(lo, hi, 4), function (v) {
    return fmtNum(v, opts.unit);
  });
  /* Garis nol yang tegas — pembeda positif/negatif. */
  s += '<line x1="' + pad.l + '" y1="' + zeroY.toFixed(1) +
    '" x2="' + (w - pad.r) + '" y2="' + zeroY.toFixed(1) +
    '" stroke="' + CH.muted + '" stroke-width="1"/>';

  labels.forEach(function (lab, i) {
    const v = values[i];
    const cx = pad.l + slot * i + slot / 2;
    if (v === null) {
      s += '<text x="' + cx.toFixed(1) + '" y="' + (pad.t + plotH / 2).toFixed(1) +
        '" text-anchor="middle" font-size="11" fill="' + CH.muted + '">belum rilis</text>';
    } else {
      const x = pad.l + slot * i + (slot - bw) / 2;
      const yv = pad.t + (1 - (v - lo) / span) * plotH;
      const top = Math.min(yv, zeroY);
      const bh = Math.max(1, Math.abs(zeroY - yv));
      const col = (opts.negativeColor && v < 0)
        ? opts.negativeColor
        : (opts.color || CH.teal);
      s += '<rect x="' + x.toFixed(1) + '" y="' + top.toFixed(1) +
        '" width="' + bw.toFixed(1) + '" height="' + bh.toFixed(1) +
        '" rx="3" fill="' + col + '"/>';
      /* Label nilai: batang negatif labelnya di atas garis nol (ruang
       * kosong kolom itu), batang positif di atas ujung batang. */
      const ly = v < 0 ? zeroY - 6 : yv - 6;
      s += '<text x="' + (x + bw / 2).toFixed(1) + '" y="' + ly.toFixed(1) +
        '" text-anchor="middle" font-size="12" font-weight="700" fill="' + CH.ink + '">' +
        fmtNum(v, opts.unit) + "</text>";
    }
    s += '<text x="' + cx.toFixed(1) + '" y="' + (h - 10) +
      '" text-anchor="middle" font-size="12" fill="' + CH.muted + '">' +
      esc(lab) + "</text>";
  });
  return s + "</svg>";
};

/* ---- Grafik garis dengan titik ----
 * opts: {labels, values, unit, color, aria, width, height} */
CHART.line = function (opts) {
  const labels = opts.labels, values = opts.values;
  const w = opts.width || 720, h = opts.height || 300;
  const pad = { t: 24, r: 16, b: 34, l: 52 };
  const plotW = w - pad.l - pad.r, plotH = h - pad.t - pad.b;

  const pts = [];
  values.forEach(function (v, i) { if (v !== null) pts.push({ i: i, v: v }); });
  let lo = pts[0].v, hi = pts[0].v;
  pts.forEach(function (p) {
    if (p.v < lo) lo = p.v;
    if (p.v > hi) hi = p.v;
  });
  /* Sedikit ruang napas di bawah nilai terendah bila semuanya positif. */
  if (lo > 0 && lo - (hi - lo) * 0.25 > 0) lo = lo - (hi - lo) * 0.25;
  if (hi === lo) hi = lo + 1;
  const span = hi - lo;
  const x = function (i) { return pad.l + (plotW * i) / (labels.length - 1); };
  const y = function (v) { return pad.t + (1 - (v - lo) / span) * plotH; };
  const color = opts.color || CH.teal;

  let s = svgOpen(w, h, opts.aria || "Grafik garis");
  s += axisLines(w, h, pad, evenTicks(lo, hi, 4), function (v) {
    return fmtNum(v, opts.unit);
  });
  let d = "";
  pts.forEach(function (p, k) {
    d += (k === 0 ? "M" : "L") + x(p.i).toFixed(1) + " " + y(p.v).toFixed(1) + " ";
  });
  s += '<path d="' + d + '" fill="none" stroke="' + color +
    '" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>';
  pts.forEach(function (p) {
    s += '<circle cx="' + x(p.i).toFixed(1) + '" cy="' + y(p.v).toFixed(1) +
      '" r="4.5" fill="' + CH.card + '" stroke="' + color + '" stroke-width="3"/>';
    s += '<text x="' + x(p.i).toFixed(1) + '" y="' + (y(p.v) - 11).toFixed(1) +
      '" text-anchor="middle" font-size="12" font-weight="700" fill="' + CH.ink + '">' +
      fmtNum(p.v, opts.unit) + "</text>";
  });
  labels.forEach(function (lab, i) {
    s += '<text x="' + x(i).toFixed(1) + '" y="' + (h - 10) +
      '" text-anchor="middle" font-size="12" fill="' + CH.muted + '">' +
      esc(lab) + "</text>";
  });
  return s + "</svg>";
};

/* ---- Grafik batang horizontal ----
 * opts: {rows: [{label, value, color}], aria, width, labelWidth} */
CHART.hbar = function (opts) {
  const rows = opts.rows;
  const w = opts.width || 720;
  const rowH = 34, pad = { t: 8, r: 64, b: 8, l: 8 };
  const labelW = opts.labelWidth || 210;
  const h = pad.t + pad.b + rows.length * rowH;
  const max = Math.max.apply(null, rows.map(function (r) { return r.value; }));
  const barX = pad.l + labelW + 10;
  const barW = w - barX - pad.r;

  let s = svgOpen(w, h, opts.aria || "Grafik batang horizontal");
  rows.forEach(function (r, i) {
    const y = pad.t + i * rowH;
    const bw = Math.max(2, (r.value / max) * barW);
    s += '<text x="' + pad.l + '" y="' + (y + 19) +
      '" font-size="13" fill="' + CH.ink + '">' + esc(r.label) + "</text>";
    s += '<rect x="' + barX + '" y="' + (y + 7) + '" width="' + bw.toFixed(1) +
      '" height="18" rx="4" fill="' + (r.color || CH.teal) + '"/>';
    s += '<text x="' + (barX + bw + 8).toFixed(1) + '" y="' + (y + 21) +
      '" font-size="13" font-weight="700" fill="' + CH.ink + '">' +
      fmtNum(r.value, "%") + "</text>";
  });
  return s + "</svg>";
};
