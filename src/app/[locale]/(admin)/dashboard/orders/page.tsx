import { getTranslations } from 'next-intl/server';

export default async function OrdersPage() {
  const t = await getTranslations('dashboard.orders');
  return (
    <div>
      <h1 className="text-3xl font-bold">{t('title')}</h1>
      <p className="text-muted-foreground">{t('description')}</p>
    </div>
  );
}
