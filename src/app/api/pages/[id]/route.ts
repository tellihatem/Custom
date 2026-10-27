import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma/client';
import { requireAuth, jsonResponse, errorResponse } from '@/lib/api-helpers';


type RouteParams = { params: Promise<{ id: string }> };

class SectionNotFoundError extends Error {}

/**
 * PUT /api/pages/[id]
 * Update a page's metadata and atomic save of sections (auto-save)
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
    const { user, error } = await requireAuth();
    if (error) return error;

    const { id } = await params;

    // Verify ownership via Website lookup
    const existingPage = await prisma.page.findFirst({
        where: {
            id,
            website: {
                userId: user!.id
            }
        },
        include: {
            website: true
        }
    });

    if (!existingPage) {
        return errorResponse('Page not found', 404);
    }

    try {
        const body = await request.json();
        const { title, slug, sections } = body;

        // Start transaction
        const updatedPage = await prisma.$transaction(async (tx: any) => {
            // 1. Update Page Metadata if provided
            const pageData: Record<string, unknown> = {};
            if (title !== undefined) pageData.title = title;
            if (slug !== undefined) pageData.slug = slug;

            let page = await tx.page.update({
                where: { id },
                data: pageData,
            });

            // 2. Update Sections if provided
            if (sections && Array.isArray(sections)) {
                // We'll update each section's content, style, and order
                // This assumes sections already exist or are being managed by other endpoints.
                // However, for a true "auto-save", we should ideally handle upserts.
                // For this implementation, we will focus on updating EXISTING sections
                // and CREATING new ones if they have a temporary ID or no ID. 
                // BUT, to keep it robust for the implementation plan which mentioned "content editing and reordering":

                for (const section of sections) {
                    if (section.id && !section.id.startsWith('temp-')) {
                        // Update existing — scoped to this page so a caller can't
                        // overwrite sections belonging to another page/user.
                        const { count } = await tx.section.updateMany({
                            where: { id: section.id, pageId: id },
                            data: {
                                content: section.content as any,
                                style: (section.style || {}) as any,
                                order: section.order,
                                visible: section.visible,
                                type: section.type // usually constant, but safe to include
                            }
                        });
                        if (count === 0) throw new SectionNotFoundError();
                    } else {
                        // Create new (if we want to support creation via save)
                        // For now, let's assume the frontend creates sections via the specific endpoint first
                        // OR we can allow creation here. 
                        // Let's allow simple creation if id is missing or temp
                        await tx.section.create({
                            data: {
                                pageId: id,
                                type: section.type,
                                order: section.order,
                                visible: section.visible ?? true,
                                content: section.content as any,
                                style: (section.style || {}) as any,
                            }
                        });
                    }
                }
            }

            return page;
        });

        return jsonResponse(updatedPage);
    } catch (err) {
        if (err instanceof SectionNotFoundError) {
            return errorResponse('Section not found', 404);
        }
        console.error('Error updating page:', err);
        return errorResponse('Failed to update page', 500);
    }
}
