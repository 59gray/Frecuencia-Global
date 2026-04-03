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
