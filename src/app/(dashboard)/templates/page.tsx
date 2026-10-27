import { Card, CardContent } from '@/components/ui';
import { templates } from '@/lib/templates/config';
import { Check } from 'lucide-react';
import { UseTemplateButton } from '@/components/dashboard/UseTemplateButton';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Choose a Template - THODZ Builder',
    description: 'Choose from our collection of professionally designed templates.',
};

const templateGradients: Record<string, string> = {
    'modern-minimal': 'from-slate-100 via-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-900',
    'creative-bold': 'from-violet-400 via-purple-500 to-pink-500',
    'developer-tech': 'from-slate-900 via-emerald-900 to-cyan-900',
    'designer-elegant': 'from-amber-50 via-rose-50 to-slate-50 dark:from-amber-950 dark:via-rose-950 dark:to-slate-900',
    'business-pro': 'from-blue-500 via-indigo-500 to-blue-600',
};

export default function TemplatesPage() {
    return (
        <div className="p-8">
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                    Choose Your Template
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                    Start with a professionally designed template and customize everything to match your style.
                </p>
            </div>

            {/* Templates Grid */}
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {templates.map((template) => (
                    <Card
                        key={template.id}
                        variant="default"
                        className="overflow-hidden group hover:shadow-xl transition-all duration-300"
                    >
                        {/* Preview */}
                        <div className={`aspect-video bg-gradient-to-br ${templateGradients[template.id] || 'from-slate-400 to-slate-600'} relative overflow-hidden`}>
                            {/* Template Preview Content */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className={`text-center ${template.id === 'developer-tech' || template.id === 'creative-bold' ? 'text-white' : 'text-slate-700 dark:text-white'}`}>
                                    <div className="text-2xl font-bold opacity-50">
                                        {template.name}
                                    </div>
                                </div>
                            </div>

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <UseTemplateButton templateId={template.id} size="lg" className="gap-2">
                                    Use This Template
                                </UseTemplateButton>
                            </div>
                        </div>

                        <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                                        {template.name}
                                    </h3>
                                    <span className="text-xs text-slate-500 uppercase tracking-wider">
                                        {template.category}
                                    </span>
                                </div>
                            </div>

                            <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                                {template.description}
                            </p>

                            {/* Features */}
                            <div className="space-y-2">
                                {getTemplateFeatures(template.id).map((feature, index) => (
                                    <div key={index} className="flex items-center gap-2 text-sm text-slate-500">
                                        <Check className="w-4 h-4 text-green-500" />
                                        {feature}
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <UseTemplateButton templateId={template.id} variant="outline" className="w-full gap-2">
                                    Select Template
                                </UseTemplateButton>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Info Section */}
            <div className="mt-16 text-center max-w-2xl mx-auto">
                <p className="text-slate-500 dark:text-slate-400">
                    Don't worry about which template to choose – you can always switch templates later
                    and all your content will be preserved.
                </p>
            </div>
        </div>
    );
}

function getTemplateFeatures(templateId: string): string[] {
    const features: Record<string, string[]> = {
        'modern-minimal': ['Clean typography', 'Lots of whitespace', 'Professional look'],
        'creative-bold': ['Vibrant gradients', 'Dynamic animations', 'Eye-catching design'],
        'developer-tech': ['Dark theme', 'Terminal aesthetics', 'Code-friendly layout'],
        'designer-elegant': ['Image-focused galleries', 'Sophisticated typography', 'Minimal accents'],
        'business-pro': ['Trust-building design', 'Clear hierarchy', 'Professional layout'],
    };
    return features[templateId] || ['Fully customizable', 'Mobile responsive', 'SEO optimized'];
}
