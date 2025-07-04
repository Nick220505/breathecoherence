'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ShoppingCart, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useRouter } from '@/i18n/routing';
import { useCart } from '@/providers/cart-provider';

export function CartButton() {
  const router = useRouter();
  const t = useTranslations('CartButton');
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    getTotalPrice,
    getTotalItems,
  } = useCart();

  const handleCheckout = () => {
    setIsCartOpen(false);
    router.push('/checkout');
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetTrigger asChild>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button
            variant="outline"
            size="icon"
            className="bg-background/50 hover:bg-background/80 relative transition-colors duration-300"
            onClick={() => setIsCartOpen(true)}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-primary text-primary-foreground absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full text-xs"
            >
              {getTotalItems()}
            </motion.div>
            <ShoppingCart className="h-5 w-5" />
          </Button>
        </motion.div>
      </SheetTrigger>
      <SheetContent className="bg-background/95 fixed top-0 right-0 flex h-full w-full flex-col border-l backdrop-blur-lg sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-2xl font-bold text-transparent">
            {t('title')}
          </SheetTitle>
          <SheetDescription className="text-muted-foreground">
            {t('description')}
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-1 flex-col px-4 pb-4">
          <div className="flex-1 overflow-y-auto">
            <AnimatePresence mode="popLayout">
              {cart.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex h-full flex-col items-center justify-center space-y-4 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', bounce: 0.5 }}
                  >
                    <ShoppingCart className="text-muted-foreground/50 h-12 w-12" />
                  </motion.div>
                  <p className="text-muted-foreground text-lg">{t('empty')}</p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsCartOpen(false);
                      router.push('/store');
                    }}
                    className="mt-4"
                  >
                    {t('browse')}
                  </Button>
                </motion.div>
              ) : (
                <motion.div layout className="space-y-4">
                  {cart.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 20, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: 20, scale: 0.95 }}
                      layout
                    >
                      <Card className="bg-card/50 p-4 transition-shadow duration-300 hover:shadow-lg">
                        <div className="flex gap-4">
                          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 border-dashed">
                            {item.imageBase64 ? (
                              <Image
                                src={item.imageBase64}
                                alt={item.name}
                                fill
                                sizes="80px"
                                className="object-cover transition-transform duration-300 hover:scale-110"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <div className="text-muted-foreground/50 h-8 w-8">
                                  <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                  >
                                    <rect
                                      width="18"
                                      height="18"
                                      x="3"
                                      y="3"
                                      rx="2"
                                      ry="2"
                                    />
                                    <circle cx="9" cy="9" r="2" />
                                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                                  </svg>
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex h-full flex-col">
                              <div className="flex-1">
                                <h3 className="truncate leading-none font-medium">
                                  {item.name}
                                </h3>
                                <p className="text-muted-foreground mt-1 text-sm">
                                  ${item.price.toFixed(2)}
                                </p>
                              </div>
                              <div className="mt-2 flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() =>
                                      updateQuantity(item.id, item.quantity - 1)
                                    }
                                  >
                                    -
                                  </Button>
                                  <span className="w-8 text-center">
                                    {item.quantity}
                                  </span>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() =>
                                      updateQuantity(item.id, item.quantity + 1)
                                    }
                                  >
                                    +
                                  </Button>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
                                  onClick={() => removeFromCart(item.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {cart.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 space-y-4 border-t pt-4"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{t('total')}</span>
                <span className="text-lg font-bold">
                  ${getTotalPrice().toFixed(2)}
                </span>
              </div>
              <Button
                onClick={handleCheckout}
                className="w-full transform bg-linear-to-r from-purple-600 to-blue-600 text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:from-purple-700 hover:to-blue-700 hover:shadow-xl"
              >
                {t('checkout')}
              </Button>
            </motion.div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
