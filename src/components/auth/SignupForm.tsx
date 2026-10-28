'use client';

import * as React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@/components/ui';
import { authClient } from '@/lib/auth-client';
import type { SocialProvider } from '@/lib/auth';
import { SocialButtons } from '@/components/auth/SocialButtons';
import { Mail, Lock, User, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface SignupFormProps {
    socialProviders: SocialProvider[];
}

export function SignupForm({ socialProviders }: SignupFormProps) {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Password strength indicators
    const passwordChecks = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /\d/.test(password),
    };

    const passwordStrength = Object.values(passwordChecks).filter(Boolean).length;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        if (passwordStrength < 3) {
            setError('Please choose a stronger password');
            setIsLoading(false);
            return;
        }

        // Signs the user in immediately (no email verification step).
        const { error } = await authClient.signUp.email({ name, email, password });

        if (error) {
            setError(error.message ?? 'Failed to sign up');
            setIsLoading(false);
            return;
        }

        router.push('/dashboard');
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
                label="Full Name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                icon={<User className="w-4 h-4" />}
                required
            />

            <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                icon={<Mail className="w-4 h-4" />}
                required
            />

            <div>
                <Input
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    icon={<Lock className="w-4 h-4" />}
                    required
                />

                {/* Password Strength Indicator */}
                {password && (
                    <div className="mt-3 space-y-2">
                        <div className="flex gap-1">
                            {[1, 2, 3, 4].map((level) => (
                                <div
                                    key={level}
                                    className={`h-1.5 flex-1 rounded-full transition-colors ${passwordStrength >= level
                                            ? level <= 1
                                                ? 'bg-red-500'
                                                : level <= 2
                                                    ? 'bg-orange-500'
                                                    : level <= 3
                                                        ? 'bg-yellow-500'
                                                        : 'bg-green-500'
                                            : 'bg-slate-200 dark:bg-slate-700'
                                        }`}
                                />
                            ))}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <span className={passwordChecks.length ? 'text-green-600' : 'text-slate-400'}>
                                ✓ 8+ characters
                            </span>
                            <span className={passwordChecks.uppercase ? 'text-green-600' : 'text-slate-400'}>
                                ✓ Uppercase letter
                            </span>
                            <span className={passwordChecks.lowercase ? 'text-green-600' : 'text-slate-400'}>
                                ✓ Lowercase letter
                            </span>
                            <span className={passwordChecks.number ? 'text-green-600' : 'text-slate-400'}>
                                ✓ Number
                            </span>
                        </div>
                    </div>
                )}
            </div>

            <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                Create Account
            </Button>

            <p className="text-center text-xs text-slate-500 dark:text-slate-400">
                By signing up, you agree to our{' '}
                <Link href="/terms" className="underline hover:text-slate-700">
                    Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="underline hover:text-slate-700">
                    Privacy Policy
                </Link>
            </p>

            <SocialButtons
                providers={socialProviders}
                callbackURL="/dashboard"
                onError={setError}
            />

            <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                Already have an account?{' '}
                <Link
                    href="/login"
                    className="font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400"
                >
                    Sign in
                </Link>
            </p>
        </form>
    );
}
