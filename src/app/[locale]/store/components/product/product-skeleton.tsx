import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProductSkeleton() {
  return (
    <Card className="overflow-hidden card-hover-effect">
      <CardHeader className="p-3 sm:p-4 md:p-6">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/4 mt-2" />
      </CardHeader>
      <CardContent className="p-3 sm:p-4 md:p-6">
        <Skeleton className="w-full aspect-square rounded-lg mb-4" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col xs:flex-row justify-center xs:justify-between items-center p-3 sm:p-4 md:p-6 gap-2 xs:gap-0">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-9 w-28" />
      </CardFooter>
    </Card>
  );
}
