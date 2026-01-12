'use client';

import { EditableText } from '@/components/ui/EditableText';
import { useEditorStore } from '@/lib/store/editorStore';
import { Button, Input } from '@/components/ui';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import type { Section, ContactContent, SocialLink } from '@/lib/types';

interface ContactSectionProps {
    section: Section;
}

export function ContactSection({ section }: ContactSectionProps) {
    const { updateSectionContent, website } = useEditorStore();
    const content = section.content as ContactContent;
    const theme = website?.themeConfig;

    const handleContentChange = (key: keyof ContactContent, value: unknown) => {
        updateSectionContent(section.id, { [key]: value });
    };

    const renderSocialIcon = (iconName?: string) => {
        if (!iconName) return null;
        const IconComponent = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[iconName];
        return IconComponent ? <IconComponent className="w-5 h-5" /> : null;
    };

    return (
        <section
            className="py-20 px-6"
            style={{
                backgroundColor: section.style.backgroundColor || theme?.surfaceColor,
            }}
        >
            <div className="max-w-4xl mx-auto">
                {/* Section Title */}
                <div className="text-center mb-12">
                    <EditableText
                        value={content.title}
                        onChange={(value) => handleContentChange('title', value)}
                        tag="h2"
                        className="text-3xl md:text-4xl font-bold mb-4"
                        placeholder="Contact"
                    />
                    {content.subtitle && (
                        <EditableText
                            value={content.subtitle}
                            onChange={(value) => handleContentChange('subtitle', value)}
                            tag="p"
                            className="text-lg"
                            style={{ color: theme?.textSecondaryColor }}
                            placeholder="Get in touch"
                        />
                    )}
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold mb-6">Contact Information</h3>

                        {content.email && (
                            <a
                                href={`mailto:${content.email}`}
                                className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-slate-800 hover:shadow-md transition-shadow"
                            >
                                <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                                    style={{ backgroundColor: theme?.primaryColor + '20' }}
                                >
                                    <Mail className="w-5 h-5" style={{ color: theme?.primaryColor }} />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Email</p>
                                    <p className="font-medium">{content.email}</p>
                                </div>
                            </a>
                        )}

                        {content.phone && (
                            <a
                                href={`tel:${content.phone}`}
                                className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-slate-800 hover:shadow-md transition-shadow"
                            >
                                <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                                    style={{ backgroundColor: theme?.primaryColor + '20' }}
                                >
                                    <Phone className="w-5 h-5" style={{ color: theme?.primaryColor }} />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Phone</p>
                                    <p className="font-medium">{content.phone}</p>
                                </div>
                            </a>
                        )}

                        {content.location && (
                            <div className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-slate-800">
                                <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                                    style={{ backgroundColor: theme?.primaryColor + '20' }}
                                >
                                    <MapPin className="w-5 h-5" style={{ color: theme?.primaryColor }} />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Location</p>
                                    <p className="font-medium">{content.location}</p>
                                </div>
                            </div>
                        )}

                        {/* Social Links */}
                        {content.socialLinks && content.socialLinks.length > 0 && (
                            <div className="pt-6">
                                <p className="text-sm text-slate-500 mb-4">Follow me</p>
                                <div className="flex gap-3">
                                    {content.socialLinks.map((link: SocialLink, index: number) => (
                                        <a
                                            key={index}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-12 h-12 rounded-xl flex items-center justify-center transition-colors hover:opacity-80"
                                            style={{ backgroundColor: theme?.primaryColor }}
                                            title={link.platform}
                                        >
                                            <span className="text-white">
                                                {renderSocialIcon(link.icon)}
                                            </span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Contact Form */}
                    {content.showForm && (
                        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm">
                            <h3 className="text-xl font-semibold mb-6">Send a Message</h3>
                            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                                <Input
                                    label="Name"
                                    placeholder="Your name"
                                />
                                <Input
                                    label="Email"
                                    type="email"
                                    placeholder="your@email.com"
                                />
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                        Message
                                    </label>
                                    <textarea
                                        rows={4}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 resize-none"
                                        placeholder="Your message..."
                                    />
                                </div>
                                <Button className="w-full gap-2" style={{ backgroundColor: theme?.primaryColor }}>
                                    <Send className="w-4 h-4" />
                                    Send Message
                                </Button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
