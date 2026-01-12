
import { startTransition } from 'react';
import prisma from '@/lib/prisma/client';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        await prisma.website.deleteMany({});
        return NextResponse.json({ message: 'Database cleared' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
