import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useConfetti } from "@/hooks/useConfetti";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Eye, FilmIcon, FolderIcon, Pencil, Star, Youtube } from "lucide-react";
import { useEffect, useState } from "react";
import { MoviePreviewSkeleton } from "./movie-preview-skeleton";
import { VideoPlayerModal } from "./video-player-modal";

interface MoviePreviewModalProps {
  movie: {
    id: number;
    uniqueCode: string;
    title: string;
    originalTitle: string | null;
    overview: string | null;
    year: number;
    mediaType: string;
    shelfCode: string;
    coverUrl: string;
    productionInfo: string;
    rating: number | null;
    trailerUrl?: string | null;
    watchedAt?: Date | null;
    genres?: {
      id: number;
      name: string;
    }[];
  };
  isLoading?: boolean;
  onWatchedToggle?: (id: number) => Promise<void>;
  onEdit?: (id: number) => void;
  totalMovies?: number;
  watchedMovies?: number;
}

function extractYouTubeId(url: string): string | null {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.95, 
    y: 20 
  },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: {
      type: "spring" as const,
      duration: 0.5,
      bounce: 0.3
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    y: 20,
    transition: {
      type: "tween" as const,
      duration: 0.2
    }
  }
};

export function MoviePreviewModal({ 
  movie, 
  isLoading = false, 
  onWatchedToggle,
  onEdit,
  totalMovies = 0,
  watchedMovies = 0,
}: MoviePreviewModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [isWatched, setIsWatched] = useState(!!movie.watchedAt);
  const [isTogglingWatched, setIsTogglingWatched] = useState(false);
  const { fireConfetti } = useConfetti();

  const videoId = movie.trailerUrl ? extractYouTubeId(movie.trailerUrl) : null;

  const handleWatchedToggle = async () => {
    if (!onWatchedToggle || isTogglingWatched) return;
    
    setIsTogglingWatched(true);
    try {
      await onWatchedToggle(movie.id);
      setIsWatched(!isWatched);
      
      // Calcula se atingirá 100% após marcar este filme
      const newWatchedCount = !isWatched ? watchedMovies + 1 : watchedMovies - 1;
      const newPercentage = totalMovies > 0 
        ? Math.round((newWatchedCount / totalMovies) * 100) 
        : 0;

      // Dispara confetes apenas se atingir 100% ao marcar como assistido
      if (newPercentage === 100 && !isWatched) {
        fireConfetti();
      }
    } finally {
      setIsTogglingWatched(false);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(movie.id);
      setIsOpen(false);
    }
  };

  useEffect(() => {
    setIsWatched(!!movie.watchedAt);
  }, [movie.watchedAt]);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            size="sm"
            variant="secondary"
            className="h-8 w-32 border-zinc-700 bg-zinc-800/50 text-zinc-100 hover:bg-zinc-800 hover:text-white"
          >
            <Eye className="h-4 w-4 mr-2" />
            Ver
          </Button>
        </DialogTrigger>

        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={overlayVariants}
                className="fixed inset-0 bg-black/60 z-50"
                onClick={() => setIsOpen(false)}
              />
              <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-zinc-900 text-zinc-100 border border-zinc-800 z-50">
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={modalVariants}
                >
                  {isLoading ? (
                    <MoviePreviewSkeleton />
                  ) : (
                    <>
                      <DialogHeader>
                        <motion.div
                          initial={{ y: -20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.1 }}
                        >
                          <DialogTitle className="text-xl font-semibold flex items-center gap-3 text-white">
                            <motion.div
                              initial={{ rotate: -180, opacity: 0 }}
                              animate={{ rotate: 0, opacity: 1 }}
                              transition={{ duration: 0.5, type: "spring" }}
                              className="p-2 rounded-lg bg-indigo-950/50 border border-indigo-900/50"
                            >
                              <FilmIcon className="h-5 w-5 text-indigo-400" />
                            </motion.div>
                            Detalhes do Filme
                          </DialogTitle>
                          <DialogDescription className="text-zinc-400 mt-2">
                            Visualize todas as informações do filme
                          </DialogDescription>
                        </motion.div>
                      </DialogHeader>

                      <div className="grid sm:grid-cols-[180px,1fr] gap-6 mt-6">
                        {/* Capa do Filme */}
                        <motion.div
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          <div className="aspect-[2/3] relative bg-zinc-800 rounded-lg border border-zinc-700 overflow-hidden">
                            {movie.coverUrl ? (
                              <motion.img
                                initial={{ scale: 1.2 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.5 }}
                                src={movie.coverUrl}
                                alt={movie.title}
                                className="absolute inset-0 w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <FilmIcon className="h-12 w-12 text-zinc-700" />
                              </div>
                            )}
                            {/* Nota do filme */}
                            {movie.rating && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.4 }}
                                className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded bg-black/60"
                              >
                                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                                <span className="text-sm font-medium text-yellow-500">
                                  {movie.rating.toFixed(1)}
                                </span>
                              </motion.div>
                            )}
                          </div>

                          {/* Ações do Filme - Movido para abaixo da capa */}
                          <motion.div
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="flex flex-col gap-3 mt-4"
                          >
                            {/* Botão de Marcar como Assistido */}
                            <Button
                              variant="outline"
                              className={`w-full ${
                                movie.watchedAt
                                  ? "bg-emerald-950/50 border-emerald-900/50 text-emerald-400 hover:bg-emerald-950/70"
                                  : "bg-zinc-800/50 border-zinc-700 text-zinc-100 hover:bg-zinc-800"
                              }`}
                              onClick={handleWatchedToggle}
                              disabled={isTogglingWatched}
                            >
                              <Check className={`h-4 w-4 mr-2 ${movie.watchedAt ? "text-emerald-400" : "text-zinc-400"}`} />
                              {isTogglingWatched ? "Atualizando..." : movie.watchedAt ? "Assistido" : "Marcar como Assistido"}
                            </Button>

                            {/* Botão de Editar */}
                            {onEdit && (
                              <Button
                                variant="outline"
                                className="w-full bg-blue-950/50 border-blue-900/50 text-blue-400 hover:bg-blue-950/70"
                                onClick={handleEdit}
                              >
                                <Pencil className="h-4 w-4 mr-2" />
                                Editar
                              </Button>
                            )}

                            {/* Botão do Trailer */}
                            {movie.trailerUrl && videoId && (
                              <Button
                                variant="outline"
                                className="w-full bg-red-950/50 border-red-900/50 text-red-400 hover:bg-red-950/70"
                                onClick={() => setShowTrailer(true)}
                              >
                                <Youtube className="h-4 w-4 mr-2" />
                                Assistir Trailer
                              </Button>
                            )}
                          </motion.div>
                        </motion.div>

                        {/* Informações do Filme */}
                        <motion.div
                          initial={{ x: 20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className="space-y-4"
                        >
                          <div>
                            <h3 className="text-xl font-semibold text-white">{movie.title}</h3>
                            {movie.originalTitle && (
                              <p className="text-sm text-zinc-400 mt-1">
                                Título Original: {movie.originalTitle}
                              </p>
                            )}
                          </div>

                          <motion.div
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="flex flex-wrap items-center gap-2"
                          >
                            <Badge variant="outline" className="bg-zinc-800/50 border-indigo-900/50 text-indigo-400">
                              Código: {movie.uniqueCode}
                            </Badge>
                            <Badge variant="outline" className="bg-zinc-800">
                              {movie.year}
                            </Badge>
                            <Badge variant="outline" className="bg-zinc-800">
                              {movie.mediaType}
                            </Badge>
                            <Badge variant="outline" className="bg-zinc-800">
                              Estante: {movie.shelfCode}
                            </Badge>
                            {movie.trailerUrl && (
                              <Badge variant="outline" className="bg-red-950/50 border-red-900/50 text-red-400 flex items-center gap-1">
                                <Youtube className="h-3 w-3" />
                                Trailer Disponível
                              </Badge>
                            )}
                            {movie.watchedAt && (
                              <Badge variant="outline" className="bg-emerald-950/50 border-emerald-900/50 text-emerald-400 flex items-center gap-1">
                                <Check className="h-3 w-3" />
                                Assistido em {format(new Date(movie.watchedAt), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                              </Badge>
                            )}
                          </motion.div>

                          {/* Gêneros/Categorias */}
                          {movie.genres && movie.genres.length > 0 && (
                            <motion.div
                              initial={{ y: 10, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 0.45 }}
                            >
                              <h4 className="text-sm font-medium text-zinc-300 mb-2">Gêneros</h4>
                              <div className="flex flex-wrap gap-2">
                                {movie.genres.map((genre) => (
                                  <Badge 
                                    key={genre.id} 
                                    variant="outline" 
                                    className="bg-zinc-800/50 border-zinc-700 text-zinc-300 flex items-center gap-1"
                                  >
                                    <FolderIcon className="h-3 w-3" />
                                    {genre.name}
                                  </Badge>
                                ))}
                              </div>
                            </motion.div>
                          )}

                          {movie.overview && (
                            <motion.div
                              initial={{ y: 10, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 0.5 }}
                            >
                              <h4 className="text-sm font-medium text-zinc-300 mb-1">Sinopse</h4>
                              <p className="text-sm text-zinc-400">{movie.overview}</p>
                            </motion.div>
                          )}

                          <motion.div
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                          >
                            <h4 className="text-sm font-medium text-zinc-300 mb-1">
                              Informações de Produção
                            </h4>
                            <p className="text-sm text-zinc-400">{movie.productionInfo}</p>
                          </motion.div>
                        </motion.div>
                      </div>
                    </>
                  )}
                </motion.div>
              </DialogContent>
            </>
          )}
        </AnimatePresence>
      </Dialog>

      {showTrailer && videoId && (
        <VideoPlayerModal
          videoId={videoId}
          isOpen={showTrailer}
          onOpenChange={setShowTrailer}
          title={`Trailer - ${movie.title}`}
        />
      )}
    </>
  );
} 