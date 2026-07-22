// @astrojs/sitemap erzeugt nur sitemap-index.xml. Damit die konventionelle
// URL /sitemap.xml erreichbar ist, kopieren wir die Index-Datei nach dem
// Build zusätzlich unter dem Namen sitemap.xml.
import { copyFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const distDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');

copyFileSync(join(distDir, 'sitemap-index.xml'), join(distDir, 'sitemap.xml'));
