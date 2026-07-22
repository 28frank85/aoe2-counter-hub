# Astro-Pilot — AoE2 Counter Guide

Parallel-Setup zum bestehenden `site/`-Ordner. **`site/` wurde nicht verändert.**
Ziel: einmal ausprobieren, wie sich Templating anfühlt, bevor alle neun Seiten migriert werden.

## Starten

```powershell
cd "C:\Users\frank\Documents\Aoe 2 Counter Guide Project\astro"
npm run dev      # http://localhost:4321
npm run build    # erzeugt dist/
```

Node liegt unter `C:\Program Files\nodejs` und ist nicht im PATH jeder Shell.
Falls `npm` nicht gefunden wird:

```powershell
$env:Path = "C:\Program Files\nodejs;$env:Path"
```

## Was hier drin ist

| Datei | Rolle |
|---|---|
| `src/layouts/GuideLayout.astro` | `<head>`, Meta-Tags, Canonical, Navigation, CTA-Box, Footer, FAQ-Schema — **einmal** für alle Seiten |
| `src/components/CounterList.astro` | Die `counter-item`-Liste, datengetrieben statt 20× kopiert |
| `src/data/nav.ts` | Navigation an einer Stelle. Neue Seite = eine Zeile |
| `src/pages/siege-counters.astro` | Der Pilot: nur noch Inhalt |
| `public/` | Kopie der übrigen `site/`-Dateien, damit die Vorschau vollständig navigierbar ist |

## Was der Pilot konkret zeigt

- **`siege-counters.astro` ist von 285 auf ~250 Zeilen geschrumpft**, und davon ist fast
  alles Inhalt. Kein `<head>`, keine neunfach kopierte Navigation, kein handgeschriebenes JSON-LD.
- **Die Counter-Listen sind Daten**, keine Markup-Blöcke. Ein neuer Konter ist ein
  Objekt mit drei Feldern.
- **Der FAQ-Block existiert einmal** und erzeugt sowohl den sichtbaren HTML-Teil als auch
  das FAQPage-Schema. In der alten Datei standen drei sichtbare Fragen, aber nur zwei im
  Schema — genau die Drift, die bei Handarbeit entsteht.
- **Die Domain steht an einer Stelle** (`astro.config.mjs`). Sobald sie entschieden ist,
  ziehen alle Canonicals automatisch nach, statt in neun Dateien ersetzt zu werden.

## URLs bleiben identisch

`build.format: 'file'` erzeugt `siege-counters.html`, nicht `siege-counters/index.html`.
Nach einer Migration ändert sich also keine einzige URL — keine Redirects, kein Ranking-Risiko.

## Stufe A — Bearbeiten ohne HTML (eingerichtet)

Die Seite lebt jetzt als **eine Markdown-Datei**, die du wie einen Textentwurf pflegst:

    src/content/guides/siege-counters.md

So bearbeitest du sie:

| Was du ändern willst | Wo | Wie es aussieht |
|---|---|---|
| Intro-Text | unter dem zweiten `---` | ganz normaler Fließtext, `**fett**`, `## Zwischenüberschrift` |
| Titel, Beschreibung, Meta | oben im Frontmatter | `title: "..."` |
| Einen Konter ergänzen | `counters:` unter der Sektion | drei Zeilen: `name` / `type` / `reason` |
| Neue FAQ-Frage | `faq:` | `- q: "..."` + `a: "..."` |
| Tipp-Kasten | `tip:` | `strong:` (fetter Teil) + `text:` |

Kein einziges spitzes Klammernzeichen mehr. Das Schema in `src/content.config.ts` ist
deine Sicherheitsleine: Tippst du `type: hrad` statt `hard`, bricht der Build **mit
Fehlermeldung** — statt dass ein Badge still falsch aussieht.

Gerendert wird alles von `src/pages/[...page].astro`. Die Datei fasst du nie wieder an;
eine neue Cluster-Seite ist eine neue `.md`-Datei in `guides/`, sonst nichts.

### Live ausprobieren

`npm run dev` starten, `siege-counters.md` öffnen, eine `reason:` ändern, speichern —
die Seite im Browser aktualisiert sich sofort.

## Stand der Migration (2026-07-22)

**7 Konter-Seiten migriert** — als `.md` in `src/content/guides/`:
siege · archer · infantry · cavalry · cavalry-archer · unique-unit · naval

**Bewusst statisch** in `public/` belassen:
- `index.html` — die interaktive Pillar-Seite (SEO schon vollständig)
- `app.html` — die Standalone-App
- `beginners-counter-guide.html` — reiner Artikel (Tabellen/Listen, keine Konter) — passt nicht ins Konter-Schema

**Domain** steht an einer Stelle (`astro.config.mjs` → `SITE`): `https://www.aoe2counterhub.com`.
Ändern → Canonicals + Sitemap ziehen automatisch nach.

**SEO-Basics fertig:** `sitemap.xml` (via `@astrojs/sitemap`, deckt migrierte + statische Seiten) und
`public/robots.txt`.

## Schema-Felder (src/content.config.ts)

Eine Guide-`.md` kann tragen:
- `sections[]` — je `heading`, optional `prose`, `counters[]`, `bullets[]`, `outro`, `tip`
- `tables[]` — freie Tabellen mit `columns` + `rows` (z. B. „Welche Civs kontern …?")
- `summary[]` — die 3-spaltige Cheat-Sheet-Tabelle
- `faq[]` — erzeugt sichtbaren Block UND FAQPage-Schema in einem
- Markdown-**Körper** unter dem Frontmatter = Intro-Prosa

## Nächste Schritte

1. GitHub-Repo anlegen + GitHub-Actions-Deploy auf Pages (`dist/` als Root).
2. Domain `aoe2counterhub.com` auf Pages zeigen (Cloudflare/Porkbun).
3. Google Search Console: Property verifizieren, `sitemap-index.xml` einreichen.
4. Optional: `beginners` später als Markdown-Artikel migrieren (braucht eine
   article-Rendervariante), `index.html` um JSON-LD ergänzen.

Der alte `site/`-Ordner ist unberührt und dient als Referenz, bis der Astro-Build deployt ist.
