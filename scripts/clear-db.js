const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const connectionString = `${process.env.DATABASE_URL}`.replace(
    'prisma+postgres://',
    'postgresql://'
);

const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false }
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    try {
        console.log('Deleting all websites temporarily to clear corrupted data...');
        const deleted = await prisma.website.deleteMany({});
        console.log(`Deleted ${deleted.count} websites.`);
    } catch (e) {
        console.error('Error details:', JSON.stringify(e, null, 2));
        if (e.meta && e.meta.driverAdapterError && e.meta.driverAdapterError.cause) {
            console.error('Driver Adapter Cause:', e.meta.driverAdapterError.cause);
        }
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
