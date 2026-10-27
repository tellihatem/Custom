import { Prisma } from '@prisma/client';

/** An error with an HTTP status that is safe to show to the client. */
export class HttpError extends Error {
    constructor(
        public readonly status: number,
        message: string,
        public readonly details?: unknown
    ) {
        super(message);
    }
}

export const badRequest = (message: string, details?: unknown) => new HttpError(400, message, details);
export const notFound = (resource: string) => new HttpError(404, `${resource} not found`);
export const conflict = (message: string) => new HttpError(409, message);

export function isUniqueViolation(err: unknown): err is Prisma.PrismaClientKnownRequestError {
    return err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002';
}
