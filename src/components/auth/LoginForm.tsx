'use client';

import * as React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@/components/ui';
import { createClient } from '@/lib/supabase/client';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export function LoginForm() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const supabase = createClient();

            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            router.push('/dashboard');
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to sign in');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOAuthLogin = async (provider: 'google' | 'github') => {
        const supabase = createClient();

        await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
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

            <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="checkbox" className="rounded border-slate-300" />
                    Remember me
                </label>
                <Link
                    href="/forgot-password"
                    className="text-sm text-violet-600 hover:text-violet-700 dark:text-violet-400"
                >
                    Forgot password?
                </Link>
            </div>

            <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                Sign In
            </Button>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200 dark:border-slate-700" />
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white dark:bg-slate-900 text-slate-500">
                        Or continue with
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleOAuthLogin('google')}
                    className="gap-2"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                            fill="currentColor"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                            fill="currentColor"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                            fill="currentColor"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                            fill="currentColor"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                    </svg>
                    Google
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleOAuthLogin('github')}
                    className="gap-2"
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    GitHub
                </Button>
            </div>

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
