export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10MB

export const IMAGE_TYPES = {
    png: 'image/png',
    jpg: 'image/jpeg',
    gif: 'image/gif',
    webp: 'image/webp',
} as const;

export type ImageExtension = keyof typeof IMAGE_TYPES;

/**
 * Detect the image type from the file's magic bytes rather than trusting the
 * client-supplied name or MIME type. SVG is deliberately unsupported: it can
 * carry scripts and we serve uploads from the app's own origin.
 */
export function detectImageType(data: Buffer): ImageExtension | null {
    const startsWith = (bytes: number[], offset = 0) =>
        data.length >= offset + bytes.length && bytes.every((b, i) => data[offset + i] === b);

    if (startsWith([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return 'png';
    if (startsWith([0xff, 0xd8, 0xff])) return 'jpg';
    if (startsWith([0x47, 0x49, 0x46, 0x38])) return 'gif'; // "GIF8"
    if (startsWith([0x52, 0x49, 0x46, 0x46]) && startsWith([0x57, 0x45, 0x42, 0x50], 8)) return 'webp'; // "RIFF....WEBP"
    return null;
}
