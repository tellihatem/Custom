import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

/**
 * Get the authenticated user from the Better Auth session cookie
 */
export async function getAuthenticatedUser() {
    const session = await auth.api.getSession({ headers: await headers() });
    return session?.user ?? null;
}

/**
 * Create a JSON response with proper headers
 */
export function jsonResponse<T>(data: T, status = 200) {
    return NextResponse.json(data, { status });
}

/**
 * Create an error response
 */
export function errorResponse(message: string, status = 400) {
    return NextResponse.json({ error: message }, { status });
}

/**
 * Check if user is authenticated, return error response if not
 */
export async function requireAuth() {
    const user = await getAuthenticatedUser();
    if (!user) {
        return { user: null, error: errorResponse('Unauthorized', 401) };
    }
    return { user, error: null };
}
