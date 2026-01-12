import { Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex">
            {/* Left side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-700 p-12 flex-col justify-between">
                <Link href="/" className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-bold text-white">THODZ</span>
                </Link>

                <div className="space-y-6">
                    <h1 className="text-4xl font-bold text-white leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
                        Build stunning portfolios that get you noticed.
                    </h1>
                    <p className="text-lg text-white/80">
                        Join thousands of creators who showcase their work with THODZ.
                        No coding required – just click, edit, and publish.
                    </p>

                    <div className="flex items-center gap-4 pt-4">
                        <div className="flex -space-x-2">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div
                                    key={i}
                                    className="w-10 h-10 rounded-full bg-white/20 border-2 border-white/30"
                                />
                            ))}
                        </div>
                        <p className="text-white/80 text-sm">
                            <strong className="text-white">10,000+</strong> creators already building
                        </p>
                    </div>
                </div>

                <p className="text-sm text-white/60">
                    © 2024 THODZ. All rights reserved.
                </p>
            </div>

            {/* Right side - Auth Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-white dark:bg-slate-900">
                <div className="w-full max-w-md">
                    {/* Mobile logo */}
                    <div className="lg:hidden mb-8 flex justify-center">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold">THODZ</span>
                        </Link>
                    </div>

                    {children}
                </div>
            </div>
        </div>
    );
}
