import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { Website, Page, Section, ThemeConfig } from '@/lib/types';
import type { SaveDraftInput } from '@/shared/schemas/draft';
import { newId } from '@/lib/utils';

export type SaveStatus = 'saved' | 'unsaved' | 'saving' | 'error' | 'conflict';

/** The part of the state that undo/redo restores. */
interface Snapshot {
    website: Website;
    currentPage: Page;
}

const HISTORY_LIMIT = 50;
/** Edits with the same key within this window form one undo step (typing). */
const HISTORY_COALESCE_MS = 1000;

interface EditorStore {
    // Document
    website: Website | null;
    currentPage: Page | null;

    // UI
    selectedSectionId: string | null;
    isEditing: boolean;
    devicePreview: 'desktop' | 'tablet' | 'mobile';
    showStylePanel: boolean;
    showSectionPanel: boolean;

    // Persistence
    saveStatus: SaveStatus;
    /** Incremented on every edit; lets a save know if edits happened meanwhile. */
    changeCounter: number;

    // History
    past: Snapshot[];
    future: Snapshot[];
    lastHistoryKey: string | null;
    lastHistoryAt: number;

    // Lifecycle
    load: (website: Website) => void;
    reset: () => void;

    // UI actions
    selectSection: (sectionId: string | null) => void;
    setEditing: (isEditing: boolean) => void;
    setDevicePreview: (device: 'desktop' | 'tablet' | 'mobile') => void;
    toggleStylePanel: () => void;
    toggleSectionPanel: () => void;

    // Website mutations
    updateWebsiteName: (name: string) => void;
    updateTheme: (theme: Partial<ThemeConfig>) => void;

    // Section mutations
    updateSection: (sectionId: string, updates: Partial<Section>) => void;
    updateSectionContent: (sectionId: string, content: Record<string, unknown>) => void;
    updateSectionStyle: (sectionId: string, style: Record<string, unknown>) => void;
    reorderSections: (sectionIds: string[]) => void;
    toggleSectionVisibility: (sectionId: string) => void;
    addSection: (type: Section['type'], afterSectionId?: string) => void;
    deleteSection: (sectionId: string) => void;

    // History actions
    undo: () => void;
    redo: () => void;

    // Save lifecycle (used by AutoSaveManager)
    beginSave: () => { payload: SaveDraftInput; changeCounter: number } | null;
    saveSucceeded: (version: number, savedChangeCounter: number) => void;
    saveFailed: (conflict: boolean) => void;
}

const initialDocumentState = {
    website: null,
    currentPage: null,
    selectedSectionId: null,
    isEditing: false,
    saveStatus: 'saved' as SaveStatus,
    changeCounter: 0,
    past: [] as Snapshot[],
    future: [] as Snapshot[],
    lastHistoryKey: null,
    lastHistoryAt: 0,
};

const renumber = (sections: Section[]) => sections.map((s, i) => ({ ...s, order: i }));

