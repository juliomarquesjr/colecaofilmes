"use client"

import { GenreManagementModal } from "@/components/genre-management-modal"
import { MovieCard } from "@/components/movie-card"
import { MovieFilters } from "@/components/movie-filters"
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
import { useDebounce } from "@/hooks/use-debounce"
import { useMovieStats } from "@/hooks/use-movie-stats"
import { cn } from "@/lib/utils"
import { Loader2, Plus, Search } from "lucide-react"
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
  
  // Hook para estatísticas dos filmes
  const { stats, isLoading: isStatsLoading, error: statsError, refetch: refetchStats } = useMovieStats()
  
  const [movies, setMovies] = useState<MovieWithGenres[]>([])
  const [filteredMovies, setFilteredMovies] = useState<MovieWithGenres[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [genres, setGenres] = useState<Genre[]>([])
  const [selectedGenre, setSelectedGenre] = useState("all")
  const [selectedYear, setSelectedYear] = useState("all")
  const [selectedRating, setSelectedRating] = useState("all")
  const [selectedMediaType, setSelectedMediaType] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(12)
  const [totalMovies, setTotalMovies] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [keyboardNavigation, setKeyboardNavigation] = useState(false)
  const [isPageLoading, setIsPageLoading] = useState(false)
  const [loadingPage, setLoadingPage] = useState<number | null>(null)
  const [isSearchLoading, setIsSearchLoading] = useState(false)
  const [showExtendedStats, setShowExtendedStats] = useState(false)

  // Debounce da pesquisa para evitar muitas requisições
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  // Obtém os anos únicos dos filmes
  const availableYears = [...new Set(movies.map(movie => movie.year))].sort((a, b) => b - a)

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
  }, [currentPage, itemsPerPage, debouncedSearchTerm, selectedGenre, selectedYear, selectedRating, selectedMediaType])

  // Exibe erro se houver problema ao carregar estatísticas
  useEffect(() => {
    if (statsError) {
      toast.error("Erro ao carregar estatísticas dos filmes")
    }
  }, [statsError])

  // Reset página quando pesquisa mudar
  useEffect(() => {
    if (debouncedSearchTerm !== searchTerm && searchTerm !== "") {
      setCurrentPage(1)
    }
  }, [debouncedSearchTerm])

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
      // Define qual tipo de loading mostrar
      if (debouncedSearchTerm !== searchTerm || currentPage === 1) {
        setIsSearchLoading(true)
      } else {
        setIsPageLoading(true)
      }

      // Constrói os parâmetros da URL
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
      })

      if (debouncedSearchTerm) {
        params.append('search', debouncedSearchTerm)
      }
      if (selectedGenre !== 'all') {
        params.append('genreId', selectedGenre)
      }
      if (selectedYear !== 'all') {
        params.append('year', selectedYear)
      }
      if (selectedRating !== 'all') {
        params.append('rating', selectedRating)
      }
      if (selectedMediaType !== 'all') {
        params.append('mediaType', selectedMediaType)
      }

      const res = await fetch(`/api/filmes?${params.toString()}`)
      if (!res.ok) throw new Error("Erro ao carregar filmes")
      const data = await res.json()
      
      setMovies(data.movies)
      setFilteredMovies(data.movies) // Com pesquisa global, não precisamos filtrar localmente
      setTotalMovies(data.totalMovies)
    } catch (error) {
      console.error("Erro ao carregar filmes:", error)
      toast.error("Erro ao carregar filmes")
    } finally {
      setIsLoading(false)
      setIsPageLoading(false)
      setIsSearchLoading(false)
      setLoadingPage(null)
    }
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
    setSelectedMediaType("all")
    setCurrentPage(1) // Reset para primeira página ao limpar filtros
  }

  // Handlers para resetar página quando filtros mudarem
  const handleGenreChange = (value: string) => {
    setSelectedGenre(value)
    setCurrentPage(1)
  }

  const handleYearChange = (value: string) => {
    setSelectedYear(value)
    setCurrentPage(1)
  }

  const handleRatingChange = (value: string) => {
    setSelectedRating(value)
    setCurrentPage(1)
  }

  const handleMediaTypeChange = (value: string) => {
    setSelectedMediaType(value)
    setCurrentPage(1)
  }

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/filmes/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Erro ao excluir filme")
      setMovies((prev) => prev.filter((movie) => movie.id !== id))
      
      // Recarrega as estatísticas após excluir filme
      refetchStats();
      
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
      
      // Recarrega as estatísticas após marcar/desmarcar filme como assistido
      refetchStats();
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
            totalMovies={stats?.totalMovies}
            watchedMovies={stats?.watchedMovies}
            watchedPercentage={stats?.watchedPercentage}
            isLoading={isStatsLoading}
            compact
          />
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
          <Search className={cn(
            "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-200",
            isSearchLoading ? "text-indigo-500" : "text-zinc-500"
          )} />
          {isSearchLoading && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-indigo-500" />
          )}
          <Input
            type="text"
            placeholder="Buscar por título, ano, mídia ou código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={cn(
              "pl-9 h-11 bg-zinc-800/50 border-zinc-700 text-zinc-100 focus-visible:ring-1 focus-visible:ring-indigo-500 transition-all duration-200",
              isSearchLoading && "pr-10 border-indigo-500/50"
            )}
          />
        </div>

        <Separator className="my-4" />

        {/* Filtros */}
        <MovieFilters
          genres={genres}
          selectedGenre={selectedGenre}
          selectedYear={selectedYear}
          selectedRating={selectedRating}
          selectedMediaType={selectedMediaType}
          onGenreChange={handleGenreChange}
          onYearChange={handleYearChange}
          onRatingChange={handleRatingChange}
          onMediaTypeChange={handleMediaTypeChange}
          onClearFilters={handleClearFilters}
          availableYears={availableYears}
        />
      </div>

      {/* Lista de Filmes */}
      <div className="relative">
        {/* Overlay de carregamento - apenas quando há filmes ou é carregamento inicial */}
        {(isPageLoading || isSearchLoading) && (filteredMovies.length > 0 || isLoading) && (
          <div className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
            <div className="flex flex-col items-center gap-3 text-zinc-100">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
              <div className="text-sm font-medium">
                {isSearchLoading ? "Pesquisando filmes..." : "Carregando filmes..."}
              </div>
              <div className="text-xs text-zinc-400">
                {isSearchLoading ? "Aplicando filtros" : `Página ${loadingPage || currentPage}`}
              </div>
            </div>
          </div>
        )}
        
        {/* Loading para lista vazia durante pesquisa */}
        {(isSearchLoading || isPageLoading) && filteredMovies.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-500 mb-4" />
            <div className="text-sm font-medium text-zinc-100">
              {isSearchLoading ? "Pesquisando filmes..." : "Carregando filmes..."}
            </div>
            <div className="text-xs text-zinc-500 mt-1">
              {isSearchLoading ? "Aplicando filtros" : `Página ${loadingPage || currentPage}`}
            </div>
          </div>
        )}
        
        {/* Grid de filmes */}
        {filteredMovies.length > 0 && (
          <div className={cn(
            "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 transition-opacity duration-200",
            (isPageLoading || isSearchLoading) && "opacity-50"
          )}>
            {filteredMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onEdit={(id) => router.push(`/filmes/${id}/editar`)}
                onDelete={handleDelete}
                onWatchedToggle={handleWatchedToggle}
                totalMovies={stats?.totalMovies || 0}
                watchedMovies={stats?.watchedMovies || 0}
              />
            ))}
          </div>
        )}
        
        {/* Estado vazio - nenhum resultado encontrado */}
        {!isLoading && !isSearchLoading && !isPageLoading && filteredMovies.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
            <div className="text-6xl mb-4">🎬</div>
            <h3 className="text-lg font-medium text-zinc-100 mb-2">
              Nenhum filme encontrado
            </h3>
            <p className="text-sm text-zinc-500 text-center max-w-md mb-6">
              {searchTerm || selectedGenre !== "all" || selectedYear !== "all" || selectedRating !== "all" || selectedMediaType !== "all"
                ? "Não encontramos filmes que correspondam aos filtros aplicados. Tente ajustar os critérios de pesquisa."
                : "Sua coleção está vazia. Que tal adicionar alguns filmes?"}
            </p>
            <div className="flex gap-3">
              {(searchTerm || selectedGenre !== "all" || selectedYear !== "all" || selectedRating !== "all" || selectedMediaType !== "all") && (
                <Button
                  variant="outline"
                  onClick={handleClearFilters}
                  className="bg-zinc-800/50 border-zinc-700 text-zinc-100 hover:bg-zinc-700 hover:text-white"
                >
                  Limpar Filtros
                </Button>
              )}
              <Link href="/filmes/cadastrar">
                <Button className="bg-indigo-600 text-white hover:bg-indigo-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Filme
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Paginação - apenas quando há resultados */}
      {totalMovies > 0 && (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Informações e Controle de Itens por Página */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="text-sm text-zinc-400">
                Mostrando {Math.min((currentPage - 1) * itemsPerPage + 1, totalMovies)} a{' '}
                {Math.min(currentPage * itemsPerPage, totalMovies)} de {totalMovies} filmes
              </div>
              
              {/* Barra de progresso visual compacta */}
              <div className="flex items-center gap-2">
                <div className="w-24 h-1 bg-zinc-800 rounded-full overflow-hidden">
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
                  "text-xs transition-colors duration-200 min-w-[60px]",
                  isPageLoading ? "text-indigo-400" : "text-zinc-500"
                )}>
                  {isPageLoading ? (
                    <div className="flex items-center gap-1">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span className="text-[10px]">...</span>
                    </div>
                  ) : (
                    `${currentPage}/${Math.ceil(totalMovies / itemsPerPage)}`
                  )}
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <span className="hidden sm:inline">Por página:</span>
                <span className="sm:hidden">Itens:</span>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={handleItemsPerPageChange}
                  disabled={isPageLoading}
                >
                  <SelectTrigger className={cn(
                    "w-[70px] h-8 bg-zinc-800/50 border-zinc-700 text-zinc-100 focus-visible:ring-1 focus-visible:ring-indigo-500",
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
                    <SelectItem value="60">60</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Sistema de Navegação Otimizado */}
            {Math.ceil(totalMovies / itemsPerPage) > 1 && (
              <div className="flex items-center justify-center sm:justify-end">
                {(() => {
                  const totalPages = Math.ceil(totalMovies / itemsPerPage);
                  
                  // Para poucos itens, paginação tradicional simples
                  if (totalPages <= 5) {
                    return (
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
                          
                          {/* Renderiza todas as páginas quando são ≤5 */}
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <PaginationItem key={page}>
                              <PaginationLink
                                href="#"
                                isActive={currentPage === page}
                                onClick={(e) => {
                                  e.preventDefault();
                                  navigateToPage(page);
                                }}
                                className={cn(
                                  "bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700 hover:border-zinc-600",
                                  currentPage === page 
                                    ? "bg-indigo-600 border-indigo-500 text-white hover:bg-indigo-700 hover:border-indigo-600"
                                    : "text-zinc-100",
                                  isPageLoading && "pointer-events-none",
                                  loadingPage === page && "opacity-75"
                                )}
                              >
                                {loadingPage === page ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  page
                                )}
                              </PaginationLink>
                            </PaginationItem>
                          ))}

                          <PaginationItem>
                            <PaginationNext
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                if (currentPage < totalPages) {
                                  navigateToPage(currentPage + 1);
                                }
                              }}
                              className={cn(
                                "bg-zinc-800/50 border-zinc-700 text-zinc-100 hover:bg-zinc-700 hover:border-zinc-600",
                                (currentPage === totalPages || isPageLoading) && "pointer-events-none opacity-50"
                              )}
                              title="Próxima página (→)"
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    );
                  }
                  
                  // Para muitas páginas (>5), usar truncamento inteligente seguindo padrões da comunidade
                  return (
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
                        
                        {/* Lógica de truncamento inteligente */}
                        {(() => {
                          const pages = [];
                          
                          // Sempre mostra a primeira página
                          pages.push(
                            <PaginationItem key={1}>
                              <PaginationLink
                                href="#"
                                isActive={currentPage === 1}
                                onClick={(e) => {
                                  e.preventDefault();
                                  navigateToPage(1);
                                }}
                                className={cn(
                                  "bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700 hover:border-zinc-600",
                                  currentPage === 1 
                                    ? "bg-indigo-600 border-indigo-500 text-white hover:bg-indigo-700 hover:border-indigo-600"
                                    : "text-zinc-100",
                                  isPageLoading && "pointer-events-none",
                                  loadingPage === 1 && "opacity-75"
                                )}
                              >
                                {loadingPage === 1 ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  1
                                )}
                              </PaginationLink>
                            </PaginationItem>
                          );
                          
                          // Elipse inicial se necessário
                          if (currentPage > 4) {
                            pages.push(
                              <PaginationItem key="ellipsis-start">
                                <span className="flex h-9 w-9 items-center justify-center text-zinc-500">...</span>
                              </PaginationItem>
                            );
                          }
                          
                          // Páginas ao redor da atual
                          const start = Math.max(2, currentPage - 1);
                          const end = Math.min(totalPages - 1, currentPage + 1);
                          
                          for (let i = start; i <= end; i++) {
                            if (i === 1 || i === totalPages) continue; // Já tratadas separadamente
                            
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
                          
                          // Elipse final se necessário
                          if (currentPage < totalPages - 3) {
                            pages.push(
                              <PaginationItem key="ellipsis-end">
                                <span className="flex h-9 w-9 items-center justify-center text-zinc-500">...</span>
                              </PaginationItem>
                            );
                          }
                          
                          // Sempre mostra a última página (se não for a primeira)
                          if (totalPages > 1) {
                            pages.push(
                              <PaginationItem key={totalPages}>
                                <PaginationLink
                                  href="#"
                                  isActive={currentPage === totalPages}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    navigateToPage(totalPages);
                                  }}
                                  className={cn(
                                    "bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700 hover:border-zinc-600",
                                    currentPage === totalPages 
                                      ? "bg-indigo-600 border-indigo-500 text-white hover:bg-indigo-700 hover:border-indigo-600"
                                      : "text-zinc-100",
                                    isPageLoading && "pointer-events-none",
                                    loadingPage === totalPages && "opacity-75"
                                  )}
                                >
                                  {loadingPage === totalPages ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                  ) : (
                                    totalPages
                                  )}
                                </PaginationLink>
                              </PaginationItem>
                            );
                          }
                          
                          return pages;
                        })()}

                        <PaginationItem>
                          <PaginationNext
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              if (currentPage < totalPages) {
                                navigateToPage(currentPage + 1);
                              }
                            }}
                            className={cn(
                              "bg-zinc-800/50 border-zinc-700 text-zinc-100 hover:bg-zinc-700 hover:border-zinc-600",
                              (currentPage === totalPages || isPageLoading) && "pointer-events-none opacity-50"
                            )}
                            title="Próxima página (→)"
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  );
                })()}
              </div>
            )}
          </div>
          
                     {/* Dicas de navegação contextuais */}
           {Math.ceil(totalMovies / itemsPerPage) > 1 && (
             <div className="mt-3 pt-3 border-t border-zinc-800">
               <div className={cn(
                 "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs transition-colors duration-300",
                 keyboardNavigation ? "text-indigo-400" : "text-zinc-500"
               )}>
                 <div className="flex items-center gap-4">
                   <span>💡 Teclado: ← → (páginas) | Home/End (início/fim)</span>
                   {Math.ceil(totalMovies / itemsPerPage) > 5 && (
                     <span className="hidden sm:inline">✨ Navegação otimizada com elipses (...)</span>
                   )}
                 </div>
                 {Math.ceil(totalMovies / itemsPerPage) > 20 && (
                   <div className="text-amber-400">
                     <span>⚡ {Math.ceil(totalMovies / itemsPerPage)} páginas - considere filtrar para melhor navegação</span>
                   </div>
                 )}
               </div>
             </div>
           )}
        </div>
      )}

    </div>
  )
} 