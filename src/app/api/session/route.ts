import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { calibrationPxMm, leftEye, rightEye } = body;

        // Create anonymous user
        // Create anonymous user
        const guestId = crypto.randomUUID();
        const user = await db.user.create({
            data: {
                email: `guest_${guestId}@vision-test.local`,
                password: "guest_password_placeholder", // Not secure, but fine for guests
                name: "Guest User"
            }
        });

        // Create session
        const session = await db.session.create({
            data: {
                userId: user.id,
                calibrationPxMm: calibrationPxMm,
                prediction: {
                    create: {
                        leftEyeEst: leftEye?.result || "N/A",
                        rightEyeEst: rightEye?.result || "N/A",
                        confidence: "Medium" // Mock
                    }
                },
                // We could also save individual trials if passed
            }
        });

        return NextResponse.json({ success: true, sessionId: session.id });
    } catch (error) {
        console.error('Failed to save session:', error);
        return NextResponse.json({ success: false, error: 'Failed to save' }, { status: 500 });
    }
}
