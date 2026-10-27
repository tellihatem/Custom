'use client';

import { useState } from 'react';
import { Button } from '@/components/ui';
import type { ButtonProps } from '@/components/ui/Button';
import { CreateWebsiteModal } from '@/components/dashboard/CreateWebsiteModal';
import { ArrowRight } from 'lucide-react';

interface UseTemplateButtonProps extends ButtonProps {
    templateId: string;
}

/** Opens the create-website modal with this template preselected. */
export function UseTemplateButton({ templateId, children, ...buttonProps }: UseTemplateButtonProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button {...buttonProps} onClick={() => setOpen(true)}>
                {children}
                <ArrowRight className="w-4 h-4" />
            </Button>
            <CreateWebsiteModal open={open} onOpenChange={setOpen} initialTemplateId={templateId} />
        </>
    );
}
