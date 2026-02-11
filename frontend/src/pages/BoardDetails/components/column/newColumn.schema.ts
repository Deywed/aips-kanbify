import { z } from 'zod';

export const newColumnSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(50, 'Title must be at most 50 characters'),
});

export type NewColumnSchemaType = z.infer<typeof newColumnSchema>;
