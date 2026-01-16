
import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { db } from "@/lib/db";

// Use environment variable for Client ID
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);

export async function POST(req: NextRequest) {
    try {
        const { token } = await req.json();

        if (!token) {
            return NextResponse.json({ success: false, error: "Missing token" }, { status: 400 });
        }

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,
        });

        const payload = ticket.getPayload();

        if (!payload || !payload.email) {
            return NextResponse.json({ success: false, error: "Invalid token payload" }, { status: 400 });
        }

        const { email, name, picture } = payload;

        // Find or Create User
        let user = await db.user.findUnique({ where: { email } });

        if (!user) {
            user = await db.user.create({
                data: {
                    email,
                    name: name || "Google User",
                    image: picture,
                    password: "GOOGLE_MANUAL_AUTH", // Placeholder
                }
            });
        } else {
            // Optional: Update image if changed
            if (picture && user.image !== picture) {
                user = await db.user.update({
                    where: { email },
                    data: { image: picture }
                });
            }
        }

        return NextResponse.json({ success: true, user });

    } catch (error: any) {
        console.error("Google verify error:", error);
        return NextResponse.json({ success: false, error: error.message || "Verification failed" }, { status: 401 });
    }
}
