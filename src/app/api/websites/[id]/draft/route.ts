import { withAuth, json, parseBody } from '@/server/http';
import { saveDraft } from '@/server/services/websiteService';
import { saveDraftSchema } from '@/shared/schemas/draft';

type Params = { id: string };

/**
 * PUT /api/websites/[id]/draft
 * Atomically save the editor state (name, theme, pages and sections).
 * Returns the saved website including its new `version`; responds 409 if
 * `version` is stale.
 */
export const PUT = withAuth<Params>(async (request, { params, user }) => {
    const input = await parseBody(request, saveDraftSchema);
    return json(await saveDraft(user.id, params.id, input));
});
