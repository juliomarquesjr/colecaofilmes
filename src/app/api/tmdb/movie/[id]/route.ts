import { NextResponse } from 'next/server';

const TMDB_ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN;
const TMDB_API_URL = 'https://api.themoviedb.org/3';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const movieId = params.id;

    // Buscar detalhes completos do filme
    const response = await fetch(
      `${TMDB_API_URL}/movie/${movieId}?language=pt-BR`,
      {
        headers: {
          'Authorization': `Bearer ${TMDB_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        next: { revalidate: 60 }
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('Erro TMDB:', error);
      throw new Error('Erro ao buscar detalhes do filme');
    }

    const data = await response.json();
    
    // Log para debug
    console.log(`Detalhes do filme ${movieId}:`, {
      id: data.id,
      title: data.title,
      runtime: data.runtime,
      original_language: data.original_language,
      production_countries: data.production_countries,
      release_date: data.release_date
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro ao buscar detalhes do filme:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar detalhes do filme' },
      { status: 500 }
    );
  }
} 