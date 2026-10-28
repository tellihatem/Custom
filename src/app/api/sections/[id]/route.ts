import { withAuth, json, parseBody } from '@/server/http';
import {
    deleteSection,
    getSection,
    reorderSection,
    updateSection,
} from '@/server/services/sectionService';
import { reorderSectionSchema, updateSectionSchema } from '@/shared/schemas/section';

type Params = { id: string };

/**
 * GET /api/sections/[id]
 * Get a single section
 */
export const GET = withAuth<Params>(async (_request, { params, user }) => {
    return json(await getSection(user.id, params.id));
});

/**
 * PUT /api/sections/[id]
 * Update section content, style and/or visibility
 */
export const PUT = withAuth<Params>(async (request, { params, user }) => {
    const input = await parseBody(request, updateSectionSchema);
    return json(await updateSection(user.id, params.id, input));
});

/**
 * DELETE /api/sections/[id]
 * Delete a section
 */
export const DELETE = withAuth<Params>(async (_request, { params, user }) => {
    await deleteSection(user.id, params.id);
    return json({ success: true });
});

/**
 * PATCH /api/sections/[id]
 * Move a section to a new position within its page; returns the page's sections
 */
export const PATCH = withAuth<Params>(async (request, { params, user }) => {
    const { newOrder } = await parseBody(request, reorderSectionSchema);
    return json(await reorderSection(user.id, params.id, newOrder));
});
