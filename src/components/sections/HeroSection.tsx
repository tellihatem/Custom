'use client';

import { EditableText } from '@/components/ui/EditableText';
import { useEditorStore } from '@/lib/store/editorStore';
import { Button } from '@/components/ui';
import type { Section, HeroContent } from '@/lib/types';
import { ArrowRight } from 'lucide-react';

interface HeroSectionProps {
    section: Section;
}

export function HeroSection({ section }: HeroSectionProps) {
    const { updateSectionContent, website } = useEditorStore();
    const content = section.content as HeroContent;
    const theme = website?.themeConfig;

    const handleContentChange = (key: keyof HeroContent, value: string) => {
        updateSectionContent(section.id, { [key]: value });
    };

    return (
        <section
            className="relative min-h-[80vh] flex items-center justify-center px-6 py-24"
            style={{
                backgroundColor: section.style.backgroundColor || theme?.backgroundColor,
                backgroundImage: content.backgroundUrl ? `url(${content.backgroundUrl})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            {/* Background overlay */}
            {content.backgroundUrl && (
                <div className="absolute inset-0 bg-black/50" />
            )}

            <div className="relative z-10 max-w-4xl mx-auto text-center">
                {/* Avatar */}
                {content.avatarUrl && (
                    <div className="mb-8">
                        <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-white/30 shadow-xl">
                            <img
                                src={content.avatarUrl}
                                alt="Avatar"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                )}

                {/* Name */}
                <EditableText
                    value={content.name}
                    onChange={(value) => handleContentChange('name', value)}
                    tag="h1"
                    className="text-5xl md:text-7xl font-extrabold mb-4"
                    style={{ fontFamily: theme?.headingFontFamily || theme?.fontFamily }}
                    placeholder="Your Name"
                />

                {/* Tagline */}
                <EditableText
                    value={content.tagline}
                    onChange={(value) => handleContentChange('tagline', value)}
                    tag="p"
                    className="text-2xl md:text-3xl font-medium mb-4"
                    style={{ color: theme?.primaryColor }}
                    placeholder="Your Professional Title"
                />

                {/* Subtitle */}
                {content.subtitle !== undefined && (
                    <EditableText
                        value={content.subtitle || ''}
                        onChange={(value) => handleContentChange('subtitle', value)}
                        tag="p"
                        className="text-lg max-w-2xl mx-auto mb-8"
                        style={{ color: theme?.textSecondaryColor }}
                        placeholder="A brief description of what you do"
                        multiline
                    />
                )}

                {/* CTA Button */}
                {content.ctaText && (
                    <div className="flex justify-center gap-4">
                        <Button
                            size="lg"
                            className="group"
                            style={{
                                backgroundColor: theme?.primaryColor,
                            }}
                        >
                            {content.ctaText}
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>
                )}

                {/* Social Links */}
                {content.socialLinks && content.socialLinks.length > 0 && (
                    <div className="flex justify-center gap-4 mt-8">
                        {content.socialLinks.map((link, index) => (
                            <a
                                key={index}
                                href={link.url}
                                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {/* Icon would be rendered here */}
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
