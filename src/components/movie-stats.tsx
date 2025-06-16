import { motion } from "framer-motion";
import { CheckCircle2Icon, FilmIcon } from "lucide-react";

interface MovieStatsProps {
  totalMovies: number;
  watchedMovies: number;
}

export function MovieStats({ totalMovies, watchedMovies }: MovieStatsProps) {
  const watchedPercentage = totalMovies > 0 
    ? Math.round((watchedMovies / totalMovies) * 100) 
    : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {/* Total de Filmes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-indigo-950 to-zinc-900 rounded-lg border border-indigo-800/30 p-6"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-indigo-900/30 border border-indigo-800/30">
            <FilmIcon className="h-6 w-6 text-indigo-400" />
          </div>
          <div>
            <p className="text-sm text-zinc-400">Total de Filmes</p>
            <h3 className="text-2xl font-bold text-white">{totalMovies}</h3>
          </div>
        </div>
      </motion.div>

      {/* Filmes Assistidos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-gradient-to-br from-emerald-950 to-zinc-900 rounded-lg border border-emerald-800/30 p-6"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-emerald-900/30 border border-emerald-800/30">
            <CheckCircle2Icon className="h-6 w-6 text-emerald-400" />
          </div>
          <div>
            <p className="text-sm text-zinc-400">Filmes Assistidos</p>
            <h3 className="text-2xl font-bold text-white">{watchedMovies}</h3>
          </div>
        </div>
      </motion.div>

      {/* Progresso */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-gradient-to-br from-purple-950 to-zinc-900 rounded-lg border border-purple-800/30 p-6 sm:col-span-2 lg:col-span-1"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-zinc-400">Progresso</p>
            <span className="text-sm font-medium text-white">{watchedPercentage}%</span>
          </div>
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${watchedPercentage}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full bg-gradient-to-r from-purple-500 to-purple-700 rounded-full"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
} 