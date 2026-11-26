// NusaStat — program penyerahan (Node 22, standard library only).
// Menyalin app/ dan screenshots/ dari samping berkas ini ke /output
// (atau $MAKEFUN_OUTPUT_DIR di luar container grader), lalu menulis
// /output/dossier.json dengan buildDossier dari ./vendor/makefun-frontend.ts.
// Deterministik: dua kali jalan menulis byte yang sama.

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });

// Batas yang dipakai scorer (kit/gate.json): hanya text_max_bytes yang
// membentuk byte dossier; sisanya menolak entri yang scorer akan tolak
// (lebih dari 4 screenshot atau satu di atas 256 KiB; lebih dari 993
// berkas/direktori di app/ atau 16 MiB berkas app/).
const DOSSIER_OPTIONS = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
};

writeFileSync(join(out, 'dossier.json'), buildDossier(out, DOSSIER_OPTIONS));
