import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    });

    // Skip auth check if Supabase is not configured (development mode)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        // In development without Supabase, allow all routes
        console.warn('⚠️ Supabase not configured - auth checks disabled');
        return supabaseResponse;
    }

    const supabase = createServerClient(
        supabaseUrl,
        supabaseKey,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );
                    supabaseResponse = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // IMPORTANT: Avoid writing any logic between createServerClient and
    // supabase.auth.getUser(). A simple mistake could make it very hard to debug
    // issues with users being randomly logged out.
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Protected routes - redirect to login if not authenticated
    const protectedPaths = ['/dashboard', '/editor', '/templates', '/settings'];
    const isProtectedPath = protectedPaths.some((path) =>
        request.nextUrl.pathname.startsWith(path)
    );

    if (isProtectedPath && !user) {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        url.searchParams.set('redirectTo', request.nextUrl.pathname);
        return NextResponse.redirect(url);
    }

    // Redirect authenticated users away from auth pages
    const authPaths = ['/login', '/signup'];
    const isAuthPath = authPaths.some((path) =>
        request.nextUrl.pathname.startsWith(path)
    );

    if (isAuthPath && user) {
        const url = request.nextUrl.clone();
        url.pathname = '/dashboard';
        return NextResponse.redirect(url);
    }

    return supabaseResponse;
}
