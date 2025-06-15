import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { z } from "zod"

const genreSchema = z.object({
  name: z.string().min(1, "Nome do gênero é obrigatório"),
})

export async function GET() {
  try {
    const genres = await prisma.genre.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        name: "asc",
      },
    })

    return NextResponse.json(genres)
  } catch (error) {
    console.error("Erro ao buscar gêneros:", error)
    return NextResponse.json(
      { error: "Erro ao buscar gêneros" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name } = genreSchema.parse(body)

    // Verifica se já existe um gênero com o mesmo nome (case insensitive)
    const normalizedName = name.toLowerCase()
    const existingGenre = await prisma.genre.findFirst({
      where: {
        deletedAt: null,
      },
    })

    // Faz a comparação case insensitive manualmente
    if (existingGenre && existingGenre.name.toLowerCase() === normalizedName) {
      return NextResponse.json(
        { error: "Já existe um gênero com este nome" },
        { status: 400 }
      )
    }

    const genre = await prisma.genre.create({
      data: {
        name,
      },
    })

    return NextResponse.json(genre)
  } catch (error) {
    console.error("Erro ao cadastrar gênero:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Erro ao cadastrar gênero" },
      { status: 500 }
    )
  }
} 