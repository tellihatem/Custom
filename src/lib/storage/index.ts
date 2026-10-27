import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

/**
 * Where uploaded files live. Only a local-disk driver exists today; an
 * S3/MinIO driver can implement the same interface later.
 */
export interface StorageDriver {
    put(key: string, data: Buffer): Promise<void>;
    get(key: string): Promise<Buffer | null>;
    delete(key: string): Promise<void>;
}

class LocalDiskStorage implements StorageDriver {
    constructor(private readonly root: string) {}

    private resolve(key: string) {
        const fullPath = path.resolve(this.root, key);
        if (!fullPath.startsWith(this.root + path.sep)) {
            throw new Error(`Invalid storage key: ${key}`);
        }
        return fullPath;
    }

    async put(key: string, data: Buffer) {
        const fullPath = this.resolve(key);
        await mkdir(path.dirname(fullPath), { recursive: true });
        await writeFile(fullPath, data, { flag: 'wx' });
    }

    async get(key: string) {
        try {
            return await readFile(this.resolve(key));
        } catch (err) {
            if ((err as NodeJS.ErrnoException).code === 'ENOENT') return null;
            throw err;
        }
    }

    async delete(key: string) {
        await rm(this.resolve(key), { force: true });
    }
}

export const storage: StorageDriver = new LocalDiskStorage(
    path.resolve(process.env.UPLOAD_DIR ?? path.join(process.cwd(), 'data', 'uploads'))
);
