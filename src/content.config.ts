import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Ein "Counter" = drei Felder. So sieht ein Eintrag im .md-Frontmatter aus.
const counter = z.object({
  name: z.string(),
  type: z.enum(['hard', 'soft']),
  reason: z.string(),
});

const tip = z.object({
  strong: z.string(), // fett vorangestellter Teil, z. B. "Universal rule:"
  text: z.string(),
});

// Jede Cluster-Seite ist eine .md-Datei in src/content/guides/.
// Das Schema ist gleichzeitig deine Sicherheitsleine: schreibst du
// type: "hrad" statt "hard", bricht der Build MIT Fehlermeldung —
// statt dass ein Badge still falsch aussieht.
const guides = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/guides' }),
  schema: z.object({
    slug: z.string(), // Ausgabe-Dateiname, z. B. "siege-counters.html"
    title: z.string(),
    description: z.string(),
    ogTitle: z.string().optional(),
    ogDescription: z.string().optional(),
    h1: z.string(),
    subtitle: z.string().optional(),
    breadcrumb: z.string(),
    // article: true → der Markdown-Körper IST der ganze Seiteninhalt
    // (Überschriften, Tabellen, Listen, Tipps als Blockquote). Keine
    // sections/counters. Für reine Artikel wie den Beginner-Guide.
    article: z.boolean().optional(),
    tip: tip.optional(), // optionaler Tipp-Kasten direkt unter dem Intro
    sections: z
      .array(
      z.object({
        heading: z.string(),
        prose: z.string().optional(),
        // Eine Sektion kann Konter-Liste UND/ODER eine einfache
        // Aufzaehlung (z. B. "Beste Komposition") tragen — beides optional.
        counters: z.array(counter).optional(),
        bullets: z.array(z.object({ strong: z.string(), text: z.string() })).optional(),
        outro: z.string().optional(), // Absatz nach den Bullets/Konter
        tip: tip.optional(),
      })
      )
      .optional(),
    // Zusätzliche freie Tabellen (z. B. "Welche Civs kontern Kavallerie?"),
    // gerendert zwischen den Sektionen und der Summary-Tabelle.
    tables: z
      .array(
        z.object({
          heading: z.string(),
          columns: z.array(z.string()),
          rows: z.array(z.array(z.string())),
        })
      )
      .optional(),
    summary: z.array(z.tuple([z.string(), z.string(), z.string()])).optional(),
    ctaText: z.string().optional(),
    faq: z.array(z.object({ q: z.string(), a: z.string() })).optional(),
  }),
});

export const collections = { guides };
