import { Package } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/routing';

export function SidebarHeader() {
  const t = useTranslations('SidebarHeader');
  return (
    <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
      <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
        <Package className="h-6 w-6" />
        <span>{t('panel')}</span>
      </Link>
    </div>
  );
}
