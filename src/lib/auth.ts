import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { nextCookies } from 'better-auth/next-js';
import prisma from '@/lib/prisma/client';

/**
 * Social login is enabled per provider only when its credentials are set,
 * so the app runs with plain email/password and zero external accounts.
 */
const {
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET,
} = process.env;

const socialProviders = {
    ...(GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET
        ? { google: { clientId: GOOGLE_CLIENT_ID, clientSecret: GOOGLE_CLIENT_SECRET } }
        : {}),
    ...(GITHUB_CLIENT_ID && GITHUB_CLIENT_SECRET
        ? { github: { clientId: GITHUB_CLIENT_ID, clientSecret: GITHUB_CLIENT_SECRET } }
        : {}),
};

export type SocialProvider = 'google' | 'github';

export const enabledSocialProviders = Object.keys(socialProviders) as SocialProvider[];

// BETTER_AUTH_SECRET and BETTER_AUTH_URL are read from the environment.
export const auth = betterAuth({
    database: prismaAdapter(prisma, { provider: 'postgresql' }),
    user: {
        // Keep the existing column name for the avatar.
        fields: { image: 'avatarUrl' },
    },
    emailAndPassword: {
        enabled: true,
        minPasswordLength: 8,
    },
    socialProviders,
    advanced: {
        database: { generateId: 'uuid' },
    },
    // Must be last: lets server actions/components set auth cookies.
    plugins: [nextCookies()],
});
