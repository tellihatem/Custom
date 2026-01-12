'use client';

import { EditableText } from '@/components/ui/EditableText';
import { useEditorStore } from '@/lib/store/editorStore';
import type { Section, ExperienceContent, Experience } from '@/lib/types';

interface ExperienceSectionProps {
    section: Section;
}

export function ExperienceSection({ section }: ExperienceSectionProps) {
    const { updateSectionContent, website } = useEditorStore();
    const content = section.content as ExperienceContent;
    const theme = website?.themeConfig;

    const handleTitleChange = (value: string) => {
        updateSectionContent(section.id, { title: value });
    };

    const handleExperienceChange = (index: number, updates: Partial<Experience>) => {
        const newExperiences = [...(content.experiences || [])];
        newExperiences[index] = { ...newExperiences[index], ...updates };
        updateSectionContent(section.id, { experiences: newExperiences });
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
                <EditableText
                    value={content.title}
                    onChange={handleTitleChange}
                    tag="h2"
                    className="text-3xl md:text-4xl font-bold mb-12 text-center"
                    placeholder="Experience"
                />

                {/* Timeline */}
                <div className="relative">
                    {/* Timeline line */}
                    <div
                        className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px"
                        style={{ backgroundColor: theme?.primaryColor + '30' }}
                    />

                    {/* Experience items */}
                    <div className="space-y-12">
                        {(content.experiences || []).map((experience, index) => (
                            <div
                                key={experience.id || index}
                                className={`relative flex flex-col md:flex-row gap-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''
                                    }`}
                            >
                                {/* Timeline dot */}
                                <div
                                    className="absolute left-0 md:left-1/2 w-4 h-4 rounded-full -translate-x-1/2 border-4 bg-white dark:bg-slate-900"
                                    style={{ borderColor: theme?.primaryColor }}
                                />

                                {/* Content */}
                                <div className="flex-1 ml-8 md:ml-0">
                                    <div
                                        className={`p-6 rounded-2xl bg-white dark:bg-slate-800 shadow-sm ${index % 2 === 0 ? 'md:mr-12' : 'md:ml-12'
                                            }`}
                                    >
                                        {/* Date */}
                                        <div
                                            className="text-sm font-medium mb-2"
                                            style={{ color: theme?.primaryColor }}
                                        >
                                            {experience.startDate} — {experience.current ? 'Present' : experience.endDate}
                                        </div>

                                        {/* Role */}
                                        <EditableText
                                            value={experience.role}
                                            onChange={(value) => handleExperienceChange(index, { role: value })}
                                            tag="h3"
                                            className="text-xl font-semibold mb-1"
                                            placeholder="Job Title"
                                        />

                                        {/* Company */}
                                        <EditableText
                                            value={experience.company}
                                            onChange={(value) => handleExperienceChange(index, { company: value })}
                                            tag="p"
                                            className="font-medium mb-3"
                                            style={{ color: theme?.textSecondaryColor }}
                                            placeholder="Company Name"
                                        />

                                        {/* Location */}
                                        {experience.location && (
                                            <p className="text-sm text-slate-500 mb-3">
                                                📍 {experience.location}
                                            </p>
                                        )}

                                        {/* Description */}
                                        <EditableText
                                            value={experience.description}
                                            onChange={(value) => handleExperienceChange(index, { description: value })}
                                            tag="p"
                                            className="text-sm"
                                            style={{ color: theme?.textSecondaryColor }}
                                            placeholder="Describe your role and achievements..."
                                            multiline
                                        />
                                    </div>
                                </div>

                                {/* Spacer for alternating layout */}
                                <div className="hidden md:block flex-1" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
