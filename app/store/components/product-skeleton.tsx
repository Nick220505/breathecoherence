import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export function ProductSkeleton() {
  return (
    <Card className="overflow-hidden animate-pulse">
      <CardHeader className="p-3 sm:p-4 md:p-6">
        <div className="h-6 bg-muted rounded w-3/4" />
        <div className="h-4 bg-muted rounded w-1/4 mt-2" />
      </CardHeader>
      <CardContent className="p-3 sm:p-4 md:p-6">
        <div className="aspect-square bg-muted rounded-lg mb-2 sm:mb-3 md:mb-4" />
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded" />
          <div className="h-4 bg-muted rounded w-5/6" />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col xs:flex-row justify-center xs:justify-between items-center p-3 sm:p-4 md:p-6 gap-2 xs:gap-0">
        <div className="h-6 bg-muted rounded w-20" />
        <div className="h-9 bg-muted rounded w-24" />
      </CardFooter>
    </Card>
  );
}
