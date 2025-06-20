import { getAllCategories } from '@/features/category/actions';

import { CategoryManagement } from '../components/category-management';

export default async function CategoriesPage() {
  const categories = await getAllCategories();
  return <CategoryManagement categories={categories} />;
}
