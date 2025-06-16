"use client"

import { Button } from "@/components/ui/button"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowLeft, Clapperboard, Film, Star } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
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
  const searchParams = useSearchParams()
  const selectedGenres = searchParams.getAll("genres").map(Number)
  
  const [movies, setMovies] = useState<Movie[]>([])
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const [isSpinning, setIsSpinning] = useState(false)
  const [showResult, setShowResult] = useState(false)

  useEffect(() => {
    loadUnwatchedMovies()
  }, [])

  async function loadUnwatchedMovies() {
    try {
      const res = await fetch("/api/filmes?unwatched=true")
      if (!res.ok) throw new Error("Erro ao carregar filmes")
      const allMovies = await res.json()
      
      // Filtra por gêneros selecionados
      const filteredMovies = allMovies.filter((movie: Movie) =>
        movie.genres.some(genre => selectedGenres.includes(genre.id))
      )
      
      setMovies(filteredMovies)
    } catch (error) {
      console.error("Erro ao carregar filmes:", error)
      toast.error("Erro ao carregar filmes")
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
  const getEmbedUrl = (url: string | null) => {
    if (!url) return null
    
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
      
      if (!videoId) return null
      
      // Retorna a URL de embed com parâmetros adicionais
      return `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`
    } catch (error) {
      console.error("Erro ao processar URL do trailer:", error)
      return null
    }
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
                <Button
                  onClick={spinRoulette}
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-xl px-8 py-6"
                >
                  <Clapperboard className="mr-2 h-6 w-6" />
                  Girar a Roleta!
                </Button>
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