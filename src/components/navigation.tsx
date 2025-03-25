'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { LogOut, Menu, ShoppingCart, User, X } from 'lucide-react';
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';

import { useCart } from '@/components/cart-provider';
import { LanguageToggle } from '@/components/language-toggle';
import { ThemeToggle } from '@/components/theme-toggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Link, useRouter } from '@/i18n/routing';

const navVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

const cartItemVariants = {
  initial: { opacity: 0, x: 20, scale: 0.95 },
  animate: { opacity: 1, x: 0, scale: 1 },
  exit: { opacity: 0, x: 20, scale: 0.95 },
};

const cartTotalVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export function Navigation() {
  const router = useRouter();
  const t = useTranslations('Navigation');
  const locale = useLocale();
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    getTotalPrice,
    getTotalItems,
  } = useCart();
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleCheckout = () => {
    setIsCartOpen(false); // Close the cart sheet
    router.push('/checkout'); // Redirect to checkout page
  };

  const NavigationItems = () => (
    <div className="flex space-x-4">
      <motion.div variants={itemVariants}>
        <Link
          href={{
            pathname: '/store',
            query: {
              [locale === 'es' ? 'categoria' : 'category']: 'Sacred Geometry',
            },
          }}
        >
          <Button
            variant="ghost"
            className="hover:bg-primary/10 flex items-center gap-2 transition-colors duration-300"
          >
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="text-xl"
            >
              ⬡
            </motion.span>
            {t('nav.sacred_geometry')}
          </Button>
        </Link>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Link
          href={{
            pathname: '/store',
            query: {
              [locale === 'es' ? 'categoria' : 'category']: 'Flower Essence',
            },
          }}
        >
          <Button
            variant="ghost"
            className="hover:bg-primary/10 flex items-center gap-2 transition-colors duration-300"
          >
            <motion.span
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="text-xl"
            >
              🌸
            </motion.span>
            {t('nav.flower_essences')}
          </Button>
        </Link>
      </motion.div>

      {session?.user.role === 'ADMIN' && (
        <motion.div variants={itemVariants}>
          <Link href="/dashboard">
            <Button
              variant="ghost"
              className="hover:bg-primary/10 transition-colors duration-300"
            >
              {t('nav.dashboard')}
            </Button>
          </Link>
        </motion.div>
      )}
    </div>
  );

  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={navVariants}
      className="bg-background/80 fixed top-0 right-0 left-0 z-50 border-b backdrop-blur-lg"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-8">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <Link href="/" className="flex items-center">
              <Image
                src="/images/BC-logo-180x60.png"
                alt="Breathe Coherence"
                width={120}
                height={40}
                className="transition-transform duration-300 dark:invert"
                priority
              />
            </Link>
          </motion.div>
          <div className="hidden space-x-4 md:flex">
            <NavigationItems />
          </div>
        </div>

        <div className="flex items-center space-x-4">
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
            <SheetContent className="bg-background/95 fixed top-0 right-0 h-full w-full border-l backdrop-blur-lg sm:max-w-md">
              <SheetHeader>
                <SheetTitle className="bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-2xl font-bold text-transparent">
                  {t('store.cart.title')}
                </SheetTitle>
                <SheetDescription className="text-muted-foreground">
                  {t('store.cart.description')}
                </SheetDescription>
              </SheetHeader>
              <div className="mt-8 flex h-[calc(100vh-8rem)] flex-col">
                <div className="flex-1 overflow-y-auto pr-2">
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
                        <p className="text-muted-foreground text-lg">
                          {t('store.cart.empty')}
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsCartOpen(false);
                            router.push('/store');
                          }}
                          className="mt-4"
                        >
                          {t('store.cart.browse')}
                        </Button>
                      </motion.div>
                    ) : (
                      <motion.div layout className="space-y-4">
                        {cart.map((item) => (
                          <motion.div
                            key={item.id}
                            variants={cartItemVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            layout
                          >
                            <Card className="bg-card/50 p-4 transition-shadow duration-300 hover:shadow-lg">
                              <div className="flex gap-4">
                                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
                                  <Image
                                    src={
                                      item.imageUrl ||
                                      (item.type === 'Sacred Geometry'
                                        ? `/products/sacred-geometry.svg#${item.id}`
                                        : '/products/flower-essence.svg')
                                    }
                                    alt={item.name}
                                    fill
                                    className="object-cover transition-transform duration-300 hover:scale-110"
                                    priority
                                  />
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
                                            updateQuantity(
                                              item.id,
                                              item.quantity - 1,
                                            )
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
                                            updateQuantity(
                                              item.id,
                                              item.quantity + 1,
                                            )
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
                                        <X className="h-4 w-4" />
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
                    variants={cartTotalVariants}
                    initial="initial"
                    animate="animate"
                    className="mt-4 space-y-4 border-t pt-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        {t('store.cart.total')}
                      </span>
                      <span className="text-lg font-bold">
                        ${getTotalPrice().toFixed(2)}
                      </span>
                    </div>
                    <Button
                      onClick={handleCheckout}
                      className="w-full transform bg-linear-to-r from-purple-600 to-blue-600 text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:from-purple-700 hover:to-blue-700 hover:shadow-xl"
                    >
                      {t('store.cart.checkout')}
                    </Button>
                  </motion.div>
                )}
              </div>
            </SheetContent>
          </Sheet>

          <div className="hidden items-center space-x-4 sm:flex">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <LanguageToggle />
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <ThemeToggle />
            </motion.div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 overflow-hidden rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      alt={session?.user?.name || 'User'}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-linear-to-br from-purple-600 to-blue-600 text-white">
                      {session?.user?.name?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </motion.div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-background/95 w-56 backdrop-blur-lg"
            >
              <AnimatePresence>
                {session?.user ? (
                  <>
                    <DropdownMenuItem
                      disabled
                      className="flex items-center gap-2"
                    >
                      <User className="h-4 w-4" />
                      <span className="font-medium">
                        {session.user.name || session.user.email}
                      </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => signOut()}
                      className="flex items-center gap-2 text-red-500 hover:text-red-600 focus:text-red-600"
                    >
                      <LogOut className="h-4 w-4" />
                      {t('nav.signout')}
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem>
                      <Link
                        href={{ pathname: '/login' }}
                        className="flex w-full items-center gap-2"
                      >
                        <User className="h-4 w-4" />
                        {t('nav.login')}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link
                        href={{ pathname: '/register' }}
                        className="flex w-full items-center gap-2"
                      >
                        <User className="h-4 w-4" />
                        {t('nav.register')}
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </AnimatePresence>
            </DropdownMenuContent>
          </DropdownMenu>

          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="md:hidden"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-primary/10 transition-colors duration-300"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </motion.div>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="bg-background/95 w-[300px] backdrop-blur-lg sm:w-[400px]"
            >
              <SheetHeader>
                <SheetTitle className="bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-2xl font-bold text-transparent">
                  Menu
                </SheetTitle>
              </SheetHeader>
              <div className="mt-8 flex flex-col space-y-4">
                <NavigationItems />
                <div className="flex flex-col space-y-4 border-t pt-4 sm:hidden">
                  <LanguageToggle />
                  <ThemeToggle />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.nav>
  );
}
