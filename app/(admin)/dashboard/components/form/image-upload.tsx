"use client";

import { useTranslation } from "@/components/language-provider";
import { Input } from "@/components/ui/input";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ImageUploadProps {
  initialImageUrl?: string;
  productType: string;
  onImageUrlChange: (url: string) => void;
}

export function ImageUpload({
  initialImageUrl,
  productType,
  onImageUrlChange,
}: ImageUploadProps) {
  const [uploadingImage, setUploadingImage] = useState(false);
  const { t } = useTranslation();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    formData.append("type", productType);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      onImageUrlChange(data.url);
    } catch (error) {
      console.error("Failed to upload image:", error);
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <div className="space-y-2">
      <label
        htmlFor="image"
        className="flex items-center gap-2 text-sm font-medium"
      >
        <ImageIcon className="h-4 w-4" />
        {t("admin.product_image")}
      </label>
      <div className="flex flex-col gap-4">
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={uploadingImage}
          className="focus-visible:ring-primary"
        />
        <Input type="hidden" name="imageUrl" value={initialImageUrl || ""} />
        {uploadingImage && (
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <span className="animate-spin">⏳</span>
            {t("admin.uploading_image")}
          </p>
        )}
        {initialImageUrl && (
          <div className="relative w-32 h-32 rounded-lg overflow-hidden border">
            <Image
              src={initialImageUrl}
              alt={t("admin.product_preview")}
              fill
              sizes="(max-width: 768px) 100vw, 128px"
              className="object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
}
