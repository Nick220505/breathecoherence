"use client";

import { useCart } from "@/components/cart-provider";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { productCache } from "@/features/products/cache";
import { Link } from "@/i18n/routing";
import { type Product } from "@prisma/client";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, ShoppingCart } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.5 },
};

export default function ProductPage() {
  const t = useTranslations("ProductPage");
  const params = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBase, setSelectedBase] = useState<string>("");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setProduct(await productCache.getById(params.id as string));
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

  const handleAddToCart = async () => {
    if (!product) return;
    setIsAdding(true);

    try {
      if (product.type === "Flower Essence" && selectedBase) {
        await addToCart({
          ...product,
          name: t("cart.name", { name: product.name, base: selectedBase }),
          description: t("cart.description", {
            base: selectedBase,
            description: product.description,
          }),
        });
      } else {
        await addToCart(product);
      }
    } finally {
      setIsAdding(false);
    }
  };

  if (isLoading) {
    return (
      <motion.div
        className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[50vh]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </motion.div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-2xl font-semibold text-gray-600 dark:text-gray-400">
            {t("product_not_found")}
          </p>
          <Link
            href="/store"
            className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("back_to_store")}
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/80 to-background">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/store"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("back_to_store")}
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <motion.div
            className="lg:sticky lg:top-8"
            variants={fadeIn}
            initial="initial"
            animate="animate"
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden group">
              <Image
                src={
                  product.imageUrl ||
                  (product.type === "Sacred Geometry"
                    ? `/products/sacred-geometry.svg#${product.id}`
                    : "/products/flower-essence.svg")
                }
                alt={product.name}
                fill
                className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </motion.div>

          {/* Product Details */}
          <motion.div
            className="space-y-8"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
              >
                {product.type}
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400"
              >
                {product.name}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-3xl font-bold text-primary"
              >
                ${product.price.toFixed(2)}
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="prose prose-gray dark:prose-invert max-w-none"
            >
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                {product.description}
              </p>
            </motion.div>

            {product.type === "Flower Essence" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-4 bg-white/5 dark:bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-purple-500/10"
              >
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {t("base.label")}
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <Select onValueChange={setSelectedBase} value={selectedBase}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("select_option")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="brandy">{t("base.brandy")}</SelectItem>
                      <SelectItem value="water">{t("base.water")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Button
                onClick={handleAddToCart}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg transition-all duration-300 hover:shadow-xl transform hover:scale-105"
                size="lg"
                disabled={
                  (product.type === "Flower Essence" && !selectedBase) ||
                  isAdding
                }
              >
                {isAdding ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t("adding_to_cart")}
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {t("add_to_cart")}
                  </>
                )}
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
