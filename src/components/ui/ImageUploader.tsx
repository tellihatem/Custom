'use client';

import * as React from 'react';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';

interface ImageUploaderProps {
    value?: string;
    onChange: (url: string) => void;
    className?: string;
    aspectRatio?: 'square' | 'video' | 'wide' | 'portrait' | 'auto';
    placeholder?: string;
}

export function ImageUploader({
    value,
    onChange,
    className,
    aspectRatio = 'auto',
    placeholder = 'Drag & drop an image, or click to select',
}: ImageUploaderProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const uploadFile = useCallback(async (file: File) => {
        setIsUploading(true);
        setError(null);
        setUploadProgress(0);

        try {
            const asset = await uploadAsset(file, setUploadProgress);
            onChange(asset.publicUrl);
        } catch (err) {
            console.error('Upload error:', err);
            setError(err instanceof Error ? err.message : 'Failed to upload image. Please try again.');
        } finally {
            setIsUploading(false);
        }
    }, [onChange]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) uploadFile(file);
    }, [uploadFile]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
        },
        maxSize: 10 * 1024 * 1024, // 10MB
        multiple: false,
    });

    const aspectRatios = {
        square: 'aspect-square',
        video: 'aspect-video',
        wide: 'aspect-[21/9]',
        portrait: 'aspect-[3/4]',
        auto: '',
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange('');
    };

    if (value) {
        return (
            <div className={cn('relative group rounded-xl overflow-hidden', aspectRatios[aspectRatio], className)}>
                <img
                    src={value}
                    alt="Uploaded image"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                        {...getRootProps()}
                        className="p-2 bg-white rounded-lg hover:bg-slate-100 transition-colors"
                    >
                        <input {...getInputProps()} />
                        <Upload className="w-5 h-5 text-slate-700" />
                    </button>
                    <button
                        onClick={handleRemove}
                        className="p-2 bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                    >
                        <X className="w-5 h-5 text-white" />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            {...getRootProps()}
            className={cn(
                'relative border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200',
                'flex flex-col items-center justify-center gap-3 p-8',
                isDragActive
                    ? 'border-violet-500 bg-violet-50 dark:bg-violet-500/10'
                    : 'border-slate-200 hover:border-violet-500 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/50',
                aspectRatios[aspectRatio],
                className
            )}
        >
            <input {...getInputProps()} />

            {isUploading ? (
                <>
                    <Loader2 className="w-10 h-10 text-violet-500 animate-spin" />
                    <div className="w-full max-w-xs">
                        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-violet-500 transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                            />
                        </div>
                        <p className="text-sm text-slate-500 mt-2 text-center">
                            Uploading... {uploadProgress}%
                        </p>
                    </div>
                </>
            ) : (
                <>
                    <div className="w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <ImageIcon className="w-7 h-7 text-slate-400" />
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {isDragActive ? 'Drop the image here' : placeholder}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                            PNG, JPG, GIF, WebP up to 10MB
                        </p>
                    </div>
                </>
            )}

            {error && (
                <p className="text-sm text-red-500 mt-2">{error}</p>
            )}
        </div>
    );
}

/**
 * POST the file to /api/assets. Uses XHR (not fetch) for upload progress.
 */
function uploadAsset(file: File, onProgress: (percent: number) => void) {
    return new Promise<{ publicUrl: string }>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/assets');
        xhr.responseType = 'json';
        xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
        };
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) resolve(xhr.response);
            else reject(new Error(xhr.response?.error ?? 'Failed to upload image. Please try again.'));
        };
        xhr.onerror = () => reject(new Error('Network error while uploading image.'));

        const form = new FormData();
        form.append('file', file);
        xhr.send(form);
    });
}
