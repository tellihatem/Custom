import { z } from 'zod';
import type { SectionType } from '@/lib/types';
import { jsonObject } from './common';

export const SECTION_TYPES = [
    'hero',
    'about',
    'skills',
    'projects',
    'experience',
    'contact',
    'gallery',
    'testimonials',
    'cta',
    'custom',
] as const satisfies readonly SectionType[];

export const sectionType = z.enum(SECTION_TYPES);

export const createSectionSchema = z.strictObject({
    pageId: z.uuid(),
    type: sectionType,
    content: jsonObject.default({}),
    style: jsonObject.default({}),
    visible: z.boolean().default(true),
});

export const updateSectionSchema = z.strictObject({
    content: jsonObject.optional(),
    style: jsonObject.optional(),
    visible: z.boolean().optional(),
});

export const reorderSectionSchema = z.strictObject({
    newOrder: z.number().int().min(0),
});

export type CreateSectionInput = z.infer<typeof createSectionSchema>;
export type UpdateSectionInput = z.infer<typeof updateSectionSchema>;
