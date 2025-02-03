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

  const handleEssenceChange = (value: string, index: number) => {
    const newEssences = [...selectedEssences];
    newEssences[index] = value;
    setSelectedEssences(newEssences);
  };

  const isValidSelection = () => {
    // Check if base is selected
    if (!selectedBase) return false;

    // Check if at least first two essences are selected
    const selectedCount = selectedEssences
      .slice(0, 2)
      .filter((essence) => essence).length;
    return selectedCount === 2;
  };

  const handleAddToCart = () => {
    // Filter out empty selections
    const selectedEssencesList = selectedEssences.filter((essence) => essence);

    // Add to cart with selected essences
    addToCart({
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
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="lg:sticky lg:top-8">
          <div className="relative aspect-square">
            <Image
              src="/images/custom-blend.jpg"
              alt="Create Your Own Bach Remedy Blend"
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
            <h1 className="text-3xl font-bold mb-2">
              Create Your Own Bach Remedy Blend
            </h1>
            <p className="text-xl font-semibold text-primary">$19.99</p>
          </div>

          <div className="space-y-8">
            <div className="prose max-w-none dark:prose-invert">
              <p>
                Here, you can combine Bach flower essences that you believe will
                benefit your health and emotional well-being, as well as that of
                your family. We recommend selecting between 2 to 5 essences,
                with a maximum of 7. If your blend only includes 2 essences,
                leave the other spaces blank. Add your selection to the cart and
                proceed to checkout. Remember, the recommended dosage is 4
                drops, 4 to 6 times a day for 3 weeks. You can create your own
                blend following the above instructions.
              </p>
              <p>{t("store.essence.whatsapp_help")}</p>
            </div>

            <Link href="/store/flower-essences">
              <Button variant="outline" className="w-full">
                {t("store.essence.learn_more")}
              </Button>
            </Link>

            <div className="space-y-6">
              {/* Base Selection */}
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
                    <label className="text-sm font-medium">
                      {t("store.essence.essence_number")} {index + 1}
                      {index < 2 && <span className="text-red-500">*</span>}
                    </label>
                    <Select
                      value={selectedEssences[index]}
                      onValueChange={(value) =>
                        handleEssenceChange(value, index)
                      }
                    >
                      <SelectTrigger>
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
          </div>

          <Button
            onClick={handleAddToCart}
            className="w-full bg-primary hover:bg-primary/90"
            size="lg"
            disabled={!isValidSelection()}
          >
            {t("store.add_to_cart")}
          </Button>
        </div>
      </div>
    </div>
  );
}
