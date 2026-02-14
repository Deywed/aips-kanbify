import { z } from 'zod';

export const tagSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(50, 'Name must be at most 50 characters'),
});

export type TagSchemaType = z.infer<typeof tagSchema>;
