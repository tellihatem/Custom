import { withAuth, json, parseBody } from '@/server/http';
import { updatePage } from '@/server/services/pageService';
import { updatePageSchema } from '@/shared/schemas/page';

type Params = { id: string };

/**
 * PUT /api/pages/[id]
 * Update page metadata (title, slug). Sections are saved via
 * PUT /api/websites/[id]/draft.
 */
export const PUT = withAuth<Params>(async (request, { params, user }) => {
    const input = await parseBody(request, updatePageSchema);
    return json(await updatePage(user.id, params.id, input));
});
