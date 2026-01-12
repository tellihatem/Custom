import * as React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'elevated' | 'outlined';
    interactive?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = 'default', interactive = false, ...props }, ref) => {
        const variants = {
            default: 'bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800',
            elevated: 'bg-white dark:bg-slate-900 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50',
            outlined: 'bg-transparent border-2 border-slate-200 dark:border-slate-700',
        };

        return (
            <div
                ref={ref}
                className={cn(
                    'rounded-2xl',
                    variants[variant],
                    interactive && 'cursor-pointer transition-all duration-200 hover:shadow-xl hover:-translate-y-1',
                    className
                )}
                {...props}
            />
        );
    }
);

Card.displayName = 'Card';

const CardHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn('p-6 pb-0', className)}
        {...props}
    />
));

CardHeader.displayName = 'CardHeader';

const CardContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6', className)} {...props} />
));

CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn('p-6 pt-0 flex items-center gap-4', className)}
        {...props}
    />
));

CardFooter.displayName = 'CardFooter';

const CardTitle = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h3
        ref={ref}
        className={cn('text-lg font-semibold text-slate-900 dark:text-slate-100', className)}
        {...props}
    />
));

CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn('text-sm text-slate-500 dark:text-slate-400', className)}
        {...props}
    />
));

CardDescription.displayName = 'CardDescription';

export { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription };
