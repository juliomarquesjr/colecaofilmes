import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { FolderIcon, Star } from "lucide-react";

interface Genre {
  id: number;
  name: string;
}

interface MovieFiltersProps {
  genres: Genre[];
  selectedGenre: string;
  selectedYear: string;
  selectedRating: string;
  selectedMediaType: string;
  onGenreChange: (value: string) => void;
  onYearChange: (value: string) => void;
  onRatingChange: (value: string) => void;
  onMediaTypeChange: (value: string) => void;
  onClearFilters: () => void;
  availableYears: number[];
}

export function MovieFilters({
  genres,
  selectedGenre,
  selectedYear,
  selectedRating,
  selectedMediaType,
  onGenreChange,
  onYearChange,
  onRatingChange,
  onMediaTypeChange,
  onClearFilters,
  availableYears,
}: MovieFiltersProps) {
  const ratingOptions = [
    { value: "4+", label: "4+ ⭐" },
    { value: "6+", label: "6+ ⭐" },
    { value: "8+", label: "8+ ⭐" },
  ];

  const mediaTypeOptions = [
    { value: "DVD", label: "📀 DVD" },
    { value: "BluRay", label: "💿 Blu-ray" },
    { value: "VHS", label: "📼 VHS" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3 bg-zinc-900 p-4 rounded-lg border border-zinc-800">
      {/* Filtro por Gênero */}
      <div className="flex-1 min-w-[200px]">
        <Select value={selectedGenre} onValueChange={onGenreChange}>
          <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-2 focus:ring-indigo-800 focus:border-indigo-800">
            <div className="flex items-center gap-2">
              <FolderIcon className="h-4 w-4" />
              <SelectValue placeholder="Filtrar por gênero" />
            </div>
          </SelectTrigger>
          <SelectContent className="bg-zinc-800 border-zinc-700">
            <SelectItem value="all" className="text-zinc-100 focus:bg-zinc-700">
              Todos os gêneros
            </SelectItem>
            {genres.map((genre) => (
              <SelectItem
                key={genre.id}
                value={genre.id.toString()}
                className="text-zinc-100 focus:bg-zinc-700"
              >
                {genre.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Filtro por Ano */}
      <div className="flex-1 min-w-[200px]">
        <Select value={selectedYear} onValueChange={onYearChange}>
          <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-2 focus:ring-indigo-800 focus:border-indigo-800">
            <SelectValue placeholder="Filtrar por ano" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-800 border-zinc-700">
            <SelectItem value="all" className="text-zinc-100 focus:bg-zinc-700">
              Todos os anos
            </SelectItem>
            {availableYears.map((year) => (
              <SelectItem
                key={year}
                value={year.toString()}
                className="text-zinc-100 focus:bg-zinc-700"
              >
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Filtro por Nota */}
      <div className="flex-1 min-w-[200px]">
        <Select value={selectedRating} onValueChange={onRatingChange}>
          <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-2 focus:ring-indigo-800 focus:border-indigo-800">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              <SelectValue placeholder="Filtrar por nota" />
            </div>
          </SelectTrigger>
          <SelectContent className="bg-zinc-800 border-zinc-700">
            <SelectItem value="all" className="text-zinc-100 focus:bg-zinc-700">
              Todas as notas
            </SelectItem>
            {ratingOptions.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="text-zinc-100 focus:bg-zinc-700"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Filtro por Tipo de Mídia */}
      <div className="flex-1 min-w-[200px]">
        <Select value={selectedMediaType} onValueChange={onMediaTypeChange}>
          <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-2 focus:ring-indigo-800 focus:border-indigo-800">
            <SelectValue placeholder="🎬 Filtrar por mídia" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-800 border-zinc-700">
            <SelectItem value="all" className="text-zinc-100 focus:bg-zinc-700">
              Todas as mídias
            </SelectItem>
            {mediaTypeOptions.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="text-zinc-100 focus:bg-zinc-700"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Botão Limpar Filtros */}
      <Button
        variant="outline"
        onClick={onClearFilters}
        className="bg-zinc-800 border-zinc-700 text-zinc-100 hover:bg-zinc-700 hover:text-white"
      >
        Limpar Filtros
      </Button>
    </div>
  );
} 