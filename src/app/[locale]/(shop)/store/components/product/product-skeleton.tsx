import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function ProductSkeleton() {
  return (
    <Card className="card-hover-effect overflow-hidden">
      <CardHeader className="p-3 sm:p-4 md:p-6">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="mt-2 h-4 w-1/4" />
      </CardHeader>
      <CardContent className="p-3 sm:p-4 md:p-6">
        <Skeleton className="mb-4 aspect-square w-full rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </CardContent>
      <CardFooter className="xs:flex-row xs:justify-between xs:gap-0 flex flex-col items-center justify-center gap-2 p-3 sm:p-4 md:p-6">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-9 w-28" />
      </CardFooter>
    </Card>
  );
}
