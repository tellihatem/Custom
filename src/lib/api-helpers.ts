import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma/client';

/**
 * Get the authenticated user from Supabase session
 * Creates user in database if they don't exist
 */
export async function getAuthenticatedUser() {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        return null;
    }

    // Ensure user exists in database
    let dbUser = await prisma.user.findUnique({
        where: { id: user.id }
    });

    if (!dbUser) {
        dbUser = await prisma.user.create({
            data: {
                id: user.id,
                email: user.email!,
                name: user.user_metadata?.full_name || user.email?.split('@')[0],
                avatarUrl: user.user_metadata?.avatar_url,
            }
        });
    }

    return dbUser;
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
