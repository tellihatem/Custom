
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Deleting all websites temporarily to clear corrupted data...');
        const deleted = await prisma.website.deleteMany({});
        console.log(`Deleted ${deleted.count} websites.`);
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
