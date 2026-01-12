'use client';

import { EditableText } from '@/components/ui/EditableText';
import { useEditorStore } from '@/lib/store/editorStore';
import { cn } from '@/lib/utils';
import type { Section, SkillsContent, Skill } from '@/lib/types';

interface SkillsSectionProps {
    section: Section;
}

export function SkillsSection({ section }: SkillsSectionProps) {
    const { updateSectionContent, website } = useEditorStore();
    const content = section.content as SkillsContent;
    const theme = website?.themeConfig;

    const handleTitleChange = (value: string) => {
        updateSectionContent(section.id, { title: value });
    };

    const handleSkillChange = (index: number, updates: Partial<Skill>) => {
        const newSkills = [...(content.skills || [])];
        newSkills[index] = { ...newSkills[index], ...updates };
        updateSectionContent(section.id, { skills: newSkills });
    };

    return (
        <section
            className="py-20 px-6"
            style={{
                backgroundColor: section.style.backgroundColor || theme?.backgroundColor,
            }}
        >
            <div className="max-w-4xl mx-auto">
                {/* Section Title */}
                <div className="text-center mb-12">
                    <EditableText
                        value={content.title}
                        onChange={handleTitleChange}
                        tag="h2"
                        className="text-3xl md:text-4xl font-bold mb-4"
                        placeholder="Skills"
                    />
                    {content.subtitle && (
                        <EditableText
                            value={content.subtitle}
                            onChange={(value) => updateSectionContent(section.id, { subtitle: value })}
                            tag="p"
                            className="text-lg"
                            style={{ color: theme?.textSecondaryColor }}
                            placeholder="What I'm good at"
                        />
                    )}
                </div>

                {/* Skills Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                    {(content.skills || []).map((skill, index) => (
                        <div
                            key={skill.id || index}
                            className="p-6 rounded-xl bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <EditableText
                                    value={skill.name}
                                    onChange={(value) => handleSkillChange(index, { name: value })}
                                    tag="h3"
                                    className="font-semibold"
                                    placeholder="Skill Name"
                                />
                                <span
                                    className="text-sm font-medium"
                                    style={{ color: theme?.primaryColor }}
                                >
                                    {skill.proficiency}%
                                </span>
                            </div>

                            {/* Progress Bar */}
                            <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-500"
                                    style={{
                                        width: `${skill.proficiency || 0}%`,
                                        backgroundColor: theme?.primaryColor,
                                    }}
                                />
                            </div>

                            {skill.category && (
                                <span className="inline-block mt-3 text-xs px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-full text-slate-600 dark:text-slate-400">
                                    {skill.category}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
