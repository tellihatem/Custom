'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';
import {
    Sparkles,
    LayoutDashboard,
    FolderKanban,
    Settings,
    LogOut,
    Plus,
    ChevronDown,
    User,
    CreditCard,
    HelpCircle,
} from 'lucide-react';
import { useState } from 'react';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [showUserMenu, setShowUserMenu] = useState(false);

    const handleSignOut = async () => {
        await authClient.signOut();
        router.push('/');
        router.refresh();
    };

    const navItems = [
        { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { href: '/templates', icon: FolderKanban, label: 'Templates' },
        { href: '/settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col z-40">
                {/* Logo */}
                <div className="p-6">
                    <Link href="/dashboard" className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold">THODZ</span>
                    </Link>
                </div>

                {/* Create Button */}
                <div className="px-4 mb-4">
                    <Link href="/templates">
                        <Button className="w-full gap-2">
                            <Plus className="w-4 h-4" />
                            New Website
                        </Button>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                                pathname === item.href
                                    ? 'bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400'
                                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                            )}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Help Link */}
                <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                    <button className="flex items-center gap-3 px-4 py-3 w-full text-sm text-slate-600 hover:bg-slate-100 rounded-xl dark:text-slate-400 dark:hover:bg-slate-800 transition-colors">
                        <HelpCircle className="w-5 h-5" />
                        Help & Support
                    </button>
                </div>

                {/* User Menu */}
                <div className="p-4 border-t border-slate-100 dark:border-slate-800 relative">
                    <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex items-center gap-3 w-full p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white font-medium">
                            U
                        </div>
                        <div className="flex-1 text-left">
                            <p className="text-sm font-medium truncate">User</p>
                            <p className="text-xs text-slate-500 truncate">user@example.com</p>
                        </div>
                        <ChevronDown className={cn('w-4 h-4 text-slate-400 transition-transform', showUserMenu && 'rotate-180')} />
                    </button>

                    {showUserMenu && (
                        <div className="absolute bottom-full left-4 right-4 mb-2 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden animate-scale-in">
                            <div className="p-2">
                                <button className="flex items-center gap-3 w-full p-3 text-sm text-slate-600 hover:bg-slate-100 rounded-lg dark:text-slate-400 dark:hover:bg-slate-800">
                                    <User className="w-4 h-4" />
                                    Profile
                                </button>
                                <button className="flex items-center gap-3 w-full p-3 text-sm text-slate-600 hover:bg-slate-100 rounded-lg dark:text-slate-400 dark:hover:bg-slate-800">
                                    <CreditCard className="w-4 h-4" />
                                    Billing
                                </button>
                            </div>
                            <div className="border-t border-slate-100 dark:border-slate-800 p-2">
                                <button
                                    onClick={handleSignOut}
                                    className="flex items-center gap-3 w-full p-3 text-sm text-red-600 hover:bg-red-50 rounded-lg dark:text-red-400 dark:hover:bg-red-500/10"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <main className="ml-64 min-h-screen">
                {children}
            </main>
        </div>
    );
}
