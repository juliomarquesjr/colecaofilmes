import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession();
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(params.id),
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

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession();
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const data = await request.json();

    // Verifica se o username já existe (exceto para o usuário atual)
    if (data.username) {
      const existingUser = await prisma.user.findFirst({
        where: {
          username: data.username,
          id: {
            not: parseInt(params.id)
          }
        }
      });

      if (existingUser) {
        return new NextResponse(
          JSON.stringify({ message: "Nome de usuário já está em uso" }),
          { status: 400 }
        );
      }
    }

    const updateData: any = {
      username: data.username,
      name: data.name,
      phone: data.phone,
      address: data.address,
      isAdmin: data.isAdmin
    };

    if (data.password) {
      updateData.password = await hash(data.password, 10);
    }

    const user = await prisma.user.update({
      where: {
        id: parseInt(params.id)
      },
      data: updateData
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    return new NextResponse(
      JSON.stringify({ message: "Erro ao atualizar usuário" }),
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession();
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const user = await prisma.user.update({
    where: {
      id: parseInt(params.id)
    },
    data: {
      deletedAt: new Date()
    }
  });

  return NextResponse.json(user);
} 