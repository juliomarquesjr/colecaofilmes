import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Youtube } from "lucide-react";

interface VideoPlayerModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  videoId: string;
  title?: string;
}

function getYouTubeVideoId(url: string) {
  const match = url.match(/[?&]v=([^&]+)/);
  return match ? match[1] : null;
}

export function VideoPlayerModal({ isOpen, onOpenChange, videoId, title }: VideoPlayerModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] p-0 bg-zinc-900 border border-zinc-800 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-semibold flex items-center gap-3 text-white">
            <div className="p-2 rounded-lg bg-red-950/50 border border-red-900/50">
              <Youtube className="h-5 w-5 text-red-500" />
            </div>
            {title || "Assistir Trailer"}
          </DialogTitle>
        </DialogHeader>

        <div className="relative mt-6">
          <div className="aspect-video w-full bg-black">
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
      </DialogContent>
    </Dialog>
  );
} 