'use client';
import { GenreModal } from '@/components/genre-modal';
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
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, BookmarkIcon, FilmIcon, InfoIcon, RefreshCw, Star } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

const filmeSchema = z.object({
  title: z.string().min(1, 'Título obrigatório'),
  originalTitle: z.string().optional(),
  overview: z.string().optional(),
  year: z.coerce.number().int().min(1900, 'Ano inválido'),
  mediaType: z.enum(['DVD', 'BluRay', 'VHS'], { required_error: 'Tipo obrigatório' }),
  shelfCode: z.string().min(1, 'Código da estante obrigatório'),
  coverUrl: z.string().url('URL da capa inválida'),
  productionInfo: z.string().min(1, 'Informação de produção obrigatória'),
  rating: z.coerce.number().min(0).max(10).optional(),
});

interface Genre {
  id: number;
  name: string;
}

export default function CadastrarFilme() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    originalTitle: '',
    overview: '',
    year: '',
    mediaType: 'DVD',
    shelfCode: '',
    coverUrl: '',
    productionInfo: '',
    rating: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [genres, setGenres] = useState<Genre[]>([]);
  const [uniqueCode, setUniqueCode] = useState<string>('');
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);

  useEffect(() => {
    fetchGenres();
    generateNewCode();
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

  const generateNewCode = async () => {
    try {
      setIsGeneratingCode(true);
      const response = await fetch('/api/filmes/generate-code');
      if (!response.ok) {
        throw new Error('Erro ao gerar código');
      }
      const data = await response.json();
      setUniqueCode(data.uniqueCode);
    } catch (error) {
      console.error(error);
      toast.error('Erro ao gerar código único');
    } finally {
      setIsGeneratingCode(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

      if (!selectedGenre) {
        setError('Selecione um gênero');
        return;
      }

      if (!uniqueCode) {
        setError('Código único não gerado');
        return;
      }

      const res = await fetch('/api/filmes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...parsed.data,
          genreId: parseInt(selectedGenre),
          uniqueCode,
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
    originalTitle: string;
    overview: string;
    year: number;
    coverUrl: string;
    productionInfo: string;
    rating: number;
  }) => {
    setForm({
      ...form,
      title: movieData.title,
      originalTitle: movieData.originalTitle,
      overview: movieData.overview,
      year: movieData.year.toString(),
      coverUrl: movieData.coverUrl,
      productionInfo: movieData.productionInfo,
      rating: movieData.rating.toString(),
    });
    toast.success('Informações do filme preenchidas!');
  };

  return (
    <main className="min-h-screen bg-zinc-950">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
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

          <div className="grid lg:grid-cols-[1fr,300px] gap-6">
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-indigo-950 to-zinc-900 rounded-lg border border-indigo-800/30 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-indigo-900/30 border border-indigo-800/30">
                    <FilmIcon className="h-5 w-5 text-indigo-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Importar do TMDB</h2>
                    <p className="text-sm text-zinc-400">Busque e importe informações do filme automaticamente</p>
                  </div>
                </div>
                <TMDBSearchModal onMovieSelect={handleTMDBSelect} />
              </div>

              <form onSubmit={handleSubmit} className="bg-zinc-900 rounded-lg border border-zinc-800 divide-y divide-zinc-800">
                {error && (
                  <div className="p-4 bg-red-950/50 text-red-200 rounded-t-lg border-b border-red-900/50">
                    <div className="flex items-center gap-2">
                      <span className="text-red-500">•</span>
                      {error}
                    </div>
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-zinc-800 border border-zinc-700">
                      <InfoIcon className="h-5 w-5 text-zinc-400" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold text-white">Informações Básicas</h2>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-zinc-400">Código:</p>
                      <div className="px-2 py-1 bg-zinc-800 rounded border border-zinc-700 flex items-center gap-2">
                        <code className="text-sm font-mono text-zinc-300">{uniqueCode || '--------'}</code>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 hover:bg-zinc-700"
                          onClick={generateNewCode}
                          disabled={isGeneratingCode}
                        >
                          <RefreshCw className={`h-4 w-4 text-zinc-400 ${isGeneratingCode ? 'animate-spin' : ''}`} />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-6">
                    <div className="grid sm:grid-cols-2 gap-4">
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

                      <div className="space-y-2">
                        <Label htmlFor="originalTitle" className="text-zinc-300">
                          Título Original
                        </Label>
                        <Input
                          id="originalTitle"
                          name="originalTitle"
                          value={form.originalTitle}
                          onChange={handleChange}
                          className="bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-2 focus:ring-indigo-800 focus:border-indigo-800"
                          placeholder="Digite o título original"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="overview" className="text-zinc-300">
                        Sinopse
                      </Label>
                      <Textarea
                        id="overview"
                        name="overview"
                        value={form.overview}
                        onChange={handleChange}
                        className="min-h-[120px] bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-2 focus:ring-indigo-800 focus:border-indigo-800 resize-y"
                        placeholder="Digite a sinopse do filme"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-zinc-800 border border-zinc-700">
                      <BookmarkIcon className="h-5 w-5 text-zinc-400" />
                    </div>
                    <h2 className="text-lg font-semibold text-white">Detalhes do Filme</h2>
                  </div>

                  <div className="grid gap-6">
                    <div className="grid sm:grid-cols-2 gap-4">
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
                          placeholder="Digite o ano"
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
                      <Label htmlFor="productionInfo" className="text-zinc-300">
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

                    <div className="grid sm:grid-cols-2 gap-4">
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
                          placeholder="Digite o código"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="rating" className="text-zinc-300">
                          Nota
                        </Label>
                        <Input
                          id="rating"
                          name="rating"
                          type="number"
                          min="0"
                          max="10"
                          step="0.1"
                          value={form.rating}
                          onChange={handleChange}
                          className="bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-2 focus:ring-indigo-800 focus:border-indigo-800"
                          placeholder="Digite a nota (0-10)"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="genre" className="text-zinc-300">
                        Gênero
                      </Label>
                      <div className="flex gap-2">
                        <div className="flex-1">
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
                                  value={genre.id.toString()}
                                  className="text-zinc-100 focus:bg-zinc-700"
                                >
                                  {genre.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <GenreModal onGenreAdded={fetchGenres} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t border-zinc-800">
                  <div className="flex items-center justify-end gap-4">
                    <Link href="/filmes">
                      <Button 
                        variant="ghost" 
                        type="button"
                        className="bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border border-zinc-800"
                      >
                        Cancelar
                      </Button>
                    </Link>
                    <Button 
                      type="submit" 
                      disabled={isLoading}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                      {isLoading ? 'Salvando...' : 'Cadastrar'}
                    </Button>
                  </div>
                </div>
              </form>
            </div>

            {/* Preview */}
            <div className="hidden lg:block">
              <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6 sticky top-8">
                <h3 className="text-lg font-semibold text-white mb-4">Preview do Filme</h3>
                <div className="aspect-[2/3] bg-zinc-800 rounded-lg border border-zinc-700 mb-4 relative">
                  {form.coverUrl ? (
                    <img
                      src={form.coverUrl}
                      alt={form.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FilmIcon className="h-12 w-12 text-zinc-700" />
                    </div>
                  )}
                  {form.rating && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded bg-black/60">
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                      <span className="text-sm font-medium text-yellow-500">
                        {parseFloat(form.rating).toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-zinc-100">{form.title || 'Título do Filme'}</h4>
                  {form.originalTitle && (
                    <p className="text-sm text-zinc-500">{form.originalTitle}</p>
                  )}
                  {form.year && (
                    <p className="text-sm text-zinc-400">{form.year}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 