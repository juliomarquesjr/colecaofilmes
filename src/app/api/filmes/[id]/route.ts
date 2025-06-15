import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'

interface RouteParams {
  params: {
    id: string
  }
}

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
  trailerUrl: z.string().url('URL do trailer inválida').optional(),
  runtime: z.number().int().min(1, 'Duração inválida').optional(),
  country: z.string().min(1, 'País de origem obrigatório'),
  countryFlag: z.string().optional(),
  originalLanguage: z.string().min(1, 'Idioma original obrigatório'),
})

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      )
    }

    const movie = await prisma.movie.findUnique({
      where: { 
        id,
        deletedAt: null 
      },
      include: {
        genres: true
      }
    })

    if (!movie) {
      return NextResponse.json(
        { error: 'Filme não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(movie)
  } catch (error) {
    console.error('Erro ao buscar filme:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar filme' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      )
    }

    // Verifica se o filme existe
    const existingMovie = await prisma.movie.findUnique({
      where: { 
        id,
        deletedAt: null 
      },
      include: {
        genres: true
      }
    })

    if (!existingMovie) {
      return NextResponse.json(
        { error: 'Filme não encontrado' },
        { status: 404 }
      )
    }

    const data = await request.json()
    const validatedData = filmeSchema.parse({
      ...data,
      genreId: data.genreId ? parseInt(data.genreId) : undefined
    })

    // Atualiza o filme
    const movie = await prisma.movie.update({
      where: { id },
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
        trailerUrl: validatedData.trailerUrl,
        runtime: validatedData.runtime,
        country: validatedData.country,
        countryFlag: validatedData.countryFlag,
        originalLanguage: validatedData.originalLanguage,
        genres: {
          set: [], // Remove todos os gêneros existentes
          connect: validatedData.genreId ? [{ id: validatedData.genreId }] : []
        }
      },
      include: {
        genres: true
      }
    })

    return NextResponse.json(movie)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Erro ao atualizar filme:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar filme' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      )
    }

    // Verifica se o filme existe
    const movie = await prisma.movie.findUnique({
      where: { id },
    })

    if (!movie) {
      return NextResponse.json(
        { error: 'Filme não encontrado' },
        { status: 404 }
      )
    }

    // Realiza a remoção lógica
    await prisma.movie.update({
      where: { id },
      data: { deletedAt: new Date() },
    })

    return NextResponse.json({ message: 'Filme excluído com sucesso' })
  } catch (error) {
    console.error('Erro ao excluir filme:', error)
    return NextResponse.json(
      { error: 'Erro ao excluir filme' },
      { status: 500 }
    )
  }
} 