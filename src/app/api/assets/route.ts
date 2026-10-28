import { randomUUID } from 'node:crypto';
import prisma from '@/lib/prisma/client';
import { withAuth, json } from '@/server/http';
import { badRequest, HttpError } from '@/server/errors';
import { storage } from '@/lib/storage';
import { detectImageType, IMAGE_TYPES, MAX_UPLOAD_BYTES } from '@/lib/storage/image-type';

/**
 * POST /api/assets
 * Upload an image (multipart form field "file"). Returns the Asset record;
 * `publicUrl` is what gets stored in section content.
 */
export const POST = withAuth(async (request, { user }) => {
    // Cheap early reject before buffering the body (allow for multipart overhead).
    const contentLength = Number(request.headers.get('content-length') ?? 0);
    if (contentLength > MAX_UPLOAD_BYTES + 64 * 1024) {
        throw new HttpError(413, 'File too large (max 10MB)');
    }

    let form: FormData;
    try {
        form = await request.formData();
    } catch {
        throw badRequest('Expected multipart form data');
    }

    const file = form.get('file');
    if (!(file instanceof File)) {
        throw badRequest('No file uploaded');
    }
    if (file.size > MAX_UPLOAD_BYTES) {
        throw new HttpError(413, 'File too large (max 10MB)');
    }

    const data = Buffer.from(await file.arrayBuffer());
    const ext = detectImageType(data);
    if (!ext) {
        throw new HttpError(415, 'Unsupported image type. Use PNG, JPEG, GIF or WebP.');
    }

    const key = `${user.id}/${randomUUID()}.${ext}`;

    try {
        await storage.put(key, data);
        const asset = await prisma.asset.create({
            data: {
                userId: user.id,
                filename: file.name.slice(0, 255),
                storagePath: key,
                publicUrl: `/api/files/${key}`,
                mimeType: IMAGE_TYPES[ext],
                sizeBytes: data.length,
            },
        });
        return json(asset, 201);
    } catch (err) {
        await storage.delete(key).catch(() => {});
        throw err;
    }
});
