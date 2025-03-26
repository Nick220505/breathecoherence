'use client';

import { Product } from '@prisma/client';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Link } from '@/i18n/routing';
import { useCart } from '@/providers/cart-provider';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.5 },
};

const TRANSLATION_SELECT_OPTION = 'select_option';
const PRODUCT_TYPE_FLOWER_ESSENCE = 'Flower Essence';
const PRODUCT_TYPE_SACRED_GEOMETRY = 'Sacred Geometry';

interface ProductDetailsProps {
  product: Product;
}

export function ProductDetails({ product }: Readonly<ProductDetailsProps>) {
  const t = useTranslations('ProductPage');
  const { addToCart } = useCart();
  const [selectedBase, setSelectedBase] = useState<string>('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);

    try {
      if (product.type === PRODUCT_TYPE_FLOWER_ESSENCE && selectedBase) {
        addToCart({
          ...product,
          name: t('cart.name', { name: product.name, base: selectedBase }),
          description: t('cart.description', {
            base: selectedBase,
            description: product.description,
          }),
        });
      } else {
        addToCart(product);
      }
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="from-background via-background/80 to-background min-h-screen bg-linear-to-b">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/store"
            className="mb-8 inline-flex items-center text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('back_to_store')}
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <motion.div
            className="lg:sticky lg:top-8"
            variants={fadeIn}
            initial="initial"
            animate="animate"
          >
            <div className="group relative aspect-square overflow-hidden rounded-2xl">
              <Image
                src={
                  product.imageUrl ??
                  (product.type === PRODUCT_TYPE_SACRED_GEOMETRY
                    ? `/products/sacred-geometry.svg#${product.id}`
                    : '/products/flower-essence.svg')
                }
                alt={product.name}
                fill
                className="transform object-cover transition-transform duration-500 group-hover:scale-105"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
          </motion.div>

          <motion.div
            className="space-y-8"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-primary/10 text-primary inline-flex items-center rounded-full px-3 py-1 text-sm font-medium"
              >
                {product.type}
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-4xl font-bold text-transparent md:text-5xl dark:from-purple-400 dark:to-blue-400"
              >
                {product.name}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-primary text-3xl font-bold"
              >
                ${product.price.toFixed(2)}
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="prose prose-gray dark:prose-invert max-w-none"
            >
              <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                {product.description}
              </p>
            </motion.div>

            {product.type === PRODUCT_TYPE_FLOWER_ESSENCE && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-4 rounded-xl border border-purple-500/10 bg-white/5 p-6 backdrop-blur-xs dark:bg-white/5"
              >
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {t('base.label')}
                    <span className="ml-1 text-red-500">*</span>
                  </label>
                  <Select onValueChange={setSelectedBase} value={selectedBase}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t(TRANSLATION_SELECT_OPTION)} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="brandy">{t('base.brandy')}</SelectItem>
                      <SelectItem value="water">{t('base.water')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Button
                onClick={handleAddToCart}
                className="w-full transform bg-linear-to-r from-purple-600 to-blue-600 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-purple-700 hover:to-blue-700 hover:shadow-xl"
                size="lg"
                disabled={
                  (product.type === PRODUCT_TYPE_FLOWER_ESSENCE &&
                    !selectedBase) ||
                  isAdding
                }
              >
                {isAdding ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('adding_to_cart')}
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    {t('add_to_cart')}
                  </>
                )}
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
