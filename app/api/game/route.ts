import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const games = await prisma.game.findMany();
    return NextResponse.json(games);
  } catch (error) {
    return NextResponse.json({ error: "ดึงข้อมูลไม่ได้" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, price, platform, code, imageUrl } = body;

    const newGame = await prisma.game.create({
      data: {
        title,
        price: parseFloat(price),
        platform,
        code,
        imageUrl,
        isSold: false
      },
    });

    return NextResponse.json(newGame, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "เพิ่มข้อมูลไม่ได้" }, { status: 500 });
  }
}