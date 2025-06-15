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
import { Label } from './ui/label'

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
    e.stopPropagation()
    
    if (!genreName.trim()) return

    setIsLoading(true)

    try {
      const res = await fetch('/api/generos', {
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
          size="icon"
          className="bg-zinc-900 text-zinc-100 hover:bg-zinc-800 hover:text-white border-zinc-800 hover:border-zinc-700 w-10 h-10 p-0"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-zinc-900 text-zinc-100 border border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-3 text-white">
            <div className="p-2 rounded-lg bg-indigo-950/50 border border-indigo-900/50">
              <FolderPlus className="h-5 w-5 text-indigo-400" />
            </div>
            Adicionar Gênero
          </DialogTitle>
          <DialogDescription className="text-zinc-400 mt-2">
            Cadastre um novo gênero para melhor organizar seu catálogo de filmes.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-2" onClick={(e) => e.stopPropagation()}>
          <div className="space-y-2">
            <Label htmlFor="genreName" className="text-sm font-medium text-zinc-300">
              Nome do Gênero
            </Label>
            <Input
              id="genreName"
              value={genreName}
              onChange={(e) => setGenreName(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-2 focus:ring-indigo-800 focus:border-indigo-800"
              placeholder="Ex: Ação, Comédia, Drama..."
            />
            <p className="text-xs text-zinc-500">
              Use nomes claros e específicos para facilitar a categorização.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-zinc-100"
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              disabled={isLoading || !genreName.trim()}
              className="bg-indigo-950 hover:bg-indigo-900 text-indigo-100 border border-indigo-800 min-w-[120px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 