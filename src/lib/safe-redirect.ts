/**
 * Only allow same-origin relative paths. Rejects absolute URLs and
 * protocol-relative tricks like `//evil.com` or `/\evil.com`.
 */
export function safeRedirectPath(next: string | null | undefined, fallback = '/dashboard') {
    if (!next || !next.startsWith('/') || next.startsWith('//') || next.startsWith('/\\')) {
        return fallback;
    }
    return next;
}
