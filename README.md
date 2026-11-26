# NusaStat — Statistik Indonesia

[![make.fun](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/melatim80186/makefun-best-national-statistics-site-20261126-0539/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/melatim80186/makefun-best-national-statistics-site-20261126-0539/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)

Situs statistik nasional Indonesia — penduduk, ekonomi, pekerjaan, dan provinsi — dirangkum dari rilis resmi BPS dan kementerian, lengkap dengan sumber dan tahun setiap angka. Entri untuk kompetisi make.fun **“Make the best national statistics site”** ($50, 10 besar masing-masing $5).

## Yang ada di dalam

- **Beranda** — 6 indikator utama (penduduk 281,6 jt; PDB Rp22.139 T; pertumbuhan 5,03%; inflasi 1,57%; TPT 4,85%; kemiskinan 8,47%) + satu grafik yang bisa beralih di antara 5 indikator (batang/garis) + pembaruan 2025.
- **Ekonomi** — PDB 2019–2025 (nominal / pertumbuhan), struktur PDB 2024 menurut lapangan usaha, perdagangan 2019–2024 (ekspor / impor / surplus), pertumbuhan komponen pengeluaran.
- **Penduduk** — tren penduduk, pengangguran Agustus 2019–2025, kemiskinan Maret 2019–2025, kondisi tenaga kerja Agustus 2025.
- **Provinsi** — 10 provinsi terpadat (proyeksi BPS 2026), bisa dicari, diurutkan, dan diklik untuk rinciannya; unduh CSV.
- **Sumber** — 10 rilis resmi yang dipakai + catatan metode.

## Cara menjalankan

Situs statis tanpa build step dan tanpa permintaan jaringan:

```sh
cd app
python3 -m http.server 8000
# buka http://localhost:8000/
```

Semua grafik digambar sebagai SVG inline dari `data.js` — tidak ada library luar, tidak ada font luar, tidak ada gambar luar.

## Struktur

```
app/
  index.html   — kerangka + navigasi (5 halaman via hash routing)
  style.css    — identitas "buku tahunan statistik" (pinus + kunyit)
  data.js      — SEMUA angka + sumber (BPS, Kemendagri, Kemenkeu)
  charts.js    — grafik SVG (batang, garis, batang horizontal)
  views.js     — render 5 halaman
  main.js      — router + semua kontrol (toggle, cari, urut, CSV)
screenshots/  — 4 render asli (3 desktop + 1 telepon)
main.ts        — program penyerahan (menyalin app/ + screenshots/, menulis dossier.json)
vendor/
  makefun-frontend.ts — salinan kit, tanpa perubahan
```

## Data

Tahun rujukan utama **2024** (tahun lengkap terakhir), dengan pembaruan 2025 yang sudah dirilis. Setiap angka mencantumkan sumber dan tahunnya di situs; daftar lengkap ada di halaman Sumber. Tidak ada angka yang dikarang — kalau tidak bisa diverifikasi, angka itu tidak masuk.

Lisensi: MIT.
