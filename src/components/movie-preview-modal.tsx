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
import { Eye, FilmIcon, FolderIcon, Star, Youtube } from "lucide-react";
import { useState } from "react";

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
}

function getYouTubeVideoId(url: string) {
  const match = url.match(/[?&]v=([^&]+)/);
  return match ? match[1] : null;
}

export function MoviePreviewModal({ movie }: MoviePreviewModalProps) {
  const [showTrailer, setShowTrailer] = useState(false);
  const videoId = movie.trailerUrl ? getYouTubeVideoId(movie.trailerUrl) : null;

  return (
    <Dialog>
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
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-zinc-900 text-zinc-100 border border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-3 text-white">
            <div className="p-2 rounded-lg bg-indigo-950/50 border border-indigo-900/50">
              <FilmIcon className="h-5 w-5 text-indigo-400" />
            </div>
            Detalhes do Filme
          </DialogTitle>
          <DialogDescription className="text-zinc-400 mt-2">
            Visualize todas as informações do filme
          </DialogDescription>
        </DialogHeader>

        <div className="grid sm:grid-cols-[180px,1fr] gap-6 mt-6">
          {/* Capa do Filme */}
          <div>
            <div className="aspect-[2/3] relative bg-zinc-800 rounded-lg border border-zinc-700 overflow-hidden">
              {movie.coverUrl ? (
                <img
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
                <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded bg-black/60">
                  <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  <span className="text-sm font-medium text-yellow-500">
                    {movie.rating.toFixed(1)}
                  </span>
                </div>
              )}
              {/* Indicador de Trailer */}
              {movie.trailerUrl && (
                <div className="absolute bottom-2 left-2 right-2">
                  <Button
                    variant="outline"
                    className="w-full bg-black/60 border-zinc-700 hover:bg-black/80 text-zinc-100"
                    onClick={() => setShowTrailer(!showTrailer)}
                  >
                    <Youtube className="h-4 w-4 mr-2 text-red-500" />
                    {showTrailer ? "Ocultar Trailer" : "Assistir Trailer"}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Informações do Filme */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-white">{movie.title}</h3>
              {movie.originalTitle && (
                <p className="text-sm text-zinc-400 mt-1">
                  Título Original: {movie.originalTitle}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
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
            </div>

            {movie.overview && (
              <div>
                <h4 className="text-sm font-medium text-zinc-300 mb-1">Sinopse</h4>
                <p className="text-sm text-zinc-400">{movie.overview}</p>
              </div>
            )}

            <div>
              <h4 className="text-sm font-medium text-zinc-300 mb-1">
                Informações de Produção
              </h4>
              <p className="text-sm text-zinc-400">{movie.productionInfo}</p>
            </div>

            {/* Player do YouTube */}
            {showTrailer && videoId && (
              <div className="mt-4">
                <div className="aspect-video rounded-lg overflow-hidden bg-black">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 