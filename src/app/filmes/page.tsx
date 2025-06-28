"use client"

import { GenreManagementModal } from "@/components/genre-management-modal"
import { MovieCard } from "@/components/movie-card"
import { MovieFilters } from "@/components/movie-filters"
import { MovieRouletteModal } from "@/components/movie-roulette-modal"
import { MovieStats } from "@/components/movie-stats"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { Dice1, Loader2, Plus, Search } from "lucide-react"
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
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(12)
  const [totalMovies, setTotalMovies] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [keyboardNavigation, setKeyboardNavigation] = useState(false)
  const [isPageLoading, setIsPageLoading] = useState(false)
  const [loadingPage, setLoadingPage] = useState<number | null>(null)

  // Obtém os anos únicos dos filmes
  const availableYears = [...new Set(movies.map(movie => movie.year))].sort((a, b) => b - a)

  // Calcula o total de filmes assistidos
  const watchedMovies = movies.filter(movie => movie.watchedAt).length

  useEffect(() => {
    // Detecta se é mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    loadMovies()
    loadGenres()
  }, [currentPage, itemsPerPage])

  useEffect(() => {
    filterMovies()
  }, [searchTerm, selectedGenre, selectedYear, selectedRating, movies])

  useEffect(() => {
    // Navegação por teclado
    const handleKeyDown = (e: KeyboardEvent) => {
      // Apenas se não estiver em um input ou textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }
      
      // Não permitir navegação se já estiver carregando
      if (isPageLoading) return
      
      const totalPages = Math.ceil(totalMovies / itemsPerPage)
      let navigationUsed = false
      
      if (e.key === 'ArrowLeft' && currentPage > 1) {
        e.preventDefault()
        navigateToPage(currentPage - 1)
        navigationUsed = true
      } else if (e.key === 'ArrowRight' && currentPage < totalPages) {
        e.preventDefault()
        navigateToPage(currentPage + 1)
        navigationUsed = true
      } else if (e.key === 'Home') {
        e.preventDefault()
        navigateToPage(1)
        navigationUsed = true
      } else if (e.key === 'End') {
        e.preventDefault()
        navigateToPage(totalPages)
        navigationUsed = true
      }
      
      if (navigationUsed) {
        setKeyboardNavigation(true)
        setTimeout(() => setKeyboardNavigation(false), 1000)
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentPage, totalMovies, itemsPerPage, isPageLoading])

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
      setIsPageLoading(true)
      const res = await fetch(`/api/filmes?page=${currentPage}&limit=${itemsPerPage}`)
      if (!res.ok) throw new Error("Erro ao carregar filmes")
      const data = await res.json()
      setMovies(data.movies)
      setFilteredMovies(data.movies) // Initially, filtered movies are the same as loaded movies
      setTotalMovies(data.totalMovies)
    } catch (error) {
      console.error("Erro ao carregar filmes:", error)
      toast.error("Erro ao carregar filmes")
    } finally {
      setIsLoading(false)
      setIsPageLoading(false)
      setLoadingPage(null)
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

  const navigateToPage = async (page: number) => {
    if (page === currentPage || isPageLoading) return
    
    setLoadingPage(page)
    setCurrentPage(page)
    
    // Simula um pequeno delay para mostrar o loading
    await new Promise(resolve => setTimeout(resolve, 150))
  }

  const handleItemsPerPageChange = async (value: string) => {
    if (isPageLoading) return
    
    setLoadingPage(1)
    setItemsPerPage(parseInt(value))
    setCurrentPage(1)
    
    // Simula um pequeno delay para mostrar o loading
    await new Promise(resolve => setTimeout(resolve, 150))
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
      <div className="relative">
        {/* Overlay de carregamento */}
        {isPageLoading && (
          <div className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
            <div className="flex flex-col items-center gap-3 text-zinc-100">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
              <div className="text-sm font-medium">Carregando filmes...</div>
              <div className="text-xs text-zinc-400">
                Página {loadingPage || currentPage}
              </div>
            </div>
          </div>
        )}
        
        <div className={cn(
          "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 transition-opacity duration-200",
          isPageLoading && "opacity-50"
        )}>
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
      </div>

      {/* Paginação */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Informações e Controle de Itens por Página */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="text-sm text-zinc-400">
              Mostrando {Math.min((currentPage - 1) * itemsPerPage + 1, totalMovies)} a{' '}
              {Math.min(currentPage * itemsPerPage, totalMovies)} de {totalMovies} filmes
            </div>
            
            {/* Barra de progresso visual */}
            <div className="flex items-center gap-2">
              <div className="w-32 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "h-full rounded-full transition-all duration-300 ease-out",
                    isPageLoading 
                      ? "bg-gradient-to-r from-indigo-500 to-purple-500 animate-pulse" 
                      : "bg-indigo-500"
                  )}
                  style={{ 
                    width: `${(currentPage / Math.ceil(totalMovies / itemsPerPage)) * 100}%` 
                  }}
                />
              </div>
              <span className={cn(
                "text-xs transition-colors duration-200",
                isPageLoading ? "text-indigo-400" : "text-zinc-500"
              )}>
                {isPageLoading ? (
                  <div className="flex items-center gap-1">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Carregando...
                  </div>
                ) : (
                  `${currentPage}/${Math.ceil(totalMovies / itemsPerPage)}`
                )}
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              Filmes por página:
              <Select
                value={itemsPerPage.toString()}
                onValueChange={handleItemsPerPageChange}
                disabled={isPageLoading}
              >
                <SelectTrigger className={cn(
                  "w-[80px] h-9 bg-zinc-800/50 border-zinc-700 text-zinc-100 focus-visible:ring-1 focus-visible:ring-indigo-500",
                  isPageLoading && "opacity-50 cursor-not-allowed"
                )}>
                  {isPageLoading && loadingPage === 1 ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <SelectValue />
                  )}
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700 text-zinc-100">
                  <SelectItem value="12">12</SelectItem>
                  <SelectItem value="24">24</SelectItem>
                  <SelectItem value="36">36</SelectItem>
                  <SelectItem value="48">48</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Controles de Navegação */}
          {Math.ceil(totalMovies / itemsPerPage) > 1 && (
            <div className="flex items-center justify-center sm:justify-end">
              <div className="flex items-center gap-2">
                {/* Atalhos rápidos apenas em desktop */}
                <div className="hidden md:flex items-center gap-1">
                  {currentPage > 3 && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigateToPage(1)}
                        className="h-8 px-2 bg-zinc-800/50 border-zinc-700 text-zinc-100 hover:bg-zinc-700 hover:border-zinc-600 text-xs"
                        title="Ir para a primeira página (Home)"
                        disabled={isPageLoading || currentPage === 1}
                      >
                        {loadingPage === 1 ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          "Primeira"
                        )}
                      </Button>
                      <div className="w-2" />
                    </>
                  )}
                </div>

                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1) navigateToPage(currentPage - 1);
                        }}
                        className={cn(
                          "bg-zinc-800/50 border-zinc-700 text-zinc-100 hover:bg-zinc-700 hover:border-zinc-600",
                          (currentPage === 1 || isPageLoading) && "pointer-events-none opacity-50"
                        )}
                        title="Página anterior (←)"
                      />
                    </PaginationItem>
                    
                    {/* Páginas */}
                    {(() => {
                      const totalPages = Math.ceil(totalMovies / itemsPerPage);
                      const pages = [];
                      
                      // Lógica responsiva: menos páginas em mobile
                      const maxPagesToShow = isMobile ? 3 : 7;
                      
                      if (totalPages <= maxPagesToShow) {
                        // Mostra todas as páginas se forem poucas
                        for (let i = 1; i <= totalPages; i++) {
                          pages.push(
                            <PaginationItem key={i}>
                              <PaginationLink
                                href="#"
                                isActive={currentPage === i}
                                onClick={(e) => {
                                  e.preventDefault();
                                  navigateToPage(i);
                                }}
                                className={cn(
                                  "bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700 hover:border-zinc-600",
                                  currentPage === i 
                                    ? "bg-indigo-600 border-indigo-500 text-white hover:bg-indigo-700 hover:border-indigo-600"
                                    : "text-zinc-100",
                                  isPageLoading && "pointer-events-none",
                                  loadingPage === i && "opacity-75"
                                )}
                              >
                                {loadingPage === i ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  i
                                )}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        }
                      } else {
                        // Lógica para muitas páginas
                        if (isMobile) {
                          // Mobile: apenas página atual e adjacentes
                          if (currentPage > 1) {
                            pages.push(
                              <PaginationItem key={currentPage - 1}>
                                <PaginationLink
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    navigateToPage(currentPage - 1);
                                  }}
                                  className="bg-zinc-800/50 border-zinc-700 text-zinc-100 hover:bg-zinc-700 hover:border-zinc-600"
                                >
                                  {currentPage - 1}
                                </PaginationLink>
                              </PaginationItem>
                            );
                          }
                          
                          pages.push(
                            <PaginationItem key={currentPage}>
                              <PaginationLink
                                href="#"
                                isActive={true}
                                className="bg-indigo-600 border-indigo-500 text-white hover:bg-indigo-700 hover:border-indigo-600"
                              >
                                {currentPage}
                              </PaginationLink>
                            </PaginationItem>
                          );
                          
                          if (currentPage < totalPages) {
                            pages.push(
                              <PaginationItem key={currentPage + 1}>
                                <PaginationLink
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    navigateToPage(currentPage + 1);
                                  }}
                                  className="bg-zinc-800/50 border-zinc-700 text-zinc-100 hover:bg-zinc-700 hover:border-zinc-600"
                                >
                                  {currentPage + 1}
                                </PaginationLink>
                              </PaginationItem>
                            );
                          }
                        } else {
                          // Desktop: lógica completa
                          if (currentPage <= 4) {
                            // Início: 1 2 3 4 5 ... última
                            for (let i = 1; i <= 5; i++) {
                              pages.push(
                                <PaginationItem key={i}>
                                  <PaginationLink
                                    href="#"
                                    isActive={currentPage === i}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      navigateToPage(i);
                                    }}
                                    className={cn(
                                      "bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700 hover:border-zinc-600",
                                      currentPage === i 
                                        ? "bg-indigo-600 border-indigo-500 text-white hover:bg-indigo-700 hover:border-indigo-600"
                                        : "text-zinc-100",
                                      isPageLoading && "pointer-events-none",
                                      loadingPage === i && "opacity-75"
                                    )}
                                  >
                                    {loadingPage === i ? (
                                      <Loader2 className="h-3 w-3 animate-spin" />
                                    ) : (
                                      i
                                    )}
                                  </PaginationLink>
                                </PaginationItem>
                              );
                            }
                            if (totalPages > 6) {
                              pages.push(
                                <PaginationItem key="ellipsis1">
                                  <span className="flex h-9 w-9 items-center justify-center text-zinc-500">...</span>
                                </PaginationItem>
                              );
                              pages.push(
                                <PaginationItem key={totalPages}>
                                  <PaginationLink
                                    href="#"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      navigateToPage(totalPages);
                                    }}
                                    className="bg-zinc-800/50 border-zinc-700 text-zinc-100 hover:bg-zinc-700 hover:border-zinc-600"
                                  >
                                    {totalPages}
                                  </PaginationLink>
                                </PaginationItem>
                              );
                            }
                          } else if (currentPage >= totalPages - 3) {
                            // Final: 1 ... antepenúltima penúltima última
                            pages.push(
                              <PaginationItem key={1}>
                                <PaginationLink
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    navigateToPage(1);
                                  }}
                                  className="bg-zinc-800/50 border-zinc-700 text-zinc-100 hover:bg-zinc-700 hover:border-zinc-600"
                                >
                                  1
                                </PaginationLink>
                              </PaginationItem>
                            );
                            pages.push(
                              <PaginationItem key="ellipsis2">
                                <span className="flex h-9 w-9 items-center justify-center text-zinc-500">...</span>
                              </PaginationItem>
                            );
                            for (let i = totalPages - 4; i <= totalPages; i++) {
                              pages.push(
                                <PaginationItem key={i}>
                                  <PaginationLink
                                    href="#"
                                    isActive={currentPage === i}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      navigateToPage(i);
                                    }}
                                    className={cn(
                                      "bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700 hover:border-zinc-600",
                                      currentPage === i 
                                        ? "bg-indigo-600 border-indigo-500 text-white hover:bg-indigo-700 hover:border-indigo-600"
                                        : "text-zinc-100",
                                      isPageLoading && "pointer-events-none",
                                      loadingPage === i && "opacity-75"
                                    )}
                                  >
                                    {loadingPage === i ? (
                                      <Loader2 className="h-3 w-3 animate-spin" />
                                    ) : (
                                      i
                                    )}
                                  </PaginationLink>
                                </PaginationItem>
                              );
                            }
                          } else {
                            // Meio: 1 ... atual-1 atual atual+1 ... última
                            pages.push(
                              <PaginationItem key={1}>
                                <PaginationLink
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    navigateToPage(1);
                                  }}
                                  className="bg-zinc-800/50 border-zinc-700 text-zinc-100 hover:bg-zinc-700 hover:border-zinc-600"
                                >
                                  1
                                </PaginationLink>
                              </PaginationItem>
                            );
                            pages.push(
                              <PaginationItem key="ellipsis3">
                                <span className="flex h-9 w-9 items-center justify-center text-zinc-500">...</span>
                              </PaginationItem>
                            );
                            for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                              pages.push(
                                <PaginationItem key={i}>
                                  <PaginationLink
                                    href="#"
                                    isActive={currentPage === i}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      navigateToPage(i);
                                    }}
                                    className={cn(
                                      "bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700 hover:border-zinc-600",
                                      currentPage === i 
                                        ? "bg-indigo-600 border-indigo-500 text-white hover:bg-indigo-700 hover:border-indigo-600"
                                        : "text-zinc-100",
                                      isPageLoading && "pointer-events-none",
                                      loadingPage === i && "opacity-75"
                                    )}
                                  >
                                    {loadingPage === i ? (
                                      <Loader2 className="h-3 w-3 animate-spin" />
                                    ) : (
                                      i
                                    )}
                                  </PaginationLink>
                                </PaginationItem>
                              );
                            }
                            pages.push(
                              <PaginationItem key="ellipsis4">
                                <span className="flex h-9 w-9 items-center justify-center text-zinc-500">...</span>
                              </PaginationItem>
                            );
                            pages.push(
                              <PaginationItem key={totalPages}>
                                <PaginationLink
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    navigateToPage(totalPages);
                                  }}
                                  className="bg-zinc-800/50 border-zinc-700 text-zinc-100 hover:bg-zinc-700 hover:border-zinc-600"
                                >
                                  {totalPages}
                                </PaginationLink>
                              </PaginationItem>
                            );
                          }
                        }
                      }
                      
                      return pages;
                    })()}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < Math.ceil(totalMovies / itemsPerPage)) {
                            navigateToPage(currentPage + 1);
                          }
                        }}
                        className={cn(
                          "bg-zinc-800/50 border-zinc-700 text-zinc-100 hover:bg-zinc-700 hover:border-zinc-600",
                          (currentPage === Math.ceil(totalMovies / itemsPerPage) || isPageLoading) && "pointer-events-none opacity-50"
                        )}
                        title="Próxima página (→)"
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>

                {/* Atalhos rápidos apenas em desktop */}
                <div className="hidden md:flex items-center gap-1">
                  {currentPage < Math.ceil(totalMovies / itemsPerPage) - 2 && (
                    <>
                      <div className="w-2" />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigateToPage(Math.ceil(totalMovies / itemsPerPage))}
                        className="h-8 px-2 bg-zinc-800/50 border-zinc-700 text-zinc-100 hover:bg-zinc-700 hover:border-zinc-600 text-xs"
                        title="Ir para a última página (End)"
                        disabled={isPageLoading || currentPage === Math.ceil(totalMovies / itemsPerPage)}
                      >
                        {loadingPage === Math.ceil(totalMovies / itemsPerPage) ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          "Última"
                        )}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Dica sobre atalhos de teclado */}
        {Math.ceil(totalMovies / itemsPerPage) > 1 && (
          <div className="mt-3 pt-3 border-t border-zinc-800">
            <div className={cn(
              "flex items-center justify-center text-xs transition-colors duration-300",
              keyboardNavigation ? "text-indigo-400" : "text-zinc-500"
            )}>
              💡 Use as setas ← → para navegar, Home/End para primeira/última página
            </div>
          </div>
        )}
      </div>

      <MovieRouletteModal
        genres={genres}
        open={isRouletteOpen}
        onOpenChange={setIsRouletteOpen}
      />
    </div>
  )
} 