'use client';

import { useEditorStore } from '@/lib/store/editorStore';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    GripVertical,
    Eye,
    EyeOff,
    Trash2,
    Plus,
    Layout,
    User,
    Briefcase,
    FolderKanban,
    Clock,
    Mail,
} from 'lucide-react';
import type { Section, SectionType } from '@/lib/types';

const sectionIcons: Record<SectionType, typeof Layout> = {
    hero: Layout,
    about: User,
    skills: Briefcase,
    projects: FolderKanban,
    experience: Clock,
    contact: Mail,
    gallery: Layout,
    testimonials: Layout,
    cta: Layout,
    custom: Layout,
};

interface SortableItemProps {
    section: Section;
    isSelected: boolean;
    onSelect: () => void;
    onToggleVisibility: () => void;
    onDelete: () => void;
}

function SortableItem({ section, isSelected, onSelect, onToggleVisibility, onDelete }: SortableItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: section.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const Icon = sectionIcons[section.type] || Layout;

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                'flex items-center gap-2 p-3 rounded-lg transition-all',
                'border border-transparent',
                isDragging && 'opacity-50 scale-105 z-50',
                isSelected
                    ? 'bg-violet-50 border-violet-200 dark:bg-violet-500/10 dark:border-violet-500/30'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800',
                !section.visible && 'opacity-50'
            )}
        >
            <button
                {...attributes}
                {...listeners}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-grab active:cursor-grabbing"
            >
                <GripVertical className="w-4 h-4" />
            </button>

            <button
                onClick={onSelect}
                className="flex items-center gap-3 flex-1 text-left"
            >
                <div className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center',
                    isSelected
                        ? 'bg-violet-100 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                )}>
                    <Icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium capitalize">
                    {section.type}
                </span>
            </button>

            <button
                onClick={onToggleVisibility}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                title={section.visible ? 'Hide section' : 'Show section'}
            >
                {section.visible ? (
                    <Eye className="w-4 h-4" />
                ) : (
                    <EyeOff className="w-4 h-4" />
                )}
            </button>

            <button
                onClick={onDelete}
                className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                title="Delete section"
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </div>
    );
}

export function SectionSorter() {
    const {
        currentPage,
        selectedSectionId,
        selectSection,
        reorderSections,
        toggleSectionVisibility,
        deleteSection,
        addSection,
    } = useEditorStore();

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    if (!currentPage?.sections) return null;

    const sortedSections = [...currentPage.sections].sort((a, b) => a.order - b.order);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = sortedSections.findIndex((s) => s.id === active.id);
            const newIndex = sortedSections.findIndex((s) => s.id === over.id);
            const newOrder = arrayMove(sortedSections, oldIndex, newIndex);
            reorderSections(newOrder.map((s) => s.id));
        }
    };

    const sectionTypes: SectionType[] = ['hero', 'about', 'skills', 'projects', 'experience', 'contact'];

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                    Sections
                </h3>
                <div className="relative group">
                    <Button variant="ghost" size="sm" className="gap-1">
                        <Plus className="w-4 h-4" />
                        Add
                    </Button>

                    {/* Add Section Dropdown */}
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                        <div className="p-2">
                            {sectionTypes.map((type) => {
                                const Icon = sectionIcons[type];
                                return (
                                    <button
                                        key={type}
                                        onClick={() => addSection(type)}
                                        className="flex items-center gap-3 w-full px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg dark:text-slate-400 dark:hover:bg-slate-800 capitalize"
                                    >
                                        <Icon className="w-4 h-4" />
                                        {type}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={sortedSections.map((s) => s.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="space-y-1">
                        {sortedSections.map((section) => (
                            <SortableItem
                                key={section.id}
                                section={section}
                                isSelected={selectedSectionId === section.id}
                                onSelect={() => selectSection(section.id)}
                                onToggleVisibility={() => toggleSectionVisibility(section.id)}
                                onDelete={() => deleteSection(section.id)}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            {sortedSections.length === 0 && (
                <div className="text-center py-8 text-sm text-slate-500">
                    No sections yet. Click "Add" to get started.
                </div>
            )}
        </div>
    );
}
