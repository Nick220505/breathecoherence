import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTranslations } from "next-intl/server";
import { TableSkeleton } from "./components/table/table-skeleton";

export default async function Loading() {
  const t = await getTranslations("AdminDashboard");

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>{t("title")}</CardTitle>
          <div className="h-10 w-32 animate-pulse rounded-md bg-muted" />
        </CardHeader>
        <CardContent>
          <TableSkeleton />
        </CardContent>
      </Card>
    </div>
  );
}
