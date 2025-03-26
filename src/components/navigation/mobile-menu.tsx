'use client';

import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

import { LanguageToggle } from './language-toggle';
import { ThemeToggle } from './theme-toggle';

interface MobileMenuProps {
  navigationItems: React.ReactNode;
}

export function MobileMenu({ navigationItems }: Readonly<MobileMenuProps>) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
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
          {navigationItems}
          <div className="flex flex-col space-y-4 border-t pt-4 sm:hidden">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
