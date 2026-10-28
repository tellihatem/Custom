import prisma from '@/lib/prisma/client';
import type { UpdatePageInput } from '@/shared/schemas/page';
import { notFound } from '../errors';

/**
 * Update page metadata. Section content is saved through
 * PUT /api/websites/:id/draft.
 */
export async function updatePage(userId: string, id: string, input: UpdatePageInput) {
    return prisma.$transaction(async (tx) => {
        const page = await tx.page.findFirst({
            where: { id, website: { userId } },
            select: { websiteId: true },
        });
        if (!page) throw notFound('Page');

        const updated = await tx.page.update({ where: { id }, data: input });
        // Keep the editor's optimistic-concurrency version in sync.
        await tx.website.update({ where: { id: page.websiteId }, data: { version: { increment: 1 } } });
        return updated;
    });
}
