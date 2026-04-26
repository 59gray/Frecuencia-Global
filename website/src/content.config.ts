import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    pilar: z.enum(['p1', 'p2', 'p3', 'p4']),
    tags: z.array(z.string()).default([]),
    image: z.string().optional(),
    cardImage: z.string().optional(),
    ogImage: z.string().optional(),
    heroVariant: z.enum(['detroit-billboard']).optional(),
    /** Línea corta opcional sobre el hero (dek / entrada editorial); solo si lleva imagen estándar. */
    heroDek: z.string().optional(),
    /** Valor CSS para `object-position` del hero (ej. `center 72%` o `center bottom`) cuando el encuadre por defecto recorta mal. */
    heroImagePosition: z.string().optional(),
    /** Ruta pública a WebP del hero (misma pieza que `image`); el componente usa <picture> con fallback PNG. */
    heroImageWebp: z.string().optional(),
    /** Activa scripts de embeds sociales solo cuando el artículo realmente los necesita. */
    enableXEmbeds: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

const episodes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/podcast' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    pilar: z.enum(['p1', 'p2', 'p3', 'p4']),
    season: z.number().int().positive().default(1),
    episodeNumber: z.number().int().positive(),
    duration: z.string(),
    audioUrl: z.string().url(),
    audioBytes: z.number().int().positive(),
    coverImage: z.string(),
    youtubeVideoId: z.string().min(1),
    videoMode: z.enum(['editorial-visualizer', 'on-camera', 'hybrid']).default('editorial-visualizer'),
    explicit: z.boolean().default(false),
    draft: z.boolean().default(false),
    platformLinks: z
      .object({
        spotify: z.string().url().optional(),
        apple: z.string().url().optional(),
        youtube: z.string().url().optional(),
      })
      .default({}),
  }),
});

export const collections = { articles, episodes };
