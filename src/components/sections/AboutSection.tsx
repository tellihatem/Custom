'use client';

import { EditableText } from '@/components/ui/EditableText';
import { ImageUploader } from '@/components/ui/ImageUploader';
import { useEditorStore } from '@/lib/store/editorStore';
import type { Section, AboutContent } from '@/lib/types';

interface AboutSectionProps {
    section: Section;
}

export function AboutSection({ section }: AboutSectionProps) {
    const { updateSectionContent, website, isEditing } = useEditorStore();
    const content = section.content as AboutContent;
    const theme = website?.themeConfig;

    const handleContentChange = (key: keyof AboutContent, value: unknown) => {
        updateSectionContent(section.id, { [key]: value });
    };

    return (
        <section
            className="py-20 px-6"
            style={{
                backgroundColor: section.style.backgroundColor || theme?.surfaceColor,
            }}
        >
            <div className="max-w-5xl mx-auto">
                {/* Section Title */}
                <EditableText
                    value={content.title}
                    onChange={(value) => handleContentChange('title', value)}
                    tag="h2"
                    className="text-3xl md:text-4xl font-bold mb-12 text-center"
                    placeholder="About Me"
                />

                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Image */}
                    <div className="order-2 md:order-1">
                        {isEditing ? (
                            <ImageUploader
                                value={content.imageUrl}
                                onChange={(url) => handleContentChange('imageUrl', url)}
                                aspectRatio="square"
                                className="rounded-2xl"
                            />
                        ) : content.imageUrl ? (
                            <img
                                src={content.imageUrl}
                                alt="About"
                                className="w-full rounded-2xl shadow-lg object-cover aspect-square"
                            />
                        ) : (
                            <div className="w-full aspect-square rounded-2xl bg-slate-200 dark:bg-slate-700" />
                        )}
                    </div>

                    {/* Content */}
                    <div className="order-1 md:order-2 space-y-6">
                        <EditableText
                            value={content.bio}
                            onChange={(value) => handleContentChange('bio', value)}
                            tag="p"
                            className="text-lg leading-relaxed"
                            style={{ color: theme?.textSecondaryColor }}
                            placeholder="Tell your story here..."
                            multiline
                        />

                        {/* Highlights */}
                        {content.highlights && content.highlights.length > 0 && (
                            <div className="grid grid-cols-3 gap-4 pt-6">
                                {content.highlights.map((highlight, index) => (
                                    <div key={index} className="text-center p-4 rounded-xl bg-white dark:bg-slate-800 shadow-sm">
                                        <div
                                            className="text-2xl font-bold mb-1"
                                            style={{ color: theme?.primaryColor }}
                                        >
                                            {highlight.value}
                                        </div>
                                        <div className="text-sm text-slate-500">{highlight.label}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
