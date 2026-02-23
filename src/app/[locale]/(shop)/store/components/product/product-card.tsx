'use client';

import type { Product } from '@/features/product/schemas';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { StockStatusBadge } from '@/components/ui/stock-status-badge';
import { Link } from '@/i18n/routing';

interface ProductCardProps {
  product: Product;
  index: number;
  categoryName: string;
}

export function ProductCard({
  product,
  index,
  categoryName,
}: Readonly<ProductCardProps>) {
  const t = useTranslations('ProductCard');
  const isOutOfStock = product.stock === 0;

  let imageToDisplay: string;
  const actualImageValue: unknown = product.imageBase64;

  if (typeof actualImageValue === 'string' && actualImageValue.trim() !== '') {
    imageToDisplay = actualImageValue;
  } else if (categoryName === 'Sacred Geometry') {
    imageToDisplay = `/products/sacred-geometry.svg#${product.id}`;
  } else {
    imageToDisplay = '/products/flower-essence.svg';
  }

  return (
    <Link
      href={{ pathname: '/store/product/[id]', params: { id: product.id } }}
    >
      <Card
        className="group transform cursor-pointer overflow-hidden border-purple-500/10 bg-white/5 shadow-lg backdrop-blur-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-white/5"
        style={{ animationDelay: `${index * 100}ms` }}
      >
        <CardHeader className="border-b border-purple-500/10">
          <CardTitle className="flex items-center gap-3 bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-lg text-transparent md:text-xl dark:from-purple-400 dark:to-blue-400">
            {categoryName === 'Sacred Geometry' ? (
              <span className="rotate-slow inline-block text-2xl text-purple-600 md:text-3xl dark:text-purple-400">
                ⬡
              </span>
            ) : (
              <span className="inline-block text-2xl text-pink-500 md:text-3xl dark:text-pink-400">
                🌸
              </span>
            )}
            {product.name}
          </CardTitle>
          <CardDescription className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>
              {categoryName === 'Sacred Geometry'
                ? t('sacred_geometry')
                : t('flower_essence')}
            </span>
            <StockStatusBadge stock={product.stock} />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative overflow-hidden rounded-lg transition-shadow duration-300 group-hover:shadow-2xl">
            <Image
              src={imageToDisplay}
              alt={product.name}
              width={400}
              height={400}
              className={`aspect-square w-full transform rounded-lg object-cover transition-transform duration-300 group-hover:scale-105 ${
                isOutOfStock ? 'opacity-60 grayscale' : ''
              }`}
              priority
              sizes="(max-width: 768px) 100vw, 400px"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>
          <div className="space-y-3">
            <p className="line-clamp-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
              {product.description}
            </p>
          </div>
        </CardContent>
        <CardFooter className="xs:flex-row flex flex-col items-center justify-between gap-3 border-t border-purple-500/10 pt-4">
          <span className="bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-2xl font-bold text-transparent dark:from-purple-400 dark:to-blue-400">
            ${product.price.toFixed(2)}
          </span>
          <Button
            size="lg"
            disabled={isOutOfStock}
            className={`shadow-lg transition-all duration-300 ${
              isOutOfStock
                ? 'cursor-not-allowed bg-gray-300 text-gray-500 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-400'
                : 'bg-linear-to-r from-purple-600 to-blue-600 text-white group-hover:shadow-xl hover:from-purple-700 hover:to-blue-700'
            }`}
          >
            {t('view_details')}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
