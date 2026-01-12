import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma/client';
import { requireAuth, jsonResponse, errorResponse } from '@/lib/api-helpers';
import { getTemplate } from '@/lib/templates/config';

/**
 * GET /api/websites
 * List all websites for the authenticated user
 */
export async function GET() {
    const { user, error } = await requireAuth();
    if (error) return error;

    try {
        const websites = await prisma.website.findMany({
            where: { userId: user!.id },
            include: {
                pages: {
                    select: { id: true, slug: true, title: true },
                    orderBy: { order: 'asc' }
                }
            },
            orderBy: { updatedAt: 'desc' }
        });

        return jsonResponse(websites);
    } catch (err: any) {
        console.error('Error fetching websites:', err);
        return errorResponse(`Failed to fetch websites: ${err.message}`, 500);
    }
}

/**
 * POST /api/websites
 * Create a new website from a template
 */
export async function POST(request: NextRequest) {
    const { user, error } = await requireAuth();
    if (error) return error;

    try {
        const body = await request.json();
        const { name, templateId } = body;

        if (!name || typeof name !== 'string') {
            return errorResponse('Website name is required');
        }

        if (!templateId || typeof templateId !== 'string') {
            return errorResponse('Template ID is required');
        }

        // Get template
        const template = getTemplate(templateId);
        if (!template) {
            return errorResponse('Template not found', 404);
        }

        // Generate unique slug
        const baseSlug = name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');

        // Check for existing slugs and make unique
        let slug = baseSlug;
        let counter = 0;
        while (await prisma.website.findUnique({ where: { slug } })) {
            counter++;
            slug = `${baseSlug}-${counter}`;
        }

        // Create website with default page and sections from template
        const website = await prisma.website.create({
            data: {
                userId: user!.id,
                name,
                slug,
                templateId,
                themeConfig: template.defaultTheme as any,
                metaData: { title: name },
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
                                content: section.content as any,
                                style: (section.style || {}) as any,
                            }))
                        }
                    }
                }
            },
            include: {
                pages: {
                    include: {
                        sections: { orderBy: { order: 'asc' } }
                    }
                }
            }
        });

        return jsonResponse(website, 201);
    } catch (err) {
        console.error('Error creating website:', err);
        return errorResponse('Failed to create website', 500);
    }
}
