'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Modal } from './Modal';
import { Input } from './Input';
import { Button } from './Button';
import { Search } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

// Get all icon names (filter out non-icon exports)
const iconNames = Object.keys(LucideIcons).filter(
    (key) =>
        key !== 'default' &&
        key !== 'createLucideIcon' &&
        key !== 'icons' &&
        typeof (LucideIcons as Record<string, unknown>)[key] === 'object' &&
        !key.startsWith('Lucide')
);

// Categorize icons
const iconCategories: Record<string, string[]> = {
    'Social': ['Github', 'Linkedin', 'Twitter', 'Facebook', 'Instagram', 'Youtube', 'Twitch', 'Dribbble', 'Figma', 'Slack', 'Discord'],
    'Communication': ['Mail', 'Phone', 'MessageCircle', 'MessageSquare', 'Send', 'Inbox', 'AtSign', 'Bell', 'BellRing'],
    'Media': ['Image', 'Camera', 'Video', 'Music', 'Mic', 'Volume2', 'Play', 'Pause', 'SkipForward', 'SkipBack'],
    'File': ['File', 'FileText', 'Folder', 'FolderOpen', 'Download', 'Upload', 'Paperclip', 'Archive', 'Clipboard'],
    'UI': ['Home', 'Menu', 'X', 'Check', 'ChevronDown', 'ChevronUp', 'ChevronLeft', 'ChevronRight', 'Plus', 'Minus', 'Search', 'Settings', 'Filter', 'Grid', 'List'],
    'Actions': ['Edit', 'Trash', 'Copy', 'Save', 'Share', 'ExternalLink', 'Link', 'Bookmark', 'Heart', 'Star', 'ThumbsUp', 'Eye', 'EyeOff'],
    'Arrows': ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'CornerDownRight', 'MoveUp', 'MoveDown', 'RefreshCw', 'RotateCw'],
    'Charts': ['BarChart', 'BarChart2', 'LineChart', 'PieChart', 'TrendingUp', 'TrendingDown', 'Activity'],
    'Misc': ['Zap', 'Award', 'Gift', 'Globe', 'Map', 'MapPin', 'Clock', 'Calendar', 'Sun', 'Moon', 'Cloud', 'Umbrella', 'Coffee', 'Briefcase', 'Building', 'Users', 'User', 'UserPlus'],
};

interface IconPickerProps {
    value?: string;
    onChange: (iconName: string) => void;
    className?: string;
}

export function IconPicker({ value, onChange, className }: IconPickerProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [selectedCategory, setSelectedCategory] = React.useState<string>('all');

    const filteredIcons = React.useMemo(() => {
        let icons = iconNames;

        // Filter by category
        if (selectedCategory !== 'all') {
            icons = iconCategories[selectedCategory] || [];
        }

        // Filter by search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            icons = icons.filter((name) => name.toLowerCase().includes(query));
        }

        return icons.slice(0, 100); // Limit for performance
    }, [searchQuery, selectedCategory]);

    const renderIcon = (name: string) => {
        const IconComponent = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[name];
        if (!IconComponent) return null;
        return <IconComponent className="w-5 h-5" />;
    };

    const SelectedIcon = value ? (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[value] : null;

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className={cn(
                    'w-12 h-12 rounded-xl border-2 border-dashed border-slate-200 hover:border-violet-500',
                    'flex items-center justify-center transition-colors',
                    'dark:border-slate-700 dark:hover:border-violet-500',
                    value && 'border-solid border-slate-200 bg-slate-50 dark:bg-slate-800',
                    className
                )}
            >
                {SelectedIcon ? (
                    <SelectedIcon className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                ) : (
                    <Plus className="w-5 h-5 text-slate-400" />
                )}
            </button>

            <Modal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title="Choose an Icon"
                size="lg"
            >
                <div className="space-y-4">
                    {/* Search */}
                    <Input
                        placeholder="Search icons..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        icon={<Search className="w-4 h-4" />}
                    />

                    {/* Categories */}
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setSelectedCategory('all')}
                            className={cn(
                                'px-3 py-1.5 text-sm rounded-lg transition-colors',
                                selectedCategory === 'all'
                                    ? 'bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-400'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'
                            )}
                        >
                            All
                        </button>
                        {Object.keys(iconCategories).map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={cn(
                                    'px-3 py-1.5 text-sm rounded-lg transition-colors',
                                    selectedCategory === category
                                        ? 'bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-400'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'
                                )}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Icons Grid */}
                    <div className="grid grid-cols-8 gap-2 max-h-64 overflow-y-auto p-1">
                        {filteredIcons.map((name) => (
                            <button
                                key={name}
                                onClick={() => {
                                    onChange(name);
                                    setIsOpen(false);
                                }}
                                className={cn(
                                    'p-3 rounded-lg transition-all',
                                    'hover:bg-violet-100 hover:text-violet-700',
                                    'dark:hover:bg-violet-500/20 dark:hover:text-violet-400',
                                    value === name && 'bg-violet-100 text-violet-700 ring-2 ring-violet-500'
                                )}
                                title={name}
                            >
                                {renderIcon(name)}
                            </button>
                        ))}
                    </div>

                    {filteredIcons.length === 0 && (
                        <p className="text-center text-slate-500 py-8">
                            No icons found matching "{searchQuery}"
                        </p>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end gap-2 pt-4 border-t dark:border-slate-800">
                        {value && (
                            <Button
                                variant="outline"
                                onClick={() => {
                                    onChange('');
                                    setIsOpen(false);
                                }}
                            >
                                Remove Icon
                            </Button>
                        )}
                        <Button variant="ghost" onClick={() => setIsOpen(false)}>
                            Cancel
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
}

// Import Plus icon for the picker button
const { Plus } = LucideIcons;
