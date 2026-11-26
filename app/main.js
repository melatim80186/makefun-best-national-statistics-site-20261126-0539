// NusaStat — router hash. Lima halaman, semua dicapai lewat tautan nav.
// Rute tak dikenal jatuh ke beranda.

import { renderHome, renderEconomy, renderPopulation, renderProvinces, renderSources } from './views.js';

const PAGES = {
  '/beranda': { render: renderHome, label: 'Beranda' },
  '/ekonomi': { render: renderEconomy, label: 'Ekonomi' },
  '/penduduk': { render: renderPopulation, label: 'Penduduk' },
  '/provinsi': { render: renderProvinces, label: 'Provinsi' },
  '/sumber': { render: renderSources, label: 'Sumber' },
};

const root = document.getElementById('view');

function route() {
  const hash = window.location.hash || '#/beranda';
  const path = hash.slice(1) || '/beranda';
  const page = PAGES[path] || PAGES['/beranda'];
  page.render(root);
  document.querySelectorAll('.nav-link').forEach((a) => {
    const active = a.getAttribute('href') === `#${path in PAGES ? path : '/beranda'}`;
    a.classList.toggle('active', active);
    if (active) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', route);
route();
