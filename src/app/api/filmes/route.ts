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
  rating: z.number().min(0).max(10).optional(),
  genreId: z.number().optional(),
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
    const data = await request.json();
    const validatedData = filmeSchema.parse({
      ...data,
      genreId: data.genreId ? parseInt(data.genreId) : undefined
    });

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
        rating: validatedData.rating,
        genres: validatedData.genreId ? {
          connect: [{ id: validatedData.genreId }]
        } : undefined,
      },
      include: {
        genres: true,
      },
    });

    return NextResponse.json(movie);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('Erro ao criar filme:', error);
    return NextResponse.json(
      { error: "Erro ao criar filme" },
      { status: 500 }
    );
  }
} 