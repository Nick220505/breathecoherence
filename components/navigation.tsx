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
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export function Navigation() {
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

  return (
    <nav className="fixed top-0 left-0 right-0 border-b bg-background/80 backdrop-blur-sm z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/" className="text-xl font-bold animate-gradient">
            Geometry & Essences
          </Link>
          <div className="hidden md:flex space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <span className="text-xl rotate-slow inline-block">⬡</span>
                  {t("nav.sacred_geometry")}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <Link href="/store?category=Sacred Geometry">
                  <DropdownMenuItem>
                    <span className="text-lg mr-2">🔮</span>
                    {t("nav.all_geometry")}
                  </DropdownMenuItem>
                </Link>
                <Link href="/store?type=tetrahedron">
                  <DropdownMenuItem>
                    <span className="text-lg mr-2">△</span>
                    {t("nav.tetrahedron")}
                  </DropdownMenuItem>
                </Link>
                <Link href="/store?type=cube">
                  <DropdownMenuItem>
                    <span className="text-lg mr-2">□</span>
                    {t("nav.cube")}
                  </DropdownMenuItem>
                </Link>
                <Link href="/store?type=octahedron">
                  <DropdownMenuItem>
                    <span className="text-lg mr-2">◇</span>
                    {t("nav.octahedron")}
                  </DropdownMenuItem>
                </Link>
                <Link href="/store?type=icosahedron">
                  <DropdownMenuItem>
                    <span className="text-lg mr-2">⬟</span>
                    {t("nav.icosahedron")}
                  </DropdownMenuItem>
                </Link>
                <Link href="/store?type=dodecahedron">
                  <DropdownMenuItem>
                    <span className="text-lg mr-2">⬡</span>
                    {t("nav.dodecahedron")}
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <span className="text-xl float inline-block">🌸</span>
                  {t("nav.flower_essences")}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <Link href="/store?category=Flower Essence">
                  <DropdownMenuItem>
                    <span className="text-lg mr-2">🌺</span>
                    {t("nav.all_essences")}
                  </DropdownMenuItem>
                </Link>
                <Link href="/store?type=agrimony">
                  <DropdownMenuItem>
                    <span className="text-lg mr-2">🌼</span>
                    {t("nav.agrimony")}
                  </DropdownMenuItem>
                </Link>
                <Link href="/store?type=aspen">
                  <DropdownMenuItem>
                    <span className="text-lg mr-2">🌿</span>
                    {t("nav.aspen")}
                  </DropdownMenuItem>
                </Link>
                <Link href="/store?type=beech">
                  <DropdownMenuItem>
                    <span className="text-lg mr-2">🍃</span>
                    {t("nav.beech")}
                  </DropdownMenuItem>
                </Link>
                <Link href="/store?type=centaury">
                  <DropdownMenuItem>
                    <span className="text-lg mr-2">🌸</span>
                    {t("nav.centaury")}
                  </DropdownMenuItem>
                </Link>
                <Link href="/store?type=cerato">
                  <DropdownMenuItem>
                    <span className="text-lg mr-2">🌹</span>
                    {t("nav.cerato")}
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>

            {session?.user.role === "ADMIN" && (
              <Link href="/admin/dashboard">
                <Button variant="ghost">{t("nav.dashboard")}</Button>
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="relative">
                <span className="mr-2">Cart</span>
                <span className="bg-primary text-primary-foreground rounded-full px-2 py-1 text-xs">
                  {getTotalItems()}
                </span>
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
                            <div className="flex justify-between items-center">
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
                      <Button className="w-full mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                        {t("store.cart.checkout")}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
          <LanguageToggle />
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src="/placeholder-avatar.png"
                    alt={session?.user?.name || "User"}
                  />
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
                    {t("cta.signout")}
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem>
                    <Link href="/auth/login">{t("cta.signin")}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/auth/register">Register</Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
