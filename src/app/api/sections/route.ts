import { withAuth, json, parseBody } from '@/server/http';
import { createSection } from '@/server/services/sectionService';
import { createSectionSchema } from '@/shared/schemas/section';

/**
 * POST /api/sections
 * Create a new section at the end of a page
 */
export const POST = withAuth(async (request, { user }) => {
    const input = await parseBody(request, createSectionSchema);
    return json(await createSection(user.id, input), 201);
});
