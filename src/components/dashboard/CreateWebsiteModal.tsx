'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { TemplateSelector } from '@/components/dashboard/TemplateSelector';
import { templates } from '@/lib/templates/config';
import { cn } from '@/lib/utils';
import { Loader2, Check } from 'lucide-react';

interface CreateWebsiteModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreateWebsiteModal({ open, onOpenChange }: CreateWebsiteModalProps) {
    const router = useRouter();
    const [step, setStep] = useState<1 | 2>(1);
    const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCreate = async () => {
        if (!name.trim()) {
            setError('Please enter a website name');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/websites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    templateId: selectedTemplateId,
                }),
            });

            if (!res.ok) {
                throw new Error('Failed to create website');
            }

            const website = await res.json();

            // Close modal and redirect to editor
            onOpenChange(false);
            router.push(`/editor/${website.id}`);
            router.refresh();
        } catch (err) {
            console.error('Error creating website:', err);
            setError('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleNext = () => {
        if (step === 1 && !selectedTemplateId) {
            setError('Please select a template');
            return;
        }
        setError(null);
        setStep(2);
    };

    const reset = () => {
        setStep(1);
        setSelectedTemplateId('');
        setName('');
        setError(null);
        onOpenChange(false);
    };

    return (
        <Modal
            isOpen={open}
            onClose={() => !isLoading && onOpenChange(false)}
            title={step === 1 ? 'Choose a Template' : 'Name Your Website'}
            description={step === 1
                ? 'Select a starting point for your new portfolio.'
                : 'Give your new website a name to get started.'}
            size="full"
        >
            <div className="flex flex-col h-full max-h-[60vh] overflow-hidden">
                <div className="flex-1 overflow-y-auto min-h-0 p-1">
                    {step === 1 ? (
                        <TemplateSelector
                            selectedTemplateId={selectedTemplateId}
                            onSelect={setSelectedTemplateId}
                        />
                    ) : (
                        <div className="py-6 space-y-4 max-w-md mx-auto">
                            <div className="space-y-2">
                                <Input
                                    id="name"
                                    label="Website Name"
                                    placeholder="My Amazing Portfolio"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    autoFocus
                                />
                                <p className="text-sm text-slate-500">
                                    This will also determine your URL slug.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {error && (
                    <div className="text-sm text-red-500 font-medium mb-4 mt-2">
                        {error}
                    </div>
                )}

                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                    {step === 2 && (
                        <Button variant="outline" onClick={() => setStep(1)} disabled={isLoading}>
                            Back
                        </Button>
                    )}
                    {step === 1 ? (
                        <Button onClick={handleNext} disabled={!selectedTemplateId}>
                            Next
                        </Button>
                    ) : (
                        <Button onClick={handleCreate} disabled={isLoading || !name.trim()}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                'Create Website'
                            )}
                        </Button>
                    )}
                </div>
            </div>
        </Modal>
    );
}
