// @astrojs/sitemap erzeugt zwei Dateien: sitemap-index.xml (nur ein Verweis auf
// sitemap-0.xml) und sitemap-0.xml (die eigentliche URL-Liste). Wir wollen aber
// EINE einzige, echte Sitemap unter der konventionellen URL /sitemap.xml — ohne
// Index-Umweg und ohne Duplikate.
//
// Darum nach dem Build: sitemap-0.xml -> sitemap.xml umbenennen und die nun
// überflüssige Index-Datei löschen. sitemap-0.xml ist ein eigenständiges
// <urlset> und verweist auf nichts, daher bleibt /sitemap.xml die vollständige,
// alleinstehende Original-Sitemap.
import { renameSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const distDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');

renameSync(join(distDir, 'sitemap-0.xml'), join(distDir, 'sitemap.xml'));
rmSync(join(distDir, 'sitemap-index.xml'), { force: true });
