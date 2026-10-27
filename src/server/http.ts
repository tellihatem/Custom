import { headers } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { badRequest, HttpError, isUniqueViolation } from './errors';

export async function getAuthenticatedUser() {
    const session = await auth.api.getSession({ headers: await headers() });
    return session?.user ?? null;
}

export type AuthUser = NonNullable<Awaited<ReturnType<typeof getAuthenticatedUser>>>;

export function json<T>(data: T, status = 200) {
    return NextResponse.json(data, { status });
}

function errorJson(message: string, status: number, details?: unknown) {
    return NextResponse.json(details === undefined ? { error: message } : { error: message, details }, { status });
}

/** Map any thrown error to a response without leaking internals. */
export function toErrorResponse(err: unknown) {
    if (err instanceof HttpError) {
        return errorJson(err.message, err.status, err.details);
    }
    if (isUniqueViolation(err)) {
        return errorJson('A record with this value already exists', 409);
    }
    console.error('Unhandled API error:', err);
    return errorJson('Internal server error', 500);
}

/** Parse and validate a JSON request body; throws a 400 HttpError on failure. */
export async function parseBody<S extends z.ZodType>(request: NextRequest, schema: S): Promise<z.output<S>> {
    let body: unknown;
    try {
        body = await request.json();
    } catch {
        throw badRequest('Request body must be valid JSON');
    }
    const result = schema.safeParse(body);
    if (!result.success) {
        throw badRequest('Invalid request body', z.flattenError(result.error));
    }
    return result.data;
}

type AuthedContext<P> = { params: P; user: AuthUser };

/**
 * Wrap a route handler: requires a valid session (401 otherwise), resolves
 * route params, and converts thrown errors into JSON responses.
 */
export function withAuth<P = Record<string, never>>(
    handler: (request: NextRequest, ctx: AuthedContext<P>) => Promise<Response>
) {
    return async (request: NextRequest, ctx: { params: Promise<P> }) => {
        try {
            const user = await getAuthenticatedUser();
            if (!user) return errorJson('Unauthorized', 401);
            return await handler(request, { params: await ctx.params, user });
        } catch (err) {
            return toErrorResponse(err);
        }
    };
}
