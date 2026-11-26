// NusaStat — grafik SVG inline, digambar dari data, tanpa library.
// Aturan gambar: batang negatif turun ke bawah garis nol (merah); sel
// yang belum rilis tidak digambar sebagai batang nol, melainkan teks
// "belum rilis" pada slotnya.

const INK = '#0a453e';
const TEAL = '#0e5f56';
const GOLD = '#d97706';
const RED = '#b42318';
const GRID = '#e3ddd0';
const MUTED = '#6b6455';

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function niceTicks(lo, hi, count) {
  const span = hi - lo || 1;
  const stepRaw = span / count;
  const mag = Math.pow(10, Math.floor(Math.log10(stepRaw)));
  const norm = stepRaw / mag;
  const step = (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10) * mag;
  const start = Math.ceil(lo / step) * step;
  const out = [];
  for (let v = start; v <= hi + step * 0.001; v += step) out.push(v);
  return out;
}

// Grafik batang vertikal. values boleh berisi null (belum rilis).
export function barChart({ values, labels, unit = '', decimals = 2, height = 300, color = TEAL }) {
  const W = 720;
  const H = height;
  const padL = 58;
  const padR = 14;
  const padT = 30;
  const padB = 34;
  const nums = values.filter((v) => v !== null && v !== undefined);
  let lo = Math.min(0, ...nums);
  let hi = Math.max(0, ...nums);
  if (hi - lo < 1e-9) { hi = lo + 1; }
  const pad = (hi - lo) * 0.08;
  lo -= pad;
  hi += pad;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const y = (v) => padT + ((hi - v) / (hi - lo)) * innerH;
  const y0 = y(0);
  const slot = innerW / values.length;
  const barW = Math.min(46, slot * 0.58);
  const ticks = niceTicks(lo, hi, 4);
  let s = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Grafik batang ${esc(unit)}" xmlns="http://www.w3.org/2000/svg">`;
  for (const t of ticks) {
    s += `<line x1="${padL}" y1="${y(t)}" x2="${W - padR}" y2="${y(t)}" stroke="${GRID}" stroke-width="1"/>`;
    s += `<text x="${padL - 8}" y="${y(t) + 4}" text-anchor="end" font-size="11" fill="${MUTED}">${esc(fmtTick(t, decimals))}</text>`;
  }
  s += `<line x1="${padL}" y1="${y0}" x2="${W - padR}" y2="${y0}" stroke="${INK}" stroke-width="1.5"/>`;
  values.forEach((v, i) => {
    const cx = padL + slot * i + slot / 2;
    if (v === null || v === undefined) {
      s += `<text x="${cx}" y="${y0 - 26}" text-anchor="middle" font-size="11" fill="${RED}">belum</text>`;
      s += `<text x="${cx}" y="${y0 - 12}" text-anchor="middle" font-size="11" fill="${RED}">rilis</text>`;
      s += `<line x1="${cx - barW / 2}" y1="${y0}" x2="${cx + barW / 2}" y2="${y0}" stroke="${GRID}" stroke-width="1" stroke-dasharray="3 3"/>`;
    } else {
      const top = y(Math.max(v, 0));
      const bot = y(Math.min(v, 0));
      const fill = v < 0 ? RED : color;
      s += `<rect x="${cx - barW / 2}" y="${top}" width="${barW}" height="${Math.max(1, bot - top)}" rx="3" fill="${fill}"/>`;
      // Batang negatif: label merah di ATAS garis nol agar terbaca
      // (bukan di atas batang merah) dan tidak menabrak label tahun.
      const ly = v < 0 ? y0 - 8 : top - 8;
      s += `<text x="${cx}" y="${ly}" text-anchor="middle" font-size="12" font-weight="600" fill="${v < 0 ? RED : INK}">${esc(fmtTick(v, decimals))}</text>`;
    }
    s += `<text x="${cx}" y="${H - 12}" text-anchor="middle" font-size="12" fill="${INK}">${esc(labels[i])}</text>`;
  });
  s += '</svg>';
  return s;
}

