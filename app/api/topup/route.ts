import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const { username, amount } = await req.json();

        if (!username || !amount) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // 1. Find User (Raw)
        const users = await prisma.$queryRaw`SELECT * FROM User WHERE username = ${username} LIMIT 1`;
        const user = Array.isArray(users) ? (users as any[])[0] : null;

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // 2. Process based on Method (Default to CREDIT_CARD/Instant if not specified or 'CREDIT_CARD')
        // The user requested "Instant like credit card", so we prioritize that.
        const paymentMethod = (req as any).method || 'CREDIT_CARD'; // Simple fallback

        if (paymentMethod === 'CREDIT_CARD' || true) { // Force instant for now based on request
            // AUTOMATIC: Add Points + Create APPROVED Request
            const newPoints = Number(user.points || 0) + Number(amount);

            // Update Points
            await prisma.$executeRaw`UPDATE User SET points = ${newPoints} WHERE id = ${user.id}`;

            // Record Transaction
            await prisma.$executeRaw`INSERT INTO TopupRequest (userId, amount, status, createdAt) VALUES (${user.id}, ${amount}, 'APPROVED', NOW())`;

            return NextResponse.json({
                success: true,
                newPoints: newPoints,
                message: `Payment successful! Added ${amount} points instantly.`
            });
        }

        /* 
        // Manual Logic (Disabled/Hidden for now)
        await prisma.$executeRaw`INSERT INTO TopupRequest (userId, amount, status, createdAt) VALUES (${user.id}, ${amount}, 'PENDING', NOW())`;

        return NextResponse.json({ 
            success: true, 
            message: `Request submitted! Please wait for admin approval.`
        });
        */

    } catch (error) {
        console.error("Topup error:", error);
        return NextResponse.json({ error: "Topup failed" }, { status: 500 });
    }
}
