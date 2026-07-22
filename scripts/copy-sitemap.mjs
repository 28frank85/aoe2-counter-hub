// @astrojs/sitemap erzeugt sitemap-index.xml (nur ein Verweis auf sitemap-0.xml)
// plus sitemap-0.xml (die eigentliche URL-Liste). Damit die konventionelle URL
// /sitemap.xml direkt alle Seiten-URLs enthält, kopieren wir sitemap-0.xml
// (NICHT die Index-Datei) nach dem Build zusätzlich unter dem Namen sitemap.xml.
import { copyFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const distDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');

copyFileSync(join(distDir, 'sitemap-0.xml'), join(distDir, 'sitemap.xml'));
