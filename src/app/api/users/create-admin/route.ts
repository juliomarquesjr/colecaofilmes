import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST() {
  // Verifica se já existe algum usuário
  const existingUser = await prisma.user.findFirst();
  if (existingUser) {
    return new NextResponse("Admin user already exists", { status: 400 });
  }

  // Cria o usuário admin inicial
  const hashedPassword = await hash("admin", 10);
  const adminUser = await prisma.user.create({
    data: {
      username: "admin",
      name: "Admin",
      phone: "admin",
      address: "admin",
      password: hashedPassword,
      isAdmin: true
    }
  });

  return NextResponse.json(adminUser);
} 