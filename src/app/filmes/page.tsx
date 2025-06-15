"use client"

import { GenreManagementModal } from "@/components/genre-management-modal"
import { MovieCard } from "@/components/movie-card"
import { MovieFilters } from "@/components/movie-filters"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { type Movie } from "@/generated/prisma/client"
import { FilmIcon, Plus, Search } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

interface Genre {
  id: number
  name: string
}

interface MovieWithGenres extends Movie {
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

  // Obtém os anos únicos dos filmes
  const availableYears = [...new Set(movies.map(movie => movie.year))].sort((a, b) => b - a)

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Carregando filmes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[1400px] space-y-8 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-indigo-600/10 p-2 text-indigo-400">
            <FilmIcon className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-100">Meus Filmes</h1>
            <p className="text-sm text-zinc-400">
              {filteredMovies.length} {filteredMovies.length === 1 ? "filme" : "filmes"} no total
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
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
      {filteredMovies.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-zinc-800 bg-zinc-900/50 py-16">
          <div className="rounded-full bg-zinc-900 p-4">
            <FilmIcon className="h-8 w-8 text-zinc-600" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-medium text-zinc-100">
              {movies.length === 0 ? "Nenhum filme cadastrado" : "Nenhum filme encontrado"}
            </h3>
            <p className="mt-1 text-sm text-zinc-400">
              {movies.length === 0
                ? "Comece adicionando seu primeiro filme ao catálogo."
                : "Tente ajustar os filtros ou termos da sua pesquisa."}
            </p>
          </div>
          {movies.length === 0 && (
            <Link href="/filmes/cadastrar">
              <Button className="bg-indigo-600 text-white hover:bg-indigo-700">
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Filme
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {filteredMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onEdit={() => router.push(`/filmes/${movie.id}/editar`)}
              onDelete={() => handleDelete(movie.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
} 