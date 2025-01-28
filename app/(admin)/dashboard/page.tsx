import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddProductButton } from "./components/add-product-button";
import { ProductTableWrapper } from "./components/product-table-wrapper";

export default function AdminDashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Admin Dashboard</CardTitle>
          <AddProductButton />
        </CardHeader>
        <CardContent>
          <ProductTableWrapper />
        </CardContent>
      </Card>
    </div>
  );
}
