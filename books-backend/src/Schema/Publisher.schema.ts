import { z } from 'zod';

export const publisherSchema = z.object({
  name: z.string().min(1).max(100),
  location: z.string().max(100).optional(),
});

export type PublisherInput = z.infer<typeof publisherSchema>;
