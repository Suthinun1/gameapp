import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: List Pending Requests
export async function GET() {
    try {
        const requests = await prisma.$queryRaw`
      SELECT tr.id, tr.amount, tr.status, tr.createdAt, u.username, u.id as userId
      FROM TopupRequest tr
      JOIN User u ON tr.userId = u.id
      WHERE tr.status = 'PENDING'
      ORDER BY tr.createdAt DESC
    `;
        return NextResponse.json(requests);
    } catch (error) {
        console.error("Error fetching requests:", error);
        return NextResponse.json({ error: "Failed to fetch requests" }, { status: 500 });
    }
}

// PUT: Approve or Reject
export async function PUT(req: Request) {
    try {
        const { requestId, action, userId, amount } = await req.json(); // action: 'APPROVED' | 'REJECTED'

        if (action === 'APPROVED') {
            // Transaction-like safety via Raw SQL
            // 1. Update Request Status
            await prisma.$executeRaw`UPDATE TopupRequest SET status = 'APPROVED' WHERE id = ${requestId}`;

            // 2. Add Points to User
            const user = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${userId} LIMIT 1`;
            const currentPoints = Number((user as any[])[0].points || 0);
            const newPoints = currentPoints + Number(amount);

            await prisma.$executeRaw`UPDATE User SET points = ${newPoints} WHERE id = ${userId}`;

        } else {
            // Reject
            await prisma.$executeRaw`UPDATE TopupRequest SET status = 'REJECTED' WHERE id = ${requestId}`;
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
    }
}
