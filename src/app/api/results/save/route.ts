import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
    try {
        const { userId, prediction, mode } = await req.json();

        if (!userId || !prediction) {
            return NextResponse.json({ error: 'Missing data' }, { status: 400 });
        }

        // Create a new session with the prediction
        const session = await db.session.create({
            data: {
                userId,
                mode: mode || "STANDARD",
                prediction: {
                    create: {
                        leftEyeEst: prediction.leftEye,
                        rightEyeEst: prediction.rightEye,
                        confidence: prediction.confidence || "Medium",
                    }
                }
            },
            include: {
                prediction: true
            }
        });

        return NextResponse.json({ success: true, session });

    } catch (error) {
        console.error('Save result error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
