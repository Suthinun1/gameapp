import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: List all users (for Admin)
export async function GET() {
    try {
        // Use raw query to bypass Prisma Client validation if it's outdated
        const users = await prisma.$queryRaw`SELECT id, username, role, points FROM User ORDER BY id ASC`;

        // Ensure points is a number (sometimes raw query returns BigInt or strings depending on driver)
        const formattedUsers = (users as any[]).map(u => ({
            ...u,
            points: Number(u.points || 0)
        }));

        return NextResponse.json(formattedUsers);
    } catch (error) {
        console.error("Failed to fetch users (Raw):", error);
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}

// PUT: Update user points
export async function PUT(req: Request) {
    try {
        const { userId, points } = await req.json();

        // Use executeRaw to update points directly, avoiding Prisma Client schema mismatch
        await prisma.$executeRaw`UPDATE User SET points = ${parseInt(points)} WHERE id = ${userId}`;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to update points:", error);
        return NextResponse.json({ error: "Failed to update points" }, { status: 500 });
    }
}
