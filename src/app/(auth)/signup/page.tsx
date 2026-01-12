import { SignupForm } from '@/components/auth/SignupForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Create Account - THODZ Builder',
    description: 'Create your free THODZ account and start building your professional portfolio today.',
};

export default function SignupPage() {
    return (
        <div>
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                    Create your account
                </h2>
                <p className="mt-2 text-slate-600 dark:text-slate-400">
                    Start building your portfolio in minutes
                </p>
            </div>

            <SignupForm />
        </div>
    );
}
