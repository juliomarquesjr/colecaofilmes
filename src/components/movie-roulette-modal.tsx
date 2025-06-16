import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { CheckIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface Genre {
  id: number
  name: string
}

interface MovieRouletteModalProps {
  genres: Genre[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MovieRouletteModal({ genres, open, onOpenChange }: MovieRouletteModalProps) {
  const router = useRouter()
  const [selectedGenres, setSelectedGenres] = useState<number[]>([])

  const handleGenreToggle = (genreId: number) => {
    setSelectedGenres(current =>
      current.includes(genreId)
        ? current.filter(id => id !== genreId)
        : [...current, genreId]
    )
  }

  const handleSelectAll = () => {
    if (selectedGenres.length === genres.length) {
      setSelectedGenres([]) // Desmarca todos
    } else {
      setSelectedGenres(genres.map(genre => genre.id)) // Marca todos
    }
  }

  const handleStartRoulette = () => {
    if (selectedGenres.length === 0) {
      return
    }
    
    const queryString = selectedGenres.map(id => `genres=${id}`).join("&")
    router.push(`/filmes/roleta?${queryString}`)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">🎲 Roleta de Filmes</DialogTitle>
          <DialogDescription className="text-lg">
            Selecione os gêneros que você está com vontade de assistir hoje!
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-end mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSelectAll}
              className="text-xs text-zinc-400 hover:text-white"
            >
              <CheckIcon className="mr-1 h-3 w-3" />
              {selectedGenres.length === genres.length ? "Desmarcar Todos" : "Selecionar Todos"}
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {genres.map((genre) => (
              <div key={genre.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`genre-${genre.id}`}
                  checked={selectedGenres.includes(genre.id)}
                  onCheckedChange={() => handleGenreToggle(genre.id)}
                />
                <Label
                  htmlFor={`genre-${genre.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {genre.name}
                </Label>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleStartRoulette}
            disabled={selectedGenres.length === 0}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          >
            Iniciar Sorteio! 🎬
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 