export const useEditorStore = create<EditorStore>()(
    devtools(
        persist(
            (set, get) => {
                /**
                 * Apply an edit to the document: records an undo snapshot
                 * (coalescing rapid edits with the same key), clears redo,
                 * and marks the document dirty.
                 */
                const mutate = (
                    key: string,
                    recipe: (doc: Snapshot) => Partial<Snapshot> | null
                ) =>
                    set(
                        (state) => {
                            if (!state.website || !state.currentPage) return state;
                            const doc = { website: state.website, currentPage: state.currentPage };
                            const changes = recipe(doc);
                            if (!changes) return state;

                            const now = Date.now();
                            const coalesce =
                                key === state.lastHistoryKey && now - state.lastHistoryAt < HISTORY_COALESCE_MS;

                            return {
                                ...changes,
                                past: coalesce ? state.past : [...state.past, doc].slice(-HISTORY_LIMIT),
                                future: [],
                                lastHistoryKey: key,
                                lastHistoryAt: now,
                                changeCounter: state.changeCounter + 1,
                                saveStatus: state.saveStatus === 'conflict' ? 'conflict' : 'unsaved',
                            };
                        },
                        false,
                        key.split(':')[0]
                    );

                const mapSections = (
                    page: Page,
                    fn: (sections: Section[]) => Section[]
                ): Partial<Snapshot> => ({
                    currentPage: { ...page, sections: fn(page.sections ?? []) },
                });

                /** Restore a snapshot from one history stack onto the other. */
                const travel = (from: 'past' | 'future') =>
                    set(
                        (state) => {
                            const stack = state[from];
                            if (stack.length === 0 || !state.website || !state.currentPage) return state;
                            const target = stack[stack.length - 1];
                            const current = { website: state.website, currentPage: state.currentPage };
                            return {
                                ...target,
                                // Keep the server version: it is not part of the undoable content.
                                website: { ...target.website, version: state.website.version },
                                past: from === 'past' ? state.past.slice(0, -1) : [...state.past, current],
                                future: from === 'future' ? state.future.slice(0, -1) : [...state.future, current],
                                lastHistoryKey: null,
                                changeCounter: state.changeCounter + 1,
                                saveStatus: state.saveStatus === 'conflict' ? 'conflict' : 'unsaved',
                            };
                        },
                        false,
                        from === 'past' ? 'undo' : 'redo'
                    );

                return {
                    ...initialDocumentState,
                    devicePreview: 'desktop',
                    showStylePanel: false,
                    showSectionPanel: true,

                    load: (website) =>
                        set(
                            {
                                ...initialDocumentState,
                                website,
                                // The editor UI currently edits a single page.
                                currentPage: website.pages?.[0] ?? null,
                                isEditing: true,
                            },
                            false,
                            'load'
                        ),

                    reset: () => set(initialDocumentState, false, 'reset'),

                    selectSection: (selectedSectionId) =>
                        set({ selectedSectionId }, false, 'selectSection'),

                    setEditing: (isEditing) => set({ isEditing }, false, 'setEditing'),

                    setDevicePreview: (devicePreview) =>
                        set({ devicePreview }, false, 'setDevicePreview'),

                    toggleStylePanel: () =>
                        set((state) => ({ showStylePanel: !state.showStylePanel }), false, 'toggleStylePanel'),

                    toggleSectionPanel: () =>
                        set((state) => ({ showSectionPanel: !state.showSectionPanel }), false, 'toggleSectionPanel'),

                    updateWebsiteName: (name) =>
                        mutate('updateWebsiteName', ({ website }) => ({ website: { ...website, name } })),

                    updateTheme: (theme) =>
                        mutate(`updateTheme:${Object.keys(theme).join(',')}`, ({ website }) => ({
                            website: { ...website, themeConfig: { ...website.themeConfig, ...theme } },
                        })),

                    updateSection: (sectionId, updates) =>
                        mutate(`updateSection:${sectionId}`, ({ currentPage }) =>
                            mapSections(currentPage, (sections) =>
                                sections.map((s) => (s.id === sectionId ? { ...s, ...updates } : s))
                            )
                        ),

                    updateSectionContent: (sectionId, content) =>
                        mutate(`updateSectionContent:${sectionId}:${Object.keys(content).join(',')}`, ({ currentPage }) =>
                            mapSections(currentPage, (sections) =>
                                sections.map((s) =>
                                    s.id === sectionId ? { ...s, content: { ...s.content, ...content } } : s
                                )
                            )
                        ),

                    updateSectionStyle: (sectionId, style) =>
                        mutate(`updateSectionStyle:${sectionId}:${Object.keys(style).join(',')}`, ({ currentPage }) =>
                            mapSections(currentPage, (sections) =>
                                sections.map((s) =>
                                    s.id === sectionId ? { ...s, style: { ...s.style, ...style } } : s
                                )
                            )
                        ),

                    reorderSections: (sectionIds) =>
                        mutate(`reorderSections:${Date.now()}`, ({ currentPage }) =>
                            mapSections(currentPage, (sections) => {
                                const byId = new Map(sections.map((s) => [s.id, s]));
                                return renumber(
                                    sectionIds
                                        .map((id) => byId.get(id))
                                        .filter((s): s is Section => s !== undefined)
                                );
                            })
                        ),

                    toggleSectionVisibility: (sectionId) =>
                        mutate(`toggleSectionVisibility:${Date.now()}`, ({ currentPage }) =>
                            mapSections(currentPage, (sections) =>
                                sections.map((s) => (s.id === sectionId ? { ...s, visible: !s.visible } : s))
                            )
                        ),

                    addSection: (type, afterSectionId) =>
                        mutate(`addSection:${Date.now()}`, ({ currentPage }) =>
                            mapSections(currentPage, (sections) => {
                                const newSection: Section = {
                                    // Real UUID: the draft endpoint creates it with this id.
                                    id: newId(),
                                    pageId: currentPage.id,
                                    type,
                                    order: sections.length,
                                    visible: true,
                                    content: getDefaultContent(type),
                                    style: {},
                                };
                                const index = afterSectionId
                                    ? sections.findIndex((s) => s.id === afterSectionId) + 1
                                    : sections.length;
                                const next = [...sections];
                                next.splice(index > 0 ? index : sections.length, 0, newSection);
                                return renumber(next);
                            })
                        ),

                    deleteSection: (sectionId) => {
                        mutate(`deleteSection:${Date.now()}`, ({ currentPage }) =>
                            mapSections(currentPage, (sections) =>
                                renumber(sections.filter((s) => s.id !== sectionId))
                            )
                        );
                        if (get().selectedSectionId === sectionId) {
                            set({ selectedSectionId: null }, false, 'deleteSection');
                        }
                    },

                    undo: () => travel('past'),
                    redo: () => travel('future'),

                    beginSave: () => {
                        const { website, currentPage, changeCounter, saveStatus } = get();
                        if (!website || !currentPage || saveStatus === 'conflict') return null;
                        set({ saveStatus: 'saving' }, false, 'beginSave');
                        return {
                            changeCounter,
                            payload: {
                                version: website.version,
                                name: website.name,
                                themeConfig: { ...website.themeConfig },
                                pages: [
                                    {
                                        id: currentPage.id,
                                        sections: (currentPage.sections ?? []).map((s) => ({
                                            id: s.id,
                                            type: s.type,
                                            order: s.order,
                                            visible: s.visible,
                                            content: { ...s.content },
                                            style: { ...s.style },
                                        })),
                                    },
                                ],
                            },
                        };
                    },

                    saveSucceeded: (version, savedChangeCounter) =>
                        set(
                            (state) => ({
                                website: state.website ? { ...state.website, version } : null,
                                // Edits made while the request was in flight still need saving.
                                saveStatus: state.changeCounter === savedChangeCounter ? 'saved' : 'unsaved',
                            }),
                            false,
                            'saveSucceeded'
                        ),

                    saveFailed: (conflict) =>
                        set({ saveStatus: conflict ? 'conflict' : 'error' }, false, 'saveFailed'),
                };
            },
            {
                name: 'thodz-editor-store',
                partialize: (state) => ({
                    devicePreview: state.devicePreview,
                    showStylePanel: state.showStylePanel,
                    showSectionPanel: state.showSectionPanel,
                }),
            }
        ),
        { name: 'EditorStore' }
    )
);

