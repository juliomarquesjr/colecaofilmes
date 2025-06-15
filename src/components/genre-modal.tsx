import { FolderPlus, Loader2, Plus } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from './ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from './ui/dialog'
import { Input } from './ui/input'

interface Genre {
  id: number
  name: string
}

interface GenreModalProps {
  onGenreAdded: () => void
}

export function GenreModal({ onGenreAdded }: GenreModalProps) {
  const [open, setOpen] = useState(false)
  const [genreName, setGenreName] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!genreName.trim()) return

    setIsLoading(true)

    try {
      const res = await fetch('/api/genres', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: genreName }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Erro ao cadastrar gênero')
      }

      toast.success('Gênero cadastrado com sucesso!')
      setGenreName('')
      setOpen(false)
      onGenreAdded()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao cadastrar gênero')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline"
          className="bg-zinc-900 text-zinc-100 hover:bg-zinc-800 hover:text-white border-zinc-800 hover:border-zinc-700"
        >
          <FolderPlus className="mr-2 h-4 w-4" />
          Adicionar Gênero
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-zinc-900 text-zinc-100 border border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <FolderPlus className="h-5 w-5 text-indigo-400" />
            Adicionar Gênero
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Cadastre um novo gênero para categorizar os filmes.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              value={genreName}
              onChange={(e) => setGenreName(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-2 focus:ring-indigo-800 focus:border-indigo-800"
              placeholder="Nome do gênero..."
            />
          </div>

          <div className="flex justify-end">
            <Button 
              type="submit"
              disabled={isLoading || !genreName.trim()}
              className="bg-indigo-950 hover:bg-indigo-900 text-indigo-100 border border-indigo-800"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              Adicionar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 