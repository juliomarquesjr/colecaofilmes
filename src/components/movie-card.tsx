'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { type Movie } from "@/generated/prisma/client"
import { motion } from "framer-motion"
import { FilmIcon, MoreVertical, Pencil, Star, Trash2, Youtube } from "lucide-react"
import { useState } from "react"
import { MoviePreviewModal } from "./movie-preview-modal"

interface MovieCardProps {
  movie: Movie & {
    genres?: {
      id: number;
      name: string;
    }[];
  }
  onEdit: (id: number) => void
  onDelete: (id: number) => void
}

export function MovieCard({ movie, onEdit, onDelete }: MovieCardProps) {
  const [imageError, setImageError] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleEdit = async () => {
    setIsLoading(true)
    try {
      await onEdit(movie.id)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="group relative"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.2 }}
        className="aspect-[2/3] relative overflow-hidden rounded-lg bg-zinc-800 border border-zinc-700"
      >
        {movie.coverUrl ? (
          <motion.img
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            src={movie.coverUrl}
            alt={movie.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <FilmIcon className="h-12 w-12 text-zinc-500" />
          </div>
        )}

        {/* Overlay com ações */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100"
        >
          <div className="flex items-center gap-2">
            <MoviePreviewModal movie={movie} isLoading={isLoading} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 w-8 border-zinc-700 bg-zinc-800/50 p-0 text-zinc-100 hover:bg-zinc-800 hover:text-white"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-40 bg-zinc-800 border-zinc-700 text-zinc-100"
              >
                <DropdownMenuItem
                  className="flex items-center gap-2 focus:bg-zinc-700 focus:text-zinc-100"
                  onClick={handleEdit}
                >
                  <Pencil className="h-4 w-4" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center gap-2 text-red-400 focus:bg-red-950/50 focus:text-red-400"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="h-4 w-4" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </motion.div>

        {/* Badges */}
        <div className="absolute left-2 right-2 top-2 flex flex-wrap items-center gap-1">
          {movie.rating && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Badge
                variant="outline"
                className="bg-black/60 border-yellow-900/50 text-yellow-500 flex items-center gap-1"
              >
                <Star className="h-3 w-3 fill-yellow-500" />
                {movie.rating.toFixed(1)}
              </Badge>
            </motion.div>
          )}
          {movie.trailerUrl && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Badge
                variant="outline"
                className="bg-black/60 border-red-900/50 text-red-400 flex items-center gap-1"
              >
                <Youtube className="h-3 w-3" />
                Trailer
              </Badge>
            </motion.div>
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-2 space-y-1"
      >
        <h3 className="text-sm font-medium leading-tight text-zinc-100 line-clamp-1">
          {movie.title}
        </h3>
        <div className="flex items-center gap-1 text-xs text-zinc-400">
          <span>{movie.year}</span>
          <span>•</span>
          <span>{movie.mediaType}</span>
          {movie.genres && movie.genres.length > 0 && (
            <>
              <span>•</span>
              <span>{movie.genres[0].name}</span>
            </>
          )}
        </div>
      </motion.div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Filme</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir &quot;{movie.title}&quot;? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                onDelete(movie.id)
                setShowDeleteDialog(false)
              }}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  )
} 