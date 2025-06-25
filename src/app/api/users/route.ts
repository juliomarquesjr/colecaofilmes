import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession();
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const users = await prisma.user.findMany({
    where: {
      deletedAt: null
    },
    select: {
      id: true,
      username: true,
      name: true,
      phone: true,
      address: true,
      isAdmin: true
    }
  });

  return NextResponse.json(users);
}

export async function POST(request: Request) {
  const session = await getServerSession();
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const data = await request.json();

    // Verifica se o username já existe
    const existingUser = await prisma.user.findUnique({
      where: {
        username: data.username
      }
    });

    if (existingUser) {
      return new NextResponse(
        JSON.stringify({ message: "Nome de usuário já está em uso" }),
        { status: 400 }
      );
    }

    const hashedPassword = await hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        username: data.username,
        name: data.name,
        phone: data.phone,
        address: data.address,
        password: hashedPassword,
        isAdmin: data.isAdmin
      }
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    return new NextResponse(
      JSON.stringify({ message: "Erro ao criar usuário" }),
      { status: 500 }
    );
  }
} 