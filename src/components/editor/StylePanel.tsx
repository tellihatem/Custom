'use client';

import { useEditorStore } from '@/lib/store/editorStore';
import { ColorPicker } from '@/components/ui';
import { cn } from '@/lib/utils';
import {
    Palette,
    Type,
    Layout,
    ChevronDown,
    ChevronRight,
} from 'lucide-react';
import { useState } from 'react';

export function StylePanel() {
    const { website, updateTheme, selectedSectionId, currentPage } = useEditorStore();
    const [expandedSection, setExpandedSection] = useState<string>('theme');

    const selectedSection = currentPage?.sections?.find(s => s.id === selectedSectionId);

    const toggleSection = (section: string) => {
        setExpandedSection(expandedSection === section ? '' : section);
    };

    if (!website) return null;

    return (
        <div className="p-4 space-y-2">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Style Settings
            </h3>

            {/* Theme Colors */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <button
                    onClick={() => toggleSection('theme')}
                    className="flex items-center justify-between w-full p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-500/20 flex items-center justify-center">
                            <Palette className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                        </div>
                        <span className="font-medium text-sm">Theme Colors</span>
                    </div>
                    {expandedSection === 'theme' ? (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                    ) : (
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                    )}
                </button>

                {expandedSection === 'theme' && (
                    <div className="p-4 pt-0 space-y-4 border-t border-slate-100 dark:border-slate-800">
                        <ColorPicker
                            label="Primary Color"
                            value={website.themeConfig.primaryColor}
                            onChange={(color) => updateTheme({ primaryColor: color })}
                        />
                        <ColorPicker
                            label="Secondary Color"
                            value={website.themeConfig.secondaryColor}
                            onChange={(color) => updateTheme({ secondaryColor: color })}
                        />
                        <ColorPicker
                            label="Accent Color"
                            value={website.themeConfig.accentColor}
                            onChange={(color) => updateTheme({ accentColor: color })}
                        />
                        <ColorPicker
                            label="Background"
                            value={website.themeConfig.backgroundColor}
                            onChange={(color) => updateTheme({ backgroundColor: color })}
                        />
                        <ColorPicker
                            label="Text Color"
                            value={website.themeConfig.textColor}
                            onChange={(color) => updateTheme({ textColor: color })}
                        />
                    </div>
                )}
            </div>

            {/* Typography */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <button
                    onClick={() => toggleSection('typography')}
                    className="flex items-center justify-between w-full p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center">
                            <Type className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="font-medium text-sm">Typography</span>
                    </div>
                    {expandedSection === 'typography' ? (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                    ) : (
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                    )}
                </button>

                {expandedSection === 'typography' && (
                    <div className="p-4 pt-0 space-y-4 border-t border-slate-100 dark:border-slate-800">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Font Family
                            </label>
                            <select
                                value={website.themeConfig.fontFamily}
                                onChange={(e) => updateTheme({ fontFamily: e.target.value })}
                                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                            >
                                <option value="Inter, system-ui, sans-serif">Inter</option>
                                <option value="Outfit, system-ui, sans-serif">Outfit</option>
                                <option value="JetBrains Mono, monospace">JetBrains Mono</option>
                                <option value="Cormorant Garamond, serif">Cormorant Garamond</option>
                                <option value="Source Sans Pro, system-ui, sans-serif">Source Sans Pro</option>
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {/* Layout */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <button
                    onClick={() => toggleSection('layout')}
                    className="flex items-center justify-between w-full p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center">
                            <Layout className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <span className="font-medium text-sm">Layout</span>
                    </div>
                    {expandedSection === 'layout' ? (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                    ) : (
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                    )}
                </button>

                {expandedSection === 'layout' && (
                    <div className="p-4 pt-0 space-y-4 border-t border-slate-100 dark:border-slate-800">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Border Radius
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {(['sm', 'md', 'lg'] as const).map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => updateTheme({ borderRadius: size })}
                                        className={cn(
                                            'p-2 text-xs font-medium rounded-lg border transition-colors',
                                            website.themeConfig.borderRadius === size
                                                ? 'border-violet-500 bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400'
                                                : 'border-slate-200 hover:border-slate-300 dark:border-slate-700'
                                        )}
                                    >
                                        {size.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Spacing
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {(['compact', 'comfortable', 'spacious'] as const).map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => updateTheme({ spacing: size })}
                                        className={cn(
                                            'p-2 text-xs font-medium rounded-lg border transition-colors capitalize',
                                            website.themeConfig.spacing === size
                                                ? 'border-violet-500 bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400'
                                                : 'border-slate-200 hover:border-slate-300 dark:border-slate-700'
                                        )}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Selected Section Style */}
            {selectedSection && (
                <div className="mt-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                    <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Selected: {selectedSection.type.charAt(0).toUpperCase() + selectedSection.type.slice(1)}
                    </h4>
                    <p className="text-xs text-slate-500">
                        Click on elements in the canvas to edit them directly.
                    </p>
                </div>
            )}
        </div>
    );
}
