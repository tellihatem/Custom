import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { Website, Page, Section, ThemeConfig } from '@/lib/types';

interface EditorStore {
    // State
    website: Website | null;
    currentPage: Page | null;
    selectedSectionId: string | null;
    isEditing: boolean;
    isSaving: boolean;
    hasUnsavedChanges: boolean;
    devicePreview: 'desktop' | 'tablet' | 'mobile';
    showStylePanel: boolean;
    showSectionPanel: boolean;

    // History for undo/redo
    history: Website[];
    historyIndex: number;

    // Actions
    setWebsite: (website: Website | null) => void;
    setCurrentPage: (page: Page | null) => void;
    selectSection: (sectionId: string | null) => void;
    setEditing: (isEditing: boolean) => void;
    setSaving: (isSaving: boolean) => void;
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
    saveToHistory: () => void;

    // Reset
    reset: () => void;
    markAsSaved: () => void;
}

const initialState = {
    website: null,
    currentPage: null,
    selectedSectionId: null,
    isEditing: false,
    isSaving: false,
    hasUnsavedChanges: false,
    devicePreview: 'desktop' as const,
    showStylePanel: false,
    showSectionPanel: true,
    history: [],
    historyIndex: -1,
};

export const useEditorStore = create<EditorStore>()(
    devtools(
        persist(
            (set, get) => ({
                ...initialState,

                setWebsite: (website) =>
                    set({ website, hasUnsavedChanges: false }, false, 'setWebsite'),

                setCurrentPage: (currentPage) =>
                    set({ currentPage }, false, 'setCurrentPage'),

                selectSection: (selectedSectionId) =>
                    set({ selectedSectionId }, false, 'selectSection'),

                setEditing: (isEditing) =>
                    set({ isEditing }, false, 'setEditing'),

                setSaving: (isSaving) =>
                    set({ isSaving }, false, 'setSaving'),

                setDevicePreview: (devicePreview) =>
                    set({ devicePreview }, false, 'setDevicePreview'),

                toggleStylePanel: () =>
                    set((state) => ({ showStylePanel: !state.showStylePanel }), false, 'toggleStylePanel'),

                toggleSectionPanel: () =>
                    set((state) => ({ showSectionPanel: !state.showSectionPanel }), false, 'toggleSectionPanel'),

                updateWebsiteName: (name) =>
                    set(
                        (state) => ({
                            website: state.website ? { ...state.website, name } : null,
                            hasUnsavedChanges: true,
                        }),
                        false,
                        'updateWebsiteName'
                    ),

                updateTheme: (theme) =>
                    set(
                        (state) => {
                            if (!state.website) return state;
                            return {
                                website: {
                                    ...state.website,
                                    themeConfig: { ...state.website.themeConfig, ...theme },
                                },
                                hasUnsavedChanges: true,
                            };
                        },
                        false,
                        'updateTheme'
                    ),

                updateSection: (sectionId, updates) =>
                    set(
                        (state) => {
                            if (!state.currentPage?.sections) return state;
                            const sections = state.currentPage.sections.map((section) =>
                                section.id === sectionId ? { ...section, ...updates } : section
                            );
                            return {
                                currentPage: { ...state.currentPage, sections },
                                hasUnsavedChanges: true,
                            };
                        },
                        false,
                        'updateSection'
                    ),

                updateSectionContent: (sectionId, content) =>
                    set(
                        (state) => {
                            if (!state.currentPage?.sections) return state;
                            const sections = state.currentPage.sections.map((section) =>
                                section.id === sectionId
                                    ? { ...section, content: { ...section.content, ...content } }
                                    : section
                            );
                            return {
                                currentPage: { ...state.currentPage, sections },
                                hasUnsavedChanges: true,
                            };
                        },
                        false,
                        'updateSectionContent'
                    ),

                updateSectionStyle: (sectionId, style) =>
                    set(
                        (state) => {
                            if (!state.currentPage?.sections) return state;
                            const sections = state.currentPage.sections.map((section) =>
                                section.id === sectionId
                                    ? { ...section, style: { ...section.style, ...style } }
                                    : section
                            );
                            return {
                                currentPage: { ...state.currentPage, sections },
                                hasUnsavedChanges: true,
                            };
                        },
                        false,
                        'updateSectionStyle'
                    ),

                reorderSections: (sectionIds) =>
                    set(
                        (state) => {
                            if (!state.currentPage?.sections) return state;
                            const sectionMap = new Map(
                                state.currentPage.sections.map((s) => [s.id, s])
                            );
                            const sections = sectionIds
                                .map((id, index) => {
                                    const section = sectionMap.get(id);
                                    return section ? { ...section, order: index } : null;
                                })
                                .filter((s): s is Section => s !== null);
                            return {
                                currentPage: { ...state.currentPage, sections },
                                hasUnsavedChanges: true,
                            };
                        },
                        false,
                        'reorderSections'
                    ),

                toggleSectionVisibility: (sectionId) =>
                    set(
                        (state) => {
                            if (!state.currentPage?.sections) return state;
                            const sections = state.currentPage.sections.map((section) =>
                                section.id === sectionId
                                    ? { ...section, visible: !section.visible }
                                    : section
                            );
                            return {
                                currentPage: { ...state.currentPage, sections },
                                hasUnsavedChanges: true,
                            };
                        },
                        false,
                        'toggleSectionVisibility'
                    ),

                addSection: (type, afterSectionId) =>
                    set(
                        (state) => {
                            if (!state.currentPage?.sections) return state;
                            const newSection: Section = {
                                id: `section-${Date.now()}`,
                                pageId: state.currentPage.id,
                                type,
                                order: state.currentPage.sections.length,
                                visible: true,
                                content: getDefaultContent(type),
                                style: {},
                            };

                            let sections = [...state.currentPage.sections];
                            if (afterSectionId) {
                                const index = sections.findIndex((s) => s.id === afterSectionId);
                                sections.splice(index + 1, 0, newSection);
                                // Reorder
                                sections = sections.map((s, i) => ({ ...s, order: i }));
                            } else {
                                sections.push(newSection);
                            }

                            return {
                                currentPage: { ...state.currentPage, sections },
                                hasUnsavedChanges: true,
                            };
                        },
                        false,
                        'addSection'
                    ),

                deleteSection: (sectionId) =>
                    set(
                        (state) => {
                            if (!state.currentPage?.sections) return state;
                            const sections = state.currentPage.sections
                                .filter((s) => s.id !== sectionId)
                                .map((s, i) => ({ ...s, order: i }));
                            return {
                                currentPage: { ...state.currentPage, sections },
                                selectedSectionId:
                                    state.selectedSectionId === sectionId
                                        ? null
                                        : state.selectedSectionId,
                                hasUnsavedChanges: true,
                            };
                        },
                        false,
                        'deleteSection'
                    ),

                saveToHistory: () =>
                    set(
                        (state) => {
                            if (!state.website) return state;
                            const newHistory = state.history.slice(0, state.historyIndex + 1);
                            newHistory.push(JSON.parse(JSON.stringify(state.website)));
                            return {
                                history: newHistory.slice(-50), // Keep last 50 states
                                historyIndex: newHistory.length - 1,
                            };
                        },
                        false,
                        'saveToHistory'
                    ),

                undo: () =>
                    set(
                        (state) => {
                            if (state.historyIndex <= 0) return state;
                            const newIndex = state.historyIndex - 1;
                            return {
                                website: JSON.parse(JSON.stringify(state.history[newIndex])),
                                historyIndex: newIndex,
                                hasUnsavedChanges: true,
                            };
                        },
                        false,
                        'undo'
                    ),

                redo: () =>
                    set(
                        (state) => {
                            if (state.historyIndex >= state.history.length - 1) return state;
                            const newIndex = state.historyIndex + 1;
                            return {
                                website: JSON.parse(JSON.stringify(state.history[newIndex])),
                                historyIndex: newIndex,
                                hasUnsavedChanges: true,
                            };
                        },
                        false,
                        'redo'
                    ),

                reset: () => set(initialState, false, 'reset'),
                markAsSaved: () => set({ hasUnsavedChanges: false }, false, 'markAsSaved'),
            }),
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
