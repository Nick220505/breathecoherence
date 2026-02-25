'use client';

import { motion } from 'motion/react';
import { Check, Laptop, Moon, Sun } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const t = useTranslations('ThemeToggle');

  return (
    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
            <span className="sr-only">{t('label')}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem
            onClick={() => setTheme('light')}
            className="flex cursor-pointer items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4" />
              <span>{t('themes.light')}</span>
            </div>
            {theme === 'light' && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setTheme('dark')}
            className="flex cursor-pointer items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Moon className="h-4 w-4" />
              <span>{t('themes.dark')}</span>
            </div>
            {theme === 'dark' && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setTheme('system')}
            className="flex cursor-pointer items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Laptop className="h-4 w-4" />
              <span>{t('themes.system')}</span>
            </div>
            {theme === 'system' && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  );
}
