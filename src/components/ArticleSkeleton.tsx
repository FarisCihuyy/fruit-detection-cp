import { Skeleton } from "@/components/ui/skeleton";

const ArticleSkeleton = () => {
  return (
    <article className="relative flex justify-center items-center py-8 md:py-16 animate-pulse">
      <Skeleton className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 h-5 w-28" />

      <div className="flex flex-col sm:flex-row gap-x-4 gap-y-4 sm:gap-y-0 md:gap-x-12 items-center *:flex-1 w-full md:max-w-3/5">
        <Skeleton className="w-full min-h-66 rounded-none" />

        <div className="flex flex-col gap-y-4 w-full">
          <div>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-24 block sm:hidden" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    </article>
  );
};

export default ArticleSkeleton;
