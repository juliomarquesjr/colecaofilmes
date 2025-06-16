import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    console.log('Recebendo requisição para atualizar status do filme:', params.id);
    
    const id = parseInt(params.id);
    if (isNaN(id)) {
      console.error('ID inválido:', params.id);
      return NextResponse.json(
        { error: "ID inválido" },
        { status: 400 }
      );
    }

    const movie = await prisma.movie.findUnique({
      where: { 
        id,
        deletedAt: null 
      }
    });

    if (!movie) {
      console.error('Filme não encontrado:', id);
      return NextResponse.json(
        { error: "Filme não encontrado" },
        { status: 404 }
      );
    }

    console.log('Status atual do filme:', movie.watchedAt ? 'Assistido' : 'Não assistido');

    // Se o filme já foi assistido, remove a data. Se não, marca como assistido agora
    const updatedMovie = await prisma.movie.update({
      where: { id },
      data: {
        watchedAt: movie.watchedAt ? null : new Date(),
      },
      include: {
        genres: true
      }
    });

    console.log('Filme atualizado com sucesso:', {
      id: updatedMovie.id,
      title: updatedMovie.title,
      watchedAt: updatedMovie.watchedAt
    });

    return NextResponse.json(updatedMovie);
  } catch (error) {
    console.error("Erro ao atualizar status do filme:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar status do filme" },
      { status: 500 }
    );
  }
} 