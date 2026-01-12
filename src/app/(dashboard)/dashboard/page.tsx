'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Button, Card, CardContent } from '@/components/ui';
import {
    Plus,
    ExternalLink,
    MoreHorizontal,
    Edit,
    Trash2,
    Eye,
    Globe,
    Clock,
    Loader2,
    AlertCircle
} from 'lucide-react';
import { CreateWebsiteModal } from '@/components/dashboard/CreateWebsiteModal';
import { DeleteConfirmModal } from '@/components/ui/DeleteConfirmModal';
import { Website } from '@/lib/types';
import { cn } from '@/lib/utils';

const templateColors: Record<string, string> = {
    'modern-minimal': 'from-slate-400 to-slate-600',
    'creative-bold': 'from-violet-500 to-pink-500',
    'developer-tech': 'from-emerald-500 to-cyan-500',
    'designer-elegant': 'from-amber-400 to-rose-400',
    'business-pro': 'from-blue-500 to-indigo-600',
};

export default function DashboardPage() {
    const [websites, setWebsites] = useState<Website[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Modal states
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [websiteToDelete, setWebsiteToDelete] = useState<string | null>(null);

    const fetchWebsites = useCallback(async () => {
        try {
            setError(null);
            const res = await fetch('/api/websites');
            if (!res.ok) {
                const text = await res.text();
                console.error('API Error Body:', text);
                throw new Error(text || 'Failed to fetch websites');
            }
            const data = await res.json();
            setWebsites(data);
        } catch (err) {
            console.error(err);
            setError('Failed to load your websites. Please try refreshing.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchWebsites();
    }, [fetchWebsites]);

    // Handle create completion (refreshes list)
    const handleCreateOpenChange = (open: boolean) => {
        setCreateModalOpen(open);
        if (!open) {
            // Wait slightly for DB to update before refreshing list
            // Though router.refresh() in modal handles navigation, 
            // if we stay on page we want to see new site
            setTimeout(() => fetchWebsites(), 500);
        }
    };

    const confirmDelete = (id: string) => {
        setWebsiteToDelete(id);
        setDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!websiteToDelete) return;

        const res = await fetch(`/api/websites/${websiteToDelete}`, {
            method: 'DELETE',
        });

        if (!res.ok) {
            throw new Error('Failed to delete website');
        }

        await fetchWebsites();
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <Loader2 className="w-10 h-10 text-violet-500 animate-spin mb-4" />
                <p className="text-slate-500">Loading your portfolios...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] p-8">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">Something went wrong</h3>
                <p className="text-slate-500 mb-6 text-center max-w-md">{error}</p>
                <Button onClick={() => { setIsLoading(true); fetchWebsites(); }}>
                    Try Again
                </Button>
            </div>
        );
    }

    const hasWebsites = websites.length > 0;

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                        My Websites
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                        Manage and edit your portfolios
                    </p>
                </div>
                <Button className="gap-2" onClick={() => setCreateModalOpen(true)}>
                    <Plus className="w-4 h-4" />
                    New Website
                </Button>
            </div>

            {hasWebsites ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {websites.map((website) => (
                        <Card key={website.id} variant="default" className="overflow-hidden group">
                            {/* Preview Image */}
                            <div className={cn(
                                "aspect-video bg-gradient-to-br relative",
                                templateColors[website.templateId] || 'from-slate-400 to-slate-600'
                            )}>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Globe className="w-12 h-12 text-white/50" />
                                </div>

                                {/* Hover Actions */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                    <Link href={`/editor/${website.id}`}>
                                        <Button size="sm" className="gap-2">
                                            <Edit className="w-4 h-4" />
                                            Edit
                                        </Button>
                                    </Link>
                                    <Link href={`/preview/${website.id}`}>
                                        <Button size="sm" variant="secondary" className="gap-2">
                                            <Eye className="w-4 h-4" />
                                            Preview
                                        </Button>
                                    </Link>
                                </div>

                                {/* Status Badge */}
                                <div className="absolute top-3 right-3">
                                    <span className={cn(
                                        "px-2 py-1 rounded-full text-xs font-medium text-white",
                                        website.isPublished ? "bg-green-500/90" : "bg-slate-500/90"
                                    )}>
                                        {website.isPublished ? 'Published' : 'Draft'}
                                    </span>
                                </div>
                            </div>

                            <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                                            {website.name}
                                        </h3>
                                        <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                                            <Clock className="w-3.5 h-3.5" />
                                            <span>
                                                Updated {formatDate(new Date(website.updatedAt))}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="relative group/menu">
                                        <button className="p-2 hover:bg-slate-100 rounded-lg dark:hover:bg-slate-800 transition-colors">
                                            <MoreHorizontal className="w-4 h-4 text-slate-500" />
                                        </button>

                                        <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-10">
                                            <div className="p-2">
                                                <Link href={`/editor/${website.id}`}>
                                                    <button className="flex items-center gap-3 w-full px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg dark:text-slate-400 dark:hover:bg-slate-800">
                                                        <Edit className="w-4 h-4" />
                                                        Edit
                                                    </button>
                                                </Link>
                                                <button className="flex items-center gap-3 w-full px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg dark:text-slate-400 dark:hover:bg-slate-800">
                                                    <ExternalLink className="w-4 h-4" />
                                                    View Live
                                                </button>
                                                <button
                                                    onClick={() => confirmDelete(website.id)}
                                                    className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg dark:text-red-400 dark:hover:bg-red-500/10"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {/* Create New Card */}
                    <button onClick={() => setCreateModalOpen(true)} className="text-left w-full h-full">
                        <Card
                            variant="outlined"
                            interactive
                            className="aspect-video lg:aspect-auto h-full flex items-center justify-center border-dashed hover:border-violet-500 hover:bg-violet-50/50 dark:hover:bg-violet-500/5 group"
                        >
                            <div className="text-center">
                                <div className="w-14 h-14 mx-auto rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4 group-hover:bg-violet-100 dark:group-hover:bg-violet-900/30 transition-colors">
                                    <Plus className="w-7 h-7 text-slate-400 group-hover:text-violet-500 transition-colors" />
                                </div>
                                <p className="font-medium text-slate-600 dark:text-slate-400 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                                    Create New Website
                                </p>
                            </div>
                        </Card>
                    </button>
                </div>
            ) : (
                /* Empty State */
                <div className="text-center py-24">
                    <div className="w-20 h-20 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6">
                        <Globe className="w-10 h-10 text-slate-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                        No websites yet
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
                        Create your first portfolio website and start showcasing your work to the world.
                    </p>
                    <Button size="lg" className="gap-2" onClick={() => setCreateModalOpen(true)}>
                        <Plus className="w-5 h-5" />
                        Create Your First Website
                    </Button>
                </div>
            )}

            {/* Modals */}
            <CreateWebsiteModal
                open={createModalOpen}
                onOpenChange={handleCreateOpenChange}
            />

            <DeleteConfirmModal
                open={deleteModalOpen}
                onOpenChange={setDeleteModalOpen}
                onConfirm={handleDelete}
                title="Delete Website?"
                description="This will permanently delete this website and all its pages. This action cannot be undone."
            />
        </div>
    );
}

function formatDate(date: Date): string {
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'today';
    if (diffInDays === 1) return 'yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