function fmtTick(v, decimals) {
  const parts = Number(v).toFixed(decimals).split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return parts.join(',');
}

// Grafik garis. Titik null dilewati (garis terputus) dan diberi label.
export function lineChart({ values, labels, unit = '', decimals = 2, height = 300, color = GOLD }) {
  const W = 720;
  const H = height;
  const padL = 58;
  const padR = 20;
  const padT = 30;
  const padB = 34;
  const nums = values.filter((v) => v !== null && v !== undefined);
  let lo = Math.min(...nums);
  let hi = Math.max(...nums);
  if (hi - lo < 1e-9) { hi = lo + 1; }
  const pad = (hi - lo) * 0.12;
  lo -= pad;
  hi += pad;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const x = (i) => padL + (innerW / Math.max(1, values.length - 1)) * i;
  const y = (v) => padT + ((hi - v) / (hi - lo)) * innerH;
  const ticks = niceTicks(lo, hi, 4);
  let s = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Grafik garis ${esc(unit)}" xmlns="http://www.w3.org/2000/svg">`;
  for (const t of ticks) {
    s += `<line x1="${padL}" y1="${y(t)}" x2="${W - padR}" y2="${y(t)}" stroke="${GRID}" stroke-width="1"/>`;
    s += `<text x="${padL - 8}" y="${y(t) + 4}" text-anchor="end" font-size="11" fill="${MUTED}">${esc(fmtTick(t, decimals))}</text>`;
  }
  let pts = '';
  values.forEach((v, i) => {
    if (v !== null && v !== undefined) pts += `${x(i).toFixed(1)},${y(v).toFixed(1)} `;
  });
  s += `<polyline points="${pts.trim()}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>`;
  values.forEach((v, i) => {
    if (v === null || v === undefined) {
      s += `<text x="${x(i)}" y="${padT + 14}" text-anchor="middle" font-size="11" fill="${RED}">belum rilis</text>`;
    } else {
      s += `<circle cx="${x(i)}" cy="${y(v)}" r="4.5" fill="#faf7f0" stroke="${color}" stroke-width="2.5"/>`;
      s += `<text x="${x(i)}" y="${y(v) - 11}" text-anchor="middle" font-size="12" font-weight="600" fill="${INK}">${esc(fmtTick(v, decimals))}</text>`;
    }
    s += `<text x="${x(i)}" y="${H - 12}" text-anchor="middle" font-size="12" fill="${INK}">${esc(labels[i])}</text>`;
  });
  s += '</svg>';
  return s;
}

// Grafik batang horizontal dengan label nama + nilai di ujung batang.
export function hbarChart({ items, unit = '', decimals = 2, height = 300 }) {
  const W = 720;
  const rowH = 44;
  const H = Math.max(height, items.length * rowH + 16);
  const padL = 210;
  const padR = 64;
  const max = Math.max(...items.map((it) => it.value));
  const innerW = W - padL - padR;
  let s = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Grafik batang horizontal ${esc(unit)}" xmlns="http://www.w3.org/2000/svg">`;
  items.forEach((it, i) => {
    const cy = 22 + i * rowH;
    const bw = (it.value / max) * innerW;
    s += `<text x="${padL - 10}" y="${cy + 4}" text-anchor="end" font-size="12.5" fill="${INK}">${esc(it.name)}</text>`;
    s += `<rect x="${padL}" y="${cy - 10}" width="${Math.max(2, bw)}" height="20" rx="3" fill="${i === 0 ? GOLD : TEAL}"/>`;
    s += `<text x="${padL + bw + 8}" y="${cy + 4}" font-size="12.5" font-weight="700" fill="${INK}">${esc(fmtTick(it.value, decimals))}${unit ? ' ' + esc(unit) : ''}</text>`;
  });
  s += '</svg>';
  return s;
}
