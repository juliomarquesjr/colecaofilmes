import { Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Input } from './ui/input'

interface SearchInputProps {
  onSearch: (term: string) => void
}

export function SearchInput({ onSearch }: SearchInputProps) {
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearch(searchTerm)
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [searchTerm, onSearch])

  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
      <Input
        type="text"
        placeholder="Buscar filmes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-9 bg-zinc-950 border-zinc-900/50 text-zinc-100 placeholder:text-zinc-600 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/20 transition-all"
      />
    </div>
  )
} 