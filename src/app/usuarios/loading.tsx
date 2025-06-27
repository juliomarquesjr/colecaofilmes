import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-[1400px] space-y-8 p-8">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-lg" /> {/* Ícone */}
          <Skeleton className="h-8 w-48" /> {/* Título */}
        </div>
        <Skeleton className="h-10 w-[160px] rounded-md" /> {/* Botão Novo Usuário */}
      </div>

      {/* Stats Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-6 rounded-lg bg-zinc-900/50 border border-zinc-800">
            <Skeleton className="h-4 w-32 mb-4" /> {/* Título do card */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5" /> {/* Ícone */}
              <Skeleton className="h-8 w-12" /> {/* Número */}
            </div>
          </div>
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 overflow-hidden">
        {/* Table Header */}
        <div className="p-4 border-b border-zinc-800">
          <div className="grid grid-cols-6 gap-4">
            <Skeleton className="h-4 w-20" /> {/* Nome */}
            <Skeleton className="h-4 w-32" /> {/* Nome de Usuário */}
            <Skeleton className="h-4 w-24" /> {/* Telefone */}
            <Skeleton className="h-4 w-32" /> {/* Endereço */}
            <Skeleton className="h-4 w-16" /> {/* Tipo */}
            <Skeleton className="h-4 w-16" /> {/* Ações */}
          </div>
        </div>
        {/* Table Body */}
        <div className="p-4 space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="grid grid-cols-6 gap-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" /> {/* Ícone */}
                <Skeleton className="h-4 w-24" /> {/* Nome */}
              </div>
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-6 w-28 rounded-full" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 