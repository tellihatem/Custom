import { randomBytes } from 'node:crypto';
import type { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma/client';
import { getTemplate } from '@/lib/templates/config';
import { generateSlug } from '@/lib/utils';
import type { CreateWebsiteInput, UpdateWebsiteInput } from '@/shared/schemas/website';
import type { SaveDraftInput } from '@/shared/schemas/draft';
import { badRequest, conflict, isUniqueViolation, notFound } from '../errors';
import { asJson } from './json';

const fullWebsite = {
    pages: {
        orderBy: { order: 'asc' },
        include: { sections: { orderBy: { order: 'asc' } } },
    },
} satisfies Prisma.WebsiteInclude;

export async function listWebsites(userId: string) {
    return prisma.website.findMany({
        where: { userId },
        include: {
            pages: {
                select: { id: true, slug: true, title: true },
                orderBy: { order: 'asc' },
            },
        },
        orderBy: { updatedAt: 'desc' },
    });
}

export async function getWebsite(userId: string, id: string) {
    const website = await prisma.website.findFirst({
        where: { id, userId },
        include: fullWebsite,
    });
    if (!website) throw notFound('Website');
    return website;
}

export async function createWebsite(userId: string, input: CreateWebsiteInput) {
    const template = getTemplate(input.templateId);
    if (!template) throw badRequest('Template not found');

    const baseSlug = generateSlug(input.name) || 'site';

    // Try the plain slug first, then random suffixes. Relying on the unique
    // index (instead of check-then-insert) is race-free.
    for (let attempt = 0; attempt < 5; attempt++) {
        const slug = attempt === 0 ? baseSlug : `${baseSlug}-${randomBytes(3).toString('hex')}`;
        try {
            return await prisma.website.create({
                data: {
                    userId,
                    name: input.name,
                    slug,
                    templateId: template.id,
                    themeConfig: asJson({ ...template.defaultTheme }),
                    metaData: { title: input.name },
                    pages: {
                        create: {
                            slug: 'home',
                            title: 'Home',
                            order: 0,
                            sections: {
                                create: template.defaultSections.map((section, index) => ({
                                    type: section.type,
                                    order: index,
                                    visible: section.visible,
                                    content: asJson({ ...section.content }),
                                    style: asJson({ ...section.style }),
                                })),
                            },
                        },
                    },
                },
                include: fullWebsite,
            });
        } catch (err) {
            if (isUniqueViolation(err)) continue;
            throw err;
        }
    }
    throw conflict('Could not generate a unique slug, try another name');
}

export async function updateWebsite(userId: string, id: string, input: UpdateWebsiteInput) {
    const { themeConfig, metaData, ...rest } = input;
    const { count } = await prisma.website.updateMany({
        where: { id, userId },
        data: {
            ...rest,
            ...(themeConfig && { themeConfig: asJson(themeConfig) }),
            ...(metaData && { metaData: asJson(metaData) }),
            version: { increment: 1 },
        },
    });
    if (count === 0) throw notFound('Website');
    return getWebsite(userId, id);
}

export async function deleteWebsite(userId: string, id: string) {
    const { count } = await prisma.website.deleteMany({ where: { id, userId } });
    if (count === 0) throw notFound('Website');
}

/**
 * Save the editor's full state atomically. Sections are upserted by their
 * client-generated id and any section of a listed page that is missing
 * from the payload is deleted.
 */
export async function saveDraft(userId: string, id: string, input: SaveDraftInput) {
    return prisma.$transaction(
        async (tx) => {
            // Version check + bump in one statement; also locks the row so
            // concurrent saves of the same website are serialized.
            const { count } = await tx.website.updateMany({
                where: { id, userId, version: input.version },
                data: {
                    version: { increment: 1 },
                    ...(input.name !== undefined && { name: input.name }),
                    ...(input.themeConfig && { themeConfig: asJson(input.themeConfig) }),
                },
            });
            if (count === 0) {
                const exists = await tx.website.findFirst({ where: { id, userId }, select: { id: true } });
                if (!exists) throw notFound('Website');
                throw conflict('This website was changed elsewhere. Reload to get the latest version.');
            }

            for (const page of input.pages) {
                const existing = await tx.page.findFirst({
                    where: { id: page.id, websiteId: id },
                    select: { sections: { select: { id: true } } },
                });
                if (!existing) throw notFound('Page');

                if (page.title !== undefined) {
                    await tx.page.update({ where: { id: page.id }, data: { title: page.title } });
                }

                const existingIds = new Set(existing.sections.map((s) => s.id));
                await tx.section.deleteMany({
                    where: { pageId: page.id, id: { notIn: page.sections.map((s) => s.id) } },
                });

                for (const section of page.sections) {
                    const data = {
                        type: section.type,
                        order: section.order,
                        visible: section.visible,
                        content: asJson(section.content),
                        style: asJson(section.style),
                    };
                    if (existingIds.has(section.id)) {
                        await tx.section.update({ where: { id: section.id }, data });
                    } else {
                        // If the id already belongs to another page this hits
                        // the primary key and fails (→ 409), never overwrites.
                        await tx.section.create({ data: { id: section.id, pageId: page.id, ...data } });
                    }
                }
            }

            return tx.website.findUniqueOrThrow({ where: { id }, include: fullWebsite });
        },
        { timeout: 15_000 }
    );
}
