import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma/client';
import { requireAuth, jsonResponse, errorResponse } from '@/lib/api-helpers';

/**
 * POST /api/sections
 * Create a new section in a page
 */
export async function POST(request: NextRequest) {
    const { user, error } = await requireAuth();
    if (error) return error;

    try {
        const body = await request.json();
        const { pageId, type, content, style, visible = true } = body;

        if (!pageId || typeof pageId !== 'string') {
            return errorResponse('Page ID is required');
        }

        if (!type || typeof type !== 'string') {
            return errorResponse('Section type is required');
        }

        // Verify ownership through page -> website -> user chain
        const page = await prisma.page.findFirst({
            where: { id: pageId },
            include: { website: { select: { userId: true } } }
        });

        if (!page || page.website.userId !== user!.id) {
            return errorResponse('Page not found', 404);
        }

        // Get the highest order number for this page
        const lastSection = await prisma.section.findFirst({
            where: { pageId },
            orderBy: { order: 'desc' }
        });

        const order = (lastSection?.order ?? -1) + 1;

        const section = await prisma.section.create({
            data: {
                pageId,
                type,
                order,
                visible,
                content: content || {},
                style: style || {},
            }
        });

        return jsonResponse(section, 201);
    } catch (err) {
        console.error('Error creating section:', err);
        return errorResponse('Failed to create section', 500);
    }
}
