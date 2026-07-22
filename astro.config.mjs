import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Die Domain steht an EINER Stelle. Sobald sie entschieden ist, hier einmal
// ändern — Canonicals UND sitemap.xml ziehen automatisch nach.
const SITE = 'https://www.aoe2counterhub.com';

// Seiten, die noch als statisches HTML in public/ liegen (noch nicht auf das
// Content-Schema migriert). Die Sitemap-Integration sieht nur Astro-Routen,
// darum werden diese hier manuell ergänzt.
// → Sobald eine Seite migriert ist, ihre Zeile hier LÖSCHEN (sie wird dann
//   automatisch erfasst). Ist die Liste leer, kann customPages ganz weg.
const STILL_STATIC = [
  '', // Startseite als Wurzel-URL (/) statt /index.html — vermeidet Duplicate Content
  'app.html', // interaktive App (kein Migrationskandidat)
].map((p) => new URL(p, SITE).href);

export default defineConfig({
  site: SITE,

  // 'file' erzeugt siege-counters.html statt siege-counters/index.html
  // → bestehende URLs bleiben identisch, keine Redirects nötig.
  build: {
    format: 'file',
  },

  outDir: './dist',

  integrations: [
    sitemap({
      customPages: STILL_STATIC,
      // Astro liefert migrierte Seiten ohne Endung (z. B. /siege-counters),
      // die realen Dateien heißen aber siege-counters.html (build.format 'file').
      // Auf GitHub Pages würde /siege-counters 404en → .html anhängen, damit
      // Sitemap, Canonicals und Dateien exakt übereinstimmen.
      serialize(item) {
        const u = new URL(item.url);
        const last = u.pathname.split('/').pop();
        if (last && !last.includes('.')) {
          // echte Seite ohne Endung → .html anhängen
          u.pathname = u.pathname.replace(/\/$/, '') + '.html';
          item.url = u.href;
        } else if (!last) {
          // Startseite → mit Schrägstrich, passend zum Canonical (.../)
          u.pathname = '/';
          item.url = u.href;
        }
        return item;
      },
    }),
  ],
});
