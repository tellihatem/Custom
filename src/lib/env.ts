/**
 * Server-side environment validation. Called once at boot from
 * `src/instrumentation.ts` so misconfiguration fails fast instead of
 * surfacing as a confusing error on the first request.
 */

const DATABASE_SSL_MODES = ['disable', 'require', 'verify-full'] as const;
export type DatabaseSslMode = (typeof DATABASE_SSL_MODES)[number];

export function getDatabaseSslMode(): DatabaseSslMode {
    const value = process.env.DATABASE_SSL ?? 'require';
    if (!(DATABASE_SSL_MODES as readonly string[]).includes(value)) {
        throw new Error(
            `Invalid DATABASE_SSL="${value}". Expected one of: ${DATABASE_SSL_MODES.join(', ')}`
        );
    }
    return value as DatabaseSslMode;
}

export function assertEnv() {
    const errors: string[] = [];

    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
        errors.push('DATABASE_URL is required');
    } else {
        try {
            new URL(databaseUrl);
        } catch {
            errors.push('DATABASE_URL is not a valid URL');
        }
    }

    try {
        getDatabaseSslMode();
    } catch (err) {
        errors.push((err as Error).message);
    }

    if (errors.length > 0) {
        throw new Error(`Invalid environment configuration:\n  - ${errors.join('\n  - ')}`);
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.warn('⚠️ NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY not set - authentication will not work');
    }
}
