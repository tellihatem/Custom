import type { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma/client';
import type { CreateSectionInput, UpdateSectionInput } from '@/shared/schemas/section';
import { notFound } from '../errors';
import { asJson } from './json';

type Tx = Prisma.TransactionClient;

const ownedSection = (userId: string, id: string) =>
    ({ id, page: { website: { userId } } }) satisfies Prisma.SectionWhereInput;

/** Any content change bumps the website version (see saveDraft). */
const bumpVersion = (tx: Tx, websiteId: string) =>
    tx.website.update({ where: { id: websiteId }, data: { version: { increment: 1 } } });

async function findOwnedSection(tx: Tx, userId: string, id: string) {
    const section = await tx.section.findFirst({
        where: ownedSection(userId, id),
        include: { page: { select: { websiteId: true } } },
    });
    if (!section) throw notFound('Section');
    return section;
}

export async function getSection(userId: string, id: string) {
    const section = await prisma.section.findFirst({ where: ownedSection(userId, id) });
    if (!section) throw notFound('Section');
    return section;
}

export async function createSection(userId: string, input: CreateSectionInput) {
    return prisma.$transaction(async (tx) => {
        const page = await tx.page.findFirst({
            where: { id: input.pageId, website: { userId } },
            select: { websiteId: true },
        });
        if (!page) throw notFound('Page');

        const { _max } = await tx.section.aggregate({
            where: { pageId: input.pageId },
            _max: { order: true },
        });

        const section = await tx.section.create({
            data: {
                pageId: input.pageId,
                type: input.type,
                order: (_max.order ?? -1) + 1,
                visible: input.visible,
                content: asJson(input.content),
                style: asJson(input.style),
            },
        });
        await bumpVersion(tx, page.websiteId);
        return section;
    });
}

export async function updateSection(userId: string, id: string, input: UpdateSectionInput) {
    return prisma.$transaction(async (tx) => {
        const { page } = await findOwnedSection(tx, userId, id);
        const updated = await tx.section.update({
            where: { id },
            data: {
                visible: input.visible,
                ...(input.content && { content: asJson(input.content) }),
                ...(input.style && { style: asJson(input.style) }),
            },
        });
        await bumpVersion(tx, page.websiteId);
        return updated;
    });
}

export async function deleteSection(userId: string, id: string) {
    await prisma.$transaction(async (tx) => {
        const { page } = await findOwnedSection(tx, userId, id);
        await tx.section.delete({ where: { id } });
        await bumpVersion(tx, page.websiteId);
    });
}

/**
 * Move a section to `newOrder` within its page and renumber the rest
 * 0..n-1, atomically (the old version ran N parallel updates outside a
 * transaction and could leave duplicate orders).
 */
export async function reorderSection(userId: string, id: string, newOrder: number) {
    return prisma.$transaction(async (tx) => {
        const section = await findOwnedSection(tx, userId, id);
        const siblings = await tx.section.findMany({
            where: { pageId: section.pageId },
            orderBy: { order: 'asc' },
        });

        const reordered = siblings.filter((s) => s.id !== id);
        reordered.splice(Math.min(newOrder, reordered.length), 0, section);

        for (const [index, s] of reordered.entries()) {
            if (s.order !== index) {
                await tx.section.update({ where: { id: s.id }, data: { order: index } });
            }
        }
        await bumpVersion(tx, section.page.websiteId);

        return tx.section.findMany({
            where: { pageId: section.pageId },
            orderBy: { order: 'asc' },
        });
    });
}
