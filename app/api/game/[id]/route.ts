import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const targetId = parseInt(id);

    // เปลี่ยนจาก update เป็น delete เพื่อลบออกจาก MySQL ถาวร
    // วิธีนี้รายการจะหายไปจากทั้ง phpMyAdmin และ Prisma Studio ทันทีครับ
    await prisma.game.delete({
      where: { id: targetId },
    });

    return NextResponse.json({ message: "ลบข้อมูลออกจากฐานข้อมูลถาวรสำเร็จ" });
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json(
      { error: "ไม่สามารถลบข้อมูลได้" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { title, price, platform, code, imageUrl } = body;

    const updatedGame = await prisma.game.update({
      where: { id: parseInt(id) },
      data: {
        title,
        price: parseFloat(price),
        platform,
        code,
        imageUrl,
      },
    });

    return NextResponse.json(updatedGame);
  } catch (error) {
    return NextResponse.json({ error: "แก้ไขข้อมูลไม่ได้" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { isSold } = body;

    const updatedGame = await prisma.game.update({
      where: { id: parseInt(id) },
      data: { isSold },
    });

    return NextResponse.json(updatedGame);
  } catch (error) {
    return NextResponse.json({ error: "อัปเดตสถานะไม่ได้" }, { status: 500 });
  }
}