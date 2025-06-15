"use client"

import { GenreManagementModal } from "@/components/genre-management-modal"
import { MovieCard } from "@/components/movie-card"
import { MovieFilters } from "@/components/movie-filters"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <FilmIcon className="h-8 w-8" />
            Meus Filmes
          </h1>
          <div className="flex items-center gap-2">
            <GenreManagementModal
              genres={genres}
              onGenresChange={setGenres}
            />
            <Link href="/filmes/cadastrar">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Filme
              </Button>
            </Link>
          </div>
        </div>

        {/* Barra de Pesquisa e Filtros */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input
              type="text"
              placeholder="Buscar filmes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-2 focus:ring-indigo-800 focus:border-indigo-800"
            />
          </div>

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
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FilmIcon className="w-12 h-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              {movies.length === 0 ? "Nenhum filme cadastrado" : "Nenhum filme encontrado"}
            </h2>
            <p className="text-muted-foreground mb-6">
              {movies.length === 0
                ? "Comece adicionando seu primeiro filme ao catálogo."
                : "Tente ajustar os filtros ou termos da sua pesquisa."}
            </p>
            {movies.length === 0 && (
              <Link href="/filmes/cadastrar">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Filme
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
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
    </div>
  )
} 