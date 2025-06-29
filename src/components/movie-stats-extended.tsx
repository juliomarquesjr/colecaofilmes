import { motion } from "framer-motion";
import {
    CheckCircle2Icon,
    ClockIcon,
    FilmIcon,
    PieChartIcon,
    StarIcon,
    TrendingUpIcon
} from "lucide-react";

interface MovieStatsExtendedProps {
  stats: {
    totalMovies: number;
    watchedMovies: number;
    unwatchedMovies: number;
    watchedPercentage: number;
    topRatedMovies: number;
    recentlyWatched: number;
    mediaTypeStats: Record<string, number>;
    yearStats: Array<{ year: number; count: number }>;
  } | null;
  isLoading?: boolean;
}

export function MovieStatsExtended({ stats, isLoading = false }: MovieStatsExtendedProps) {
  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Skeleton para 6 cards */}
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-zinc-800/50 rounded-lg border border-zinc-700 p-4 animate-pulse">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-zinc-700/50 border border-zinc-600/50">
                <div className="h-5 w-5 bg-zinc-600/50 rounded" />
              </div>
              <div className="h-4 w-16 bg-zinc-600/50 rounded" />
            </div>
            <div className="space-y-2">
              <div className="h-8 w-12 bg-zinc-600/50 rounded" />
              <div className="h-3 w-20 bg-zinc-600/50 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const isComplete = stats.watchedPercentage === 100;
  const topYear = stats.yearStats[0];
  const mostCommonMediaType = Object.entries(stats.mediaTypeStats)
    .sort(([,a], [,b]) => b - a)[0];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {/* Total de Filmes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`bg-gradient-to-br ${
          isComplete 
            ? 'from-indigo-600 to-indigo-800 border-indigo-500/50' 
            : 'from-indigo-950 to-zinc-900 border-indigo-800/30'
        } rounded-lg border p-4`}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className={`p-2 rounded-lg ${
            isComplete 
              ? 'bg-indigo-500/30 border-indigo-400/30' 
              : 'bg-indigo-900/30 border-indigo-800/30'
          } border`}>
            <FilmIcon className={`h-5 w-5 ${
              isComplete ? 'text-indigo-300' : 'text-indigo-400'
            }`} />
          </div>
          <span className={`text-sm font-medium ${
            isComplete ? 'text-indigo-200' : 'text-zinc-400'
          }`}>Total</span>
        </div>
        <div className="space-y-1">
          <h3 className={`text-3xl font-bold ${
            isComplete ? 'text-indigo-200' : 'text-white'
          }`}>{stats.totalMovies}</h3>
          <p className={`text-xs ${
            isComplete ? 'text-indigo-300' : 'text-zinc-500'
          }`}>filmes na coleção</p>
        </div>
      </motion.div>

      {/* Filmes Assistidos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className={`bg-gradient-to-br ${
          isComplete 
            ? 'from-emerald-600 to-emerald-800 border-emerald-500/50' 
            : 'from-emerald-950 to-zinc-900 border-emerald-800/30'
        } rounded-lg border p-4`}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className={`p-2 rounded-lg ${
            isComplete 
              ? 'bg-emerald-500/30 border-emerald-400/30' 
              : 'bg-emerald-900/30 border-emerald-800/30'
          } border`}>
            <CheckCircle2Icon className={`h-5 w-5 ${
              isComplete ? 'text-emerald-300' : 'text-emerald-400'
            }`} />
          </div>
          <span className={`text-sm font-medium ${
            isComplete ? 'text-emerald-200' : 'text-zinc-400'
          }`}>Assistidos</span>
        </div>
        <div className="space-y-1">
          <h3 className={`text-3xl font-bold ${
            isComplete ? 'text-emerald-200' : 'text-white'
          }`}>{stats.watchedMovies}</h3>
          <p className={`text-xs ${
            isComplete ? 'text-emerald-300' : 'text-zinc-500'
          }`}>{stats.watchedPercentage}% da coleção</p>
        </div>
      </motion.div>

      {/* Filmes com Alta Avaliação */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-gradient-to-br from-amber-950 to-zinc-900 border-amber-800/30 rounded-lg border p-4"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-lg bg-amber-900/30 border-amber-800/30 border">
            <StarIcon className="h-5 w-5 text-amber-400" />
          </div>
          <span className="text-sm font-medium text-zinc-400">Top Rated</span>
        </div>
        <div className="space-y-1">
          <h3 className="text-3xl font-bold text-white">{stats.topRatedMovies}</h3>
          <p className="text-xs text-zinc-500">nota ≥ 8.0</p>
        </div>
      </motion.div>

      {/* Assistidos Recentemente */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-gradient-to-br from-purple-950 to-zinc-900 border-purple-800/30 rounded-lg border p-4"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-lg bg-purple-900/30 border-purple-800/30 border">
            <ClockIcon className="h-5 w-5 text-purple-400" />
          </div>
          <span className="text-sm font-medium text-zinc-400">Recentes</span>
        </div>
        <div className="space-y-1">
          <h3 className="text-3xl font-bold text-white">{stats.recentlyWatched}</h3>
          <p className="text-xs text-zinc-500">últimos 30 dias</p>
        </div>
      </motion.div>

      {/* Ano com Mais Filmes */}
      {topYear && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-gradient-to-br from-cyan-950 to-zinc-900 border-cyan-800/30 rounded-lg border p-4"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-cyan-900/30 border-cyan-800/30 border">
              <TrendingUpIcon className="h-5 w-5 text-cyan-400" />
            </div>
            <span className="text-sm font-medium text-zinc-400">Top Ano</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-bold text-white">{topYear.year}</h3>
            <p className="text-xs text-zinc-500">{topYear.count} filmes</p>
          </div>
        </motion.div>
      )}

      {/* Mídia Mais Comum */}
      {mostCommonMediaType && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-gradient-to-br from-rose-950 to-zinc-900 border-rose-800/30 rounded-lg border p-4"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-rose-900/30 border-rose-800/30 border">
              <PieChartIcon className="h-5 w-5 text-rose-400" />
            </div>
            <span className="text-sm font-medium text-zinc-400">Mídia</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-white">{mostCommonMediaType[0]}</h3>
            <p className="text-xs text-zinc-500">{mostCommonMediaType[1]} filmes</p>
          </div>
        </motion.div>
      )}
    </div>
  );
} 