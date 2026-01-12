'use client';

import { useEditorStore } from '@/lib/store/editorStore';
import { cn } from '@/lib/utils';
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { SkillsSection } from '@/components/sections/SkillsSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { ExperienceSection } from '@/components/sections/ExperienceSection';
import { ContactSection } from '@/components/sections/ContactSection';
import type { Section } from '@/lib/types';

const sectionComponents: Record<string, React.ComponentType<{ section: Section }>> = {
    hero: HeroSection,
    about: AboutSection,
    skills: SkillsSection,
    projects: ProjectsSection,
    experience: ExperienceSection,
    contact: ContactSection,
};

import { AutoSaveManager } from '@/components/editor/AutoSaveManager';

export function EditorCanvas() {
    const { website, currentPage, devicePreview, selectedSectionId, selectSection } = useEditorStore();

    if (!currentPage?.sections) {
        return (
            <div className="flex items-center justify-center h-full text-slate-500">
                No sections to display
            </div>
        );
    }

    const deviceWidths = {
        desktop: 'max-w-6xl',
        tablet: 'max-w-2xl',
        mobile: 'max-w-sm',
    };

    // Sort sections by order
    const sortedSections = [...currentPage.sections]
        .filter((s) => s.visible)
        .sort((a, b) => a.order - b.order);

    return (
        <div className="min-h-full flex justify-center">
            <AutoSaveManager />
            <div
                className={cn(
                    'w-full bg-white dark:bg-slate-900 shadow-2xl rounded-lg overflow-hidden transition-all duration-300',
                    deviceWidths[devicePreview]
                )}
                style={{
                    backgroundColor: website?.themeConfig.backgroundColor,
                    color: website?.themeConfig.textColor,
                    fontFamily: website?.themeConfig.fontFamily,
                }}
            >
                {sortedSections.map((section) => {
                    const SectionComponent = sectionComponents[section.type];

                    if (!SectionComponent) {
                        return (
                            <div key={section.id} className="p-8 bg-slate-100 text-center text-slate-500">
                                Unknown section type: {section.type}
                            </div>
                        );
                    }

                    return (
                        <div
                            key={section.id}
                            onClick={() => selectSection(section.id)}
                            className={cn(
                                'relative cursor-pointer transition-all duration-200',
                                'hover:ring-2 hover:ring-violet-500/50 hover:ring-offset-2',
                                selectedSectionId === section.id && 'ring-2 ring-violet-600 ring-offset-2'
                            )}
                        >
                            {/* Section Label (visible on hover/selection) */}
                            <div
                                className={cn(
                                    'absolute -top-6 left-2 px-2 py-1 bg-violet-600 text-white text-xs font-medium rounded',
                                    'opacity-0 transition-opacity z-10',
                                    (selectedSectionId === section.id || 'group-hover:opacity-100') &&
                                    (selectedSectionId === section.id ? 'opacity-100' : '')
                                )}
                            >
                                {section.type.charAt(0).toUpperCase() + section.type.slice(1)}
                            </div>

                            <SectionComponent section={section} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
