import { prisma } from "@/lib/prisma";
import { generateUniqueCode } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    let uniqueCode;
    let existingMovie;
    
    do {
      uniqueCode = generateUniqueCode();
      existingMovie = await prisma.movie.findUnique({
        where: { uniqueCode },
      });
    } while (existingMovie);

    return NextResponse.json({ uniqueCode });
  } catch (error) {
    console.error('Erro ao gerar código:', error);
    return NextResponse.json(
      { error: "Erro ao gerar código único" },
      { status: 500 }
    );
  }
} 