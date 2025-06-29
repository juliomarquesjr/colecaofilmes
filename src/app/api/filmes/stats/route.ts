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
      recentlyWatched,
      moviesByGenre,
      moviesByCountry,
      moviesByLanguage,
      runtimeStats,
      ratingDistribution,
      watchingPatterns
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
      }),

      // Filmes por gênero (Top 10) - versão simplificada
      prisma.genre.findMany({
        where: {
          deletedAt: null
        },
        include: {
          _count: {
            select: {
              movies: {
                where: {
                  deletedAt: null
                }
              }
            }
          }
        },
        orderBy: {
          movies: {
            _count: 'desc'
          }
        },
        take: 10
      }),

      // Filmes por país (Top 10)
      prisma.movie.groupBy({
        by: ['country', 'countryFlag'],
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

      // Filmes por idioma original (Top 10)
      prisma.movie.groupBy({
        by: ['originalLanguage'],
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

      // Estatísticas de duração
      prisma.movie.aggregate({
        where: {
          deletedAt: null,
          runtime: { not: null }
        },
        _avg: {
          runtime: true
        },
        _sum: {
          runtime: true
        },
        _min: {
          runtime: true
        },
        _max: {
          runtime: true
        },
        _count: {
          runtime: true
        }
      }),

      // Distribuição de notas (por faixas)
      prisma.$queryRaw`
        SELECT 
          CASE 
            WHEN rating >= 9 THEN '9.0-10.0'
            WHEN rating >= 8 THEN '8.0-8.9'
            WHEN rating >= 7 THEN '7.0-7.9'
            WHEN rating >= 6 THEN '6.0-6.9'
            WHEN rating >= 5 THEN '5.0-5.9'
            WHEN rating >= 4 THEN '4.0-4.9'
            WHEN rating >= 3 THEN '3.0-3.9'
            WHEN rating >= 2 THEN '2.0-2.9'
            WHEN rating >= 1 THEN '1.0-1.9'
            ELSE '0.0-0.9'
          END as range,
          COUNT(*)::int as count
        FROM "Movie"
        WHERE "deletedAt" IS NULL AND rating IS NOT NULL
        GROUP BY range
        ORDER BY range DESC
      `,

      // Padrões de assistir filmes (por mês dos últimos 12 meses)
      prisma.$queryRaw`
        SELECT 
          TO_CHAR("watchedAt", 'YYYY-MM') as month,
          COUNT(*)::int as count
        FROM "Movie"
        WHERE "deletedAt" IS NULL 
        AND "watchedAt" IS NOT NULL 
        AND "watchedAt" >= NOW() - INTERVAL '12 months'
        GROUP BY month
        ORDER BY month
      `
    ]);

    // Calcula estatísticas derivadas
    const watchedPercentage = totalMovies > 0 
      ? Math.round((watchedMovies / totalMovies) * 100) 
      : 0;
    
    const unwatchedMovies = totalMovies - watchedMovies;

    // Organiza dados por tipo de mídia
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

    // Organiza dados por gênero
    const genreStats = (moviesByGenre as any[])
      .filter(item => item._count.movies > 0) // Só gêneros com filmes
      .map(item => ({
        name: item.name,
        count: item._count.movies
      }));

    // Organiza dados por país
    const countryStats = moviesByCountry.map(item => {
      const count = typeof item._count === 'object' && item._count ? item._count.id : 0;
      return {
        country: item.country,
        flag: item.countryFlag || '🌍',
        count: count || 0
      };
    });

    // Organiza dados por idioma
    const languageStats = moviesByLanguage.map(item => {
      const count = typeof item._count === 'object' && item._count ? item._count.id : 0;
      return {
        language: item.originalLanguage,
        count: count || 0
      };
    });

    // Organiza estatísticas de duração
    const totalRuntimeHours = runtimeStats._sum.runtime ? Math.round(runtimeStats._sum.runtime / 60) : 0;
    const avgRuntime = runtimeStats._avg.runtime ? Math.round(runtimeStats._avg.runtime) : 0;
    const totalWatchedRuntimeHours = watchedMovies > 0 && runtimeStats._sum.runtime 
      ? Math.round((runtimeStats._sum.runtime * watchedMovies / totalMovies) / 60) 
      : 0;

    // Organiza distribuição de notas
    const ratingStats = (ratingDistribution as any[]).map(item => ({
      range: item.range,
      count: item.count
    }));

    // Organiza padrões de assistir
    const watchingPatternsStats = (watchingPatterns as any[]).map(item => ({
      month: item.month,
      count: item.count
    }));

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

      // Novas estatísticas expandidas
      genreStats,
      countryStats,
      languageStats,
      
      // Estatísticas de duração
      runtimeStats: {
        totalHours: totalRuntimeHours,
        totalWatchedHours: totalWatchedRuntimeHours,
        averageMinutes: avgRuntime,
        shortestMinutes: runtimeStats._min.runtime || 0,
        longestMinutes: runtimeStats._max.runtime || 0,
        moviesWithRuntime: runtimeStats._count.runtime || 0
      },

      // Distribuição de notas
      ratingStats,

      // Padrões de assistir
      watchingPatternsStats,
      
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