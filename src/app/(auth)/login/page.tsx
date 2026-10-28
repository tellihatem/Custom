import { LoginForm } from '@/components/auth/LoginForm';
import { enabledSocialProviders } from '@/lib/auth';
import { redirectIfSignedIn } from '../redirect-if-signed-in';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Sign In - THODZ Builder',
    description: 'Sign in to your THODZ account to continue building your portfolio.',
};

export default async function LoginPage() {
    await redirectIfSignedIn();

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                    Welcome back
                </h2>
                <p className="mt-2 text-slate-600 dark:text-slate-400">
                    Sign in to continue building your portfolio
                </p>
            </div>

            <LoginForm socialProviders={enabledSocialProviders} />
        </div>
    );
}
