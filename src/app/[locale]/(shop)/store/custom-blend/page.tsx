'use client';

import { ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { useCart } from '@/app/[locale]/providers/cart-provider';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Link } from '@/i18n/routing';

const FLOWER_ESSENCES = [
  'Agrimony',
  'Aspen',
  'Beech',
  'Centaury',
  'Cerato',
  'Cherry Plum',
  'Chestnut Bud',
  'Chicory',
  'Clematis',
  'Crab Apple',
  'Elm',
  'Gentian',
  'Gorse',
  'Heather',
  'Holly',
  'Honeysuckle',
  'Hornbeam',
  'Impatiens',
  'Larch',
  'Mimulus',
  'Mustard',
  'Oak',
  'Olive',
  'Pine',
  'Red Chestnut',
  'Rock Rose',
  'Rock Water',
  'Scleranthus',
  'Star of Bethlehem',
  'Sweet Chestnut',
  'Vervain',
  'Vine',
  'Walnut',
  'Water Violet',
  'White Chestnut',
  'Wild Oat',
  'Wild Rose',
  'Willow',
];

export default function CustomBlendPage() {
  const t = useTranslations('CustomBlendPage');
  const { addToCart } = useCart();
  const [selectedBase, setSelectedBase] = useState<string>('');
  const [selectedEssences, setSelectedEssences] = useState<string[]>(
    Array(7).fill(''),
  );
  const [isAdding, setIsAdding] = useState(false);

  const handleEssenceChange = (value: string, index: number) => {
    const newEssences = [...selectedEssences];
    newEssences[index] = value;
    setSelectedEssences(newEssences);
  };

  const isValidSelection = () => {
    if (!selectedBase) return false;
    const selectedCount = selectedEssences
      .slice(0, 2)
      .filter((essence) => essence).length;
    return selectedCount === 2;
  };

  const handleAddToCart = () => {
    setIsAdding(true);
    try {
      const selectedEssencesList = selectedEssences.filter(
        (essence) => essence,
      );
      addToCart({
        id: 'custom-blend',
        name: t('cart.name', { essences: selectedEssencesList.join(', ') }),
        description: t('cart.description', {
          base: selectedBase,
          essences: selectedEssencesList.join(', '),
        }),
        type: 'Flower Essence',
        price: 19.99,
        stock: 999,
        imageUrl: '/images/custom-blend.jpg',
      });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="from-background via-background/80 to-background min-h-screen bg-linear-to-b">
      <div className="container mx-auto px-4 py-12">
        <Link
          href="/store"
          className="mb-8 inline-flex items-center text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('back_to_store')}
        </Link>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Product Image */}
          <div className="lg:sticky lg:top-8">
            <div className="group relative aspect-square overflow-hidden rounded-2xl">
              <Image
                src="/images/custom-blend.jpg"
                alt={t('image_alt')}
                fill
                className="transform object-cover transition-transform duration-500 group-hover:scale-105"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="bg-primary/10 text-primary inline-flex items-center rounded-full px-3 py-1 text-sm font-medium">
                <Sparkles className="mr-2 h-4 w-4" />
                {t('subtitle')}
              </div>
              <h1 className="bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-4xl font-bold text-transparent md:text-5xl dark:from-purple-400 dark:to-blue-400">
                {t('title')}
              </h1>
              <p className="text-primary text-3xl font-bold">{t('price')}</p>
            </div>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                {t('description')}
              </p>
              <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                {t('whatsapp_help')}
              </p>
            </div>

            <div className="mb-12">
              <Link href="/store/flower-essences">
                <Button
                  variant="outline"
                  className="w-full border-purple-500/20 hover:bg-purple-500/5"
                >
                  {t('learn_more')}
                </Button>
              </Link>
            </div>

            <div className="space-y-6 rounded-xl border border-purple-500/10 bg-white/5 p-6 backdrop-blur-xs dark:bg-white/5">
              {/* Base Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {t('base.label')}
                  <span className="ml-1 text-red-500">*</span>
                </label>
                <Select onValueChange={setSelectedBase} value={selectedBase}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t('select_option')} />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px] overflow-y-auto">
                    <SelectItem value="brandy">{t('base.brandy')}</SelectItem>
                    <SelectItem value="water">{t('base.water')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Essences Grid */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {Array.from({ length: 7 }).map((_, index) => (
                  <div key={index} className="space-y-2">
                    <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {t('essence.label', { number: index + 1 })}
                      {index < 2 && (
                        <span className="ml-1 text-red-500">*</span>
                      )}
                    </label>
                    <Select
                      value={selectedEssences[index]}
                      onValueChange={(value) =>
                        handleEssenceChange(value, index)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={
                            index < 2 ? t('select_option') : t('skip_option')
                          }
                        />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px] overflow-y-auto">
                        {FLOWER_ESSENCES.map((essence) => (
                          <SelectItem
                            key={essence}
                            value={essence}
                            disabled={
                              selectedEssences.includes(essence) &&
                              selectedEssences[index] !== essence
                            }
                          >
                            {essence}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>

            <Button
              onClick={handleAddToCart}
              className="w-full bg-linear-to-r from-purple-600 to-blue-600 text-white shadow-lg transition-all duration-300 hover:from-purple-700 hover:to-blue-700 hover:shadow-xl"
              size="lg"
              disabled={!isValidSelection() || isAdding}
            >
              {isAdding ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('adding_to_cart')}
                </>
              ) : (
                t('add_to_cart')
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
