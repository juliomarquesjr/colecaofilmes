import { prisma } from "@/lib/prisma";
import { generateUniqueCode } from "@/lib/utils";
import { NextResponse } from "next/server";

// Força a rota a ser dinâmica, sem cache
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    let uniqueCode;
    let existingMovie;
    let attempts = 0;
    const maxAttempts = 5;
    
    do {
      attempts++;
      uniqueCode = generateUniqueCode();
      
      try {
        existingMovie = await prisma.movie.findUnique({
          where: { uniqueCode },
        });
      } catch (dbError) {
        console.error('Erro ao verificar existência do código:', dbError);
        return NextResponse.json(
          { error: "Erro ao verificar existência do código no banco de dados" },
          { status: 500 }
        );
      }

      if (attempts >= maxAttempts && existingMovie) {
        return NextResponse.json(
          { error: "Não foi possível gerar um código único após várias tentativas" },
          { status: 500 }
        );
      }
    } while (existingMovie);

    const response = NextResponse.json({ uniqueCode });
    
    // Headers para prevenir cache em todos os níveis
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('Surrogate-Control', 'no-store');
    
    return response;
  } catch (error) {
    console.error('Erro ao gerar código:', error);
    return NextResponse.json(
      { error: "Erro ao gerar código único" },
      { status: 500 }
    );
  }
} 