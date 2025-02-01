"use client";

import { getProductById } from "@/actions/product";
import { useCart } from "@/components/cart-provider";
import { useTranslation } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type Product } from "@prisma/client";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProductPage() {
  const { t } = useTranslation();
  const params = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBase, setSelectedBase] = useState<string>("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setProduct(await getProductById(params.id as string));
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  const handleAddToCart = () => {
    if (!product) return;

    if (product.type === "Flower Essence" && selectedBase) {
      addToCart({
        ...product,
        name: `${product.name} (${selectedBase})`,
        description: `Base: ${selectedBase}, ${product.description}`,
      });
    } else {
      addToCart(product);
    }
  };

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[50vh]">
        <div className="rotate-slow w-20 h-20 border-4 border-primary rounded-full border-t-transparent" />
      </main>
    );
  }

  if (!product) {
    return (
      <main className="container mx-auto px-4 py-8">
        <p className="text-center text-lg">Product not found</p>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="lg:sticky lg:top-8">
          <div className="relative aspect-square">
            <Image
              src={
                product.imageUrl ||
                (product.type === "Sacred Geometry"
                  ? `/products/sacred-geometry.svg#${product.id}`
                  : "/products/flower-essence.svg")
              }
              alt={product.name}
              fill
              className="object-cover rounded-lg"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-xl font-semibold text-primary">
              ${product.price.toFixed(2)}
            </p>
          </div>

          <p className="text-muted-foreground">{product.description}</p>

          {product.type === "Flower Essence" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("store.essence.select_base")}
                  <span className="text-red-500">*</span>
                </label>
                <Select onValueChange={setSelectedBase} value={selectedBase}>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t("store.essence.select_option")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="brandy">
                      {t("store.essence.base.brandy")}
                    </SelectItem>
                    <SelectItem value="water">
                      {t("store.essence.base.water")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <Button
            onClick={handleAddToCart}
            className="w-full bg-primary hover:bg-primary/90"
            size="lg"
            disabled={product.type === "Flower Essence" && !selectedBase}
          >
            {t("store.add_to_cart")}
          </Button>
        </div>
      </div>
    </main>
  );
}
