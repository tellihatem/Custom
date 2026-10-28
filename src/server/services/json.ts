import type { Prisma } from '@prisma/client';

/** Zod has already validated these as plain JSON objects. */
export const asJson = (value: Record<string, unknown>) => value as Prisma.InputJsonObject;
