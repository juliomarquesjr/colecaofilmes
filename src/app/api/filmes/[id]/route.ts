import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

interface RouteParams {
  params: {
    id: string
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