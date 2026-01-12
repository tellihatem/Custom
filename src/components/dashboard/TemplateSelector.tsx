'use client';

import { templates } from '@/lib/templates/config';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface TemplateSelectorProps {
    selectedTemplateId: string;
    onSelect: (id: string) => void;
}

export function TemplateSelector({ selectedTemplateId, onSelect }: TemplateSelectorProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-2">
            {templates.map((template) => (
                <div
                    key={template.id}
                    className={cn(
                        'group relative rounded-xl border-2 overflow-hidden cursor-pointer transition-all hover:border-violet-500 hover:shadow-lg bg-white dark:bg-slate-950',
                        selectedTemplateId === template.id
                            ? 'border-violet-600 ring-2 ring-violet-200 dark:ring-violet-900'
                            : 'border-slate-200 dark:border-slate-800'
                    )}
                    onClick={() => onSelect(template.id)}
                >
                    <div className="aspect-video bg-slate-100 dark:bg-slate-900 relative">
                        {/* Placeholder logic until real images are added */}
                        <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-medium z-0">
                            {template.name} Preview
                        </div>

                        <img
                            src={template.previewImage}
                            alt={template.name}
                            className="w-full h-full object-cover relative z-10"
                            onError={(e) => (e.currentTarget.style.display = 'none')}
                        />

                        {selectedTemplateId === template.id && (
                            <div className="absolute inset-0 bg-violet-500/10 z-20 flex items-center justify-center">
                                <div className="bg-violet-600 text-white p-2 rounded-full shadow-lg">
                                    <Check className="w-5 h-5" />
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="p-4">
                        <h3 className="font-medium text-slate-900 dark:text-slate-100">
                            {template.name}
                        </h3>
                        <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                            {template.description}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
