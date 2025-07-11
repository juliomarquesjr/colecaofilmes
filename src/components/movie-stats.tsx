import { motion } from "framer-motion";
import { CheckCircle2Icon, FilmIcon } from "lucide-react";

interface MovieStatsProps {
  totalMovies?: number;
  watchedMovies?: number;
  watchedPercentage?: number;
  compact?: boolean;
  isLoading?: boolean;
}

export function MovieStats({ 
  totalMovies = 0, 
  watchedMovies = 0, 
  watchedPercentage: providedPercentage,
  compact = false,
  isLoading = false 
}: MovieStatsProps) {
  // Usa a porcentagem fornecida ou calcula se não fornecida
  const watchedPercentage = providedPercentage ?? (totalMovies > 0 
    ? Math.round((watchedMovies / totalMovies) * 100) 
    : 0);

  const isComplete = watchedPercentage === 100;

  // Skeleton de carregamento para versão compacta
  if (isLoading && compact) {
    return (
      <div className="flex items-center gap-3">
        {/* Skeleton Total de Filmes */}
        <div className="bg-zinc-800/50 rounded-lg border border-zinc-700 p-3 w-[140px] animate-pulse">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-zinc-700/50 border border-zinc-600/50">
                <div className="h-4 w-4 bg-zinc-600/50 rounded" />
              </div>
              <div className="h-3 w-8 bg-zinc-600/50 rounded" />
            </div>
            <div className="flex items-end justify-between">
              <div className="h-8 w-12 bg-zinc-600/50 rounded" />
            </div>
          </div>
        </div>

        {/* Skeleton Filmes Assistidos */}
        <div className="bg-zinc-800/50 rounded-lg border border-zinc-700 p-3 w-[140px] animate-pulse">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-zinc-700/50 border border-zinc-600/50">
                <div className="h-4 w-4 bg-zinc-600/50 rounded" />
              </div>
              <div className="h-3 w-16 bg-zinc-600/50 rounded" />
            </div>
            <div className="flex items-end justify-between">
              <div className="h-8 w-12 bg-zinc-600/50 rounded" />
            </div>
          </div>
        </div>

        {/* Skeleton Progresso */}
        <div className="bg-zinc-800/50 rounded-lg border border-zinc-700 p-3 w-[140px] animate-pulse">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-zinc-700/50 border border-zinc-600/50">
                <div className="h-4 w-4 bg-zinc-600/50 rounded-full" />
              </div>
              <div className="h-3 w-14 bg-zinc-600/50 rounded" />
            </div>
            <div className="flex items-end justify-between">
              <div className="h-8 w-12 bg-zinc-600/50 rounded" />
              <div className="h-1 w-full flex-1 bg-zinc-700/50 rounded-full ml-3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        {/* Total de Filmes - Versão Compacta */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className={`bg-gradient-to-br ${
            isComplete 
              ? 'from-indigo-600 to-indigo-800 border-indigo-500/50 animate-pulse' 
              : 'from-indigo-950 to-zinc-900 border-indigo-800/30'
          } rounded-lg border p-3 w-[140px]`}
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${
                isComplete 
                  ? 'bg-indigo-500/30 border-indigo-400/30' 
                  : 'bg-indigo-900/30 border-indigo-800/30'
              } border`}>
                <FilmIcon className={`h-4 w-4 ${
                  isComplete ? 'text-indigo-300' : 'text-indigo-400'
                }`} />
              </div>
              <span className={`text-[11px] font-medium ${
                isComplete ? 'text-indigo-200' : 'text-zinc-400'
              }`}>Total</span>
            </div>
            <div className="flex items-end justify-between">
              <h3 className={`text-2xl font-bold ${
                isComplete ? 'text-indigo-200' : 'text-white'
              } leading-none`}>{totalMovies}</h3>
              <div className="h-1 w-12 opacity-0" />
            </div>
          </div>
        </motion.div>

        {/* Filmes Assistidos - Versão Compacta */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={`bg-gradient-to-br ${
            isComplete 
              ? 'from-emerald-600 to-emerald-800 border-emerald-500/50 animate-pulse' 
              : 'from-emerald-950 to-zinc-900 border-emerald-800/30'
          } rounded-lg border p-3 w-[140px]`}
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${
                isComplete 
                  ? 'bg-emerald-500/30 border-emerald-400/30' 
                  : 'bg-emerald-900/30 border-emerald-800/30'
              } border`}>
                <CheckCircle2Icon className={`h-4 w-4 ${
                  isComplete ? 'text-emerald-300' : 'text-emerald-400'
                }`} />
              </div>
              <span className={`text-[11px] font-medium ${
                isComplete ? 'text-emerald-200' : 'text-zinc-400'
              }`}>Assistidos</span>
            </div>
            <div className="flex items-end justify-between">
              <h3 className={`text-2xl font-bold ${
                isComplete ? 'text-emerald-200' : 'text-white'
              } leading-none`}>{watchedMovies}</h3>
              <div className="h-1 w-12 opacity-0" />
            </div>
          </div>
        </motion.div>

        {/* Progresso - Versão Compacta */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`bg-gradient-to-br ${
            isComplete 
              ? 'from-purple-600 to-purple-800 border-purple-500/50 animate-pulse' 
              : 'from-purple-950 to-zinc-900 border-purple-800/30'
          } rounded-lg border p-3 w-[140px]`}
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${
                isComplete 
                  ? 'bg-purple-500/30 border-purple-400/30' 
                  : 'bg-purple-900/30 border-purple-800/30'
              } border`}>
                <div className={`h-4 w-4 rounded-full ${
                  isComplete 
                    ? 'bg-purple-300 text-purple-900' 
                    : 'bg-purple-400 text-purple-950'
                } flex items-center justify-center text-[10px] font-bold`}>
                  %
                </div>
              </div>
              <span className={`text-[11px] font-medium ${
                isComplete ? 'text-purple-200' : 'text-zinc-400'
              }`}>Progresso</span>
            </div>
            <div className="flex items-end justify-between">
              <h3 className={`text-2xl font-bold ${
                isComplete ? 'text-purple-200' : 'text-white'
              } leading-none`}>{watchedPercentage}%</h3>
              <div className={`h-1 w-full flex-1 ${
                isComplete ? 'bg-purple-500/50' : 'bg-purple-950/50'
              } rounded-full overflow-hidden ml-3`}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${watchedPercentage}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className={`h-full bg-gradient-to-r ${
                    isComplete 
                      ? 'from-purple-300 to-purple-200' 
                      : 'from-purple-500 to-purple-400'
                  } rounded-full`}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return null; // Não renderiza a versão grande
} 