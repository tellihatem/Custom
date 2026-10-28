import { z } from 'zod';
import { jsonObject, name } from './common';
import { sectionType } from './section';

/**
 * Full editor state saved in one request by PUT /api/websites/:id/draft.
 * Section ids are generated client-side (crypto.randomUUID()), so new
 * sections need no temp-id mapping. Sections missing from a page's list
 * are deleted.
 */
const draftSection = z.strictObject({
    id: z.uuid(),
    type: sectionType,
    order: z.number().int().min(0),
    visible: z.boolean(),
    content: jsonObject,
    style: jsonObject.default({}),
});

const draftPage = z.strictObject({
    id: z.uuid(),
    title: z.string().trim().min(1).max(100).optional(),
    sections: z.array(draftSection).max(100),
});

export const saveDraftSchema = z
    .strictObject({
        /** The version the client last loaded; mismatch → 409 Conflict. */
        version: z.number().int().min(0),
        name: name.optional(),
        themeConfig: jsonObject.optional(),
        pages: z.array(draftPage).max(20),
    })
    .superRefine((draft, ctx) => {
        const seen = new Set<string>();
        for (const page of draft.pages) {
            for (const section of page.sections) {
                if (seen.has(section.id)) {
                    ctx.addIssue({ code: 'custom', message: `Duplicate section id ${section.id}` });
                }
                seen.add(section.id);
            }
        }
    });

export type SaveDraftInput = z.infer<typeof saveDraftSchema>;
