'use client';

import { EditableText } from '@/components/ui/EditableText';
import { ImageUploader } from '@/components/ui/ImageUploader';
import { useEditorStore } from '@/lib/store/editorStore';
import { ExternalLink, Github } from 'lucide-react';
import type { Section, ProjectsContent, Project } from '@/lib/types';

interface ProjectsSectionProps {
    section: Section;
}

export function ProjectsSection({ section }: ProjectsSectionProps) {
    const { updateSectionContent, website, isEditing } = useEditorStore();
    const content = section.content as ProjectsContent;
    const theme = website?.themeConfig;

    const handleTitleChange = (value: string) => {
        updateSectionContent(section.id, { title: value });
    };

    const handleProjectChange = (index: number, updates: Partial<Project>) => {
        const newProjects = [...(content.projects || [])];
        newProjects[index] = { ...newProjects[index], ...updates };
        updateSectionContent(section.id, { projects: newProjects });
    };

    return (
        <section
            className="py-20 px-6"
            style={{
                backgroundColor: section.style.backgroundColor || theme?.surfaceColor,
            }}
        >
            <div className="max-w-6xl mx-auto">
                {/* Section Title */}
                <div className="text-center mb-12">
                    <EditableText
                        value={content.title}
                        onChange={handleTitleChange}
                        tag="h2"
                        className="text-3xl md:text-4xl font-bold mb-4"
                        placeholder="Projects"
                    />
                    {content.subtitle && (
                        <EditableText
                            value={content.subtitle}
                            onChange={(value) => updateSectionContent(section.id, { subtitle: value })}
                            tag="p"
                            className="text-lg"
                            style={{ color: theme?.textSecondaryColor }}
                            placeholder="Featured work"
                        />
                    )}
                </div>

                {/* Projects Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {(content.projects || []).map((project, index) => (
                        <div
                            key={project.id || index}
                            className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                        >
                            {/* Project Image */}
                            <div className="aspect-video relative overflow-hidden">
                                {isEditing ? (
                                    <ImageUploader
                                        value={project.imageUrl}
                                        onChange={(url) => handleProjectChange(index, { imageUrl: url })}
                                        aspectRatio="video"
                                    />
                                ) : project.imageUrl ? (
                                    <img
                                        src={project.imageUrl}
                                        alt={project.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <div
                                        className="w-full h-full flex items-center justify-center"
                                        style={{ backgroundColor: theme?.primaryColor + '20' }}
                                    >
                                        <span className="text-4xl font-bold" style={{ color: theme?.primaryColor }}>
                                            {project.title.charAt(0)}
                                        </span>
                                    </div>
                                )}

                                {/* Overlay with links */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                    {project.liveUrl && (
                                        <a
                                            href={project.liveUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-3 bg-white rounded-full hover:bg-slate-100 transition-colors"
                                        >
                                            <ExternalLink className="w-5 h-5 text-slate-900" />
                                        </a>
                                    )}
                                    {project.repoUrl && (
                                        <a
                                            href={project.repoUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-3 bg-white rounded-full hover:bg-slate-100 transition-colors"
                                        >
                                            <Github className="w-5 h-5 text-slate-900" />
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <EditableText
                                    value={project.title}
                                    onChange={(value) => handleProjectChange(index, { title: value })}
                                    tag="h3"
                                    className="text-xl font-semibold mb-2"
                                    placeholder="Project Name"
                                />
                                <EditableText
                                    value={project.description}
                                    onChange={(value) => handleProjectChange(index, { description: value })}
                                    tag="p"
                                    className="text-sm mb-4"
                                    style={{ color: theme?.textSecondaryColor }}
                                    placeholder="Project description..."
                                    multiline
                                />

                                {/* Tags */}
                                {project.tags && project.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {project.tags.map((tag, tagIndex) => (
                                            <span
                                                key={tagIndex}
                                                className="text-xs px-2 py-1 rounded-full"
                                                style={{
                                                    backgroundColor: theme?.primaryColor + '20',
                                                    color: theme?.primaryColor,
                                                }}
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
