import debounce from 'lodash/debounce'
import { FilmIcon, Loader2, Plus, SearchIcon, Star } from 'lucide-react'
import { useCallback, useState } from 'react'
import { toast } from 'sonner'
import { Button } from './ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from './ui/dialog'
import { Input } from './ui/input'

interface TMDBMovie {
  id: number
  title: string
  original_title: string
  overview: string
  release_date: string
  poster_path: string | null
  production_countries?: { iso_3166_1: string; name: string }[]
  vote_average: number
  genres: { id: number; name: string }[]
}

interface TMDBSearchModalProps {
  onMovieSelect: (movieData: {
    title: string
    originalTitle: string
    overview: string
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
  const [searchStatus, setSearchStatus] = useState<string>('')

  const searchMovies = useCallback(
    debounce(async (term: string) => {
      if (!term.trim()) {
        setMovies([])
        setSearchStatus('')
        return
      }

      setIsLoading(true)
      setSearchStatus(`Pesquisando por "${term}"...`)

      try {
        const res = await fetch(`/api/tmdb/search?query=${encodeURIComponent(term)}`)
        if (!res.ok) throw new Error('Erro ao buscar filmes')
        
        const data = await res.json()
        setMovies(data.results || [])
        
        if (data.results.length === 0) {
          setSearchStatus('Nenhum filme encontrado com este título')
        } else {
          setSearchStatus(`${data.results.length} filmes encontrados`)
        }
      } catch (error) {
        console.error(error)
        toast.error('Erro ao buscar filmes no TMDB')
        setSearchStatus('Erro ao realizar a busca')
        setMovies([])
      } finally {
        setIsLoading(false)
      }
    }, 500),
    []
  )

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    setSearchStatus(value.trim() ? 'Aguarde...' : '')
    searchMovies(value)
  }

  const handleMovieSelect = (movie: TMDBMovie) => {
    const year = movie.release_date ? parseInt(movie.release_date.split('-')[0]) : 0
    const coverUrl = movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : ''
    const productionCountries = movie.production_countries?.map(country => country.name).join(', ') || 'País não informado'
    
    onMovieSelect({
      title: movie.title,
      originalTitle: movie.original_title,
      overview: movie.overview || '',
      year,
      coverUrl,
      productionInfo: `Produzido em: ${productionCountries}`,
    })
    
    setOpen(false)
    setSearchTerm('')
    setMovies([])
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
      <DialogContent className="sm:max-w-[1000px] max-h-[90vh] bg-zinc-900 text-zinc-100 border border-zinc-800 flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-xl font-semibold flex items-center gap-3 text-white">
            <div className="p-2 rounded-lg bg-indigo-950/50 border border-indigo-900/50">
              <FilmIcon className="h-5 w-5 text-indigo-400" />
            </div>
            Buscar Filme no TMDB
          </DialogTitle>
          <DialogDescription className="text-zinc-400 mt-2">
            Pesquise por título para preencher automaticamente as informações do filme.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 flex-shrink-0">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              value={searchTerm}
              onChange={handleSearchChange}
              className="bg-zinc-800 border-zinc-700 text-zinc-100 pl-10 focus:ring-2 focus:ring-indigo-800 focus:border-indigo-800"
              placeholder="Digite o título do filme..."
            />
          </div>

          {searchStatus && (
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {searchStatus}
            </div>
          )}
        </div>

        {movies.length > 0 && (
          <div className="overflow-y-auto flex-grow mt-6 pr-2 -mr-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {movies.map((movie) => (
                <div
                  key={movie.id}
                  className="group relative bg-zinc-800 rounded-lg border border-zinc-700 overflow-hidden hover:border-indigo-800 transition-colors flex"
                >
                  {/* Capa do Filme */}
                  <div className="relative w-[100px] flex-shrink-0">
                    <div className="aspect-[2/3] w-full relative bg-zinc-900">
                      {movie.poster_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                          alt={movie.title}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FilmIcon className="h-8 w-8 text-zinc-700" />
                        </div>
                      )}
                    </div>
                    {/* Nota do filme */}
                    <div className="absolute top-1 right-1 flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/60 text-yellow-500 text-xs font-medium">
                      <Star className="h-3 w-3 fill-yellow-500" />
                      {movie.vote_average.toFixed(1)}
                    </div>
                  </div>
                  
                  {/* Informações do Filme */}
                  <div className="flex flex-col flex-1 p-3 min-w-0">
                    <div className="flex-1">
                      <h3 className="font-medium text-zinc-100 line-clamp-1">
                        {movie.title}
                      </h3>
                      {movie.original_title !== movie.title && (
                        <p className="text-xs text-zinc-500 mt-0.5 line-clamp-1">
                          Título Original: {movie.original_title}
                        </p>
                      )}
                      <div className="flex items-center gap-2 flex-wrap mt-1.5 text-xs">
                        <span className="text-zinc-400">
                          {movie.release_date ? movie.release_date.split('-')[0] : 'Ano não informado'}
                        </span>
                        {movie.production_countries && movie.production_countries.length > 0 && (
                          <span className="text-zinc-500 line-clamp-1">
                            • {movie.production_countries[0].name}
                          </span>
                        )}
                      </div>
                      {movie.overview && (
                        <p className="text-xs text-zinc-400 mt-2 line-clamp-2">
                          {movie.overview}
                        </p>
                      )}
                      {movie.genres && movie.genres.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-zinc-500 mb-1">Gêneros:</p>
                          <div className="flex flex-wrap gap-1">
                            {movie.genres.map(genre => (
                              <span 
                                key={genre.id}
                                className="px-1.5 py-0.5 bg-zinc-700/50 text-zinc-300 rounded text-xs"
                              >
                                {genre.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <Button
                      onClick={() => handleMovieSelect(movie)}
                      className="w-full mt-3 bg-indigo-950 hover:bg-indigo-900 text-indigo-100 border border-indigo-800"
                      size="sm"
                    >
                      <Plus className="mr-1.5 h-3.5 w-3.5" />
                      Selecionar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
} 