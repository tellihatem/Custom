import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, label, error, icon, ...props }, ref) => {
        const id = React.useId();

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={id}
                        className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                    >
                        {label}
                    </label>
                )}
                <div className="relative">
                    {icon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                            {icon}
                        </div>
                    )}
                    <input
                        id={id}
                        type={type}
                        className={cn(
                            'w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900',
                            'placeholder:text-slate-400',
                            'focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent',
                            'disabled:opacity-50 disabled:cursor-not-allowed',
                            'dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100',
                            'transition-all duration-200',
                            icon && 'pl-10',
                            error && 'border-red-500 focus:ring-red-500',
                            className
                        )}
                        ref={ref}
                        {...props}
                    />
                </div>
                {error && (
                    <p className="mt-1.5 text-sm text-red-500">{error}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export { Input };
