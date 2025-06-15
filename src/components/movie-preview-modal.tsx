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
import { AnimatePresence, motion } from "framer-motion";
import { Eye, FilmIcon, FolderIcon, Star, Youtube } from "lucide-react";
import { useState } from "react";
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
    genres?: {
      id: number;
      name: string;
    }[];
  };
  isLoading?: boolean;
}

function getYouTubeVideoId(url: string) {
  const match = url.match(/[?&]v=([^&]+)/);
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

export function MoviePreviewModal({ movie, isLoading = false }: MoviePreviewModalProps) {
  const [showTrailer, setShowTrailer] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const videoId = movie.trailerUrl ? getYouTubeVideoId(movie.trailerUrl) : null;

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
                            {/* Indicador de Trailer */}
                            {movie.trailerUrl && videoId && (
                              <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="absolute bottom-2 left-2 right-2"
                              >
                                <Button
                                  variant="outline"
                                  className="w-full bg-black/60 border-zinc-700 hover:bg-black/80 text-zinc-100"
                                  onClick={() => setShowTrailer(true)}
                                >
                                  <Youtube className="h-4 w-4 mr-2 text-red-500" />
                                  Assistir Trailer
                                </Button>
                              </motion.div>
                            )}
                          </div>
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
                            {movie.genres && movie.genres.length > 0 && (
                              <Badge variant="outline" className="bg-zinc-800 flex items-center gap-1">
                                <FolderIcon className="h-3 w-3" />
                                {movie.genres[0].name}
                              </Badge>
                            )}
                            {movie.trailerUrl && (
                              <Badge variant="outline" className="bg-red-950/50 border-red-900/50 text-red-400 flex items-center gap-1">
                                <Youtube className="h-3 w-3" />
                                Trailer Disponível
                              </Badge>
                            )}
                          </motion.div>

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