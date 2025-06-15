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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Check, Pencil, Plus, Settings, Trash2, X } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface Genre {
  id: number
  name: string
}

interface GenreManagementModalProps {
  genres: Genre[]
  onGenresChange: (genres: Genre[]) => void
}

export function GenreManagementModal({ genres, onGenresChange }: GenreManagementModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [newGenreName, setNewGenreName] = useState("")
  const [editingGenre, setEditingGenre] = useState<Genre | null>(null)
  const [editingName, setEditingName] = useState("")
  const [genreToDelete, setGenreToDelete] = useState<Genre | null>(null)

  const handleAddGenre = async () => {
    if (!newGenreName.trim()) {
      toast.error("Nome do gênero é obrigatório")
      return
    }

    try {
      const res = await fetch("/api/generos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newGenreName.trim() }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Erro ao adicionar gênero")
      }

      const newGenre = await res.json()
      onGenresChange([...genres, newGenre])
      setNewGenreName("")
      toast.success("Gênero adicionado com sucesso")
    } catch (error) {
      console.error("Erro ao adicionar gênero:", error)
      toast.error(error instanceof Error ? error.message : "Erro ao adicionar gênero")
    }
  }

  const startEditing = (genre: Genre) => {
    setEditingGenre(genre)
    setEditingName(genre.name)
  }

  const handleEditGenre = async (genre: Genre) => {
    if (!editingName.trim()) {
      toast.error("Nome do gênero é obrigatório")
      return
    }

    try {
      const res = await fetch(`/api/generos/${genre.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editingName.trim() }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Erro ao atualizar gênero")
      }

      const updatedGenre = await res.json()
      onGenresChange(genres.map(g => g.id === genre.id ? updatedGenre : g))
      setEditingGenre(null)
      setEditingName("")
      toast.success("Gênero atualizado com sucesso")
    } catch (error) {
      console.error("Erro ao atualizar gênero:", error)
      toast.error(error instanceof Error ? error.message : "Erro ao atualizar gênero")
    }
  }

  const handleDeleteGenre = async (genre: Genre) => {
    try {
      const res = await fetch(`/api/generos/${genre.id}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Erro ao excluir categoria")
      }

      onGenresChange(genres.filter(g => g.id !== genre.id))
      setGenreToDelete(null)
      toast.success("Categoria excluída com sucesso")
    } catch (error) {
      console.error("Erro ao excluir categoria:", error)
      toast.error(error instanceof Error ? error.message : "Erro ao excluir categoria")
    }
  }

  const cancelEditing = () => {
    setEditingGenre(null)
    setEditingName("")
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Gerenciar Categorias
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] max-h-[90vh] bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-zinc-100">Gerenciar Categorias</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Adicione, edite ou remova categorias do catálogo.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col space-y-4">
            {/* Adicionar nova categoria */}
            <div className="flex gap-2">
              <Input
                placeholder="Nome da nova categoria"
                value={newGenreName}
                onChange={(e) => setNewGenreName(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddGenre()}
                className="bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-2 focus:ring-indigo-800 focus:border-indigo-800"
              />
              <Button
                onClick={handleAddGenre}
                className="shrink-0"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar
              </Button>
            </div>

            {/* Lista de categorias */}
            <div className="overflow-y-auto max-h-[50vh] pr-2 -mr-2">
              <div className="space-y-2">
                {genres.map((genre) => (
                  <div
                    key={genre.id}
                    className="flex items-center gap-2 p-2 rounded-md bg-zinc-800 border border-zinc-700"
                  >
                    {editingGenre?.id === genre.id ? (
                      <div className="flex-1 flex gap-2">
                        <Input
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && handleEditGenre(genre)}
                          className="flex-1 bg-zinc-700 border-zinc-600 text-zinc-100 focus:ring-2 focus:ring-indigo-800 focus:border-indigo-800"
                          autoFocus
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditGenre(genre)}
                          className="h-8 w-8 text-green-500 hover:text-green-400 hover:bg-zinc-700"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={cancelEditing}
                          className="h-8 w-8 text-zinc-400 hover:text-zinc-300 hover:bg-zinc-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <span className="flex-1 text-zinc-100">{genre.name}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => startEditing(genre)}
                          className="h-8 w-8 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setGenreToDelete(genre)}
                          className="h-8 w-8 text-zinc-400 hover:text-red-500 hover:bg-zinc-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!genreToDelete} onOpenChange={(open) => !open && setGenreToDelete(null)}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-zinc-100">Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              Tem certeza que deseja excluir a categoria "{genreToDelete?.name}"?
              Esta ação não poderá ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={() => setGenreToDelete(null)}
              className="bg-zinc-800 border-zinc-700 text-zinc-100 hover:bg-zinc-700 hover:text-white"
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => genreToDelete && handleDeleteGenre(genreToDelete)}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
} 