import { getProducts } from "@/actions/product";
import { AdminDashboardClient } from "./components/admin-dashboard-client";

export default async function AdminDashboard() {
  const products = await getProducts();
  return <AdminDashboardClient initialProducts={products} />;
}