// Helper function to get default content for each section type
function getDefaultContent(type: Section['type']): Record<string, unknown> {
    switch (type) {
        case 'hero':
            return {
                name: 'Your Name',
                tagline: 'Your Professional Tagline',
                subtitle: 'A brief description of what you do',
                ctaText: 'Get in Touch',
                ctaLink: '#contact',
            };
        case 'about':
            return {
                title: 'About Me',
                bio: 'Tell your story here. Share your background, experience, and what drives you.',
            };
        case 'skills':
            return {
                title: 'Skills & Expertise',
                skills: [
                    { id: '1', name: 'Skill 1', proficiency: 90 },
                    { id: '2', name: 'Skill 2', proficiency: 85 },
                    { id: '3', name: 'Skill 3', proficiency: 80 },
                ],
            };
        case 'projects':
            return {
                title: 'Featured Projects',
                projects: [
                    {
                        id: '1',
                        title: 'Project 1',
                        description: 'A brief description of this project.',
                        tags: ['Tag 1', 'Tag 2'],
                    },
                ],
            };
        case 'experience':
            return {
                title: 'Experience',
                experiences: [
                    {
                        id: '1',
                        company: 'Company Name',
                        role: 'Your Role',
                        startDate: '2020',
                        current: true,
                        description: 'Describe your responsibilities and achievements.',
                    },
                ],
            };
        case 'contact':
            return {
                title: 'Get in Touch',
                subtitle: "I'd love to hear from you!",
                email: 'your@email.com',
                showForm: true,
            };
        default:
            return {};
    }
}
