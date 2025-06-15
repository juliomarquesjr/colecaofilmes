import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { z } from "zod"

const genreSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
})

export async function GET() {
  try {
    const genres = await prisma.genre.findMany({
      orderBy: { name: "asc" },
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
    const normalizedName = name.trim().toLowerCase()

    // Busca todos os gêneros e faz a comparação case-insensitive manualmente
    const allGenres = await prisma.genre.findMany()
    const existingGenre = allGenres.find(
      genre => genre.name.toLowerCase() === normalizedName
    )

    if (existingGenre) {
      return NextResponse.json(
        { error: "Já existe uma categoria com este nome" },
        { status: 400 }
      )
    }

    const genre = await prisma.genre.create({
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

    console.error("Erro ao criar categoria:", error)
    return NextResponse.json(
      { error: "Erro ao criar categoria" },
      { status: 500 }
    )
  }
} 