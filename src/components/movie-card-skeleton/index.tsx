interface MovieCardSkeletonProps {
  count?: number;
}

export function MovieCardSkeleton({ count = 12 }: MovieCardSkeletonProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {[...Array(count)].map((_, index) => (
        <div key={index} className="group relative h-full flex flex-col">
          <div className="aspect-[2/3] w-full overflow-hidden rounded-lg bg-zinc-800/50 animate-pulse" />
          <div className="mt-2 space-y-2 flex-grow">
            <div className="h-5 w-3/4 rounded bg-zinc-800/50 animate-pulse" />
            <div className="h-4 w-1/2 rounded bg-zinc-800/50 animate-pulse" />
            <div className="flex gap-1">
              <div className="h-6 w-16 rounded bg-zinc-800/50 animate-pulse" />
              <div className="h-6 w-16 rounded bg-zinc-800/50 animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 