import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    // 1. ตรวจสอบว่าชื่อผู้ใช้นี้มีอยู่ใน MySQL หรือยัง
    const existingUser = await prisma.user.findUnique({
      where: { username: username },
    });

    // 2. ถ้าเจอชื่อซ้ำ ให้ส่ง Error กลับไป
    if (existingUser) {
      return NextResponse.json(
        { message: "ชื่อผู้ใช้นี้มีคนใช้แล้ว" },
        { status: 400 }
      );
    }

    // 3. ถ้าไม่ซ้ำ ให้บันทึกข้อมูลใหม่ลงตาราง User

    const newUser = await prisma.user.create({
      data: {
        username,
        password, // ในงานจริงควรใช้ bcrypt เข้ารหัสรหัสผ่านด้วยครับ
        role: "USER",
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล" },
      { status: 500 }
    );
  }
}