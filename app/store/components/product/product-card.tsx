"use client";

import { useTranslation } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Product } from "@/types/product";
import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
  index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
  const { t } = useTranslation();

  return (
    <Link href={`/product/${product.id}`}>
      <Card
        className="card-hover-effect overflow-hidden cursor-pointer"
        style={{
          animationDelay: `${index * 100}ms`,
        }}
      >
        <CardHeader className="p-3 sm:p-4 md:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg md:text-xl">
            {product.type === "Sacred Geometry" ? (
              <span className="text-xl sm:text-2xl rotate-slow inline-block">
                ⬡
              </span>
            ) : (
              <span className="text-xl sm:text-2xl float inline-block">🌸</span>
            )}
            {product.name}
          </CardTitle>
          <CardDescription className="text-sm">{product.type}</CardDescription>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 md:p-6">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              width={400}
              height={400}
              className="w-full aspect-square object-cover rounded-lg mb-2 sm:mb-3 md:mb-4"
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
              className="w-full aspect-square object-cover rounded-lg mb-2 sm:mb-3 md:mb-4"
              priority
              sizes="(max-width: 768px) 100vw, 400px"
            />
          )}
          <p className="text-muted-foreground text-sm">{product.description}</p>
        </CardContent>
        <CardFooter className="flex flex-col xs:flex-row justify-center xs:justify-between items-center p-3 sm:p-4 md:p-6 gap-2 xs:gap-0">
          <span className="text-lg sm:text-xl md:text-2xl font-bold text-primary text-center xs:text-left">
            ${product.price.toFixed(2)}
          </span>
          <Button size="sm" className="pointer-events-none">
            {t("store.view_details")}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
