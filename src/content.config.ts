import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const partnerSchema = z.object({
  name: z.string(),
  location: z.string().optional(),
  url: z.string().optional(),
  logo: z.string().optional(),
  people: z.array(z.string()).default([]),
  students: z.array(z.string()).default([]),
});

const pageBase = {
  title: z.string(),
  description: z.string().optional(),
};

export const collections = {
  home: defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/home' }),
    schema: z.object({ ...pageBase }),
  }),
  program: defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/program' }),
    schema: z.object({ ...pageBase }),
  }),
  journal: defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/journal' }),
    schema: z.object({
      ...pageBase,
      days: z.array(
        z.object({
          day: z.string(),
          description: z.string(),
          images: z.array(z.string()).min(1),
        })
      ).default([]),
    }),
  }),
  lectures: defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/lectures' }),
    schema: z.object({
      ...pageBase,
      sessions: z.array(
        z.object({
          label: z.string(),
          youtubeId: z.string(),
          daily: z.array(z.string()).optional(),
        })
      ).default([]),
    }),
  }),
  projects: defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
    schema: z.object({ ...pageBase }),
  }),
  about: defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/about' }),
    schema: z.object({
      ...pageBase,
      partners: z.array(partnerSchema).default([]),
    }),
  }),
};