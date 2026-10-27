'use client';

import * as React from 'react';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, Input } from '@/components/ui';
import { authClient } from '@/lib/auth-client';
import { safeRedirectPath } from '@/lib/safe-redirect';
import type { SocialProvider } from '@/lib/auth';
import { SocialButtons } from '@/components/auth/SocialButtons';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface LoginFormProps {
    socialProviders: SocialProvider[];
}

export function LoginForm({ socialProviders }: LoginFormProps) {
    const router = useRouter();
    const redirectTo = safeRedirectPath(useSearchParams().get('redirectTo'));
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        const { error } = await authClient.signIn.email({ email, password, rememberMe });

        if (error) {
            setError(error.message ?? 'Failed to sign in');
            setIsLoading(false);
            return;
        }

        router.push(redirectTo);
        router.refresh();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="flex items-center gap-2 p-4 text-red-700 bg-red-50 rounded-xl dark:bg-red-500/10 dark:text-red-400">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm">{error}</p>
                </div>
            )}

            <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                icon={<Mail className="w-4 h-4" />}
                required
            />

            <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                icon={<Lock className="w-4 h-4" />}
                required
            />

            <div className="flex items-center">
                <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input
                        type="checkbox"
                        className="rounded border-slate-300"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    Remember me
                </label>
            </div>

            <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                Sign In
            </Button>

            <SocialButtons
                providers={socialProviders}
                callbackURL={redirectTo}
                onError={setError}
            />

            <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                Don't have an account?{' '}
                <Link
                    href="/signup"
                    className="font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400"
                >
                    Sign up for free
                </Link>
            </p>
        </form>
    );
}
