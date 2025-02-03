"use client";

import { useCart } from "@/components/cart-provider";
import { useTranslation } from "@/components/language-provider";
import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function Navigation() {
  const router = useRouter();
  const { t } = useTranslation();
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
    router.push("/checkout"); // Redirect to checkout page
  };

  const NavigationItems = () => (
    <>
      <Link href="/store?category=Sacred Geometry">
        <Button variant="ghost" className="flex items-center gap-2">
          <span className="text-xl rotate-slow inline-block">⬡</span>
          {t("nav.sacred_geometry")}
        </Button>
      </Link>

      <Link href="/store?category=Flower Essence">
        <Button variant="ghost" className="flex items-center gap-2">
          <span className="text-xl float inline-block">🌸</span>
          {t("nav.flower_essences")}
        </Button>
      </Link>

      {session?.user.role === "ADMIN" && (
        <Link href="/dashboard">
          <Button variant="ghost">{t("nav.dashboard")}</Button>
        </Link>
      )}
    </>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 border-b bg-background/80 backdrop-blur-sm z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/BC-logo-180x60.png"
              alt="Breathe Coherence"
              width={120}
              height={40}
              className="dark:invert"
              priority
            />
          </Link>
          <div className="hidden md:flex space-x-4">
            <NavigationItems />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="relative"
                onClick={() => setIsCartOpen(true)}
              >
                <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
                  {getTotalItems()}
                </span>
                🛒
              </Button>
            </SheetTrigger>
            <SheetContent className="fixed top-0 right-0 h-full border-l bg-background/80 backdrop-blur-sm">
              <SheetHeader>
                <SheetTitle>Cart</SheetTitle>
                <SheetDescription>
                  {t("store.cart.description")}
                </SheetDescription>
              </SheetHeader>
              <div className="mt-8">
                {cart.length === 0 ? (
                  <p>{t("store.cart.empty")}</p>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <Card key={item.id} className="p-4">
                        <div className="flex items-center gap-4">
                          {item.imageUrl ? (
                            <Image
                              src={item.imageUrl}
                              alt={item.name}
                              width={64}
                              height={64}
                              className="w-16 h-16 object-cover rounded-lg"
                              priority
                            />
                          ) : (
                            <Image
                              src={
                                item.type === "Sacred Geometry"
                                  ? `/products/sacred-geometry.svg#${item.id}`
                                  : "/products/flower-essence.svg"
                              }
                              alt={item.name}
                              width={64}
                              height={64}
                              className="w-16 h-16 object-cover rounded-lg"
                              priority
                            />
                          )}
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                              <div>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  ${item.price.toFixed(2)}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    updateQuantity(item.id, item.quantity - 1)
                                  }
                                >
                                  -
                                </Button>
                                <span>{item.quantity}</span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    updateQuantity(item.id, item.quantity + 1)
                                  }
                                >
                                  +
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => removeFromCart(item.id)}
                                >
                                  {t("store.cart.remove")}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                    <div className="pt-4 border-t">
                      <p className="font-medium text-lg">
                        {t("store.cart.total")}: ${getTotalPrice().toFixed(2)}
                      </p>
                      <Button
                        onClick={handleCheckout}
                        className="w-full mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      >
                        {t("store.cart.checkout")}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>

          <div className="hidden sm:flex items-center space-x-4">
            <LanguageToggle />
            <ThemeToggle />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage alt={session?.user?.name || "User"} />
                  <AvatarFallback>
                    {session?.user?.name?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {session?.user ? (
                <>
                  <DropdownMenuItem disabled>
                    {session.user.name || session.user.email}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => signOut()}>
                    {t("nav.signout")}
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem>
                    <Link href="/login">{t("cta.signin")}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/register">Register</Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-4 mt-4">
                <NavigationItems />
                <div className="sm:hidden flex flex-col space-y-4">
                  <LanguageToggle />
                  <ThemeToggle />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
