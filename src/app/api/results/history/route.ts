import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
        }

        const sessions = await db.session.findMany({
            where: { userId },
            include: {
                prediction: true
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 20 // Limit to last 20 results
        });

        return NextResponse.json({ sessions });

    } catch (error) {
        console.error('Fetch history error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
