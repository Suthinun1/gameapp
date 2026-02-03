import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const { username, password } = await req.json();

        // Use raw query to bypass outdated Prisma Client
        const users = await prisma.$queryRaw`SELECT * FROM User WHERE username = ${username} LIMIT 1`;
        const user = Array.isArray(users) ? (users as any[])[0] : null;

        if (!user || user.password !== password) {
            return NextResponse.json(
                { message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" },
                { status: 401 }
            );
        }

        // ✅ ถ้าล็อกอินผ่าน (มีชื่อนี้ใน MySQL และรหัสตรงกัน)
        return NextResponse.json({
            username: user.username,
            role: user.role,
            points: Number(user.points || 0),
        });
    } catch (error) {
        return NextResponse.json(
            { message: "Server Error" },
            { status: 500 }
        );
    }
}
