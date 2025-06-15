import { NextResponse } from 'next/server'

const TMDB_ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN
const TMDB_API_URL = 'https://api.themoviedb.org/3'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query')

    if (!query) {
      return NextResponse.json(
        { error: 'Parâmetro de busca obrigatório' },
        { status: 400 }
      )
    }

    if (!TMDB_ACCESS_TOKEN) {
      return NextResponse.json(
        { error: 'Token de acesso do TMDB não configurado' },
        { status: 500 }
      )
    }

    const response = await fetch(
      `${TMDB_API_URL}/search/movie?query=${encodeURIComponent(query)}&language=pt-BR&include_adult=false`,
      {
        headers: {
          'Authorization': `Bearer ${TMDB_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        next: { revalidate: 60 }
      }
    )

    if (!response.ok) {
      const error = await response.json()
      console.error('Erro TMDB:', error)
      throw new Error('Erro ao buscar no TMDB')
    }

    const data = await response.json()
    
    // Filtra apenas os resultados com data de lançamento e título
    const filteredResults = data.results.filter((movie: any) => 
      movie.release_date && 
      movie.title &&
      movie.release_date.trim() !== '' &&
      !isNaN(new Date(movie.release_date).getTime())
    )

    return NextResponse.json({
      ...data,
      results: filteredResults
    })
  } catch (error) {
    console.error('Erro na busca TMDB:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar filmes' },
      { status: 500 }
    )
  }
} 