'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useEditorStore } from '@/lib/store/editorStore';

const AUTO_SAVE_DELAY = 1500;
const MIN_RETRY_DELAY = 2000;
const MAX_RETRY_DELAY = 30_000;

/**
 * Headless component that persists the editor state through
 * PUT /api/websites/:id/draft:
 * - debounces edits, and re-saves if edits happen while a save is in flight
 * - retries network/5xx failures with exponential backoff
 * - stops on 409 (the website was saved from another tab) until reload
 * - warns before closing the tab with unsaved changes
 */
export function AutoSaveManager() {
    const changeCounter = useEditorStore((s) => s.changeCounter);
    const saveStatus = useEditorStore((s) => s.saveStatus);

    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const inFlight = useRef(false);
    const pending = useRef(false);
    const retryDelay = useRef(MIN_RETRY_DELAY);
    const retryable = useRef(true);

    const save = useCallback(async () => {
        if (inFlight.current) {
            pending.current = true;
            return;
        }
        const store = useEditorStore.getState();
        const websiteId = store.website?.id;
        const started = store.beginSave();
        if (!websiteId || !started) return;

        inFlight.current = true;
        try {
            const res = await fetch(`/api/websites/${websiteId}/draft`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(started.payload),
            });

            if (res.ok) {
                const saved: { version: number } = await res.json();
                useEditorStore.getState().saveSucceeded(saved.version, started.changeCounter);
                retryDelay.current = MIN_RETRY_DELAY;
            } else {
                // 4xx (other than 409) won't succeed by retrying the same payload.
                retryable.current = res.status >= 500;
                if (!retryable.current) {
                    console.error('Auto-save rejected:', res.status, await res.text());
                }
                useEditorStore.getState().saveFailed(res.status === 409);
            }
        } catch (err) {
            console.error('Auto-save failed:', err);
            retryable.current = true;
            useEditorStore.getState().saveFailed(false);
        } finally {
            inFlight.current = false;
            if (pending.current) {
                pending.current = false;
                void save();
            }
        }
    }, []);

    useEffect(() => {
        if (timer.current) clearTimeout(timer.current);

        if (saveStatus === 'unsaved') {
            retryable.current = true;
            timer.current = setTimeout(save, AUTO_SAVE_DELAY);
        } else if (saveStatus === 'error' && retryable.current) {
            timer.current = setTimeout(save, retryDelay.current);
            retryDelay.current = Math.min(retryDelay.current * 2, MAX_RETRY_DELAY);
        }

        return () => {
            if (timer.current) clearTimeout(timer.current);
        };
    }, [changeCounter, saveStatus, save]);

    // Flush pending edits when leaving the editor inside the app.
    useEffect(() => {
        return () => {
            if (useEditorStore.getState().saveStatus === 'unsaved') void save();
        };
    }, [save]);

    useEffect(() => {
        const onBeforeUnload = (event: BeforeUnloadEvent) => {
            if (useEditorStore.getState().saveStatus !== 'saved') {
                event.preventDefault();
            }
        };
        window.addEventListener('beforeunload', onBeforeUnload);
        return () => window.removeEventListener('beforeunload', onBeforeUnload);
    }, []);

    return null; // Headless component
}
