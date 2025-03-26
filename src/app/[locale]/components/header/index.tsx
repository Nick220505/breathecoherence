import { CartButton } from './cart';
import { LanguageToggle } from './language-toggle';
import { Logo } from './logo';
import { MobileMenu } from './mobile-menu';
import { NavigationItems } from './navigation-items';
import { ThemeToggle } from './theme-toggle';
import { UserMenu } from './user-menu';

export function Header() {
  return (
    <header className="bg-background/80 fixed top-0 right-0 left-0 z-50 border-b backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-8">
          <Logo />
          <div className="hidden space-x-4 md:flex">
            <NavigationItems />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <CartButton />

          <div className="hidden items-center space-x-4 sm:flex">
            <LanguageToggle />
            <ThemeToggle />
          </div>

          <UserMenu />
          <MobileMenu navigationItems={<NavigationItems />} />
        </div>
      </div>
    </header>
  );
}
