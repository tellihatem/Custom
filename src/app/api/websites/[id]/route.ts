import { withAuth, json, parseBody } from '@/server/http';
import { deleteWebsite, getWebsite, updateWebsite } from '@/server/services/websiteService';
import { updateWebsiteSchema } from '@/shared/schemas/website';

type Params = { id: string };

/**
 * GET /api/websites/[id]
 * Get a single website with all pages and sections
 */
export const GET = withAuth<Params>(async (_request, { params, user }) => {
    return json(await getWebsite(user.id, params.id));
});

/**
 * PUT /api/websites/[id]
 * Update website settings (name, theme, meta, publish state, domain)
 */
export const PUT = withAuth<Params>(async (request, { params, user }) => {
    const input = await parseBody(request, updateWebsiteSchema);
    return json(await updateWebsite(user.id, params.id, input));
});

/**
 * DELETE /api/websites/[id]
 * Delete a website and all its pages/sections (cascade)
 */
export const DELETE = withAuth<Params>(async (_request, { params, user }) => {
    await deleteWebsite(user.id, params.id);
    return json({ success: true });
});
