
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { db as prisma } from "@/lib/db";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider === "google") {
                if (!user.email) return false;

                try {
                    // Check if user exists
                    const existingUser = await prisma.user.findUnique({
                        where: { email: user.email },
                    });

                    if (!existingUser) {
                        // Create user
                        await prisma.user.create({
                            data: {
                                email: user.email,
                                name: user.name || "User",
                                image: user.image,
                                password: "GOOGLE_AUTH_USER", // Placeholder for passwordless users
                            },
                        });
                    }
                    return true;
                } catch (error) {
                    console.error("Error saving google user", error);
                    return false;
                }
            }
            return true;
        },
        async session({ session, token }) {
            // Attach the user ID from our DB to the session
            if (session.user?.email) {
                const dbUser = await prisma.user.findUnique({
                    where: { email: session.user.email },
                });
                if (dbUser) {
                    // @ts-ignore
                    session.user.id = dbUser.id;
                }
            }
            return session;
        },
    },
    pages: {
        signIn: '/login', // Redirect to our custom login page
    },
    session: {
        strategy: "jwt",
    }
};
