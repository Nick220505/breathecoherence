import { Skeleton } from '@/components/ui/skeleton';

export function DashboardCardSkeleton() {
  return (
    <div className="bg-card flex items-center justify-center gap-6 rounded-lg border p-6 shadow-sm max-[475px]:flex-col max-[475px]:gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-full">
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
      <div className="space-y-2 text-center">
        <Skeleton className="mx-auto h-9 w-12" />
        <Skeleton className="mx-auto h-5 w-20" />
      </div>
    </div>
  );
}
