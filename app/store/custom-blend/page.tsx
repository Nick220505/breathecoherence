"use client";

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
import { ArrowLeft, Loader2, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

// List of all available flower essences
const FLOWER_ESSENCES = [
  "Agrimony",
  "Aspen",
  "Beech",
  "Centaury",
  "Cerato",
  "Cherry Plum",
  "Chestnut Bud",
  "Chicory",
  "Clematis",
  "Crab Apple",
  "Elm",
  "Gentian",
  "Gorse",
  "Heather",
  "Holly",
  "Honeysuckle",
  "Hornbeam",
  "Impatiens",
  "Larch",
  "Mimulus",
  "Mustard",
  "Oak",
  "Olive",
  "Pine",
  "Red Chestnut",
  "Rock Rose",
  "Rock Water",
  "Scleranthus",
  "Star of Bethlehem",
  "Sweet Chestnut",
  "Vervain",
  "Vine",
  "Walnut",
  "Water Violet",
  "White Chestnut",
  "Wild Oat",
  "Wild Rose",
  "Willow",
];

export default function CustomBlendPage() {
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const [selectedBase, setSelectedBase] = useState<string>("");
  const [selectedEssences, setSelectedEssences] = useState<string[]>(
    Array(7).fill(""),
  );
  const [isAdding, setIsAdding] = useState(false);

  const handleEssenceChange = (value: string, index: number) => {
    const newEssences = [...selectedEssences];
    newEssences[index] = value;
    setSelectedEssences(newEssences);
  };

  const isValidSelection = () => {
    if (!selectedBase) return false;
    const selectedCount = selectedEssences
      .slice(0, 2)
      .filter((essence) => essence).length;
    return selectedCount === 2;
  };

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      const selectedEssencesList = selectedEssences.filter(
        (essence) => essence,
      );
      await addToCart({
        id: "custom-blend",
        name: `Custom Bach Remedy Blend (${selectedEssencesList.join(", ")})`,
        description: `Base: ${selectedBase}, Essences: ${selectedEssencesList.join(
          ", ",
        )}`,
        type: "Flower Essence",
        price: 19.99,
        stock: 999,
        imageUrl: "/images/custom-blend.jpg",
      });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/80 to-background">
      <div className="container mx-auto px-4 py-12">
        <Link
          href="/store"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t("store.back_to_store")}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="lg:sticky lg:top-8">
            <div className="relative aspect-square rounded-2xl overflow-hidden group">
              <Image
                src="/images/custom-blend.jpg"
                alt="Create Your Own Bach Remedy Blend"
                fill
                className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Sparkles className="w-4 h-4 mr-2" />
                {t("store.custom_blend.subtitle")}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400">
                {t("store.custom_blend.title")}
              </h1>
              <p className="text-3xl font-bold text-primary">
                {t("store.custom_blend.price")}
              </p>
            </div>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                {t("store.custom_blend.description")}
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                {t("store.essence.whatsapp_help")}
              </p>
            </div>

            <div className="mb-12">
              <Link href="/store/flower-essences">
                <Button
                  variant="outline"
                  className="w-full border-purple-500/20 hover:bg-purple-500/5"
                >
                  {t("store.essence.learn_more")}
                </Button>
              </Link>
            </div>

            <div className="space-y-6 bg-white/5 dark:bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-purple-500/10">
              {/* Base Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {t("store.essence.select_base")}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <Select onValueChange={setSelectedBase} value={selectedBase}>
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={t("store.essence.select_option")}
                    />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px] overflow-y-auto">
                    <SelectItem value="brandy">
                      {t("store.essence.base.brandy")}
                    </SelectItem>
                    <SelectItem value="water">
                      {t("store.essence.base.water")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Essences Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Array.from({ length: 7 }).map((_, index) => (
                  <div key={index} className="space-y-2">
                    <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {t("store.essence.essence_number")} {index + 1}
                      {index < 2 && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </label>
                    <Select
                      value={selectedEssences[index]}
                      onValueChange={(value) =>
                        handleEssenceChange(value, index)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={
                            index < 2
                              ? t("store.essence.select_option")
                              : t("store.essence.skip_option")
                          }
                        />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px] overflow-y-auto">
                        {FLOWER_ESSENCES.map((essence) => (
                          <SelectItem
                            key={essence}
                            value={essence}
                            disabled={
                              selectedEssences.includes(essence) &&
                              selectedEssences[index] !== essence
                            }
                          >
                            {essence}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>

            <Button
              onClick={handleAddToCart}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg transition-all duration-300 hover:shadow-xl"
              size="lg"
              disabled={!isValidSelection() || isAdding}
            >
              {isAdding ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t("store.adding_to_cart")}
                </>
              ) : (
                t("store.add_to_cart")
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
