import { z } from 'zod';

export const newBoardSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be at most 100 characters'),
  description: z
    .string()
    .max(500, 'Description must be at most 500 characters')
    .optional(),
});

export type NewBoardSchemaType = z.infer<typeof newBoardSchema>;
