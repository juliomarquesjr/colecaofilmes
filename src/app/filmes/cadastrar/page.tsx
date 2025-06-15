'use client';
import { GenreDialog } from '@/components/GenreDialog';
import { TMDBSearchModal } from '@/components/tmdb-search-modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, FilmIcon, ImageIcon, InfoIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

const filmeSchema = z.object({
  title: z.string().min(1, 'Título obrigatório'),
  year: z.coerce.number().int().min(1900, 'Ano inválido'),
  mediaType: z.enum(['DVD', 'BluRay', 'VHS'], { required_error: 'Tipo obrigatório' }),
  shelfCode: z.string().min(1, 'Código da estante obrigatório'),
  coverUrl: z.string().url('URL da capa inválida'),
  productionInfo: z.string().min(1, 'Informação de produção obrigatória'),
});

interface Genre {
  id: string;
  name: string;
}

export default function CadastrarFilme() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    year: '',
    mediaType: 'DVD',
    shelfCode: '',
    coverUrl: '',
    productionInfo: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [genres, setGenres] = useState<Genre[]>([]);

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    try {
      const response = await fetch('/api/generos');
      if (!response.ok) {
        throw new Error('Erro ao buscar gêneros');
      }
      const data = await response.json();
      setGenres(data);
    } catch (error) {
      console.error(error);
      toast.error('Erro ao buscar gêneros');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const parsed = filmeSchema.safeParse(form);
      if (!parsed.success) {
        setError(parsed.error.errors[0].message);
        return;
      }

      const res = await fetch('http://localhost:3000/api/filmes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...parsed.data,
          genreId: selectedGenre,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erro ao cadastrar filme');
      }

      toast.success('Filme cadastrado com sucesso!');
      router.push('/filmes');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao cadastrar filme');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTMDBSelect = (movieData: {
    title: string;
    year: number;
    coverUrl: string;
    productionInfo: string;
  }) => {
    setForm({
      ...form,
      title: movieData.title,
      year: movieData.year.toString(),
      coverUrl: movieData.coverUrl,
      productionInfo: movieData.productionInfo,
    });
    toast.success('Informações do filme preenchidas!');
  };

  return (
    <main className="min-h-screen bg-zinc-950">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/filmes">
              <Button 
                variant="ghost" 
                size="icon"
                className="bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border border-zinc-800"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <FilmIcon className="h-8 w-8" />
              Cadastrar Filme
            </h1>
          </div>

          <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6">
            <div className="mb-6">
              <TMDBSearchModal onMovieSelect={handleTMDBSelect} />
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-950/50 text-red-200 px-4 py-3 rounded-md border border-red-900/50">
                  {error}
                </div>
              )}

              <div className="grid gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-zinc-300">
                    Título
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    className="bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-2 focus:ring-indigo-800 focus:border-indigo-800"
                    placeholder="Digite o título do filme"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="year" className="text-zinc-300">
                      Ano
                    </Label>
                    <Input
                      id="year"
                      name="year"
                      type="number"
                      value={form.year}
                      onChange={handleChange}
                      className="bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-2 focus:ring-indigo-800 focus:border-indigo-800"
                      placeholder="Ex: 2024"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mediaType" className="text-zinc-300">
                      Tipo de Mídia
                    </Label>
                    <Select 
                      value={form.mediaType} 
                      onValueChange={(value) => setForm({ ...form, mediaType: value })}
                    >
                      <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-2 focus:ring-indigo-800 focus:border-indigo-800">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-800 border-zinc-700">
                        <SelectItem value="DVD" className="text-zinc-100 focus:bg-zinc-700">DVD</SelectItem>
                        <SelectItem value="BluRay" className="text-zinc-100 focus:bg-zinc-700">BluRay</SelectItem>
                        <SelectItem value="VHS" className="text-zinc-100 focus:bg-zinc-700">VHS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shelfCode" className="text-zinc-300">
                    Código da Estante
                  </Label>
                  <Input
                    id="shelfCode"
                    name="shelfCode"
                    value={form.shelfCode}
                    onChange={handleChange}
                    className="bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-2 focus:ring-indigo-800 focus:border-indigo-800"
                    placeholder="Ex: A1, B2, C3"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="coverUrl" className="text-zinc-300 flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-zinc-400" />
                    URL da Capa
                  </Label>
                  <Input
                    id="coverUrl"
                    name="coverUrl"
                    value={form.coverUrl}
                    onChange={handleChange}
                    className="bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-2 focus:ring-indigo-800 focus:border-indigo-800"
                    placeholder="https://exemplo.com/imagem.jpg"
                  />
                  <p className="text-xs text-zinc-500">
                    Cole aqui o link da imagem da capa do filme
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="productionInfo" className="text-zinc-300 flex items-center gap-2">
                    <InfoIcon className="h-4 w-4 text-zinc-400" />
                    Informações de Produção
                  </Label>
                  <Input
                    id="productionInfo"
                    name="productionInfo"
                    value={form.productionInfo}
                    onChange={handleChange}
                    className="bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-2 focus:ring-indigo-800 focus:border-indigo-800"
                    placeholder="Diretor, produtora, elenco principal..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="genre" className="text-zinc-300">
                    Gênero
                  </Label>
                  <div className="flex items-center gap-2">
                    <Select 
                      value={selectedGenre} 
                      onValueChange={setSelectedGenre}
                    >
                      <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-2 focus:ring-indigo-800 focus:border-indigo-800">
                        <SelectValue placeholder="Selecione o gênero" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-800 border-zinc-700">
                        {genres.map((genre) => (
                          <SelectItem 
                            key={genre.id} 
                            value={genre.id}
                            className="text-zinc-100 focus:bg-zinc-700"
                          >
                            {genre.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <GenreDialog onGenreAdded={fetchGenres} />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-4 pt-4">
                <Link href="/filmes">
                  <Button
                    type="button"
                    variant="ghost"
                    className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-zinc-100"
                    disabled={isLoading}
                  >
                    Cancelar
                  </Button>
                </Link>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-indigo-950 hover:bg-indigo-900 text-indigo-100 border border-indigo-800 min-w-[100px]"
                >
                  {isLoading ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
} 