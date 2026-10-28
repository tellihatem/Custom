'use client';

import { useEditorStore } from '@/lib/store/editorStore';
import { Button } from '@/components/ui';
import {
    Undo2,
    Redo2,
    Eye,
    Save,
    Share2,
    Monitor,
    Tablet,
    Smartphone,
    PanelLeftClose,
    PanelRightClose,
    Cloud,
    CloudOff,
    Loader2,
    AlertTriangle,
    RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SaveStatus } from '@/lib/store/editorStore';

export function EditorToolbar() {
    const {
        devicePreview,
        setDevicePreview,
        showStylePanel,
        showSectionPanel,
        toggleStylePanel,
        toggleSectionPanel,
        saveStatus,
        past,
        future,
        undo,
        redo,
    } = useEditorStore();

    const canUndo = past.length > 0;
    const canRedo = future.length > 0;

    const handleSave = async () => {
        // Publishing is implemented in Phase 5 (published snapshot + public route).
        console.log('Publish not implemented yet');
    };

    return (
        <div className="flex items-center gap-2">
            {/* Panel Toggles */}
            <div className="flex items-center gap-1 mr-2">
                <button
                    onClick={toggleSectionPanel}
                    className={cn(
                        'p-2 rounded-lg transition-colors',
                        showSectionPanel
                            ? 'text-violet-600 bg-violet-50 dark:bg-violet-500/10'
                            : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                    )}
                    title="Toggle Sections Panel"
                >
                    <PanelLeftClose className="w-4 h-4" />
                </button>
                <button
                    onClick={toggleStylePanel}
                    className={cn(
                        'p-2 rounded-lg transition-colors',
                        showStylePanel
                            ? 'text-violet-600 bg-violet-50 dark:bg-violet-500/10'
                            : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                    )}
                    title="Toggle Style Panel"
                >
                    <PanelRightClose className="w-4 h-4" />
                </button>
            </div>

            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />

            {/* Undo/Redo */}
            <div className="flex items-center gap-1">
                <button
                    onClick={undo}
                    disabled={!canUndo}
                    className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed dark:hover:bg-slate-800 transition-colors"
                    title="Undo"
                >
                    <Undo2 className="w-4 h-4" />
                </button>
                <button
                    onClick={redo}
                    disabled={!canRedo}
                    className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed dark:hover:bg-slate-800 transition-colors"
                    title="Redo"
                >
                    <Redo2 className="w-4 h-4" />
                </button>
            </div>

            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />

            {/* Device Preview */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                {[
                    { device: 'desktop', icon: Monitor },
                    { device: 'tablet', icon: Tablet },
                    { device: 'mobile', icon: Smartphone },
                ].map(({ device, icon: Icon }) => (
                    <button
                        key={device}
                        onClick={() => setDevicePreview(device as 'desktop' | 'tablet' | 'mobile')}
                        className={cn(
                            'p-2 rounded-md transition-colors',
                            devicePreview === device
                                ? 'bg-white text-violet-600 shadow-sm dark:bg-slate-900'
                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                        )}
                        title={`${device.charAt(0).toUpperCase() + device.slice(1)} preview`}
                    >
                        <Icon className="w-4 h-4" />
                    </button>
                ))}
            </div>

            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />

            {/* Save Status */}
            <div className="flex items-center gap-2 px-3">
                <SaveIndicator status={saveStatus} />
            </div>

            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />

            {/* Actions */}
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="gap-2">
                    <Eye className="w-4 h-4" />
                    Preview
                </Button>
                <Button variant="ghost" size="sm" className="gap-2">
                    <Share2 className="w-4 h-4" />
                    Share
                </Button>
                <Button size="sm" className="gap-2" onClick={handleSave}>
                    <Save className="w-4 h-4" />
                    Publish
                </Button>
            </div>
        </div>
    );
}

function SaveIndicator({ status }: { status: SaveStatus }) {
    switch (status) {
        case 'saving':
            return (
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                </div>
            );
        case 'unsaved':
            return (
                <div className="flex items-center gap-2 text-amber-600 text-sm">
                    <CloudOff className="w-4 h-4" />
                    Unsaved
                </div>
            );
        case 'error':
            return (
                <div className="flex items-center gap-2 text-red-600 text-sm" title="Your changes will be retried automatically">
                    <AlertTriangle className="w-4 h-4" />
                    Save failed
                </div>
            );
        case 'conflict':
            return (
                <button
                    onClick={() => window.location.reload()}
                    className="flex items-center gap-2 text-red-600 text-sm whitespace-nowrap hover:underline"
                    title="This website was saved from another tab or device. Reload to continue editing (your unsaved changes here will be lost)."
                >
                    <RefreshCw className="w-4 h-4" />
                    Changed elsewhere, reload
                </button>
            );
        default:
            return (
                <div className="flex items-center gap-2 text-green-600 text-sm">
                    <Cloud className="w-4 h-4" />
                    Saved
                </div>
            );
    }
}
