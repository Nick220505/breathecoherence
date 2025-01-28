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
import Image from "next/image";
import Link from "next/link";

export function CustomBlendCard() {
  return (
    <Link href="/store/custom-blend">
      <Card className="card-hover-effect overflow-hidden cursor-pointer">
        <CardHeader className="p-3 sm:p-4 md:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg md:text-xl">
            <span className="text-xl sm:text-2xl float inline-block">🌸</span>
            Create Your Own Bach Remedy Blend
          </CardTitle>
          <CardDescription className="text-sm">Flower Essence</CardDescription>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 md:p-6">
          <Image
            src="/images/custom-blend.jpg"
            alt="Create Your Own Bach Remedy Blend"
            width={400}
            height={400}
            className="w-full aspect-square object-cover rounded-lg mb-2 sm:mb-3 md:mb-4"
            priority
            sizes="(max-width: 768px) 100vw, 400px"
          />
          <p className="text-muted-foreground text-sm">
            Here, you can combine Bach flower essences that you believe will
            benefit your health and emotional well-being. Select between 2 to 5
            essences (max. 7).
          </p>
        </CardContent>
        <CardFooter className="flex flex-col xs:flex-row justify-center xs:justify-between items-center p-3 sm:p-4 md:p-6 gap-2 xs:gap-0">
          <span className="text-lg sm:text-xl md:text-2xl font-bold text-primary text-center xs:text-left">
            $19.99
          </span>
          <Button size="sm" className="pointer-events-none">
            View Details
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
