import prisma from '@/lib/prisma/client';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * GET /api/health
 * Liveness/readiness probe used by the Docker HEALTHCHECK.
 */
export async function GET() {
    try {
        await prisma.$queryRaw`SELECT 1`;
        return NextResponse.json({ status: 'ok' });
    } catch (err) {
        console.error('Health check failed:', err);
        return NextResponse.json({ status: 'error', database: 'unreachable' }, { status: 503 });
    }
}
