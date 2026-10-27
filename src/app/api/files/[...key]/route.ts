import { NextRequest } from 'next/server';
import { storage } from '@/lib/storage';
import { IMAGE_TYPES, type ImageExtension } from '@/lib/storage/image-type';

type RouteParams = { params: Promise<{ key: string[] }> };

// <userId>/<uuid>.<ext> — anything else (e.g. "..") is rejected outright.
const notFound = () => Response.json({ error: 'Not found' }, { status: 404 });

const KEY_PATTERN = /^[A-Za-z0-9_-]+\/[0-9a-f-]{36}\.(png|jpg|gif|webp)$/;

/**
 * GET /api/files/:userId/:file
 * Public: published sites embed these URLs. Keys are unguessable UUIDs.
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
    const key = (await params).key.join('/');
    const match = KEY_PATTERN.exec(key);
    if (!match) {
        return notFound();
    }

    const data = await storage.get(key);
    if (!data) {
        return notFound();
    }

    return new Response(new Uint8Array(data), {
        headers: {
            'Content-Type': IMAGE_TYPES[match[1] as ImageExtension],
            'Content-Length': String(data.length),
            // Files are immutable: a new upload always gets a new key.
            'Cache-Control': 'public, max-age=31536000, immutable',
            'X-Content-Type-Options': 'nosniff',
            'Content-Security-Policy': "default-src 'none'",
        },
    });
}
