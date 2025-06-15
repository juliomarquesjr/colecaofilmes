"use client"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVertical, Pencil, Trash } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

interface Genre {
  id: string
  name: string
}

interface Movie {
  id: string
  title: string
  description: string
  imageUrl: string
  genres: Genre[]
}

interface MovieCardProps {
  movie: Movie
  onDelete: (id: string) => void
}

export function MovieCard({ movie, onDelete }: MovieCardProps) {
  const router = useRouter()
  const [isImageError, setIsImageError] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleImageError = () => {
    setIsImageError(true)
  }

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/filmes/${movie.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Erro ao excluir filme")
      }

      toast.success("Filme excluído com sucesso!")
      onDelete(movie.id)
    } catch (error) {
      toast.error("Erro ao excluir filme")
      console.error(error)
    } finally {
      setIsDeleteDialogOpen(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-48">
        {isImageError ? (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">Imagem não disponível</span>
          </div>
        ) : (
          <Image
            src={movie.imageUrl}
            alt={movie.title}
            fill
            className="object-cover"
            onError={handleImageError}
          />
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{movie.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {movie.description}
        </p>

        {movie.genres && movie.genres.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {movie.genres.map((genre) => (
              <span
                key={genre.id}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
              >
                {genre.name}
              </span>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/filmes/${movie.id}`)}
          >
            Ver detalhes
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => router.push(`/filmes/${movie.id}/editar`)}
              >
                <Pencil className="h-4 w-4 mr-2" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash className="h-4 w-4 mr-2" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Filme</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este filme? Esta ação não pode ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 