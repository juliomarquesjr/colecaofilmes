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
  genreIds: z.array(z.number()).min(1, 'Selecione pelo menos um gênero'),
  uniqueCode: z.string().length(8, 'Código único deve ter 8 caracteres'),
  trailerUrl: z.string().url('URL do trailer inválida').optional(),
  runtime: z.number().int().min(1, 'Duração inválida').optional(),
  country: z.string().min(1, 'País de origem obrigatório'),
  countryFlag: z.string().optional(),
  originalLanguage: z.string().min(1, 'Idioma original obrigatório'),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const unwatched = searchParams.get("unwatched") === "true";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;

    const whereClause = {
      deletedAt: null,
      watchedAt: unwatched ? null : undefined,
    };

    const [movies, totalMovies] = await prisma.$transaction([
      prisma.movie.findMany({
        where: whereClause,
        include: {
          genres: true,
        },
        orderBy: {
          title: "asc",
        },
        take: limit,
        skip: skip,
      }),
      prisma.movie.count({
        where: whereClause,
      }),
    ]);

    return NextResponse.json({ movies, totalMovies });
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
      genreIds: Array.isArray(data.genreIds) ? data.genreIds.map((id: any) => parseInt(id as string)) : []
    });

    // Verifica se o código já existe
    const existingMovie = await prisma.movie.findUnique({
      where: { uniqueCode: validatedData.uniqueCode },
    });

    if (existingMovie) {
      return NextResponse.json(
        { error: "Código único já existe" },
        { status: 400 }
      );
    }

    const movie = await prisma.movie.create({
      data: {
        uniqueCode: validatedData.uniqueCode,
        title: validatedData.title,
        originalTitle: validatedData.originalTitle,
        overview: validatedData.overview,
        year: validatedData.year,
        mediaType: validatedData.mediaType,
        shelfCode: validatedData.shelfCode,
        coverUrl: validatedData.coverUrl,
        productionInfo: validatedData.productionInfo,
        rating: validatedData.rating,
        trailerUrl: validatedData.trailerUrl,
        runtime: validatedData.runtime,
        country: validatedData.country,
        countryFlag: validatedData.countryFlag,
        originalLanguage: validatedData.originalLanguage,
        genres: {
          connect: validatedData.genreIds.map(id => ({ id }))
        },
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