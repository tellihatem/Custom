'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Input } from './Input';
import { Modal } from './Modal';
import { Button } from './Button';
import { Pipette, Check } from 'lucide-react';

interface ColorPickerProps {
    value: string;
    onChange: (color: string) => void;
    label?: string;
    className?: string;
    presets?: string[];
}

const defaultPresets = [
    // Neutrals
    '#ffffff', '#f8fafc', '#e2e8f0', '#94a3b8', '#475569', '#1e293b', '#0f172a', '#000000',
    // Primary colors
    '#ef4444', '#f97316', '#eab308', '#22c55e', '#14b8a6', '#3b82f6', '#8b5cf6', '#ec4899',
    // Vibrant
    '#dc2626', '#ea580c', '#ca8a04', '#16a34a', '#0d9488', '#2563eb', '#7c3aed', '#db2777',
    // Pastel
    '#fecaca', '#fed7aa', '#fef08a', '#bbf7d0', '#99f6e4', '#bfdbfe', '#ddd6fe', '#fbcfe8',
];

export function ColorPicker({
    value,
    onChange,
    label,
    className,
    presets = defaultPresets,
}: ColorPickerProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState(value);

    React.useEffect(() => {
        setInputValue(value);
    }, [value]);

    const handleInputChange = (newValue: string) => {
        setInputValue(newValue);
        // Validate hex color
        if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(newValue)) {
            onChange(newValue);
        }
    };

    const handlePresetClick = (color: string) => {
        onChange(color);
        setInputValue(color);
    };

    return (
        <div className={className}>
            {label && (
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    {label}
                </label>
            )}

            <button
                onClick={() => setIsOpen(true)}
                className={cn(
                    'w-full flex items-center gap-3 p-2 rounded-xl border border-slate-200',
                    'hover:border-violet-500 transition-colors',
                    'dark:border-slate-700 dark:hover:border-violet-500'
                )}
            >
                <div
                    className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-600"
                    style={{ backgroundColor: value }}
                />
                <span className="text-sm font-mono text-slate-600 dark:text-slate-400 uppercase">
                    {value}
                </span>
                <Pipette className="w-4 h-4 text-slate-400 ml-auto" />
            </button>

            <Modal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title="Choose Color"
                size="sm"
            >
                <div className="space-y-4">
                    {/* Color Preview */}
                    <div
                        className="w-full h-24 rounded-xl border border-slate-200 dark:border-slate-700"
                        style={{ backgroundColor: inputValue }}
                    />

                    {/* Hex Input */}
                    <Input
                        label="Hex Color"
                        value={inputValue}
                        onChange={(e) => handleInputChange(e.target.value)}
                        placeholder="#000000"
                        className="font-mono uppercase"
                    />

                    {/* Color Presets */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Presets
                        </label>
                        <div className="grid grid-cols-8 gap-2">
                            {presets.map((color) => (
                                <button
                                    key={color}
                                    onClick={() => handlePresetClick(color)}
                                    className={cn(
                                        'w-8 h-8 rounded-lg border-2 transition-transform hover:scale-110',
                                        'relative flex items-center justify-center',
                                        value === color
                                            ? 'border-violet-500 ring-2 ring-violet-500 ring-offset-2'
                                            : 'border-transparent'
                                    )}
                                    style={{ backgroundColor: color }}
                                    title={color}
                                >
                                    {value === color && (
                                        <Check
                                            className={cn(
                                                'w-4 h-4',
                                                isLightColor(color) ? 'text-slate-900' : 'text-white'
                                            )}
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-2 pt-4 border-t dark:border-slate-800">
                        <Button variant="ghost" onClick={() => setIsOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={() => setIsOpen(false)}>
                            Apply
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

// Helper to determine if a color is light
function isLightColor(hex: string): boolean {
    const color = hex.replace('#', '');
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5;
}
