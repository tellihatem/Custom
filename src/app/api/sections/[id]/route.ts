import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma/client';
import { requireAuth, jsonResponse, errorResponse } from '@/lib/api-helpers';

type RouteParams = { params: Promise<{ id: string }> };

/**
 * Helper to verify section ownership
 */
async function verifySectionOwnership(sectionId: string, userId: string) {
    const section = await prisma.section.findFirst({
        where: { id: sectionId },
        include: {
            page: {
                include: {
                    website: { select: { userId: true } }
                }
            }
        }
    });

    if (!section || section.page.website.userId !== userId) {
        return null;
    }

    return section;
}

/**
 * GET /api/sections/[id]
 * Get a single section
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
    const { user, error } = await requireAuth();
    if (error) return error;

    const { id } = await params;
    const section = await verifySectionOwnership(id, user!.id);

    if (!section) {
        return errorResponse('Section not found', 404);
    }

    return jsonResponse(section);
}

/**
 * PUT /api/sections/[id]
 * Update section content and/or style
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
    const { user, error } = await requireAuth();
    if (error) return error;

    const { id } = await params;
    const section = await verifySectionOwnership(id, user!.id);

    if (!section) {
        return errorResponse('Section not found', 404);
    }

    try {
        const body = await request.json();
        const { content, style, visible, order } = body;

        const updateData: Record<string, unknown> = {};

        if (content !== undefined) updateData.content = content;
        if (style !== undefined) updateData.style = style;
        if (visible !== undefined) updateData.visible = visible;
        if (order !== undefined) updateData.order = order;

        const updated = await prisma.section.update({
            where: { id },
            data: updateData
        });

        return jsonResponse(updated);
    } catch (err) {
        console.error('Error updating section:', err);
        return errorResponse('Failed to update section', 500);
    }
}

/**
 * DELETE /api/sections/[id]
 * Delete a section
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    const { user, error } = await requireAuth();
    if (error) return error;

    const { id } = await params;
    const section = await verifySectionOwnership(id, user!.id);

    if (!section) {
        return errorResponse('Section not found', 404);
    }

    try {
        await prisma.section.delete({ where: { id } });
        return jsonResponse({ success: true });
    } catch (err) {
        console.error('Error deleting section:', err);
        return errorResponse('Failed to delete section', 500);
    }
}

/**
 * PATCH /api/sections/[id]
 * Reorder sections within a page
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
    const { user, error } = await requireAuth();
    if (error) return error;

    const { id } = await params;
    const section = await verifySectionOwnership(id, user!.id);

    if (!section) {
        return errorResponse('Section not found', 404);
    }

    try {
        const body = await request.json();
        const { newOrder } = body;

        if (typeof newOrder !== 'number') {
            return errorResponse('newOrder must be a number');
        }

        const pageId = section.pageId;
        const oldOrder = section.order;

        // Get all sections in the page
        const sections = await prisma.section.findMany({
            where: { pageId },
            orderBy: { order: 'asc' }
        });

        // Reorder: shift sections between old and new positions
        const updates: Promise<unknown>[] = [];

        if (newOrder > oldOrder) {
            // Moving down: shift sections between old+1 and new up by 1
            for (const s of sections) {
                if (s.order > oldOrder && s.order <= newOrder) {
                    updates.push(prisma.section.update({
                        where: { id: s.id },
                        data: { order: s.order - 1 }
                    }));
                }
            }
        } else if (newOrder < oldOrder) {
            // Moving up: shift sections between new and old-1 down by 1
            for (const s of sections) {
                if (s.order >= newOrder && s.order < oldOrder) {
                    updates.push(prisma.section.update({
                        where: { id: s.id },
                        data: { order: s.order + 1 }
                    }));
                }
            }
        }

        // Update the moved section's order
        updates.push(prisma.section.update({
            where: { id },
            data: { order: newOrder }
        }));

        await Promise.all(updates);

        // Return updated sections
        const updatedSections = await prisma.section.findMany({
            where: { pageId },
            orderBy: { order: 'asc' }
        });

        return jsonResponse(updatedSections);
    } catch (err) {
        console.error('Error reordering section:', err);
        return errorResponse('Failed to reorder section', 500);
    }
}
