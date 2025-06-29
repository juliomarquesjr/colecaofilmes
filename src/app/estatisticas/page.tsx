"use client"

import { MovieStatsExtended } from "@/components/movie-stats-extended"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useMovieStats } from "@/hooks/use-movie-stats"
import { ArrowLeft, BarChart3, Calendar, Clock, Eye, Film, Globe, Languages, Star, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  RadialBar,
  RadialBarChart,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'

// Paleta de cores moderna expandida
const COLORS = {
  primary: ['#8B5CF6', '#A78BFA', '#C4B5FD', '#DDD6FE', '#EDE9FE'],
  secondary: ['#06B6D4', '#67E8F9', '#A5F3FC', '#CFFAFE', '#ECFEFF'],
  accent: ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0', '#D1FAE5'],
  warm: ['#F59E0B', '#FBBF24', '#FCD34D', '#FDE68A', '#FEF3C7'],
  rose: ['#F43F5E', '#FB7185', '#FDA4AF', '#FECACA', '#FEE2E2'],
  emerald: ['#059669', '#10B981', '#34D399', '#6EE7B7', '#A7F3D0'],
  blue: ['#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE', '#DBEAFE'],
  purple: ['#7C3AED', '#8B5CF6', '#A78BFA', '#C4B5FD', '#DDD6FE']
}

export default function EstatisticasPage() {
  const { stats, isLoading, error, refetch } = useMovieStats()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null // Evita hidration mismatch
  }

  // Preparar dados para os gráficos existentes
  const prepareMediaTypeData = () => {
    if (!stats) return []
    return Object.entries(stats.mediaTypeStats).map(([type, count]) => ({
      name: type,
      value: count,
      percentage: Math.round((count / stats.totalMovies) * 100)
    }))
  }

  const prepareYearData = () => {
    if (!stats) return []
    return stats.yearStats.slice(0, 8).map(item => ({
      year: item.year.toString(),
      filmes: item.count,
      decade: `${Math.floor(item.year / 10) * 10}s`
    }))
  }

  const prepareProgressData = () => {
    if (!stats) return []
    return [
      { name: 'Assistidos', value: stats.watchedMovies, fill: '#10B981' },
      { name: 'Não Assistidos', value: stats.unwatchedMovies, fill: '#6B7280' }
    ]
  }

  // Preparar dados para os novos gráficos
  const prepareGenreData = () => {
    if (!stats) return []
    return stats.genreStats.slice(0, 8).map((item, index) => ({
      name: item.name,
      value: item.count,
      fill: COLORS.purple[index % COLORS.purple.length]
    }))
  }

  const prepareCountryData = () => {
    if (!stats) return []
    return stats.countryStats.slice(0, 6).map((item, index) => ({
      name: `${item.flag} ${item.country}`,
      country: item.country,
      flag: item.flag,
      value: item.count,
      fill: COLORS.blue[index % COLORS.blue.length]
    }))
  }

  const prepareLanguageData = () => {
    if (!stats) return []
    return stats.languageStats.slice(0, 6).map((item, index) => ({
      name: item.language,
      value: item.count,
      fill: COLORS.emerald[index % COLORS.emerald.length]
    }))
  }

  const prepareRatingData = () => {
    if (!stats) return []
    return stats.ratingStats.map((item, index) => ({
      range: item.range,
      count: item.count,
      fill: COLORS.warm[index % COLORS.warm.length]
    }))
  }

  const prepareWatchingPatternsData = () => {
    if (!stats) return []
    return stats.watchingPatternsStats.map(item => ({
      month: item.month,
      filmes: item.count
    }))
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-zinc-900/95 border border-zinc-700 rounded-lg p-3 shadow-lg backdrop-blur-sm">
          <p className="text-zinc-300 font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      return (
        <div className="bg-zinc-900/95 border border-zinc-700 rounded-lg p-3 shadow-lg backdrop-blur-sm">
          <p className="text-zinc-300 font-medium">{data.payload.name}</p>
          <p className="text-sm text-zinc-400">
            {data.value} filmes
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="mx-auto max-w-[1600px] space-y-8 p-8">
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
            <h1 className="text-3xl font-bold text-white">Análise Completa da Coleção</h1>
          </div>
          <p className="text-zinc-400">
            Visualização detalhada de todos os aspectos da sua coleção de filmes
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
            {isLoading ? 'Carregando...' : 'Atualizar Dados'}
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

      {/* Seção de Gráficos Principais - Layout 2x2 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Progresso de Visualização */}
        <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Eye className="h-5 w-5 text-emerald-400" />
              Progresso de Visualização
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Proporção de filmes assistidos vs não assistidos
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
              </div>
            ) : stats ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={prepareProgressData()}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {prepareProgressData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                    <Legend 
                      wrapperStyle={{ color: '#D1D5DB' }}
                      iconType="circle"
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-zinc-500">
                Erro ao carregar dados
              </div>
            )}
          </CardContent>
        </Card>

        {/* Distribuição por Tipo de Mídia */}
        <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Film className="h-5 w-5 text-purple-400" />
              Distribuição por Mídia
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Quantidade de filmes por tipo de mídia
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
              </div>
            ) : stats ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={prepareMediaTypeData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#9CA3AF"
                      fontSize={12}
                    />
                    <YAxis stroke="#9CA3AF" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="value" 
                      radius={[4, 4, 0, 0]}
                    >
                      {prepareMediaTypeData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS.primary[index % COLORS.primary.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-zinc-500">
                Erro ao carregar dados
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Gêneros */}
        <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Star className="h-5 w-5 text-violet-400" />
              Gêneros Favoritos
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Os gêneros mais presentes na sua coleção
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
              </div>
            ) : stats && stats.genreStats && stats.genreStats.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={prepareGenreData()} 
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#9CA3AF" 
                      fontSize={10}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis stroke="#9CA3AF" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="value" 
                      radius={[4, 4, 0, 0]}
                      fill="#8B5CF6"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : stats ? (
              <div className="h-64 flex items-center justify-center text-zinc-500">
                <div className="text-center">
                  <p className="text-lg font-medium">Nenhum gênero cadastrado</p>
                  <p className="text-sm mt-2">Os filmes ainda não possuem gêneros associados</p>
                </div>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-zinc-500">
                Erro ao carregar dados
              </div>
            )}
          </CardContent>
        </Card>

        {/* Diversidade Geográfica */}
        <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Globe className="h-5 w-5 text-blue-400" />
              Diversidade Geográfica
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Países de origem dos filmes da coleção
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : stats ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={prepareCountryData()}
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {prepareCountryData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                    <Legend 
                      wrapperStyle={{ color: '#D1D5DB', fontSize: '12px' }}
                      iconType="circle"
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-zinc-500">
                Erro ao carregar dados
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Seção de Análises Temporais e Distribuições */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Filmes por Ano */}
        <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm xl:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Calendar className="h-5 w-5 text-cyan-400" />
              Distribuição Temporal
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Anos com mais filmes na sua coleção
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-80 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
              </div>
            ) : stats ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={prepareYearData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="year" 
                      stroke="#9CA3AF"
                      fontSize={12}
                    />
                    <YAxis stroke="#9CA3AF" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="filmes" 
                      stroke="#06B6D4" 
                      strokeWidth={2}
                      fill="url(#colorArea)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center text-zinc-500">
                Erro ao carregar dados
              </div>
            )}
          </CardContent>
        </Card>

        {/* Idiomas */}
        <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Languages className="h-5 w-5 text-emerald-400" />
              Diversidade Linguística
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Idiomas originais dos filmes
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-80 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
              </div>
            ) : stats ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={prepareLanguageData()} margin={{ top: 20, right: 10, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#9CA3AF"
                      fontSize={10}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis stroke="#9CA3AF" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="value" 
                      radius={[4, 4, 0, 0]}
                      fill="#10B981"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center text-zinc-500">
                Erro ao carregar dados
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Seção de Análises Avançadas */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Distribuição de Notas */}
        <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Star className="h-5 w-5 text-yellow-400" />
              Distribuição de Qualidade
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Como as notas estão distribuídas na sua coleção
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
              </div>
            ) : stats ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={prepareRatingData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="range" 
                      stroke="#9CA3AF"
                      fontSize={12}
                    />
                    <YAxis stroke="#9CA3AF" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="count" 
                      radius={[4, 4, 0, 0]}
                    >
                      {prepareRatingData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS.warm[index % COLORS.warm.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-zinc-500">
                Erro ao carregar dados
              </div>
            )}
          </CardContent>
        </Card>

        {/* Padrões de Visualização */}
        <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <TrendingUp className="h-5 w-5 text-pink-400" />
              Padrões de Visualização
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Quando você mais assiste filmes (últimos 12 meses)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
              </div>
            ) : stats && stats.watchingPatternsStats.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={prepareWatchingPatternsData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="month" 
                      stroke="#9CA3AF"
                      fontSize={12}
                    />
                    <YAxis stroke="#9CA3AF" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line 
                      type="monotone" 
                      dataKey="filmes" 
                      stroke="#F43F5E" 
                      strokeWidth={3}
                      dot={{ fill: '#F43F5E', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#F43F5E', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-zinc-500">
                {stats ? 'Nenhum padrão de visualização encontrado' : 'Erro ao carregar dados'}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Card de Estatísticas de Duração */}
      {stats && stats.runtimeStats.moviesWithRuntime > 0 && (
        <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Clock className="h-5 w-5 text-orange-400" />
              Análise de Duração
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Estatísticas sobre a duração dos filmes da sua coleção
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-orange-950/50 to-amber-950/50 border border-orange-800/30">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{stats.runtimeStats.totalHours}h</p>
                  <p className="text-xs text-orange-300 mt-1">Tempo Total</p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-950/50 to-teal-950/50 border border-emerald-800/30">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{stats.runtimeStats.totalWatchedHours}h</p>
                  <p className="text-xs text-emerald-300 mt-1">Já Assistido</p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-950/50 to-indigo-950/50 border border-blue-800/30">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{stats.runtimeStats.averageMinutes}min</p>
                  <p className="text-xs text-blue-300 mt-1">Duração Média</p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-purple-950/50 to-violet-950/50 border border-purple-800/30">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{stats.runtimeStats.shortestMinutes}min</p>
                  <p className="text-xs text-purple-300 mt-1">Mais Curto</p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-rose-950/50 to-pink-950/50 border border-rose-800/30">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{stats.runtimeStats.longestMinutes}min</p>
                  <p className="text-xs text-rose-300 mt-1">Mais Longo</p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-950/50 to-sky-950/50 border border-cyan-800/30">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{stats.runtimeStats.moviesWithRuntime}</p>
                  <p className="text-xs text-cyan-300 mt-1">Com Duração</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Seção de Insights Aprimorada */}
      <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Star className="h-5 w-5 text-emerald-400" />
            Insights da Coleção
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Análises detalhadas e descobertas sobre sua coleção
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
              {/* Insight 1: Progresso com Gráfico Radial */}
              <div className="p-6 rounded-xl bg-gradient-to-br from-indigo-950/50 to-purple-950/50 border border-indigo-800/30 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl" />
                <div className="relative z-10">
                  <h4 className="text-sm font-medium text-indigo-300 mb-2">Progresso de Visualização</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold text-white">{stats.watchedPercentage}%</p>
                      <p className="text-xs text-zinc-400 mt-1">
                        {stats.watchedMovies} de {stats.totalMovies} filmes
                      </p>
                    </div>
                    <div className="w-16 h-16">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={[{ value: stats.watchedPercentage }]}>
                          <RadialBar dataKey="value" fill="#8B5CF6" />
                        </RadialBarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>

              {/* Insight 2: Gênero Favorito */}
              {stats.genreStats.length > 0 && (
                <div className="p-6 rounded-xl bg-gradient-to-br from-violet-950/50 to-purple-950/50 border border-violet-800/30 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-xl" />
                  <div className="relative z-10">
                    <h4 className="text-sm font-medium text-violet-300 mb-2">Gênero Favorito</h4>
                    <p className="text-3xl font-bold text-white">{stats.genreStats[0].name}</p>
                    <p className="text-xs text-zinc-400 mt-1">
                      {stats.genreStats[0].count} filmes ({Math.round((stats.genreStats[0].count / stats.totalMovies) * 100)}%)
                    </p>
                  </div>
                </div>
              )}

              {/* Insight 3: País Mais Comum */}
              {stats.countryStats.length > 0 && (
                <div className="p-6 rounded-xl bg-gradient-to-br from-blue-950/50 to-cyan-950/50 border border-blue-800/30 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl" />
                  <div className="relative z-10">
                    <h4 className="text-sm font-medium text-blue-300 mb-2">País Predominante</h4>
                    <p className="text-3xl font-bold text-white">{stats.countryStats[0].flag} {stats.countryStats[0].country}</p>
                    <p className="text-xs text-zinc-400 mt-1">
                      {stats.countryStats[0].count} filmes
                    </p>
                  </div>
                </div>
              )}

              {/* Insight 4: Tempo Total */}
              {stats.runtimeStats.moviesWithRuntime > 0 && (
                <div className="p-6 rounded-xl bg-gradient-to-br from-orange-950/50 to-amber-950/50 border border-orange-800/30 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-amber-500/10 rounded-xl" />
                  <div className="relative z-10">
                    <h4 className="text-sm font-medium text-orange-300 mb-2">Tempo de Cinema</h4>
                    <p className="text-3xl font-bold text-white">{stats.runtimeStats.totalWatchedHours}h</p>
                    <p className="text-xs text-zinc-400 mt-1">
                      Já assistidas de {stats.runtimeStats.totalHours}h totais
                    </p>
                  </div>
                </div>
              )}

              {/* Insight 5: Idioma Mais Comum */}
              {stats.languageStats.length > 0 && (
                <div className="p-6 rounded-xl bg-gradient-to-br from-emerald-950/50 to-teal-950/50 border border-emerald-800/30 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-xl" />
                  <div className="relative z-10">
                    <h4 className="text-sm font-medium text-emerald-300 mb-2">Idioma Principal</h4>
                    <p className="text-3xl font-bold text-white">{stats.languageStats[0].language}</p>
                    <p className="text-xs text-zinc-400 mt-1">
                      {stats.languageStats[0].count} filmes
                    </p>
                  </div>
                </div>
              )}

              {/* Insight 6: Filmes de Qualidade */}
              <div className="p-6 rounded-xl bg-gradient-to-br from-yellow-950/50 to-amber-950/50 border border-yellow-800/30 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-amber-500/10 rounded-xl" />
                <div className="relative z-10">
                  <h4 className="text-sm font-medium text-yellow-300 mb-2">Alta Qualidade</h4>
                  <p className="text-3xl font-bold text-white">{stats.topRatedMovies}</p>
                  <p className="text-xs text-zinc-400 mt-1">
                    Filmes com nota ≥ 8.0 ({Math.round((stats.topRatedMovies / stats.totalMovies) * 100)}%)
                  </p>
                </div>
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
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span>Última atualização: {new Date(stats.lastUpdated).toLocaleString('pt-BR')}</span>
          </div>
        </div>
      )}
    </div>
  )
} 