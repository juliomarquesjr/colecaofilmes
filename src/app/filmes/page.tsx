"use client"

import { MovieCard } from "@/components/movie-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FilmIcon, Plus, Search } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

interface Movie {
  id: number
  title: string
  year: number
  mediaType: string
  shelfCode: string
  coverUrl: string
  productionInfo: string
}

export default function FilmesPage() {
  const router = useRouter()
  const [movies, setMovies] = useState<Movie[]>([])
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadMovies()
  }, [])

  useEffect(() => {
    const filtered = movies.filter((movie) =>
      movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movie.mediaType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movie.shelfCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movie.year.toString().includes(searchTerm)
    )
    setFilteredMovies(filtered)
  }, [searchTerm, movies])

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
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <FilmIcon className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">Catálogo de Filmes</h1>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar filmes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full sm:w-[300px]"
            />
          </div>

          <Link href="/filmes/cadastrar">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Filme
            </Button>
          </Link>
        </div>
      </div>

      {/* Content */}
      {filteredMovies.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <FilmIcon className="w-12 h-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">
            {movies.length === 0 ? "Nenhum filme cadastrado" : "Nenhum filme encontrado"}
          </h2>
          <p className="text-muted-foreground mb-6">
            {movies.length === 0
              ? "Comece adicionando seu primeiro filme ao catálogo."
              : "Tente ajustar os termos da sua pesquisa."}
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
              onView={() => router.push(`/filmes/${movie.id}`)}
              onEdit={() => router.push(`/filmes/${movie.id}/editar`)}
              onDelete={() => handleDelete(movie.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
} 