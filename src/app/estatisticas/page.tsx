"use client"

import { MovieStatsExtended } from "@/components/movie-stats-extended"
import { ProgressBar } from "@/components/progress-bar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useMovieStats } from "@/hooks/use-movie-stats"
import { ArrowLeft, BarChart3, PieChart, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function EstatisticasPage() {
  const { stats, isLoading, error, refetch } = useMovieStats()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null // Evita hidration mismatch
  }

  return (
    <div className="mx-auto max-w-[1400px] space-y-8 p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Link href="/filmes">
              <Button variant="outline" size="sm" className="bg-zinc-800/50 border-zinc-700 text-zinc-100 hover:bg-zinc-700">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
            </Link>
            <div className="h-6 w-px bg-zinc-700" />
            <h1 className="text-3xl font-bold text-white">Estatísticas da Coleção</h1>
          </div>
          <p className="text-zinc-400">
            Análise detalhada da sua coleção de filmes com gráficos e insights
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={refetch}
            variant="outline"
            disabled={isLoading}
            className="bg-zinc-800/50 border-zinc-700 text-zinc-100 hover:bg-zinc-700"
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            Atualizar Dados
          </Button>
        </div>
      </div>

      {/* Cards de Estatísticas Principais */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <TrendingUp className="h-6 w-6 text-indigo-400" />
          <h2 className="text-xl font-semibold text-white">Visão Geral</h2>
        </div>
        
        <MovieStatsExtended
          stats={stats}
          isLoading={isLoading}
        />
      </div>

      {/* Seção de Distribuições */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribuição por Tipo de Mídia */}
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <PieChart className="h-5 w-5 text-purple-400" />
              Distribuição por Mídia
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Quantidade de filmes por tipo de mídia
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="h-4 w-20 bg-zinc-700/50 rounded animate-pulse" />
                    <div className="h-4 w-12 bg-zinc-700/50 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            ) : stats ? (
              <div className="space-y-4">
                {Object.entries(stats.mediaTypeStats)
                  .sort(([,a], [,b]) => b - a)
                  .map(([type, count], index) => {
                    const percentage = stats.totalMovies > 0 ? Math.round((count / stats.totalMovies) * 100) : 0
                    const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500']
                    
                    return (
                      <div key={type} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-zinc-300 font-medium">{type}</span>
                          <span className="text-zinc-400">{count} ({percentage}%)</span>
                        </div>
                        <ProgressBar
                          value={percentage}
                          barClassName={colors[index % colors.length]}
                          delay={index * 0.1}
                        />
                      </div>
                    )
                  })}
              </div>
            ) : (
              <div className="text-center text-zinc-500 py-8">
                Erro ao carregar dados
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Anos */}
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <BarChart3 className="h-5 w-5 text-cyan-400" />
              Top 10 Anos
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Anos com mais filmes na coleção
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="h-4 w-16 bg-zinc-700/50 rounded animate-pulse" />
                    <div className="h-4 w-8 bg-zinc-700/50 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            ) : stats ? (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {stats.yearStats.map((yearData, index) => {
                  const maxCount = stats.yearStats[0]?.count || 1
                  const percentage = Math.round((yearData.count / maxCount) * 100)
                  
                  return (
                    <div key={yearData.year} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-zinc-300 font-medium">{yearData.year}</span>
                        <span className="text-zinc-400">{yearData.count} filmes</span>
                      </div>
                      <ProgressBar
                        value={percentage}
                        barClassName="bg-gradient-to-r from-cyan-500 to-blue-500"
                        delay={index * 0.05}
                      />
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center text-zinc-500 py-8">
                Erro ao carregar dados
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Seção de Insights */}
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <TrendingUp className="h-5 w-5 text-emerald-400" />
            Insights da Coleção
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Análises e descobertas sobre sua coleção
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="p-4 rounded-lg bg-zinc-800/30 animate-pulse">
                  <div className="h-4 w-3/4 bg-zinc-700/50 rounded mb-2" />
                  <div className="h-6 w-1/2 bg-zinc-700/50 rounded" />
                </div>
              ))}
            </div>
          ) : stats ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Insight 1: Progresso */}
              <div className="p-4 rounded-lg bg-gradient-to-br from-indigo-950/50 to-purple-950/50 border border-indigo-800/30">
                <h4 className="text-sm font-medium text-indigo-300 mb-1">Progresso de Visualização</h4>
                <p className="text-2xl font-bold text-white">{stats.watchedPercentage}%</p>
                <p className="text-xs text-zinc-400 mt-1">
                  {stats.watchedPercentage >= 75 ? "Excelente progresso!" : 
                   stats.watchedPercentage >= 50 ? "Bom progresso!" : 
                   stats.watchedPercentage >= 25 ? "Continue assistindo!" : "Muitos filmes para descobrir!"}
                </p>
              </div>

              {/* Insight 2: Filmes de Qualidade */}
              <div className="p-4 rounded-lg bg-gradient-to-br from-amber-950/50 to-orange-950/50 border border-amber-800/30">
                <h4 className="text-sm font-medium text-amber-300 mb-1">Filmes de Alta Qualidade</h4>
                <p className="text-2xl font-bold text-white">{stats.topRatedMovies}</p>
                <p className="text-xs text-zinc-400 mt-1">
                  {Math.round((stats.topRatedMovies / stats.totalMovies) * 100)}% da coleção com nota ≥ 8.0
                </p>
              </div>

              {/* Insight 3: Atividade Recente */}
              <div className="p-4 rounded-lg bg-gradient-to-br from-emerald-950/50 to-teal-950/50 border border-emerald-800/30">
                <h4 className="text-sm font-medium text-emerald-300 mb-1">Atividade Recente</h4>
                <p className="text-2xl font-bold text-white">{stats.recentlyWatched}</p>
                <p className="text-xs text-zinc-400 mt-1">
                  Filmes assistidos nos últimos 30 dias
                </p>
              </div>

              {/* Insight 4: Mídia Preferida */}
              {(() => {
                const mostCommon = Object.entries(stats.mediaTypeStats).sort(([,a], [,b]) => b - a)[0]
                return mostCommon ? (
                  <div className="p-4 rounded-lg bg-gradient-to-br from-rose-950/50 to-pink-950/50 border border-rose-800/30">
                    <h4 className="text-sm font-medium text-rose-300 mb-1">Mídia Favorita</h4>
                    <p className="text-2xl font-bold text-white">{mostCommon[0]}</p>
                    <p className="text-xs text-zinc-400 mt-1">
                      {Math.round((mostCommon[1] / stats.totalMovies) * 100)}% da coleção
                    </p>
                  </div>
                ) : null
              })()}

              {/* Insight 5: Década Favorita */}
              {(() => {
                const topYear = stats.yearStats[0]
                const decade = topYear ? Math.floor(topYear.year / 10) * 10 : null
                return decade ? (
                  <div className="p-4 rounded-lg bg-gradient-to-br from-cyan-950/50 to-blue-950/50 border border-cyan-800/30">
                    <h4 className="text-sm font-medium text-cyan-300 mb-1">Década Favorita</h4>
                    <p className="text-2xl font-bold text-white">{decade}s</p>
                    <p className="text-xs text-zinc-400 mt-1">
                      Ano {topYear.year} com {topYear.count} filmes
                    </p>
                  </div>
                ) : null
              })()}

              {/* Insight 6: Filmes Restantes */}
              <div className="p-4 rounded-lg bg-gradient-to-br from-violet-950/50 to-purple-950/50 border border-violet-800/30">
                <h4 className="text-sm font-medium text-violet-300 mb-1">Ainda por Assistir</h4>
                <p className="text-2xl font-bold text-white">{stats.unwatchedMovies}</p>
                <p className="text-xs text-zinc-400 mt-1">
                  {stats.unwatchedMovies === 0 ? "Parabéns! Todos assistidos!" : "Filmes esperando por você"}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center text-zinc-500 py-8">
              Erro ao carregar insights
            </div>
          )}
        </CardContent>
      </Card>

      {/* Footer com informações adicionais */}
      {stats && (
        <div className="text-center text-sm text-zinc-500 border-t border-zinc-800 pt-6">
          Última atualização: {new Date(stats.lastUpdated).toLocaleString('pt-BR')}
        </div>
      )}
    </div>
  )
} 