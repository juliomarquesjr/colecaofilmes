"use client"

import { GenreManagementModal } from "@/components/genre-management-modal"
import { MovieCard } from "@/components/movie-card"
import { MovieFilters } from "@/components/movie-filters"
import { MovieRouletteModal } from "@/components/movie-roulette-modal"
import { MovieStats } from "@/components/movie-stats"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Dice1, FilmIcon, Plus, Search } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

interface Genre {
  id: number
  name: string
}

interface MovieWithGenres {
  id: number
  uniqueCode: string
  title: string
  originalTitle: string | null
  overview: string | null
  year: number
  mediaType: string
  shelfCode: string
  coverUrl: string
  productionInfo: string
  rating: number | null
  trailerUrl?: string | null
  watchedAt?: Date | null
  genres: Genre[]
}

export default function FilmesPage() {
  const router = useRouter()
  const [movies, setMovies] = useState<MovieWithGenres[]>([])
  const [filteredMovies, setFilteredMovies] = useState<MovieWithGenres[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [genres, setGenres] = useState<Genre[]>([])
  const [selectedGenre, setSelectedGenre] = useState("all")
  const [selectedYear, setSelectedYear] = useState("all")
  const [selectedRating, setSelectedRating] = useState("all")
  const [isRouletteOpen, setIsRouletteOpen] = useState(false)

  // Obtém os anos únicos dos filmes
  const availableYears = [...new Set(movies.map(movie => movie.year))].sort((a, b) => b - a)

  // Calcula o total de filmes assistidos
  const watchedMovies = movies.filter(movie => movie.watchedAt).length

  useEffect(() => {
    loadMovies()
    loadGenres()
  }, [])

  useEffect(() => {
    filterMovies()
  }, [searchTerm, selectedGenre, selectedYear, selectedRating, movies])

  const loadGenres = async () => {
    try {
      const res = await fetch("/api/generos")
      if (!res.ok) throw new Error("Erro ao carregar gêneros")
      const data = await res.json()
      setGenres(data)
    } catch (error) {
      console.error("Erro ao carregar gêneros:", error)
      toast.error("Erro ao carregar gêneros")
    }
  }

  async function loadMovies() {
    try {
      const res = await fetch("/api/filmes")
      if (!res.ok) throw new Error("Erro ao carregar filmes")
      const data = await res.json()
      setMovies(data)
      setFilteredMovies(data)
    } catch (error) {
      console.error("Erro ao carregar filmes:", error)
      toast.error("Erro ao carregar filmes")
    } finally {
      setIsLoading(false)
    }
  }

  const filterMovies = () => {
    let filtered = [...movies]

    // Filtro por texto
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter((movie) =>
        movie.title.toLowerCase().includes(searchLower) ||
        movie.mediaType.toLowerCase().includes(searchLower) ||
        movie.shelfCode.toLowerCase().includes(searchLower) ||
        movie.year.toString().includes(searchLower)
      )
    }

    // Filtro por gênero
    if (selectedGenre !== "all") {
      filtered = filtered.filter((movie) =>
        movie.genres.some((genre) => genre.id.toString() === selectedGenre)
      )
    }

    // Filtro por ano
    if (selectedYear !== "all") {
      filtered = filtered.filter((movie) => 
        movie.year.toString() === selectedYear
      )
    }

    // Filtro por nota
    if (selectedRating !== "all") {
      const minRating = parseInt(selectedRating.replace("+", ""))
      filtered = filtered.filter((movie) => 
        movie.rating && movie.rating >= minRating
      )
    }

    setFilteredMovies(filtered)
  }

  const handleClearFilters = () => {
    setSearchTerm("")
    setSelectedGenre("all")
    setSelectedYear("all")
    setSelectedRating("all")
  }

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/filmes/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Erro ao excluir filme")
      setMovies((prev) => prev.filter((movie) => movie.id !== id))
      toast.success("Filme excluído com sucesso")
    } catch (error) {
      console.error("Erro ao excluir filme:", error)
      toast.error("Erro ao excluir filme")
    }
  }

  const handleWatchedToggle = async (id: number) => {
    try {
      console.log('Tentando atualizar status do filme:', id);
      const response = await fetch(`/api/filmes/${id}/watched`, {
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao atualizar status do filme');
      }

      const updatedMovie = await response.json();
      console.log('Filme atualizado:', updatedMovie);
      
      // Atualiza o estado local
      setMovies(prevMovies => 
        prevMovies.map(movie => 
          movie.id === id ? { ...movie, watchedAt: updatedMovie.watchedAt } : movie
        )
      );
    } catch (error) {
      console.error('Erro ao atualizar status do filme:', error);
      toast.error('Erro ao atualizar status do filme');
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1400px] space-y-8 p-8">
        {/* Header Skeleton */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-zinc-800/50 p-2">
                <div className="h-6 w-6 rounded bg-zinc-700/50 animate-pulse" />
              </div>
              <div className="h-8 w-36 rounded bg-zinc-800/50 animate-pulse" />
            </div>
            {/* Stats compactos */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-zinc-800/50 animate-pulse" />
                <div className="h-5 w-28 rounded bg-zinc-800/50 animate-pulse" />
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-zinc-800/50 animate-pulse" />
                <div className="h-5 w-28 rounded bg-zinc-800/50 animate-pulse" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-10 w-[180px] rounded bg-zinc-800/50 animate-pulse" />
            <div className="h-10 w-[160px] rounded bg-zinc-800/50 animate-pulse" />
          </div>
        </div>


        {/* Search and Filters Skeleton */}
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 rounded bg-zinc-700/50 animate-pulse" />
            <div className="h-11 w-full rounded bg-zinc-800/50 animate-pulse" />
          </div>
          <div className="my-4 h-[1px] bg-zinc-800" />
          <div className="flex flex-wrap gap-2">
            {/* Filtro de Gênero */}
            <div className="h-9 w-[180px] rounded bg-zinc-800/50 animate-pulse" />
            {/* Filtro de Ano */}
            <div className="h-9 w-[140px] rounded bg-zinc-800/50 animate-pulse" />
            {/* Filtro de Nota */}
            <div className="h-9 w-[140px] rounded bg-zinc-800/50 animate-pulse" />
            {/* Botão Limpar */}
            <div className="h-9 w-[100px] rounded bg-zinc-800/50 animate-pulse" />
          </div>
        </div>

        {/* Movies Grid Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {[...Array(12)].map((_, index) => (
            <div key={index} className="group relative">
              <div className="aspect-[2/3] w-full overflow-hidden rounded-lg bg-zinc-800/50 animate-pulse" />
              <div className="mt-2 space-y-2">
                <div className="h-5 w-3/4 rounded bg-zinc-800/50 animate-pulse" />
                <div className="h-4 w-1/2 rounded bg-zinc-800/50 animate-pulse" />
                <div className="flex gap-1">
                  <div className="h-6 w-16 rounded bg-zinc-800/50 animate-pulse" />
                  <div className="h-6 w-16 rounded bg-zinc-800/50 animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[1400px] space-y-8 p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-indigo-600/10 p-2 text-indigo-400">
              <FilmIcon className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold text-zinc-100">Meus Filmes</h1>
          </div>
          <MovieStats
            totalMovies={movies.length}
            watchedMovies={watchedMovies}
            compact
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsRouletteOpen(true)}
            variant="outline"
            className="bg-zinc-800/50 border-zinc-700 text-white hover:bg-zinc-800 hover:text-white"
          >
            <Dice1 className="mr-2 h-4 w-4" />
            Sorteio
          </Button>
          <GenreManagementModal
            genres={genres}
            onGenresChange={setGenres}
          />
          <Link href="/filmes/cadastrar">
            <Button className="bg-indigo-600 text-white hover:bg-indigo-700">
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Filme
            </Button>
          </Link>
        </div>
      </div>

      {/* Estatísticas Detalhadas */}
      <MovieStats
        totalMovies={movies.length}
        watchedMovies={watchedMovies}
      />

      <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
        {/* Barra de Pesquisa */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            type="text"
            placeholder="Buscar por título, ano, mídia ou código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-11 bg-zinc-800/50 border-zinc-700 text-zinc-100 focus-visible:ring-1 focus-visible:ring-indigo-500"
          />
        </div>

        <Separator className="my-4" />

        {/* Filtros */}
        <MovieFilters
          genres={genres}
          selectedGenre={selectedGenre}
          selectedYear={selectedYear}
          selectedRating={selectedRating}
          onGenreChange={setSelectedGenre}
          onYearChange={setSelectedYear}
          onRatingChange={setSelectedRating}
          onClearFilters={handleClearFilters}
          availableYears={availableYears}
        />
      </div>

      {/* Lista de Filmes */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {filteredMovies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onEdit={(id) => router.push(`/filmes/${id}/editar`)}
            onDelete={handleDelete}
            onWatchedToggle={handleWatchedToggle}
            totalMovies={movies.length}
            watchedMovies={watchedMovies}
          />
        ))}
      </div>

      <MovieRouletteModal
        genres={genres}
        open={isRouletteOpen}
        onOpenChange={setIsRouletteOpen}
      />
    </div>
  )
} 