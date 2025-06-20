'use client';

import { useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';

interface NavigationCategoryButtonProps {
  categoryName: string;
  locale: string;
}

export function NavigationCategoryButton({
  categoryName,
  locale,
}: Readonly<NavigationCategoryButtonProps>) {
  const searchParams = useSearchParams();
  const paramKey = locale === 'es' ? 'categoria' : 'category';
  const active = searchParams.get(paramKey) === categoryName;

  return (
    <Link
      href={{
        pathname: '/store',
        query: { [paramKey]: categoryName },
      }}
      className="w-full"
    >
      <Button
        variant="ghost"
        className={`hover:bg-primary/10 flex w-full items-center justify-start gap-2 transition-colors duration-300 md:w-auto ${active ? 'bg-primary/10 font-semibold' : ''}`}
      >
        {categoryName}
      </Button>
    </Link>
  );
}
