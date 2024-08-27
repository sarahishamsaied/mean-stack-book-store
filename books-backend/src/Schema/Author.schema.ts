import { z } from 'zod';

export const authorSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  bio: z.string().max(1000).optional(),
  birthDate: z.date().optional(),
});

export type AuthorInput = z.infer<typeof authorSchema>;
