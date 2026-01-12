'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useEditorStore } from '@/lib/store/editorStore';

const AUTO_SAVE_DELAY = 2000; // 2 seconds

export function AutoSaveManager() {
    const {
        website,
        currentPage,
        hasUnsavedChanges,
        setSaving,
        updateWebsiteName,
        markAsSaved,
    } = useEditorStore();

    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const saveChanges = useCallback(async () => {
        if (!currentPage || !website || !currentPage.sections) return;

        setSaving(true);
        console.log('Auto-saving...');

        try {
            // 1. Save Page Data (Content, Sections, Order)
            // We strip out internal fields or pass exactly what the API expects
            const sectionsToSave = currentPage.sections.map(s => ({
                id: s.id,
                type: s.type,
                order: s.order,
                visible: s.visible,
                content: s.content,
                style: s.style,
            }));

            const pageRes = await fetch(`/api/pages/${currentPage.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sections: sectionsToSave,
                    // We could also save title/slug if those were editable in the UI
                }),
            });

            if (!pageRes.ok) throw new Error('Failed to save page');

            // 2. Save Website Data (Theme, Meta)
            // Only if we tracked website-level changes separately, but the store `hasUnsavedChanges` is global.
            // For efficiency, we might want to check what actually changed, but for now we'll do a safe "upsert" style update 
            // for the website properties if needed. 
            // However, the `PUT /api/websites/[id]` is for settings. 
            // The `updateTheme` action sets `hasUnsavedChanges`.
            // Let's unconditionally save the theme config as well if it might have changed.

            const websiteRes = await fetch(`/api/websites/${website.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    themeConfig: website.themeConfig,
                    // name, metaData, etc. usually only changed in settings modal, relying on explicit save there?
                    // actually the store tracks `updateWebsiteName`.
                    name: website.name,
                }),
            });

            if (!websiteRes.ok) throw new Error('Failed to save website settings');

            console.log('Auto-save complete');
        } catch (error) {
            console.error('Auto-save failed:', error);
            // Ideally set an error state in the store
        } finally {
            setSaving(false);
            // We don't manually set hasUnsavedChanges(false) here because 
            // the store might not expose a setter for it directly other than via actions.
            // However, looking at the store definition, `setWebsite` sets it to false.
            // But we don't want to reload the whole website and cause a flicker.
            // We should ideally add a `markSaved()` action to the store. 
            // For now, we'll assume the store needs an update or we leave it "dirty" until explicit save?
            // No, auto-save should clear the dirty flag.
            // Let's add `markAsSaved` to the store in the next step.
        }
    }, [currentPage, website, setSaving]);

    useEffect(() => {
        if (hasUnsavedChanges) {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
                saveChanges();
            }, AUTO_SAVE_DELAY);
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [hasUnsavedChanges, saveChanges]);

    return null; // Headless component
}
