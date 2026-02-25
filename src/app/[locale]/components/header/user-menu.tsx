'use client';

import { AnimatePresence, motion } from 'motion/react';
import { LogOut, Package, User } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link } from '@/i18n/routing';

export function UserMenu() {
  const t = useTranslations('UserMenu');
  const { data: session } = useSession();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button
            variant="ghost"
            className="relative h-8 w-8 overflow-hidden rounded-full"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage
                alt={session?.user?.name ?? 'User'}
                className="object-cover"
              />
              <AvatarFallback className="bg-linear-to-br from-purple-600 to-blue-600 text-white">
                {session?.user?.name?.[0] ?? 'U'}
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
              <DropdownMenuItem disabled className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="font-medium">
                  {session.user.name || session.user.email}
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  href={{ pathname: '/account/orders' }}
                  className="flex w-full items-center gap-2"
                >
                  <Package className="h-4 w-4" />
                  {t('orders')}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => void signOut({ redirectTo: '/' })}
                className="flex items-center gap-2 text-red-500 hover:text-red-600 focus:text-red-600"
              >
                <LogOut className="h-4 w-4" />
                {t('signout')}
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
                  {t('login')}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  href={{ pathname: '/register' }}
                  className="flex w-full items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  {t('register')}
                </Link>
              </DropdownMenuItem>
            </>
          )}
        </AnimatePresence>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
