import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"
import { ArrowLeft, FilmIcon } from "lucide-react"

export function MovieEditSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="h-9 w-9 bg-zinc-900 rounded-md border border-zinc-800"
          >
            <div className="h-full w-full flex items-center justify-center">
              <ArrowLeft className="h-4 w-4 text-zinc-400" />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2"
          >
            <FilmIcon className="h-8 w-8 text-zinc-400" />
            <Skeleton className="h-9 w-40 bg-zinc-800" />
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-[1fr,300px] gap-6">
          <div className="space-y-6">
            {/* Cards de Importação */}
            <div className="grid sm:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-gradient-to-br from-zinc-900 to-zinc-900 rounded-lg border border-zinc-800 p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Skeleton className="h-9 w-9 rounded-lg bg-zinc-800" />
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-32 bg-zinc-800" />
                      <Skeleton className="h-4 w-40 bg-zinc-800/50" />
                    </div>
                  </div>
                  <Skeleton className="h-9 w-full bg-zinc-800" />
                </motion.div>
              ))}
            </div>

            {/* Formulário */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-zinc-900 rounded-lg border border-zinc-800 divide-y divide-zinc-800"
            >
              {/* Seção Informações Básicas */}
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Skeleton className="h-9 w-9 rounded-lg bg-zinc-800" />
                  <Skeleton className="h-6 w-40 bg-zinc-800" />
                </div>

                <div className="grid gap-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-20 bg-zinc-800" />
                        <Skeleton className="h-10 w-full bg-zinc-800" />
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20 bg-zinc-800" />
                    <Skeleton className="h-[120px] w-full bg-zinc-800" />
                  </div>
                </div>
              </div>

              {/* Seção Detalhes */}
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Skeleton className="h-9 w-9 rounded-lg bg-zinc-800" />
                  <Skeleton className="h-6 w-40 bg-zinc-800" />
                </div>

                <div className="grid gap-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="grid sm:grid-cols-2 gap-4">
                      {[1, 2].map((j) => (
                        <div key={j} className="space-y-2">
                          <Skeleton className="h-4 w-20 bg-zinc-800" />
                          <Skeleton className="h-10 w-full bg-zinc-800" />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="p-6">
                <div className="flex items-center justify-end gap-4">
                  <Skeleton className="h-10 w-24 bg-zinc-800" />
                  <Skeleton className="h-10 w-32 bg-zinc-800" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="hidden lg:block"
          >
            <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6 sticky top-8">
              <Skeleton className="h-6 w-32 mb-4 bg-zinc-800" />
              <Skeleton className="aspect-[2/3] w-full rounded-lg bg-zinc-800 mb-4" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-3/4 bg-zinc-800" />
                <Skeleton className="h-4 w-1/2 bg-zinc-800" />
                <Skeleton className="h-4 w-1/4 bg-zinc-800" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
} 