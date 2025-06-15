import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { z } from "zod"

const genreSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
})

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const body = await request.json()
    const { name } = genreSchema.parse(body)
    const normalizedName = name.trim().toLowerCase()

    // Busca todos os gêneros e faz a comparação case-insensitive manualmente
    const allGenres = await prisma.genre.findMany()
    const existingGenre = allGenres.find(
      genre => genre.id !== id && genre.name.toLowerCase() === normalizedName
    )

    if (existingGenre) {
      return NextResponse.json(
        { error: "Já existe uma categoria com este nome" },
        { status: 400 }
      )
    }

    const genre = await prisma.genre.update({
      where: { id },
      data: { name: name.trim() },
    })

    return NextResponse.json(genre)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error("Erro ao atualizar categoria:", error)
    return NextResponse.json(
      { error: "Erro ao atualizar categoria" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

    // Verifica se a categoria está sendo usada em algum filme
    const moviesWithGenre = await prisma.movie.findFirst({
      where: {
        genres: {
          some: { id },
        },
      },
    })

    if (moviesWithGenre) {
      return NextResponse.json(
        { error: "Esta categoria está sendo usada em filmes e não pode ser excluída" },
        { status: 400 }
      )
    }

    await prisma.genre.delete({
      where: { id },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Erro ao excluir categoria:", error)
    return NextResponse.json(
      { error: "Erro ao excluir categoria" },
      { status: 500 }
    )
  }
} 