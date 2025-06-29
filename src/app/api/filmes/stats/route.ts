import { prisma } from "@/lib/prisma";
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Executa todas as consultas em paralelo para melhor performance
    const [
      totalMovies,
      watchedMovies,
      moviesByMediaType,
      moviesByYear,
      topRatedMovies,
      recentlyWatched
    ] = await prisma.$transaction([
      // Total de filmes (não deletados)
      prisma.movie.count({
        where: {
          deletedAt: null
        }
      }),
      
      // Filmes assistidos
      prisma.movie.count({
        where: {
          deletedAt: null,
          watchedAt: { not: null }
        }
      }),
      
      // Filmes por tipo de mídia
      prisma.movie.groupBy({
        by: ['mediaType'],
        where: {
          deletedAt: null
        },
        _count: {
          id: true
        },
        orderBy: {
          _count: {
            id: 'desc'
          }
        }
      }),
      
      // Filmes por ano (últimos 10 anos com mais filmes)
      prisma.movie.groupBy({
        by: ['year'],
        where: {
          deletedAt: null
        },
        _count: {
          id: true
        },
        orderBy: {
          _count: {
            id: 'desc'
          }
        },
        take: 10
      }),
      
      // Filmes com melhor avaliação (com nota >= 8)
      prisma.movie.count({
        where: {
          deletedAt: null,
          rating: {
            gte: 8
          }
        }
      }),
      
      // Filmes assistidos recentemente (últimos 30 dias)
      prisma.movie.count({
        where: {
          deletedAt: null,
          watchedAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 dias atrás
          }
        }
      })
    ]);

    // Calcula estatísticas derivadas
    const watchedPercentage = totalMovies > 0 
      ? Math.round((watchedMovies / totalMovies) * 100) 
      : 0;
    
    const unwatchedMovies = totalMovies - watchedMovies;

    // Organiza dados por tipo de mídia em um formato mais útil
    const mediaTypeStats = moviesByMediaType.reduce((acc, item) => {
      const count = typeof item._count === 'object' && item._count ? item._count.id : 0;
      acc[item.mediaType] = count || 0;
      return acc;
    }, {} as Record<string, number>);

    // Organiza dados por ano
    const yearStats = moviesByYear.map(item => {
      const count = typeof item._count === 'object' && item._count ? item._count.id : 0;
      return {
        year: item.year,
        count: count || 0
      };
    });

    const stats = {
      // Estatísticas principais (para os cards)
      totalMovies,
      watchedMovies,
      unwatchedMovies,
      watchedPercentage,
      
      // Estatísticas adicionais
      topRatedMovies,
      recentlyWatched,
      
      // Distribuição por tipo de mídia
      mediaTypeStats,
      
      // Distribuição por ano
      yearStats,
      
      // Metadados
      lastUpdated: new Date().toISOString()
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Erro ao buscar estatísticas dos filmes:', error);
    return NextResponse.json(
      { error: "Erro ao buscar estatísticas dos filmes" },
      { status: 500 }
    );
  }
} 