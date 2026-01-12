import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma/client';
import { requireAuth, jsonResponse, errorResponse } from '@/lib/api-helpers';

type RouteParams = { params: Promise<{ id: string }> };

/**
 * GET /api/websites/[id]
 * Get a single website with all pages and sections
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
    const { user, error } = await requireAuth();
    if (error) return error;

    const { id } = await params;

    const website = await prisma.website.findFirst({
        where: { id, userId: user!.id },
        include: {
            pages: {
                include: {
                    sections: { orderBy: { order: 'asc' } }
                },
                orderBy: { order: 'asc' }
            }
        }
    });

    if (!website) {
        return errorResponse('Website not found', 404);
    }

    return jsonResponse(website);
}

/**
 * PUT /api/websites/[id]
 * Update website settings (name, theme, meta)
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
    const { user, error } = await requireAuth();
    if (error) return error;

    const { id } = await params;

    // Verify ownership
    const existing = await prisma.website.findFirst({
        where: { id, userId: user!.id }
    });

    if (!existing) {
        return errorResponse('Website not found', 404);
    }

    try {
        const body = await request.json();
        const { name, themeConfig, metaData, isPublished, customDomain } = body;

        const updateData: Record<string, unknown> = {};

        if (name !== undefined) updateData.name = name;
        if (themeConfig !== undefined) updateData.themeConfig = themeConfig;
        if (metaData !== undefined) updateData.metaData = metaData;
        if (isPublished !== undefined) updateData.isPublished = isPublished;
        if (customDomain !== undefined) updateData.customDomain = customDomain;

        const website = await prisma.website.update({
            where: { id },
            data: updateData,
            include: {
                pages: {
                    include: {
                        sections: { orderBy: { order: 'asc' } }
                    }
                }
            }
        });

        return jsonResponse(website);
    } catch (err) {
        console.error('Error updating website:', err);
        return errorResponse('Failed to update website', 500);
    }
}

/**
 * DELETE /api/websites/[id]
 * Delete a website and all its pages/sections (cascade)
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    const { user, error } = await requireAuth();
    if (error) return error;

    const { id } = await params;

    // Verify ownership
    const existing = await prisma.website.findFirst({
        where: { id, userId: user!.id }
    });

    if (!existing) {
        return errorResponse('Website not found', 404);
    }

    try {
        await prisma.website.delete({ where: { id } });
        return jsonResponse({ success: true });
    } catch (err) {
        console.error('Error deleting website:', err);
        return errorResponse('Failed to delete website', 500);
    }
}
