import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { CategoryManagement } from './components/category-management';
import { ProductManagement } from './components/product-management';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Manage your products and inventory',
};

export const revalidate = 3600;

export default async function DashboardPage() {
  const t = await getTranslations('dashboard');

  return (
    <div className="container mx-auto py-10">
      <Tabs defaultValue="products">
        <TabsList>
          <TabsTrigger value="products">{t('products')}</TabsTrigger>
          <TabsTrigger value="categories">{t('categories')}</TabsTrigger>
        </TabsList>
        <TabsContent value="products">
          <ProductManagement />
        </TabsContent>
        <TabsContent value="categories">
          <CategoryManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}
