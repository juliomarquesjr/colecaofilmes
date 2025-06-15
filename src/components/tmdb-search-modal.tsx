import { CalendarIcon, CheckIcon, FilmIcon, Loader2Icon, SearchIcon, StarIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import { Input } from './ui/input'

interface TMDBMovie {
  id: number
  title: string
  release_date: string
  poster_path: string | null
  backdrop_path: string | null
  overview: string
  vote_average: number
  original_title: string
  original_language: string
  popularity: number
  production_countries: Array<{ iso_3166_1: string, name: string }>
}

interface TMDBSearchModalProps {
  onMovieSelect: (movie: {
    title: string
    year: number
    coverUrl: string
    productionInfo: string
  }) => void
}

export function TMDBSearchModal({ onMovieSelect }: TMDBSearchModalProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [movies, setMovies] = useState<TMDBMovie[]>([])
  const [selectedMovie, setSelectedMovie] = useState<TMDBMovie | null>(null)

  const handleSearch = async () => {
    if (!searchTerm.trim()) return

    setIsLoading(true)
    setMovies([])
    setSelectedMovie(null)

    try {
      const res = await fetch(`/api/tmdb/search?query=${encodeURIComponent(searchTerm)}`)
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Erro ao buscar filmes')
      }
      
      const data = await res.json()
      setMovies(data.results)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao buscar filmes no TMDB')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatReleaseDate = (date: string) => {
    try {
      return new Intl.DateTimeFormat('pt-BR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }).format(new Date(date))
    } catch {
      return 'Data desconhecida'
    }
  }

  const handleSelect = (movie: TMDBMovie) => {
    setSelectedMovie(movie)

    // Prepara as informações de produção
    const productionInfo = [
      `Título Original: ${movie.original_title}`,
      `Idioma Original: ${movie.original_language.toUpperCase()}`,
      `Países de Produção: ${movie.production_countries.map(c => c.name).join(', ')}`,
      `Popularidade: ${movie.popularity.toFixed(1)}`,
      movie.overview
    ].filter(Boolean).join('\n\n')

    onMovieSelect({
      title: movie.title,
      year: new Date(movie.release_date).getFullYear(),
      coverUrl: movie.poster_path 
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : '/placeholder-movie.jpg',
      productionInfo,
    })
    setOpen(false)
    toast.success('Informações do filme importadas com sucesso!')
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="bg-zinc-900 text-zinc-100 hover:bg-zinc-800 hover:text-white border-zinc-800 hover:border-zinc-700 w-full"
        >
          <SearchIcon className="mr-2 h-4 w-4" />
          Buscar no TMDB
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] bg-zinc-900 text-zinc-100 border border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <FilmIcon className="h-5 w-5 text-indigo-400" />
            Buscar Filme no TMDB
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Pesquise por título para preencher automaticamente as informações do filme.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-2 focus:ring-indigo-800 focus:border-indigo-800"
              placeholder="Digite o título do filme..."
            />
            <Button 
              onClick={handleSearch}
              disabled={isLoading || !searchTerm.trim()}
              className="bg-indigo-950 hover:bg-indigo-900 text-indigo-100 border border-indigo-800"
            >
              {isLoading ? (
                <Loader2Icon className="h-4 w-4 animate-spin" />
              ) : (
                <SearchIcon className="h-4 w-4" />
              )}
            </Button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2Icon className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
          ) : movies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2">
              {movies.map((movie) => (
                <div
                  key={movie.id}
                  className={`
                    relative rounded-lg border p-3
                    ${selectedMovie?.id === movie.id
                      ? 'bg-indigo-950/50 border-indigo-800'
                      : 'bg-zinc-800/50 border-zinc-700'
                    }
                  `}
                >
                  <div className="flex gap-3">
                    {movie.poster_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                        alt={movie.title}
                        className="w-16 h-24 object-cover rounded"
                      />
                    ) : (
                      <div className="w-16 h-24 bg-zinc-800 rounded flex items-center justify-center">
                        <FilmIcon className="h-8 w-8 text-zinc-600" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-zinc-100 truncate">{movie.title}</h3>
                      <div className="flex items-center gap-2 mt-1 text-sm text-zinc-400">
                        <CalendarIcon className="h-3 w-3" />
                        <span>{formatReleaseDate(movie.release_date)}</span>
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <div className="flex items-center gap-1 text-xs px-1.5 py-0.5 rounded bg-yellow-950 text-yellow-500 border border-yellow-900/50">
                          <StarIcon className="h-3 w-3" />
                          <span>{movie.vote_average.toFixed(1)}</span>
                        </div>
                        <span className="text-xs text-zinc-500 uppercase">{movie.original_language}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full bg-indigo-950 hover:bg-indigo-900 text-indigo-100 border-indigo-800"
                          onClick={() => handleSelect(movie)}
                        >
                          <CheckIcon className="h-4 w-4 mr-2" />
                          Selecionar
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : searchTerm && !isLoading ? (
            <div className="text-center py-8 text-zinc-400">
              Nenhum filme encontrado para "{searchTerm}"
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  )
} 