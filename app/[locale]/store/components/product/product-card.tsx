"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "@/i18n/routing";
import { type Product } from "@prisma/client";
import { useTranslations } from "next-intl";
import Image from "next/image";

interface ProductCardProps {
  product: Product;
  index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
  const t = useTranslations("ProductCard");

  return (
    <Link
      href={{
        pathname: "/product/[id]",
        params: { id: product.id },
      }}
    >
      <Card
        className="group overflow-hidden cursor-pointer bg-white/5 dark:bg-white/5 backdrop-blur-sm border-purple-500/10 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        style={{
          animationDelay: `${index * 100}ms`,
        }}
      >
        <CardHeader className="p-6 border-b border-purple-500/10">
          <CardTitle className="flex items-center gap-3 text-lg md:text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400">
            {product.type === "Sacred Geometry" ? (
              <span className="text-2xl md:text-3xl rotate-slow inline-block text-purple-600 dark:text-purple-400">
                ⬡
              </span>
            ) : (
              <span className="text-2xl md:text-3xl inline-block text-pink-500 dark:text-pink-400">
                🌸
              </span>
            )}
            {product.name}
          </CardTitle>
          <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
            {product.type}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="relative overflow-hidden rounded-lg group-hover:shadow-2xl transition-shadow duration-300">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                width={400}
                height={400}
                className="w-full aspect-square object-cover rounded-lg transform group-hover:scale-105 transition-transform duration-300"
                priority
                sizes="(max-width: 768px) 100vw, 400px"
              />
            ) : (
              <Image
                src={
                  product.type === "Sacred Geometry"
                    ? `/products/sacred-geometry.svg#${product.id}`
                    : "/products/flower-essence.svg"
                }
                alt={product.name}
                width={400}
                height={400}
                className="w-full aspect-square object-cover rounded-lg transform group-hover:scale-105 transition-transform duration-300"
                priority
                sizes="(max-width: 768px) 100vw, 400px"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
            {product.description}
          </p>
        </CardContent>
        <CardFooter className="flex flex-col xs:flex-row justify-between items-center p-6 border-t border-purple-500/10 bg-white/5 dark:bg-white/5">
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400">
            ${product.price.toFixed(2)}
          </span>
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg transition-all duration-300 group-hover:shadow-xl"
          >
            {t("view_details")}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
