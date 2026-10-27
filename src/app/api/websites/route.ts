import { withAuth, json, parseBody } from '@/server/http';
import { createWebsite, listWebsites } from '@/server/services/websiteService';
import { createWebsiteSchema } from '@/shared/schemas/website';

/**
 * GET /api/websites
 * List all websites for the authenticated user
 */
export const GET = withAuth(async (_request, { user }) => {
    return json(await listWebsites(user.id));
});

/**
 * POST /api/websites
 * Create a new website from a template
 */
export const POST = withAuth(async (request, { user }) => {
    const input = await parseBody(request, createWebsiteSchema);
    return json(await createWebsite(user.id, input), 201);
});
