import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const { gameId, username } = await req.json();

        // 1. Find User (Raw)
        const users = await prisma.$queryRaw`SELECT * FROM User WHERE username = ${username} LIMIT 1`;
        const user = Array.isArray(users) ? (users as any[])[0] : null;

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // 2. Find Game
        const game = await prisma.game.findUnique({
            where: { id: parseInt(gameId) }
        });

        if (!game) {
            return NextResponse.json({ error: "Game not found" }, { status: 404 });
        }

        // 3. Check Points
        const currentPoints = Number(user.points || 0);
        if (currentPoints < game.price) {
            return NextResponse.json({
                error: "Points not enough",
                currentPoints: currentPoints,
                requiredPoints: game.price
            }, { status: 400 });
        }

        // 4. Transaction (Reduce Points -> Mark Sold)
        // Manual "Transaction"
        const newPoints = currentPoints - game.price;

        // Force update points via Raw SQL
        await prisma.$executeRaw`UPDATE User SET points = ${newPoints} WHERE id = ${user.id}`;

        // Soft Delete (Mark as Sold) instead of hard delete
        // This allows us to track sales in the dashboard
        // We use '1' for TRUE to be safe with all MySQL drivers in raw mode
        await prisma.$executeRaw`UPDATE Game SET isSold = 1 WHERE id = ${game.id}`;

        return NextResponse.json({ message: "Purchase successful" });

    } catch (error) {
        console.error("Purchase error:", error);
        return NextResponse.json({ error: "Transaction failed" }, { status: 500 });
    }
}
