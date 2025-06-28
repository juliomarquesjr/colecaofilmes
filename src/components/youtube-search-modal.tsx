import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PlayCircle, Youtube } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Hook de debounce
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
}

interface YouTubeSearchModalProps {
  onVideoSelect: (videoUrl: string) => void;
  initialSearchTerm?: string;
}

export function YouTubeSearchModal({ onVideoSelect, initialSearchTerm = "" }: YouTubeSearchModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const debouncedQuery = useDebounce(query, 500); // 500ms de delay

  useEffect(() => {
    if (debouncedQuery) {
      handleSearch();
    }
  }, [debouncedQuery]);

  // Definir o termo inicial quando o modal abrir
  useEffect(() => {
    if (isOpen && initialSearchTerm && !query) {
      setQuery(initialSearchTerm);
    }
  }, [isOpen, initialSearchTerm]);

  const handleSearch = async () => {
    if (!debouncedQuery.trim()) {
      setVideos([]);
      return;
    }

    setIsLoading(true);
    setSelectedVideo(null);
    try {
      const response = await fetch(`/api/youtube/search?q=${encodeURIComponent(debouncedQuery + " trailer")}`);
      if (!response.ok) {
        throw new Error("Erro ao buscar vídeos");
      }
      const data = await response.json();
      setVideos(data);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao buscar vídeos");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (video: Video) => {
    const videoUrl = `https://www.youtube.com/watch?v=${video.id}`;
    onVideoSelect(videoUrl);
    setIsOpen(false);
    toast.success("Trailer selecionado!");
  };

  const handlePreview = (videoId: string) => {
    setSelectedVideo(selectedVideo === videoId ? null : videoId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full bg-zinc-800 border-zinc-700 text-zinc-100 hover:bg-zinc-700 hover:text-white"
        >
          <Youtube className="h-4 w-4 mr-2" />
          Buscar Trailer
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto bg-zinc-900 text-zinc-100 border border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-3 text-white">
            <div className="p-2 rounded-lg bg-red-950/50 border border-red-900/50">
              <Youtube className="h-5 w-5 text-red-500" />
            </div>
            Buscar Trailer
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Pesquise e selecione o trailer do filme
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Barra de Pesquisa */}
          <div className="flex gap-2">
            <Input
              placeholder="Digite o nome do filme..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-zinc-800 border-zinc-700 text-zinc-100"
            />
          </div>

          {/* Lista de Vídeos */}
          <div className="grid gap-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="flex items-center gap-2 text-zinc-400">
                  <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Buscando vídeos...
                </div>
              </div>
            ) : videos.length > 0 ? (
              videos.map((video) => (
                <div
                  key={video.id}
                  className="overflow-hidden bg-zinc-800/50 rounded-lg border border-zinc-700 transition-colors"
                >
                  <div className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div 
                        className="relative sm:w-48 aspect-video rounded-md overflow-hidden bg-zinc-800 cursor-pointer group"
                        onClick={() => handlePreview(video.id)}
                      >
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <PlayCircle className="h-12 w-12 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0 space-y-2">
                        <h4 className="font-medium text-zinc-100 text-lg leading-tight line-clamp-2">
                          {video.title}
                        </h4>
                        <p className="text-sm text-zinc-400">{video.channelTitle}</p>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleSelect(video)}
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            <Youtube className="h-4 w-4 mr-2" />
                            Selecionar Trailer
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handlePreview(video.id)}
                            className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
                          >
                            <PlayCircle className="h-4 w-4 mr-2" />
                            {selectedVideo === video.id ? "Ocultar" : "Visualizar"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Preview do Vídeo */}
                  {selectedVideo === video.id && (
                    <div className="border-t border-zinc-700">
                      <div className="aspect-video w-full bg-black">
                        <iframe
                          width="100%"
                          height="100%"
                          src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
                          title="YouTube video player"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : query.trim() !== "" && (
              <div className="text-center py-8 text-zinc-400">
                Nenhum vídeo encontrado
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 