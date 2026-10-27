import { z } from 'zod';
import { jsonObject, name } from './common';

export const createWebsiteSchema = z.strictObject({
    name,
    templateId: z.string().min(1, 'Template ID is required'),
});

export const updateWebsiteSchema = z.strictObject({
    name: name.optional(),
    themeConfig: jsonObject.optional(),
    metaData: jsonObject.optional(),
    isPublished: z.boolean().optional(),
    customDomain: z
        .string()
        .trim()
        .toLowerCase()
        .regex(/^(?=.{1,253}$)([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/, 'Invalid domain')
        .nullable()
        .optional(),
});

export type CreateWebsiteInput = z.infer<typeof createWebsiteSchema>;
export type UpdateWebsiteInput = z.infer<typeof updateWebsiteSchema>;
