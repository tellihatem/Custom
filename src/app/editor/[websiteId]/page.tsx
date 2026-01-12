'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useEditorStore } from '@/lib/store/editorStore';
import { getTemplate } from '@/lib/templates/config';
import { Button } from '@/components/ui';
import { EditorToolbar } from '@/components/editor/EditorToolbar';
import { EditorCanvas } from '@/components/editor/EditorCanvas';
import { StylePanel } from '@/components/editor/StylePanel';
import { SectionSorter } from '@/components/editor/SectionSorter';
import {
    Sparkles,
    ArrowLeft,
    Loader2,
} from 'lucide-react';
import type { Website, Page, Section } from '@/lib/types';

export default function EditorPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const websiteId = params.websiteId as string;
    const templateId = searchParams.get('template');

    const [isLoading, setIsLoading] = useState(true);

    const {
        website,
        currentPage,
        setWebsite,
        setCurrentPage,
        setEditing,
        showStylePanel,
        showSectionPanel,
    } = useEditorStore();

    useEffect(() => {
        const initializeEditor = async () => {
            setIsLoading(true);

            if (websiteId === 'new' && templateId) {
                // Create new website from template
                const template = getTemplate(templateId);
                if (template) {
                    const newWebsite: Website = {
                        id: 'new-' + Date.now(),
                        userId: 'demo-user',
                        name: 'My New Portfolio',
                        slug: 'my-new-portfolio',
                        templateId: template.id,
                        themeConfig: template.defaultTheme,
                        metaData: {},
                        isPublished: false,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    };

                    const newPage: Page = {
                        id: 'page-' + Date.now(),
                        websiteId: newWebsite.id,
                        slug: 'home',
                        title: 'Home',
                        order: 0,
                        seoMeta: {},
                        sections: template.defaultSections.map((section, index) => ({
                            ...section,
                            id: `section-${Date.now()}-${index}`,
                            pageId: 'page-' + Date.now(),
                        })) as Section[],
                    };

                    setWebsite(newWebsite);
                    setCurrentPage(newPage);
                }
            } else {
                // Load existing website (mock for now)
                // In production, fetch from API/database
                const template = getTemplate('modern-minimal');
                if (template) {
                    const mockWebsite: Website = {
                        id: websiteId,
                        userId: 'demo-user',
                        name: 'My Portfolio',
                        slug: 'my-portfolio',
                        templateId: 'modern-minimal',
                        themeConfig: template.defaultTheme,
                        metaData: {},
                        isPublished: false,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    };

                    const mockPage: Page = {
                        id: 'page-1',
                        websiteId: websiteId,
                        slug: 'home',
                        title: 'Home',
                        order: 0,
                        seoMeta: {},
                        sections: template.defaultSections.map((section, index) => ({
                            ...section,
                            id: `section-${index}`,
                            pageId: 'page-1',
                        })) as Section[],
                    };

                    setWebsite(mockWebsite);
                    setCurrentPage(mockPage);
                }
            }

            setEditing(true);
            setIsLoading(false);
        };

        initializeEditor();

        return () => {
            setEditing(false);
        };
    }, [websiteId, templateId, setWebsite, setCurrentPage, setEditing]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-violet-600 mx-auto mb-4" />
                    <p className="text-slate-600 dark:text-slate-400">Loading editor...</p>
                </div>
            </div>
        );
    }

    if (!website || !currentPage) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="text-center">
                    <p className="text-slate-600 dark:text-slate-400 mb-4">Website not found</p>
                    <Link href="/dashboard">
                        <Button variant="outline">Back to Dashboard</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col">
            {/* Top Bar */}
            <header className="h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 flex-shrink-0 z-50">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm">Back</span>
                    </Link>

                    <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />

                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-medium text-sm">{website.name}</span>
                    </div>
                </div>

                <EditorToolbar />
            </header>

            {/* Main Editor Area */}
            <div className="flex-1 flex overflow-hidden">
                {/* Section Sorter (Left Panel) */}
                {showSectionPanel && (
                    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-shrink-0 overflow-y-auto">
                        <SectionSorter />
                    </aside>
                )}

                {/* Canvas (Center) */}
                <main className="flex-1 overflow-auto p-8">
                    <EditorCanvas />
                </main>

                {/* Style Panel (Right Panel) */}
                {showStylePanel && (
                    <aside className="w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex-shrink-0 overflow-y-auto">
                        <StylePanel />
                    </aside>
                )}
            </div>
        </div>
    );
}
