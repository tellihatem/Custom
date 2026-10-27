import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { getDatabaseSslMode } from '@/lib/env';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const url = new URL(process.env.DATABASE_URL!);
url.password = encodeURIComponent(url.password);
const connectionString = url.toString();

// DATABASE_SSL: 'disable' for a local/Docker Postgres, 'require' (default)
// for hosted DBs with self-signed certs, 'verify-full' to check the cert.
const sslMode = getDatabaseSslMode();
const ssl =
  sslMode === 'disable' ? false :
  sslMode === 'require' ? { rejectUnauthorized: false } :
  { rejectUnauthorized: true };

const pool = new Pool({ connectionString, ssl });
const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
