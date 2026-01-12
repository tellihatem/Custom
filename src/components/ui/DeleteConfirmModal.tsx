'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Loader2, AlertTriangle } from 'lucide-react';

interface DeleteConfirmModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => Promise<void>;
    title?: string;
    description?: string;
}

export function DeleteConfirmModal({
    open,
    onOpenChange,
    onConfirm,
    title = 'Are you sure?',
    description = 'This action cannot be undone. This will permanently delete this website and all its data.',
}: DeleteConfirmModalProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleConfirm = async () => {
        setIsDeleting(true);
        try {
            await onConfirm();
            onOpenChange(false);
        } catch (error) {
            console.error('Delete error:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Modal
            isOpen={open}
            onClose={() => !isDeleting && onOpenChange(false)}
            title={title}
            description={description}
            size="sm"
        >
            <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>

                <div className="flex justify-center gap-3 mt-6 w-full">
                    <Button
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        disabled={isDeleting}
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="danger"
                        onClick={handleConfirm}
                        disabled={isDeleting}
                        className="flex-1"
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            'Delete Forever'
                        )}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
