import prisma from '@/lib/prisma/client';
import type { UpdatePageInput } from '@/shared/schemas/page';
import { notFound } from '../errors';

/**
 * Update page metadata. Section content is saved through
 * PUT /api/websites/:id/draft.
 */
export async function updatePage(userId: string, id: string, input: UpdatePageInput) {
    const { count } = await prisma.page.updateMany({
        where: { id, website: { userId } },
        data: input,
    });
    if (count === 0) throw notFound('Page');
    return prisma.page.findUniqueOrThrow({ where: { id } });
}
