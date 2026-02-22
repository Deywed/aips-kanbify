import { z } from 'zod';

export const cardSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  dueDate: z.coerce.date('Invalid date').optional(),
  assignedToId: z
    .union([z.uuid(), z.literal('')])
    .optional()
    .transform((val) => (val === '' ? undefined : val)),
  tagIds: z.array(z.string()).optional(),
});

export type CardSchemaType = z.infer<typeof cardSchema>;
