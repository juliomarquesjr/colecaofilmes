import { prisma } from "@/lib/prisma";
import { NextResponse } from 'next/server';
import { z } from 'zod';

const filmeSchema = z.object({
  title: z.string().min(1, 'Título obrigatório'),
  originalTitle: z.string().optional(),
  overview: z.string().optional(),
  year: z.number().int().min(1900, 'Ano inválido'),
  mediaType: z.enum(['DVD', 'BluRay', 'VHS']),
  shelfCode: z.string().min(1, 'Código da estante obrigatório'),
  coverUrl: z.string().url('URL da capa inválida'),
  productionInfo: z.string().min(1, 'Informação de produção obrigatória'),
  genreIds: z.array(z.number()).optional(),
});

export async function GET() {
  try {
    const movies = await prisma.movie.findMany({
      where: {
        deletedAt: null,
      },
      include: {
        genres: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(movies);
  } catch (error) {
    console.error('Erro ao buscar filmes:', error);
    return NextResponse.json(
      { error: "Erro ao buscar filmes" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Valida os dados recebidos
    const validatedData = filmeSchema.parse(body);

    const movie = await prisma.movie.create({
      data: {
        title: validatedData.title,
        originalTitle: validatedData.originalTitle,
        overview: validatedData.overview,
        year: validatedData.year,
        mediaType: validatedData.mediaType,
        shelfCode: validatedData.shelfCode,
        coverUrl: validatedData.coverUrl,
        productionInfo: validatedData.productionInfo,
        genres: validatedData.genreIds ? {
          connect: validatedData.genreIds.map(id => ({ id }))
        } : undefined,
      },
      include: {
        genres: true,
      },
    });

    return NextResponse.json(movie);
  } catch (error) {
    console.error('Erro ao cadastrar filme:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Erro ao cadastrar filme" },
      { status: 500 }
    );
  }
} 