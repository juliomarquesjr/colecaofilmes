"use client"

import { Button } from "@/components/ui/button"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowLeft, Clapperboard, Film, Loader2, Star } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"
import { toast } from "sonner"

interface Genre {
  id: number
  name: string
}

interface Movie {
  id: number
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

export default function RouletteMoviePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-zinc-900 to-indigo-900 p-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <Loader2 className="h-12 w-12 animate-spin text-indigo-500 mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Carregando Roleta...</h1>
            <p className="text-zinc-400">Preparando seus filmes para o sorteio</p>
          </div>
        </div>
      </div>
    }>
      <RouletteContent />
    </Suspense>
  )
}

function RouletteContent() {
  const searchParams = useSearchParams()
  const selectedGenres = searchParams.getAll("genres").map(Number).filter(id => !isNaN(id))
  
  const [movies, setMovies] = useState<Movie[]>([])
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const [isSpinning, setIsSpinning] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadUnwatchedMovies()
  }, []) // Remover selectedGenres da dependência para evitar loop

  async function loadUnwatchedMovies() {
    try {
      setIsLoading(true)
      setError(null)
      
      console.log('Carregando filmes não assistidos...')
      console.log('Gêneros selecionados:', selectedGenres)
      
      // Primeiro, vamos buscar o total para definir um limite adequado
      const res = await fetch("/api/filmes?unwatched=true&limit=1000")
      if (!res.ok) throw new Error("Erro ao carregar filmes")
      const data = await res.json()
      
      // A API retorna { movies, totalMovies }, então pegamos apenas movies
      const allMovies = data.movies || []
      const totalMovies = data.totalMovies || 0
      
      console.log(`Total de filmes não assistidos disponíveis: ${totalMovies}`)
      console.log(`Filmes carregados na primeira requisição: ${allMovies.length}`)
      
      // Se temos menos filmes carregados do que o total, significa que precisamos buscar mais
      let finalMovies = allMovies
      if (allMovies.length < totalMovies) {
        console.log('Buscando todos os filmes sem limite de paginação...')
        const allRes = await fetch(`/api/filmes?unwatched=true&limit=${totalMovies}`)
        if (allRes.ok) {
          const allData = await allRes.json()
          finalMovies = allData.movies || []
          console.log(`Total de filmes carregados após segunda requisição: ${finalMovies.length}`)
        }
      }
      
      // Filtra por gêneros selecionados (se houver gêneros selecionados)
      const filteredMovies = selectedGenres.length > 0 
        ? finalMovies.filter((movie: Movie) =>
            movie.genres.some(genre => selectedGenres.includes(genre.id))
          )
        : finalMovies
      
      console.log(`Filmes filtrados por gênero: ${filteredMovies.length}`)
      setMovies(filteredMovies)
      
    } catch (error) {
      console.error("Erro ao carregar filmes:", error)
      setError("Erro ao carregar filmes para o sorteio")
      toast.error("Erro ao carregar filmes")
    } finally {
      setIsLoading(false)
    }
  }

  const spinRoulette = () => {
    if (movies.length === 0) {
      toast.error("Nenhum filme disponível para sorteio!")
      return
    }

    setIsSpinning(true)
    setShowResult(false)
    setSelectedMovie(null)

    // Animação de "sorteio"
    let duration = 3000 // 3 segundos
    let intervals = 100 // Intervalo entre cada filme mostrado
    let count = 0
    const maxCount = duration / intervals

    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * movies.length)
      setSelectedMovie(movies[randomIndex])
      count++

      if (count >= maxCount) {
        clearInterval(interval)
        setIsSpinning(false)
        setShowResult(true)
      }
    }, intervals)
  }

  // Função para formatar a URL do YouTube para embed
  const getEmbedUrl = (url: string | null): string | undefined => {
    if (!url) return undefined
    
    try {
      // Tenta extrair o ID do vídeo de diferentes formatos de URL do YouTube
      let videoId = ""
      
      if (url.includes("youtube.com/watch?v=")) {
        videoId = new URL(url).searchParams.get("v") || ""
      } else if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1]?.split("?")[0] || ""
      } else if (url.includes("youtube.com/embed/")) {
        videoId = url.split("youtube.com/embed/")[1]?.split("?")[0] || ""
      }
      
      if (!videoId) return undefined
      
      // Retorna a URL de embed com parâmetros adicionais
      return `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`
    } catch (error) {
      console.error("Erro ao processar URL do trailer:", error)
      return undefined
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-zinc-900 to-indigo-900 p-8">
        <div className="mx-auto max-w-4xl">
          <Link href="/filmes" className="inline-flex items-center text-zinc-400 hover:text-white mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para lista
          </Link>

          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">🎲 Roleta de Filmes</h1>
            <p className="text-xl text-zinc-400">
              Deixe a sorte escolher seu próximo filme!
            </p>
          </div>

          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <Loader2 className="h-16 w-16 animate-spin text-indigo-500 mb-6" />
            <h2 className="text-2xl font-bold text-white mb-2">Carregando filmes...</h2>
            <p className="text-zinc-400 mb-4">Buscando filmes não assistidos na sua coleção</p>
            {selectedGenres.length > 0 && (
              <p className="text-sm text-zinc-500">
                Filtrando por {selectedGenres.length} gênero{selectedGenres.length !== 1 ? 's' : ''} selecionado{selectedGenres.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-zinc-900 to-indigo-900 p-8">
        <div className="mx-auto max-w-4xl">
          <Link href="/filmes" className="inline-flex items-center text-zinc-400 hover:text-white mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para lista
          </Link>

          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">🎲 Roleta de Filmes</h1>
            <p className="text-xl text-zinc-400">
              Deixe a sorte escolher seu próximo filme!
            </p>
          </div>

          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-white mb-2">Erro ao carregar filmes</h2>
            <p className="text-zinc-400 mb-6">{error}</p>
            <Button
              onClick={loadUnwatchedMovies}
              variant="outline"
              className="bg-zinc-800/50 border-zinc-700 text-white hover:bg-zinc-800 hover:text-white"
            >
              Tentar Novamente
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-zinc-900 to-indigo-900 p-8">
      <div className="mx-auto max-w-4xl">
        <Link href="/filmes" className="inline-flex items-center text-zinc-400 hover:text-white mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para lista
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">🎲 Roleta de Filmes</h1>
          <p className="text-xl text-zinc-400">
            Deixe a sorte escolher seu próximo filme!
          </p>
        </div>

        <div className="relative min-h-[400px]">
          <AnimatePresence mode="wait">
            {!selectedMovie && !isSpinning && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center"
              >
                {movies.length > 0 ? (
                  <div className="space-y-4">
                    <p className="text-zinc-400 mb-4">
                      {movies.length} filme{movies.length !== 1 ? 's' : ''} disponível{movies.length !== 1 ? 'eis' : ''} para sorteio
                    </p>
                    {selectedGenres.length > 0 && (
                      <p className="text-sm text-zinc-500 mb-4">
                        Filtrados por {selectedGenres.length} gênero{selectedGenres.length !== 1 ? 's' : ''} selecionado{selectedGenres.length !== 1 ? 's' : ''}
                      </p>
                    )}
                    <Button
                      onClick={spinRoulette}
                      size="lg"
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-xl px-8 py-6"
                    >
                      <Clapperboard className="mr-2 h-6 w-6" />
                      Girar a Roleta!
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-6xl mb-4">🎬</div>
                    <h3 className="text-xl font-medium text-white mb-2">
                      Nenhum filme disponível para sorteio
                    </h3>
                    <p className="text-zinc-400 text-center max-w-md mx-auto mb-6">
                      {selectedGenres.length > 0 
                        ? "Não há filmes não assistidos nos gêneros selecionados. Tente selecionar outros gêneros ou adicione mais filmes à sua coleção."
                        : "Não há filmes não assistidos na sua coleção ou todos os gêneros foram desmarcados."
                      }
                    </p>
                    <div className="flex gap-3 justify-center">
                      <Button
                        onClick={loadUnwatchedMovies}
                        variant="outline"
                        className="bg-zinc-800/50 border-zinc-700 text-white hover:bg-zinc-800 hover:text-white"
                      >
                        Recarregar
                      </Button>
                      <Link href="/filmes">
                        <Button
                          variant="outline"
                          className="bg-zinc-800/50 border-zinc-700 text-white hover:bg-zinc-800 hover:text-white"
                        >
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          Voltar para Filmes
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {selectedMovie && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`bg-zinc-900/80 backdrop-blur rounded-xl p-6 ${isSpinning ? "animate-pulse" : ""}`}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <motion.img
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      src={selectedMovie.coverUrl}
                      alt={selectedMovie.title}
                      className="w-full rounded-lg shadow-2xl"
                    />
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">{selectedMovie.title}</h2>
                    {selectedMovie.originalTitle && (
                      <p className="text-zinc-400 italic">{selectedMovie.originalTitle}</p>
                    )}
                    <div className="flex items-center gap-2 text-zinc-300">
                      <Film className="h-4 w-4" />
                      <span>{selectedMovie.year}</span>
                      {selectedMovie.rating && (
                        <>
                          <Star className="h-4 w-4 ml-2 text-yellow-500" />
                          <span>{selectedMovie.rating}/10</span>
                        </>
                      )}
                    </div>
                    <p className="text-zinc-300">{selectedMovie.overview}</p>
                    
                    {selectedMovie.trailerUrl && showResult && (
                      <div className="mt-4">
                        <h3 className="text-lg font-semibold text-white mb-2">Trailer</h3>
                        <div className="aspect-video rounded-lg overflow-hidden bg-zinc-800">
                          {getEmbedUrl(selectedMovie.trailerUrl) ? (
                            <iframe
                              src={getEmbedUrl(selectedMovie.trailerUrl)}
                              className="w-full h-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-500">
                              URL do trailer inválida
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 text-center"
            >
              <Button
                onClick={spinRoulette}
                variant="outline"
                size="lg"
                className="bg-zinc-800/50 border-zinc-700 text-white hover:bg-zinc-800 hover:text-white"
              >
                Sortear Outro Filme
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
} 