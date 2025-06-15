'use client'

import { MoviePreviewModal } from "@/components/movie-preview-modal"
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
import {
  Card,
  CardContent
} from "@/components/ui/card"
import { type Movie } from "@/generated/prisma/client"
import { Pencil, Star, Trash2 } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

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

  return (
    <Card className="group relative overflow-hidden border-zinc-800 bg-zinc-900/50 transition-all hover:scale-[1.02] hover:border-zinc-700">
      {/* Overlay com ações */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 bg-black/60 opacity-0 backdrop-blur-[2px] transition-opacity group-hover:opacity-100">
        <MoviePreviewModal movie={movie} />
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onEdit(movie.id)}
          className="h-8 w-32 border-zinc-700 bg-zinc-800/50 text-zinc-100 hover:bg-zinc-800 hover:text-white"
        >
          <Pencil className="mr-2 h-4 w-4" />
          Editar
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => setShowDeleteDialog(true)}
          className="h-8 w-32"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Excluir
        </Button>
      </div>

      {/* Capa do Filme */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <Image
          src={movie.coverUrl || "/placeholder-cover.jpg"}
          alt={movie.title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        
        {/* Nota do filme */}
        {movie.rating ? (
          <div className="absolute right-2 top-2 z-10 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-amber-500 backdrop-blur-[2px]">
            <Star className="h-3.5 w-3.5 fill-current" />
            <span className="text-sm font-medium leading-none">
              {movie.rating.toFixed(1)}
            </span>
          </div>
        ) : (
          <div className="absolute right-2 top-2 z-10 rounded-full bg-black/60 px-2 py-1 text-zinc-400 backdrop-blur-[2px]">
            <span className="text-xs">Sem nota</span>
          </div>
        )}

        {/* Gradiente sobre a imagem */}
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
      </div>

      {/* Informações do filme */}
      <CardContent className="absolute bottom-0 left-0 right-0 z-10 bg-black/40 p-3 backdrop-blur-[2px]">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <h3 className="line-clamp-1 font-medium text-zinc-50" title={movie.title}>
              {movie.title}
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-300">
            <span>{movie.year}</span>
            <span>•</span>
            <span>{movie.mediaType}</span>
            <span>•</span>
            <span>{movie.shelfCode}</span>
          </div>
          <div className="flex flex-wrap gap-1 pt-0.5">
            {movie.genres?.slice(0, 2).map((genre) => (
              <Badge
                key={genre.name}
                variant="secondary"
                className="bg-white/20 px-1.5 py-0.5 text-[10px] font-normal text-white hover:bg-white/30"
              >
                {genre.name}
              </Badge>
            ))}
            {movie.genres && movie.genres.length > 2 && (
              <Badge
                variant="secondary"
                className="bg-white/20 px-1.5 py-0.5 text-[10px] font-normal text-white hover:bg-white/30"
              >
                +{movie.genres.length - 2}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>

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
    </Card>
  )
} 