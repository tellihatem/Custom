import { z } from 'zod';

export const updatePageSchema = z.strictObject({
    title: z.string().trim().min(1).max(100).optional(),
    slug: z
        .string()
        .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Slug may only contain lowercase letters, numbers and dashes')
        .max(50)
        .optional(),
});

export type UpdatePageInput = z.infer<typeof updatePageSchema>;
