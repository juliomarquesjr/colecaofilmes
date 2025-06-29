import { useEffect, useState } from 'react';

interface MovieStats {
  totalMovies: number;
  watchedMovies: number;
  unwatchedMovies: number;
  watchedPercentage: number;
  topRatedMovies: number;
  recentlyWatched: number;
  mediaTypeStats: Record<string, number>;
  yearStats: Array<{ year: number; count: number }>;
  
  // Novas estatísticas expandidas
  genreStats: Array<{ name: string; count: number }>;
  countryStats: Array<{ country: string; flag: string; count: number }>;
  languageStats: Array<{ language: string; count: number }>;
  
  // Estatísticas de duração
  runtimeStats: {
    totalHours: number;
    totalWatchedHours: number;
    averageMinutes: number;
    shortestMinutes: number;
    longestMinutes: number;
    moviesWithRuntime: number;
  };
  
  // Distribuição de notas
  ratingStats: Array<{ range: string; count: number }>;
  
  // Padrões de assistir
  watchingPatternsStats: Array<{ month: string; count: number }>;
  
  lastUpdated: string;
}

interface UseMovieStatsReturn {
  stats: MovieStats | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useMovieStats(): UseMovieStatsReturn {
  const [stats, setStats] = useState<MovieStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/filmes/stats');
      
      if (!response.ok) {
        throw new Error('Erro ao carregar estatísticas');
      }
      
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error('Erro ao carregar estatísticas:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    isLoading,
    error,
    refetch: fetchStats
  };
} 