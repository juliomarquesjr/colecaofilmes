import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { AnimatePresence, motion, Variants } from "framer-motion";
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

const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.95, 
    y: 20,
    transition: { duration: 0.2 }
  },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: {
      type: "spring",
      duration: 0.5,
      bounce: 0.3
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    y: 20,
    transition: { duration: 0.2 }
  }
};

export function VideoPlayerModal({ isOpen, onOpenChange, videoId, title }: VideoPlayerModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={overlayVariants}
            className="fixed inset-0 bg-black/60 z-50"
            onClick={() => onOpenChange(false)}
          />
          <DialogContent className="sm:max-w-[900px] max-h-[90vh] p-0 bg-zinc-900 border border-zinc-800 overflow-hidden z-50">
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={modalVariants}
            >
              <DialogHeader className="p-6 pb-0">
                <DialogTitle className="text-xl font-semibold flex items-center gap-3 text-white">
                  <motion.div
                    initial={{ rotate: -180, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    transition={{ duration: 0.5, type: "spring" }}
                    className="p-2 rounded-lg bg-red-950/50 border border-red-900/50"
                  >
                    <Youtube className="h-5 w-5 text-red-500" />
                  </motion.div>
                  <motion.span
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {title || "Assistir Trailer"}
                  </motion.span>
                </DialogTitle>
              </DialogHeader>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="relative mt-6"
              >
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
              </motion.div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
} 