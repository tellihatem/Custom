'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { useEditorStore } from '@/lib/store/editorStore';

interface EditableTextProps {
    value: string;
    onChange: (value: string) => void;
    tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
    className?: string;
    placeholder?: string;
    multiline?: boolean;
    style?: React.CSSProperties;
}

export function EditableText({
    value,
    onChange,
    tag: Tag = 'p',
    className,
    placeholder = 'Click to edit...',
    multiline = false,
    style,
}: EditableTextProps) {
    const isEditing = useEditorStore((state) => state.isEditing);
    const [localValue, setLocalValue] = React.useState(value);
    const [isFocused, setIsFocused] = React.useState(false);
    const inputRef = React.useRef<HTMLTextAreaElement | HTMLInputElement>(null);

    React.useEffect(() => {
        setLocalValue(value);
    }, [value]);

    const handleBlur = () => {
        setIsFocused(false);
        if (localValue !== value) {
            onChange(localValue);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !multiline) {
            e.preventDefault();
            inputRef.current?.blur();
        }
        if (e.key === 'Escape') {
            setLocalValue(value);
            inputRef.current?.blur();
        }
    };

    if (!isEditing) {
        return (
            <Tag className={className} style={style}>
                {value || placeholder}
            </Tag>
        );
    }

    if (isFocused) {
        const InputComponent = multiline ? 'textarea' : 'input';

        return (
            <InputComponent
                ref={inputRef as React.RefObject<HTMLInputElement & HTMLTextAreaElement>}
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className={cn(
                    className,
                    'bg-transparent border-none outline-none resize-none w-full',
                    'ring-2 ring-violet-500 ring-offset-2 rounded-lg',
                    'focus:ring-2 focus:ring-violet-500'
                )}
                style={{ font: 'inherit', letterSpacing: 'inherit', ...style }}
                autoFocus
                rows={multiline ? 3 : undefined}
            />
        );
    }

    return (
        <Tag
            className={cn(
                className,
                'cursor-text relative group',
                'hover:ring-2 hover:ring-violet-500/50 hover:ring-offset-2 rounded-lg transition-all'
            )}
            style={style}
            onClick={() => {
                setIsFocused(true);
                setTimeout(() => inputRef.current?.focus(), 0);
            }}
        >
            {localValue || (
                <span className="text-slate-400 italic">{placeholder}</span>
            )}
            <span className="absolute -top-6 left-0 text-xs text-violet-600 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-slate-900 px-2 py-0.5 rounded shadow-sm">
                Click to edit
            </span>
        </Tag>
    );
}
