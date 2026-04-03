// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const concepts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    layer: z.enum(['L0', 'L1', 'L2', 'L3']),
    connections: z.array(z.string()),
    hasDemo: z.boolean().default(false),
    demoComponent: z.string().optional(),
    summary: z.string(),
    order: z.number().default(99),
  }),
});

export const collections = { concepts };
