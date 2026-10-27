import { randomUUID } from 'node:crypto';
import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma/client';
import { requireAuth, jsonResponse, errorResponse } from '@/lib/api-helpers';
import { storage } from '@/lib/storage';
import { detectImageType, IMAGE_TYPES, MAX_UPLOAD_BYTES } from '@/lib/storage/image-type';

/**
 * POST /api/assets
 * Upload an image (multipart form field "file"). Returns the Asset record;
 * `publicUrl` is what gets stored in section content.
 */
export async function POST(request: NextRequest) {
    const { user, error } = await requireAuth();
    if (error) return error;

    // Cheap early reject before buffering the body (allow for multipart overhead).
    const contentLength = Number(request.headers.get('content-length') ?? 0);
    if (contentLength > MAX_UPLOAD_BYTES + 64 * 1024) {
        return errorResponse('File too large (max 10MB)', 413);
    }

    let form: FormData;
    try {
        form = await request.formData();
    } catch {
        return errorResponse('Expected multipart form data');
    }

    const file = form.get('file');
    if (!(file instanceof File)) {
        return errorResponse('No file uploaded');
    }
    if (file.size > MAX_UPLOAD_BYTES) {
        return errorResponse('File too large (max 10MB)', 413);
    }

    const data = Buffer.from(await file.arrayBuffer());
    const ext = detectImageType(data);
    if (!ext) {
        return errorResponse('Unsupported image type. Use PNG, JPEG, GIF or WebP.', 415);
    }

    const key = `${user!.id}/${randomUUID()}.${ext}`;

    try {
        await storage.put(key, data);
        const asset = await prisma.asset.create({
            data: {
                userId: user!.id,
                filename: file.name.slice(0, 255),
                storagePath: key,
                publicUrl: `/api/files/${key}`,
                mimeType: IMAGE_TYPES[ext],
                sizeBytes: data.length,
            },
        });
        return jsonResponse(asset, 201);
    } catch (err) {
        console.error('Error uploading asset:', err);
        await storage.delete(key).catch(() => {});
        return errorResponse('Failed to upload file', 500);
    }
}
