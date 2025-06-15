import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"

export function MoviePreviewSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center gap-3"
        >
          <Skeleton className="h-10 w-10 rounded-lg bg-zinc-800" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-40 bg-zinc-800" />
            <Skeleton className="h-4 w-60 bg-zinc-800/50" />
          </div>
        </motion.div>
      </div>

      <div className="grid sm:grid-cols-[180px,1fr] gap-6">
        {/* Skeleton da Capa */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Skeleton className="aspect-[2/3] w-full rounded-lg bg-zinc-800" />
        </motion.div>

        {/* Skeleton das Informações */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Skeleton className="h-7 w-3/4 bg-zinc-800" />
            <Skeleton className="h-5 w-1/2 bg-zinc-800/50" />
          </div>

          <div className="space-y-2 pt-4">
            <Skeleton className="h-4 w-full bg-zinc-800" />
            <Skeleton className="h-4 w-5/6 bg-zinc-800" />
            <Skeleton className="h-4 w-4/6 bg-zinc-800" />
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-6 w-20 rounded-full bg-zinc-800" />
            ))}
          </div>

          <div className="flex items-center gap-4 pt-4">
            <Skeleton className="h-10 w-10 rounded-lg bg-zinc-800" />
            <Skeleton className="h-6 w-32 bg-zinc-800" />
          </div>

          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-lg bg-zinc-800" />
            <Skeleton className="h-6 w-40 bg-zinc-800" />
          </div>
        </motion.div>
      </div>
    </div>
  )
} 