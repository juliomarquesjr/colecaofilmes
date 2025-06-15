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
import {
    Card,
    CardContent,
    CardHeader
} from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Eye, ImageIcon, MoreVertical, Pencil, Trash } from "lucide-react"
import { useState } from "react"

interface MovieCardProps {
  movie: {
    id: number
    title: string
    year: number
    mediaType: string
    shelfCode: string
    coverUrl: string
    productionInfo: string
  }
  onView: (id: number) => void
  onEdit: (id: number) => void
  onDelete: (id: number) => void
}

export function MovieCard({ movie, onView, onEdit, onDelete }: MovieCardProps) {
  const [imageError, setImageError] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  return (
    <Card className="overflow-hidden">
      {/* Imagem */}
      <div className="aspect-[2/3] relative group">
        {imageError ? (
          <div className="absolute inset-0 bg-muted flex items-center justify-center">
            <ImageIcon className="h-12 w-12 text-muted-foreground" />
          </div>
        ) : (
          <img
            src={movie.coverUrl}
            alt={movie.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        )}
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              className="flex-1"
              onClick={() => onView(movie.id)}
            >
              <Eye className="h-4 w-4 mr-2" />
              Ver
            </Button>
          </div>
        </div>
      </div>

      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold line-clamp-1" title={movie.title}>
            {movie.title}
          </h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(movie.id)}>
                <Pencil className="h-4 w-4 mr-2" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash className="h-4 w-4 mr-2" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{movie.year}</span>
          <Badge variant="outline">{movie.mediaType}</Badge>
        </div>
        <Badge variant="secondary" className="w-full justify-center">
          Estante: {movie.shelfCode}
        </Badge>
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