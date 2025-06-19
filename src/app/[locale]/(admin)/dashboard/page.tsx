import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Manage your products and inventory',
};

export const revalidate = 3600;

export default async function DashboardPage() {
  const t = await getTranslations('dashboard');

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold">{t('title')}</h1>
      <p className="text-muted-foreground">{t('description')}</p>
    </div>
  );
}
