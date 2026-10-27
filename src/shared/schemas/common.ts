import { z } from 'zod';

/** Max serialized size of a single JSON blob (section content, theme, …). */
const MAX_JSON_BYTES = 256 * 1024;

/**
 * A JSON object column (content, style, themeConfig, …). The shape is not
 * validated here — per-section-type schemas come with the section registry —
 * but it must be a plain object and stay within a sane size.
 */
export const jsonObject = z
    .record(z.string(), z.unknown())
    .refine((value) => JSON.stringify(value).length <= MAX_JSON_BYTES, {
        message: `Must be at most ${MAX_JSON_BYTES / 1024}KB when serialized`,
    });

export const name = z.string().trim().min(1, 'Name is required').max(100);
